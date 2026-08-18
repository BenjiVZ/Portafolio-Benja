// ============================================
// Respaldo local — se usa solo si Supabase no responde.
// Lee los JSON de src/data y los normaliza al mismo shape que devuelven
// las tablas de Supabase, para que los componentes no noten la diferencia.
//
// Gracias a esto el portafolio nunca se ve vacío: si la base está caída,
// pausada o sin credenciales, el sitio sigue mostrando el contenido.
// ============================================

const loaders = {
  proyectos: () => import('../data/proyectos.json'),
  experiencia: () => import('../data/experiencia.json'),
  personalInfo: () => import('../data/personal-info.json'),
  configuracion: () => import('../data/configuracion.json'),
  habilidades: () => import('../data/habilidades.json'),
  flyers: () => import('../data/flyers.json'),
  servicios: () => import('../data/servicios.json')
}

const cache = new Map()

async function load(key) {
  if (!cache.has(key)) {
    cache.set(key, loaders[key]().then(mod => localizeMediaUrls(mod.default)))
  }
  return cache.get(key)
}

// Los JSON conservan URLs absolutas del backend que los generó; las
// imágenes ya viven en public/media, así que se reescriben al propio sitio.
function localizeMediaUrls(data) {
  const text = JSON.stringify(data)
    .replaceAll('https://1000.masterslogic.com/media/', '/media/')
    .replaceAll('http://1000.masterslogic.com/media/', '/media/')
    .replaceAll('https://masterslogic.com/media/', '/media/')
    .replaceAll('http://127.0.0.1:8000/media/', '/media/')
  return JSON.parse(text)
}

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

// Las categorías del export vienen por nombre en español; el frontend usa slugs
function mapCategory(nombre = '') {
  const n = (nombre || '').toLowerCase()
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

export async function localProjects() {
  const data = await load('proyectos')
  return data.map(p => ({
    id: p.id,
    title: p.titulo,
    description: p.descripcion,
    short_description: p.descripcion_corta,
    category: mapCategory(p.categoria?.nombre),
    tech_stack: p.tecnologias_rel?.length
      ? p.tecnologias_rel.map(t => t.nombre)
      : (p.tecnologias || '').split(',').map(s => s.trim()).filter(Boolean),
    live_url: p.url_demo || p.url_link || '',
    repo_url: p.url_github || '',
    featured: Boolean(p.destacado),
    image_url: p.imagen || '',
    sort_order: p.orden ?? 0
  }))
}

export async function localServices() {
  const data = await load('servicios')
  return [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

export async function localExperiences() {
  const data = await load('experiencia')
  return data.map(e => ({
    title: e.cargo,
    company: e.empresa,
    location: e.ubicacion || '',
    period: formatPeriod(e.fecha_inicio, e.fecha_fin, e.actual),
    is_current: Boolean(e.actual),
    tasks: (e.descripcion || '').split('\n').map(s => s.trim()).filter(Boolean),
    techs: []
  }))
}

export async function localFlyers() {
  const data = await load('flyers')
  return data
    .filter(f => f.activo !== false)
    .map(f => ({
      id: f.id,
      title: f.titulo,
      tag: f.precio || '',
      image_url: f.imagen || '',
      sort_order: f.orden ?? 0
    }))
    .sort((a, b) => a.sort_order - b.sort_order)
}

// site_config en Supabase es un mapa key → value; aquí se arma igual
export async function localSiteConfig() {
  const [infoArr, configArr, habilidades] = await Promise.all([
    load('personalInfo'),
    load('configuracion'),
    load('habilidades')
  ])

  const info = (Array.isArray(infoArr) ? infoArr[0] : infoArr) || {}
  const cfg = (Array.isArray(configArr) ? configArr[0] : configArr) || {}

  // Solo habilidades técnicas concretas: "Aptitudes Personales" son blandas
  // y "Habilidades Técnicas" es un resumen legado que duplica las demás.
  const EXCLUIDAS = ['aptitudes personales', 'habilidades técnicas']
  const skills = [...new Set(
    habilidades
      .filter(h => !EXCLUIDAS.includes((h.categoria?.nombre || '').toLowerCase()))
      .map(h => h.nombre)
  )]

  return {
    hero: {
      name: `${info.nombre || ''} ${info.apellido || ''}`.trim() || 'MastersLogic',
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
