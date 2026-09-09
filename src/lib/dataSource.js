// ============================================
// Carga de datos: todo local primero, Supabase cuando responda.
//
// Regla: el sitio pinta al instante con los JSON del repo (sin esqueletos
// ni esperas) y en paralelo consulta Supabase. Si la base contesta, sus
// datos reemplazan a los locales — aunque una tabla venga vacia. Si no
// contesta dentro del minuto, se queda lo local y listo.
// ============================================

import { registrarOrigen } from './origen'

// Tiempo que se sigue sondeando a Supabase antes de dar por buena la copia local
export const TIMEOUT_MS = 60000

// Primera pausa antes de reintentar; luego se va duplicando hasta 15 s
const REINTENTO_MS = 1000

// Si una seccion ya comprobo que no hay conexion, las demas no vuelven
// a esperar el tope completo: se van directo al respaldo.
let supabaseCaido = false

export function marcarSupabaseCaido() {
  supabaseCaido = true
}

// Se agoto el tope de espera: la base no dio senales
class TiempoAgotado extends Error {
  constructor(ms) {
    super(`Supabase no respondio en ${ms}ms`)
    this.name = 'TiempoAgotado'
  }
}

export function withTimeout(promise, ms = TIMEOUT_MS) {
  let id
  const limite = new Promise((_, reject) => {
    id = setTimeout(() => reject(new TiempoAgotado(ms)), ms)
  })
  return Promise.race([promise, limite]).finally(() => clearTimeout(id))
}

// Los errores de PostgREST traen `code` (por ejemplo 42P01, tabla inexistente):
// esos si llegaron a la base. Sin codigo es que la peticion nunca llego.
export function esFalloDeConexion(e) {
  return e instanceof TiempoAgotado || !e?.code
}

/**
 * Pinta de inmediato los datos locales y consulta Supabase en segundo plano.
 * Si la base responde, su resultado es el definitivo (una tabla vacia es una
 * respuesta valida: devuelve vacio, no lo local). Si no, se queda lo local.
 *
 * @param {object}   opts
 * @param {Function} opts.query     () => consulta de supabase-js
 * @param {Function} opts.local     () => datos de los archivos del repo
 * @param {Function} [opts.transform] convierte las filas de Supabase
 * @param {*}        [opts.onError]  valor (o funcion) si tambien falla lo local
 * @param {Function} [opts.onEarly]  recibe los datos locales al instante
 * @returns {Promise<{ value: *, usingLocal: boolean, error: string|null }>}
 */
export async function loadWithFallback({ query, local, transform, onError = null, onEarly, nombre }) {
  const res = await intentar({ query, local, transform, onError, onEarly })
  registrarOrigen(nombre, {
    usingLocal: res.usingLocal,
    error: res.error,
    total: Array.isArray(res.value) ? res.value.length : undefined
  })
  return res
}

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

// Una sola sonda para todo el sitio. Antes cada seccion reintentaba por su
// cuenta cada 5 s durante el minuto: seis secciones = 72 peticiones fallidas
// llenando la consola. Ahora la primera que se cae abre la sonda y las demas
// esperan su resultado.
let sonda = null

function esperarConexion(query) {
  // Se limpia al terminar para que una caida posterior vuelva a sondear
  // en vez de reutilizar el veredicto de la vez anterior.
  if (!sonda) sonda = sondear(query).finally(() => { sonda = null })
  return sonda
}

async function sondear(query) {
  const inicio = Date.now()
  // Espera creciente: si la base no vuelve rapido, tampoco tiene sentido
  // insistir cada pocos segundos.
  let espera = REINTENTO_MS

  while (true) {
    const restante = TIMEOUT_MS - (Date.now() - inicio)
    if (restante <= 0) return false

    await esperar(Math.min(espera, restante))
    if (Date.now() - inicio >= TIMEOUT_MS) return false

    try {
      const { error } = await withTimeout(query(), TIMEOUT_MS - (Date.now() - inicio))
      // Cualquier respuesta con codigo de PostgREST significa que el servidor
      // esta ahi; el problema seria de esa tabla, no de la conexion.
      if (!error || !esFalloDeConexion(error)) return true
    } catch (e) {
      if (!esFalloDeConexion(e)) return true
    }

    espera = Math.min(espera * 2, 15000)
  }
}

async function intentar({ query, local, transform, onError, onEarly }) {
  // Todo local primero: se pinta al instante con los JSON del repo. Si luego
  // Supabase contesta, lo de la base pisa a lo local.
  let valorLocal
  let localListo = false
  try {
    valorLocal = await local()
    localListo = true
    if (onEarly) onEarly(valorLocal)
  } catch (e) { /* mas abajo se prueba el ultimo recurso */ }

  if (supabaseCaido) {
    if (localListo) return { value: valorLocal, usingLocal: true, error: 'Sin conexion con Supabase' }
    return { ...(await respaldo(local, onError)), error: 'Sin conexion con Supabase' }
  }

  let ultimoError = null

  // Dos pasadas: la primera de entrada, la segunda solo si la sonda
  // confirma que Supabase volvio dentro del minuto.
  for (let intento = 0; intento < 2; intento++) {
    try {
      const { data, error } = await withTimeout(query())
      if (error) throw error
      // data puede ser [] y esta bien: la base dice que no hay nada
      const filas = data || []
      return { value: transform ? await transform(filas) : filas, usingLocal: false, error: null }
    } catch (e) {
      ultimoError = e
      // Un error de la propia base (tabla que no existe, permisos) si llego
      // al servidor: no se insiste, es cosa de esa tabla y no del enlace.
      if (!esFalloDeConexion(e)) break
      if (intento === 0 && !(await esperarConexion(query))) break
    }
  }

  console.warn('Supabase no respondio, se mantiene lo local:', ultimoError?.message)
  // Solo un fallo de conexion condena a las demas secciones.
  if (esFalloDeConexion(ultimoError)) supabaseCaido = true
  if (localListo) return { value: valorLocal, usingLocal: true, error: ultimoError?.message }
  return { ...(await respaldo(local, onError)), error: ultimoError?.message || 'Sin conexion con Supabase' }
}

async function respaldo(local, onError) {
  try {
    return { value: await local(), usingLocal: true }
  } catch (e) {
    console.error('Respaldo local tambien fallo:', e.message)
    try {
      return { value: typeof onError === 'function' ? await onError() : onError, usingLocal: true }
    } catch (e2) {
      return { value: null, usingLocal: true }
    }
  }
}
