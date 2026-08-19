import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localProjects } from '../lib/localData'
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
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')

      // Con Supabase vivo manda solo la base: los proyectos locales y los repos
      // de GitHub quedan como sugerencias en /admin. De los repos se aprovecha
      // unicamente el enlace, para no duplicar tarjetas.
      usingLocal.value = false
      projects.value = await applyRepoLinks(data)
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      error.value = e.message
      usingLocal.value = true
      // Sin base, el sitio no puede quedar vacio: entran los JSON del repo
      // y ahi si se publican tambien los repos de GitHub.
      try {
        projects.value = await mergeWithGithub(await localProjects())
      } catch (e2) {
        console.error('Respaldo local tambien fallo:', e2.message)
        projects.value = await fetchGithubProjects()
      }
    } finally {
      loading.value = false
    }
  }

  fetchProjects()

  return { projects, loading, error, usingLocal, fetchProjects }
}
