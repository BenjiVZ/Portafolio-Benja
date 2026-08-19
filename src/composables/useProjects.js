import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localProjects } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'
import { applyRepoLinks, mergeWithGithub, fetchGithubProjects } from '../lib/githubRepos'

export function useProjects() {
  const projects = ref([])
  const loading = ref(true)
  const error = ref(null)
  // true cuando lo que se ve NO viene de Supabase sino de los archivos del repo
  const usingLocal = ref(false)

  async function fetchProjects() {
    loading.value = true
    error.value = null

    const res = await loadWithFallback({
      query: () => supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      // Con Supabase vivo manda solo la base: los proyectos locales y los repos
      // de GitHub quedan como sugerencias en /admin. De los repos se aprovecha
      // unicamente el enlace, para no duplicar tarjetas.
      transform: applyRepoLinks,
      // Sin base, el sitio no puede quedar vacio: entran los JSON del repo
      // y ahi si se publican tambien los repos de GitHub.
      local: async () => mergeWithGithub(await localProjects()),
      // Ultimo recurso si ni los JSON cargan: al menos los repos de GitHub
      onError: () => fetchGithubProjects().catch(() => []),
      // Corta el esqueleto sin esperar el tope completo
      onEarly: valor => {
        projects.value = valor
        usingLocal.value = true
        loading.value = false
      }
    })

    projects.value = res.value || []
    usingLocal.value = res.usingLocal
    error.value = res.error
    loading.value = false
  }

  fetchProjects()

  return { projects, loading, error, usingLocal, fetchProjects }
}
