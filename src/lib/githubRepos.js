// ============================================
// Repos de GitHub curados — viven en el repo, no en Supabase.
// Se fusionan con los proyectos que vienen de la base:
//  - `enlaces` añade el repo a un proyecto que ya existe en Supabase
//  - `repos` se publican como proyectos propios
// ============================================

let cache = null

async function load() {
  if (!cache) {
    cache = import('../data/repos-github.json').then(mod => mod.default)
  }
  return cache
}

// Devuelve los repos con el shape de la tabla `projects`
export async function fetchGithubProjects() {
  const github = await load()
  return (github.repos || []).map(r => ({
    id: r.id,
    title: r.title,
    description: r.description,
    short_description: r.short_description,
    category: r.category,
    tech_stack: r.tech_stack || [],
    live_url: r.live_url || '',
    repo_url: r.repo_url,
    featured: Boolean(r.featured),
    image_url: r.image_url || '',
    sort_order: 1000
  }))
}

// Mapa { id de proyecto en Supabase → url del repo }
export async function fetchRepoLinks() {
  const github = await load()
  return github.enlaces || {}
}

// Solo completa el repo_url que falte. NO añade proyectos nuevos: es lo que
// usa el sitio cuando Supabase responde, para que ahi mande unicamente la base.
export async function applyRepoLinks(projects) {
  const enlaces = await fetchRepoLinks()
  return projects.map(p => ({
    ...p,
    repo_url: p.repo_url || enlaces[String(p.id)] || ''
  }))
}

// Aplica los enlaces y ademas publica los repos como proyectos propios.
// Reservado para el modo respaldo (sin Supabase) y para las sugerencias del panel.
export async function mergeWithGithub(projects) {
  const [conRepo, deGithub] = await Promise.all([
    applyRepoLinks(projects),
    fetchGithubProjects()
  ])

  return [...conRepo, ...deGithub]
}
