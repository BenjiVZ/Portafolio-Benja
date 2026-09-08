import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.dirname(fileURLToPath(import.meta.url))

// ============================================
// Edicion local del admin — solo existe en `npm run dev`.
// Con Supabase caido, /admin guarda aqui:
//  - cambios de proyectos → public/data/proyectos-edit.json
//  - imagenes subidas     → public/media/proyectos/
// El sitio lee ese JSON como parte de sus datos locales, asi que lo
// editado se ve al instante y tambien queda dentro del build.
// ============================================
function adminLocal() {
  const EDIT_FILE = path.join(raiz, 'public/data/proyectos-edit.json')
  const MEDIA_DIR = path.join(raiz, 'public/media/proyectos')

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

  return {
    name: 'admin-local',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__local/')) return next()

        try {
          if (req.method === 'POST' && req.url.startsWith('/__local/proyecto')) {
            const row = JSON.parse((await leerBody(req)).toString('utf8'))
            if (row.id == null) return responder(res, 400, { error: 'falta id' })
            const edits = JSON.parse(fs.readFileSync(EDIT_FILE, 'utf8'))
            const i = edits.findIndex(e => String(e.id) === String(row.id))
            if (i >= 0) edits[i] = { ...edits[i], ...row }
            else edits.push(row)
            fs.writeFileSync(EDIT_FILE, JSON.stringify(edits, null, 2) + '\n')
            return responder(res, 200, row)
          }

          if (req.method === 'POST' && req.url.startsWith('/__local/upload')) {
            const url = new URL(req.url, 'http://local')
            const nombre = (url.searchParams.get('nombre') || 'imagen').replace(/[^A-Za-z0-9._-]/g, '_')
            fs.mkdirSync(MEDIA_DIR, { recursive: true })
            const archivo = `${Date.now()}-${nombre}`
            fs.writeFileSync(path.join(MEDIA_DIR, archivo), await leerBody(req))
            return responder(res, 200, { url: `/media/proyectos/${archivo}` })
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
