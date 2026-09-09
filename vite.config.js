import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.dirname(fileURLToPath(import.meta.url))

// ============================================
// Edicion local del admin — solo existe en `npm run dev`.
// Con Supabase caido (o con "Editar en local" encendido), /admin guarda aqui:
//  - cada pestaña → public/data/<coleccion>-edit.json (upsert por id;
//    eliminar deja la fila marcada con _eliminado: true)
//  - imagenes subidas → public/media/<carpeta>/
// El sitio lee esos JSON como parte de sus datos locales, asi que lo
// editado se ve al instante y tambien queda dentro del build.
// ============================================

// Una coleccion por pestaña del panel; el nombre es el del archivo -edit.json
export const COLECCIONES_LOCALES = [
  'proyectos', 'servicios', 'experiencia', 'flyers', 'testimonios', 'configuracion-sitio', 'mensajes'
]

function adminLocal() {
  const DATA_DIR = path.join(raiz, 'public/data')
  const MEDIA_DIR = path.join(raiz, 'public/media')

  const leerBody = req => new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })

  const responder = (res, codigo, obj) => {
    res.statusCode = codigo
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(obj))
  }

  const archivoDe = coleccion => path.join(DATA_DIR, `${coleccion}-edit.json`)

  const leerEdits = coleccion => {
    const archivo = archivoDe(coleccion)
    if (!fs.existsSync(archivo)) return []
    const edits = JSON.parse(fs.readFileSync(archivo, 'utf8'))
    return Array.isArray(edits) ? edits : []
  }

  const escribirEdits = (coleccion, edits) => {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(archivoDe(coleccion), JSON.stringify(edits, null, 2) + '\n')
  }

  return {
    name: 'admin-local',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__local/')) return next()

        try {
          const url = new URL(req.url, 'http://local')
          const partes = url.pathname.split('/').filter(Boolean) // ['__local', accion, coleccion?]
          const accion = partes[1]

          if (req.method === 'GET' && accion === 'estado') {
            return responder(res, 200, { ok: true, colecciones: COLECCIONES_LOCALES })
          }

          // POST /__local/guardar/<coleccion>  (y /__local/proyecto por compatibilidad)
          if (req.method === 'POST' && (accion === 'guardar' || accion === 'proyecto')) {
            const coleccion = accion === 'proyecto' ? 'proyectos' : partes[2]
            if (!COLECCIONES_LOCALES.includes(coleccion)) {
              return responder(res, 400, { error: `coleccion desconocida: ${coleccion}` })
            }
            const row = JSON.parse((await leerBody(req)).toString('utf8'))
            if (row.id == null) return responder(res, 400, { error: 'falta id' })
            const edits = leerEdits(coleccion)
            const i = edits.findIndex(e => String(e.id) === String(row.id))
            if (i >= 0) edits[i] = { ...edits[i], ...row }
            else edits.push(row)
            escribirEdits(coleccion, edits)
            return responder(res, 200, i >= 0 ? edits[i] : row)
          }

          // POST /__local/descartar/<coleccion>?id=...  quita una edicion local
          // (vuelve a lo que dice el JSON del repo). Sin id, vacia toda la coleccion.
          if (req.method === 'POST' && accion === 'descartar') {
            const coleccion = partes[2]
            if (!COLECCIONES_LOCALES.includes(coleccion)) {
              return responder(res, 400, { error: `coleccion desconocida: ${coleccion}` })
            }
            const id = url.searchParams.get('id')
            const edits = id == null ? [] : leerEdits(coleccion).filter(e => String(e.id) !== String(id))
            escribirEdits(coleccion, edits)
            return responder(res, 200, { ok: true, restantes: edits.length })
          }

          // POST /__local/upload?nombre=...&carpeta=proyectos|flyers|perfil
          if (req.method === 'POST' && accion === 'upload') {
            const nombre = (url.searchParams.get('nombre') || 'imagen').replace(/[^A-Za-z0-9._-]/g, '_')
            const carpeta = (url.searchParams.get('carpeta') || 'proyectos').replace(/[^A-Za-z0-9_-]/g, '_')
            const destino = path.join(MEDIA_DIR, carpeta)
            fs.mkdirSync(destino, { recursive: true })
            const archivo = `${Date.now()}-${nombre}`
            fs.writeFileSync(path.join(destino, archivo), await leerBody(req))
            return responder(res, 200, { url: `/media/${carpeta}/${archivo}` })
          }

          return responder(res, 404, { error: 'ruta desconocida' })
        } catch (e) {
          return responder(res, 500, { error: e.message })
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), adminLocal()],
})
