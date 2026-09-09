import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { esFalloDeConexion } from '../lib/dataSource'
import {
  localProjects, localServices, localExperiences, localFlyers,
  localTestimonials, localSiteConfig, localMessages
} from '../lib/localData'

// ============================================
// Panel de administración: escribe en Supabase cuando responde.
//
// Con Supabase caido, las LECTURAS de todas las pestañas caen a los JSON del
// repo (mas las ediciones locales) en cualquier entorno: es lo mismo que
// muestra el sitio publico. Las ESCRITURAS solo tienen plan B en
// `npm run dev`: el backend de vite.config.js guarda cada pestaña en
// public/data/<coleccion>-edit.json y las imagenes en public/media. En
// produccion el error llega al panel.
//
// Los repos de GitHub no se gestionan aqui — viven en
// src/data/repos-github.json y se editan en el repo.
// ============================================

const enDev = import.meta.env.DEV

// true cuando la ultima lectura tuvo que usar el respaldo: el panel lo usa
// para el indicador de conexion (antes un respaldo exitoso se leia como
// "Supabase conectado").
const usandoLocal = ref(false)

// "Editar en local" (solo en dev): todo el panel lee y escribe en los
// archivos locales sin pasar por Supabase. Queda guardado para la proxima
// sesion, asi no hay que esperar a que la base falle cada vez.
const CLAVE_MODO_LOCAL = 'portafolio-admin-local'
function leerModoLocal() {
  try { return enDev && localStorage.getItem(CLAVE_MODO_LOCAL) === '1' } catch { return false }
}
const modoLocal = ref(leerModoLocal())
function fijarModoLocal(valor) {
  modoLocal.value = enDev && Boolean(valor)
  try { localStorage.setItem(CLAVE_MODO_LOCAL, modoLocal.value ? '1' : '0') } catch { /* sin storage */ }
}

// Cuando una llamada a Supabase falla por conexion, las siguientes no vuelven
// a esperar a que falle: van directo al respaldo mientras dure la sesion.
let supabaseCaido = false

const SIN_ESCRITURA_EN_PROD = 'Sin conexión con Supabase. En producción no se puede guardar; para editar el respaldo local ejecuta npm run dev.'

async function remotoOLocal(remota, local, { escritura = false } = {}) {
  if (!modoLocal.value && !supabaseCaido) {
    try {
      return await remota()
    } catch (e) {
      if (esFalloDeConexion(e)) supabaseCaido = true
      if (escritura && !enDev) throw new Error(SIN_ESCRITURA_EN_PROD)
      console.warn('Supabase no disponible, usando respaldo local:', e.message)
    }
  }
  if (escritura && !enDev) throw new Error(SIN_ESCRITURA_EN_PROD)
  if (!escritura) usandoLocal.value = true
  return local()
}

// ── Escritura local (vite.config.js) ──
async function guardarLocal(coleccion, row) {
  const res = await fetch(`/__local/guardar/${coleccion}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(row)
  })
  if (!res.ok) throw new Error('La edicion local fallo: ' + res.status)
  return res.json()
}

// Los JSON del repo no se tocan: la fila queda marcada como eliminada en el
// -edit.json y localData la filtra
const eliminarLocal = (coleccion, id) => guardarLocal(coleccion, { id, _eliminado: true })

const nuevoId = prefijo => `${prefijo}-${Date.now()}`

async function subirImagenLocal(file, carpeta) {
  const res = await fetch(`/__local/upload?nombre=${encodeURIComponent(file.name)}&carpeta=${encodeURIComponent(carpeta)}`, {
    method: 'POST',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file
  })
  if (!res.ok) throw new Error('La subida local fallo: ' + res.status)
  return (await res.json()).url
}

// CRUD generico: tabla de Supabase + coleccion local equivalente
function crud({ tabla, coleccion, local, prefijo, orden = { columna: 'sort_order', ascendente: true } }) {
  return {
    listar: () => remotoOLocal(
      async () => {
        const { data, error } = await supabase
          .from(tabla)
          .select('*')
          .order(orden.columna, { ascending: orden.ascendente })
        if (error) throw error
        return data
      },
      local
    ),
    crear: fila => remotoOLocal(
      async () => {
        const { data, error } = await supabase.from(tabla).insert(fila).select().single()
        if (error) throw error
        return data
      },
      () => guardarLocal(coleccion, { id: nuevoId(prefijo), ...fila }),
      { escritura: true }
    ),
    actualizar: (id, cambios) => remotoOLocal(
      async () => {
        const { data, error } = await supabase.from(tabla).update(cambios).eq('id', id).select().single()
        if (error) throw error
        return data
      },
      () => guardarLocal(coleccion, { id, ...cambios }),
      { escritura: true }
    ),
    eliminar: id => remotoOLocal(
      async () => {
        const { error } = await supabase.from(tabla).delete().eq('id', id)
        if (error) throw error
      },
      () => eliminarLocal(coleccion, id),
      { escritura: true }
    )
  }
}

const proyectos = crud({ tabla: 'projects', coleccion: 'proyectos', local: localProjects, prefijo: 'nuevo' })
const servicios = crud({ tabla: 'services', coleccion: 'servicios', local: localServices, prefijo: 'servicio' })
const experiencias = crud({ tabla: 'experiences', coleccion: 'experiencia', local: localExperiences, prefijo: 'experiencia' })
const flyers = crud({ tabla: 'flyers', coleccion: 'flyers', local: localFlyers, prefijo: 'flyer' })
const testimonios = crud({ tabla: 'testimonials', coleccion: 'testimonios', local: localTestimonials, prefijo: 'testimonio' })
const mensajes = crud({
  tabla: 'contact_messages', coleccion: 'mensajes', local: localMessages, prefijo: 'mensaje',
  orden: { columna: 'created_at', ascendente: false }
})

export function useAdmin() {
  const loading = ref(false)
  const error = ref(null)

  // Enciende el spinner mientras dura la operacion
  const conCarga = fn => async (...args) => {
    loading.value = true
    try { return await fn(...args) } finally { loading.value = false }
  }

  // ── Site Config ──
  async function getSiteConfig() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase.from('site_config').select('*')
        if (err) throw err
        const configMap = {}
        ;(data || []).forEach(row => { configMap[row.key] = row.value })
        return configMap
      },
      localSiteConfig
    )
  }

  const updateSiteConfig = conCarga((key, value) => remotoOLocal(
    async () => {
      const { error: err } = await supabase
        .from('site_config')
        .upsert({ key, value, updated_at: new Date().toISOString() })
      if (err) throw err
    },
    () => guardarLocal('configuracion-sitio', { id: key, value }),
    { escritura: true }
  ))

  // ── Image Upload ──
  // Local: el bucket de flyers va a public/media/flyers, el resto a proyectos
  const uploadImage = conCarga((file, bucket = 'portfolio') => remotoOLocal(
    async () => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: err } = await supabase.storage.from(bucket).upload(fileName, file)
      if (err) throw err

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      return data.publicUrl
    },
    () => subirImagenLocal(file, bucket === 'flyers' ? 'flyers' : 'proyectos'),
    { escritura: true }
  ))

  return {
    loading, error, usandoLocal, modoLocal, fijarModoLocal, enDev,
    // Projects
    getProjects: proyectos.listar,
    createProject: conCarga(proyectos.crear),
    updateProject: conCarga(proyectos.actualizar),
    deleteProject: conCarga(proyectos.eliminar),
    // Services
    getServices: servicios.listar,
    createService: conCarga(servicios.crear),
    updateService: conCarga(servicios.actualizar),
    deleteService: conCarga(servicios.eliminar),
    // Experiences
    getExperiences: experiencias.listar,
    createExperience: conCarga(experiencias.crear),
    updateExperience: conCarga(experiencias.actualizar),
    deleteExperience: conCarga(experiencias.eliminar),
    // Flyers
    getFlyers: flyers.listar,
    createFlyer: conCarga(flyers.crear),
    updateFlyer: conCarga(flyers.actualizar),
    deleteFlyer: conCarga(flyers.eliminar),
    // Testimonials
    getTestimonials: testimonios.listar,
    createTestimonial: conCarga(testimonios.crear),
    updateTestimonial: conCarga(testimonios.actualizar),
    deleteTestimonial: conCarga(testimonios.eliminar),
    // Config
    getSiteConfig, updateSiteConfig,
    // Messages
    getMessages: mensajes.listar,
    markMessageRead: id => mensajes.actualizar(id, { read: true }),
    deleteMessage: mensajes.eliminar,
    // Images
    uploadImage
  }
}
