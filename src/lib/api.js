// ============================================
// Cliente de la API Django (fallback de Supabase)
// Cadena de datos: Supabase → API Django → export local (src/data) → datos estáticos
// Manual: base /api/, sin auth, solo GET, sin paginación
// ============================================

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : 'https://1000.masterslogic.com/api')
).replace(/\/$/, '')

// Export local de export_data/ (respaldo si la API no responde).
// Los JSON se cargan bajo demanda; Vite los separa del bundle principal.
const localData = {
  '/proyectos/': () => import('../data/proyectos.json'),
  '/experiencia/': () => import('../data/experiencia.json'),
  '/personal-info/': () => import('../data/personal-info.json'),
  '/configuracion/': () => import('../data/configuracion.json'),
  '/habilidades/': () => import('../data/habilidades.json'),
  '/flyers/': () => import('../data/flyers.json')
}

// Las URLs de media del export se sirven desde public/media del propio sitio
// (copias locales ya optimizadas), sin depender del dominio del backend.
function localizeMediaUrls(data) {
  const text = JSON.stringify(data)
    .replaceAll('https://1000.masterslogic.com/media/', '/media/')
    .replaceAll('http://1000.masterslogic.com/media/', '/media/')
    .replaceAll('https://masterslogic.com/media/', '/media/')
    .replaceAll('http://127.0.0.1:8000/media/', '/media/')
  return JSON.parse(text)
}

// El backend corre detrás de un proxy y puede devolver URLs de media con
// http:// en lugar de https:// — se normaliza el esquema hasta que el
// backend despliegue el fix (SECURE_PROXY_SSL_HEADER).
function forceHttpsMediaUrls(data) {
  if (!API_BASE.startsWith('https://')) return data
  const host = new URL(API_BASE).host
  const text = JSON.stringify(data).replaceAll(`http://${host}/`, `https://${host}/`)
  return JSON.parse(text)
}

async function apiGet(path) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`API Django respondió ${res.status} en ${path}`)
    return forceHttpsMediaUrls(await res.json())
  } catch (e) {
    const loadLocal = localData[path]
    if (!loadLocal) throw e
    console.warn(`API Django no disponible (${e.message}), usando export local para ${path}`)
    const mod = await loadLocal()
    return localizeMediaUrls(mod.default)
  } finally {
    clearTimeout(timer)
  }
}

// ── Helpers ──
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function formatDate(iso) {
  if (!iso) return ''
  const [year, month] = iso.split('-')
  return `${MESES[Number(month) - 1]} ${year}`
}

function formatPeriod(inicio, fin, actual) {
  const desde = formatDate(inicio)
  if (actual || !fin) return `${desde} — Actualidad`
  return `${desde} — ${formatDate(fin)}`
}

// Las categorías del API vienen por nombre en español; el frontend usa slugs
function mapCategory(nombre = '') {
  const n = nombre.toLowerCase()
  if (n.includes('web')) return 'web'
  if (n.includes('app') || n.includes('móvil') || n.includes('movil')) return 'app'
  if (n.includes('backend') || n.includes('api')) return 'backend'
  if (n.includes('universi')) return 'university'
  if (n.includes('pasant')) return 'internship'
  if (n.includes('labor') || n.includes('trabajo') || n.includes('empresa')) return 'work'
  if (n.includes('sistema')) return 'sistemas'
  if (n.includes('futuro')) return 'future'
  return 'personal'
}

// ── Proyectos: /api/proyectos/ → shape de la tabla `projects` ──
export async function fetchApiProjects() {
  const data = await apiGet('/proyectos/')
  return data.map(p => ({
    id: p.id,
    title: p.titulo,
    description: p.descripcion,
    short_description: p.descripcion_corta,
    category: mapCategory(p.categoria?.nombre),
    // tecnologias_rel es la fuente recomendada; `tecnologias` (string) es legado
    tech_stack: p.tecnologias_rel?.length
      ? p.tecnologias_rel.map(t => t.nombre)
      : (p.tecnologias || '').split(',').map(s => s.trim()).filter(Boolean),
    live_url: p.url_demo || p.url_link || '',
    repo_url: p.url_github || '',
    featured: Boolean(p.destacado),
    image_url: p.imagen || ''
  }))
}

// ── Flyers: /api/flyers/ → shape de la tabla `flyers` ──
export async function fetchApiFlyers() {
  const data = await apiGet('/flyers/')
  return data.map(f => ({
    id: f.id,
    title: f.titulo,
    tag: f.precio || '',
    image_url: f.imagen || '',
    sort_order: f.orden ?? 0
  }))
}

// ── Experiencia: /api/experiencia/ → shape de la tabla `experiences` ──
export async function fetchApiExperiences() {
  const data = await apiGet('/experiencia/')
  return data.map(e => ({
    title: e.cargo,
    company: e.empresa,
    location: e.ubicacion || '',
    period: formatPeriod(e.fecha_inicio, e.fecha_fin, e.actual),
    is_current: Boolean(e.actual),
    // la API trae la descripción como texto plano; una línea por tarea
    tasks: (e.descripcion || '').split('\n').map(s => s.trim()).filter(Boolean),
    techs: []
  }))
}

// ── Configuración del sitio: personal-info + configuracion + habilidades ──
export async function fetchApiSiteConfig() {
  const [infoArr, configArr, habilidades] = await Promise.all([
    apiGet('/personal-info/'),
    apiGet('/configuracion/').catch(() => []),
    apiGet('/habilidades/').catch(() => [])
  ])

  const info = infoArr[0]
  if (!info) throw new Error('personal-info vacío en la API')
  const cfg = configArr[0] || {}

  // El tech stack solo lleva habilidades técnicas concretas:
  // "Aptitudes Personales" son blandas y "Habilidades Técnicas" es un
  // resumen legado con nombres compuestos que duplica las demás categorías.
  const EXCLUDED_SKILL_CATS = ['aptitudes personales', 'habilidades técnicas']
  const skills = [...new Set(
    habilidades
      .filter(h => !EXCLUDED_SKILL_CATS.includes((h.categoria?.nombre || '').toLowerCase()))
      .map(h => h.nombre)
  )]

  return {
    hero: {
      name: `${info.nombre} ${info.apellido}`.trim() || 'MastersLogic',
      role: info.titulo || 'Desarrollador Full Stack',
      tagline: info.descripcion_corta || '',
      cta_primary: 'Ver Proyectos',
      cta_secondary: 'Contactar'
    },
    about: {
      title: 'Sobre Mí',
      description: info.sobre_mi || info.descripcion_corta || '',
      image_url: info.foto_perfil || '',
      skills
    },
    contact: {
      title: 'Contacto',
      subtitle: '¿Tienes un proyecto en mente? Hablemos.',
      email: info.email || '',
      social: {
        github: info.github || '',
        linkedin: info.linkedin || '',
        twitter: ''
      }
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} ${cfg.titulo_sitio || 'MastersLogic'}. Todos los derechos reservados.`,
      tagline: cfg.descripcion_meta || 'Soluciones tecnológicas a tu medida'
    }
  }
}
