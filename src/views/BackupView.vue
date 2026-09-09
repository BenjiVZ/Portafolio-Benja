<template>
  <div class="respaldo" data-theme="dark">
    <header class="respaldo-header">
      <div class="respaldo-header-inner">
        <div class="respaldo-brand">
          <router-link to="/admin" class="respaldo-logo">
            <img :src="logoUrl" alt="MastersLogic" class="respaldo-logo-img" />
            <span>MastersLogic</span>
          </router-link>
          <span class="respaldo-badge">Respaldo</span>
        </div>
        <div class="respaldo-header-actions">
          <router-link to="/admin" class="btn btn-ghost btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Volver al panel
          </router-link>
          <a href="/" class="btn btn-ghost btn-sm">Ver sitio</a>
        </div>
      </div>
    </header>

    <main class="respaldo-main">
      <section class="respaldo-hero">
        <div>
          <h1>Respaldo completo</h1>
          <p class="respaldo-hint">
            Un solo archivo JSON con todo: lo que el sistema muestra ahora mismo (Supabase o el
            respaldo local), tus ediciones del panel y los archivos de datos del repositorio.
            Guárdalo donde quieras; sirve para restaurar o migrar a otra base.
          </p>
          <ul class="respaldo-meta" v-if="!cargando">
            <li><strong>Origen de los datos:</strong> {{ origenGlobal }}</li>
            <li><strong>Generado:</strong> {{ fechaLegible }}</li>
            <li><strong>Tamaño estimado:</strong> {{ tamanoLegible(tamanoTotal) }}</li>
          </ul>
        </div>
        <div class="respaldo-cta">
          <button class="btn btn-primary btn-lg" :disabled="cargando" @click="descargarTodo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ cargando ? 'Preparando…' : 'Descargar respaldo completo' }}
          </button>
          <span class="respaldo-archivo">{{ nombreArchivo('respaldo-completo') }}</span>
        </div>
      </section>

      <p v-if="errores.length" class="respaldo-aviso">
        Algunos conjuntos no se pudieron leer y van vacíos en el respaldo:
        {{ errores.join(' · ') }}
      </p>

      <section class="respaldo-bloque">
        <h2>Datos que muestra el sistema ahora</h2>
        <p class="respaldo-hint">
          Lo mismo que ves en el panel y en el sitio: si Supabase responde, viene de la base;
          si no, del respaldo local ya mezclado con tus ediciones.
        </p>
        <div class="respaldo-tabla-wrap">
          <table class="respaldo-tabla">
            <thead>
              <tr><th>Conjunto</th><th>Origen</th><th class="num">Registros</th><th class="num">Tamaño</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasEfectivo" :key="fila.clave">
                <td><strong>{{ fila.etiqueta }}</strong><span class="respaldo-clave">{{ fila.clave }}</span></td>
                <td><span class="origen" :class="fila.origen === 'Supabase' ? 'origen-db' : 'origen-local'">{{ fila.origen }}</span></td>
                <td class="num">{{ fila.registros }}</td>
                <td class="num">{{ tamanoLegible(fila.tamano) }}</td>
                <td class="acciones">
                  <button class="btn btn-ghost btn-sm" :disabled="cargando" @click="descargar(fila.clave, efectivo[fila.clave])">Descargar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="respaldo-bloque">
        <h2>Archivos locales del repositorio</h2>
        <p class="respaldo-hint">
          Tal cual están en <code>src/data/</code> y <code>public/data/</code>. El archivo
          <code>proyectos-edit</code> son tus cambios guardados desde el panel en modo local.
        </p>
        <div class="respaldo-tabla-wrap">
          <table class="respaldo-tabla">
            <thead>
              <tr><th>Archivo</th><th>Ruta</th><th class="num">Registros</th><th class="num">Tamaño</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="fila in filasArchivos" :key="fila.clave">
                <td><strong>{{ fila.clave }}.json</strong></td>
                <td><code>{{ fila.ruta }}</code></td>
                <td class="num">{{ fila.registros }}</td>
                <td class="num">{{ tamanoLegible(fila.tamano) }}</td>
                <td class="acciones">
                  <button class="btn btn-ghost btn-sm" :disabled="cargando" @click="descargar(fila.clave, archivos[fila.clave])">Descargar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="respaldo-bloque respaldo-nota">
        <h2>Cómo restaurar</h2>
        <ul>
          <li>Ediciones locales: copia <code>archivos["proyectos-edit"]</code> del respaldo a <code>public/data/proyectos-edit.json</code>.</li>
          <li>Archivos base: cada clave de <code>archivos</code> corresponde a <code>src/data/&lt;clave&gt;.json</code>.</li>
          <li>Supabase: <code>efectivo.projects</code>, <code>efectivo.services</code>, etc. tienen las columnas de cada tabla y se pueden importar desde el Table Editor (CSV/JSON).</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdmin } from '../composables/useAdmin'
import logoUrl from '../assets/logo.png'

// Misma sesion que el panel: sin ella, de vuelta al login de /admin
const SESSION_KEY = 'portafolio-admin-sesion'
const router = useRouter()
if (sessionStorage.getItem(SESSION_KEY) !== 'ok') router.replace('/admin')

const admin = useAdmin()

// Archivos de src/data tal cual (Vite los empaqueta; no hace falta fetch)
const modulosData = import.meta.glob('../data/*.json', { eager: true, import: 'default' })

const cargando = ref(true)
const errores = ref([])
const generado = ref(new Date())
const archivos = ref({})
const efectivo = ref({})
const origenes = ref({})

const ETIQUETAS = {
  projects: 'Proyectos',
  services: 'Servicios',
  experiences: 'Experiencia',
  flyers: 'Flyers',
  testimonials: 'Testimonios',
  site_config: 'Configuración del sitio',
  contact_messages: 'Mensajes de contacto'
}

// El origen (Supabase o respaldo) es uno solo para toda la sesion: se
// averigua con la primera lectura y el resto se lanza en paralelo, porque
// cada consulta a una base caida tarda varios segundos en fallar.
let origenSesion = 'Supabase'
async function leer(clave, fn) {
  try {
    const valor = await fn()
    efectivo.value[clave] = valor ?? (clave === 'site_config' ? {} : [])
    origenes.value[clave] = origenSesion
  } catch (e) {
    efectivo.value[clave] = clave === 'site_config' ? {} : []
    origenes.value[clave] = 'No disponible'
    // "Failed to fetch" es Supabase caido; estos conjuntos no tienen respaldo local
    const motivo = /fetch|network|ERR_/i.test(e.message || '') ? 'sin conexión con Supabase y sin respaldo local' : e.message
    errores.value.push(`${ETIQUETAS[clave] || clave} (${motivo})`)
  }
}

onMounted(async () => {
  // 1) archivos del repo
  for (const [ruta, contenido] of Object.entries(modulosData)) {
    const clave = ruta.split('/').pop().replace(/\.json$/, '')
    archivos.value[clave] = contenido
  }
  try {
    const res = await fetch('/data/proyectos-edit.json', { cache: 'no-store' })
    archivos.value['proyectos-edit'] = res.ok ? await res.json() : []
  } catch {
    archivos.value['proyectos-edit'] = []
  }

  // 2) lo que muestra el sistema (Supabase o respaldo), conjunto por conjunto
  admin.usandoLocal.value = false
  await leer('projects', admin.getProjects)
  origenSesion = admin.usandoLocal.value ? 'Respaldo local' : 'Supabase'
  origenes.value.projects = origenSesion
  await Promise.all([
    leer('services', admin.getServices),
    leer('experiences', admin.getExperiences),
    leer('flyers', admin.getFlyers),
    leer('testimonials', admin.getTestimonials),
    leer('site_config', admin.getSiteConfig),
    leer('contact_messages', admin.getMessages)
  ])

  generado.value = new Date()
  cargando.value = false
})

// ── Presentacion ──
function contar(v) {
  if (Array.isArray(v)) return v.length
  if (v && typeof v === 'object') return Object.keys(v).length
  return v == null ? 0 : 1
}
function tamano(v) {
  return new Blob([JSON.stringify(v ?? null)]).size
}
function tamanoLegible(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const filasEfectivo = computed(() =>
  Object.keys(ETIQUETAS).map(clave => ({
    clave,
    etiqueta: ETIQUETAS[clave],
    origen: origenes.value[clave] || '…',
    registros: contar(efectivo.value[clave]),
    tamano: tamano(efectivo.value[clave])
  }))
)

const filasArchivos = computed(() =>
  Object.keys(archivos.value).sort().map(clave => ({
    clave,
    ruta: clave === 'proyectos-edit' ? 'public/data/proyectos-edit.json' : `src/data/${clave}.json`,
    registros: contar(archivos.value[clave]),
    tamano: tamano(archivos.value[clave])
  }))
)

const origenGlobal = computed(() => {
  const set = new Set(Object.values(origenes.value).filter(o => o !== 'No disponible'))
  if (set.size === 1) return [...set][0]
  if (set.size === 0) return 'Sin datos'
  return 'Mezcla (ver cada conjunto)'
})

const respaldoCompleto = computed(() => ({
  _meta: {
    formato: 'portafolio-benja/respaldo',
    version: 1,
    generado: generado.value.toISOString(),
    sitio: typeof location !== 'undefined' ? location.origin : '',
    origen: origenGlobal.value,
    origenes: origenes.value,
    errores: errores.value
  },
  efectivo: efectivo.value,
  archivos: archivos.value
}))

const tamanoTotal = computed(() => tamano(respaldoCompleto.value))
const fechaLegible = computed(() =>
  generado.value.toLocaleString('es-VE', { dateStyle: 'long', timeStyle: 'short' })
)

// ── Descargas ──
function sello() {
  const d = generado.value
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`
}
function nombreArchivo(base) {
  return `portafolio_${base}_${sello()}.json`
}
function descargar(base, contenido) {
  const blob = new Blob([JSON.stringify(contenido ?? null, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo(base)
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Se libera despues del click: si se revoca antes, algunos navegadores cancelan la descarga
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function descargarTodo() {
  generado.value = new Date()
  descargar('respaldo-completo', respaldoCompleto.value)
}
</script>

<style scoped>
.respaldo {
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
}

.respaldo-header {
  border-bottom: 1px solid var(--color-border);
  background: var(--color-glass-strong);
}
.respaldo-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  flex-wrap: wrap;
}
.respaldo-brand { display: flex; align-items: center; gap: var(--space-md); }
.respaldo-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--font-heading); font-weight: 700; color: var(--color-text);
}
.respaldo-logo-img { width: 32px; height: 32px; object-fit: contain; }
.respaldo-badge {
  padding: 4px 12px; border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 600;
  color: var(--color-accent); background: var(--color-accent-subtle);
  border: 1px solid var(--color-border-accent);
}
.respaldo-header-actions { display: flex; gap: var(--space-sm); align-items: center; }

.respaldo-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg) var(--space-4xl);
  display: grid;
  gap: var(--space-2xl);
}

.respaldo-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-2xl);
  align-items: center;
  padding: var(--space-xl);
  border: 1px solid var(--color-border-accent);
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 0% 0%, var(--color-accent-subtle), transparent 60%),
    var(--color-bg-elevated);
}
.respaldo-hero h1 {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-sm);
}
.respaldo-hint {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  max-width: 640px;
  margin: 0;
}
.respaldo-meta {
  list-style: none; padding: 0;
  margin: var(--space-md) 0 0;
  display: flex; flex-wrap: wrap; gap: var(--space-xs) var(--space-lg);
  font-size: var(--text-sm); color: var(--color-text-secondary);
}
.respaldo-cta { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); }
.btn-lg { padding: 14px 24px; font-size: var(--text-base); display: inline-flex; gap: 10px; align-items: center; }
.respaldo-archivo { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-faint); }

.respaldo-aviso {
  margin: 0;
  padding: 10px 14px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: var(--radius-md);
}

.respaldo-bloque h2 {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  margin: 0 0 var(--space-xs);
}
.respaldo-bloque .respaldo-hint { margin-bottom: var(--space-md); }

.respaldo-tabla-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
}
.respaldo-tabla { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.respaldo-tabla th, .respaldo-tabla td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}
.respaldo-tabla th {
  font-size: var(--text-xs); text-transform: uppercase; letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted); background: var(--color-bg-surface);
}
.respaldo-tabla tbody tr:last-child td { border-bottom: 0; }
.respaldo-tabla .num { text-align: right; font-family: var(--font-mono); white-space: nowrap; }
.respaldo-tabla .acciones { text-align: right; white-space: nowrap; }
.respaldo-clave { display: block; font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-text-faint); }
code {
  font-family: var(--font-mono); font-size: var(--text-xs);
  padding: 1px 6px; border-radius: 4px; background: var(--color-chip);
}

.origen {
  display: inline-block; padding: 2px 10px; border-radius: var(--radius-full);
  font-size: var(--text-xs); font-weight: 600; border: 1px solid transparent;
}
.origen-db { color: var(--color-success); border-color: rgba(34, 197, 94, 0.35); background: rgba(34, 197, 94, 0.08); }
.origen-local { color: var(--color-warning); border-color: rgba(245, 158, 11, 0.35); background: rgba(245, 158, 11, 0.08); }

.respaldo-nota ul { margin: 0; padding-left: 20px; color: var(--color-text-secondary); font-size: var(--text-sm); line-height: var(--leading-relaxed); }

@media (max-width: 768px) {
  .respaldo-hero { grid-template-columns: 1fr; }
  .respaldo-cta { align-items: stretch; }
}
</style>
