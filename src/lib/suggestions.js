// ============================================
// Sugerencias para el panel: proyectos que viven en los archivos del repo
// (los JSON exportados de Django y los repos de GitHub) y que todavia NO
// estan en Supabase. El sitio publico no los muestra mientras la base
// responda; desde /admin se pueden importar uno a uno.
// ============================================

import { localProjects } from './localData'
import { fetchGithubProjects } from './githubRepos'

// Titulos "Cloud de Música" y "cloud de musica" son el mismo proyecto
function normTitle(s) {
  return (s || '')
    .toLowerCase()
    // NFD separa la tilde de la letra y el filtro siguiente la descarta,
    // asi "Música" y "Musica" dan la misma clave
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '')
}

// github.com/User/Repo.git y github.com/user/repo/ apuntan al mismo sitio
function normRepo(url) {
  return (url || '').toLowerCase().replace(/\.git$/, '').replace(/\/+$/, '')
}

export async function getProjectSuggestions(existing = []) {
  const [locales, repos] = await Promise.all([localProjects(), fetchGithubProjects()])

  const titulos = new Set(existing.map(p => normTitle(p.title)).filter(Boolean))
  const urls = new Set(existing.map(p => normRepo(p.repo_url)).filter(Boolean))

  const candidatos = [
    ...locales.map(p => ({ ...p, origen: 'JSON local' })),
    ...repos.map(p => ({ ...p, origen: 'GitHub' }))
  ]

  const pendientes = []
  for (const p of candidatos) {
    const t = normTitle(p.title)
    const r = normRepo(p.repo_url)
    if (t && titulos.has(t)) continue
    if (r && urls.has(r)) continue
    // Marcarlos evita repetir un proyecto que esta en los dos origenes
    if (t) titulos.add(t)
    if (r) urls.add(r)
    pendientes.push(p)
  }

  return pendientes
}

// Deja el objeto con las columnas de la tabla `projects`. El id local se
// descarta a proposito: lo genera Supabase para no chocar con los existentes.
export function toProjectRow(p) {
  return {
    title: p.title || '',
    description: p.description || '',
    short_description: p.short_description || '',
    category: p.category || 'personal',
    tech_stack: p.tech_stack || [],
    live_url: p.live_url || '',
    repo_url: p.repo_url || '',
    featured: Boolean(p.featured),
    image_url: p.image_url || '',
    sort_order: p.sort_order ?? 0
  }
}
