import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { mergeWithGithub, fetchGithubProjects } from '../lib/githubRepos'

export function useProjects() {
  const projects = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      // Los repos de GitHub se guardan en el repo, no en la base
      projects.value = await mergeWithGithub(data || [])
    } catch (e) {
      console.error('No se pudieron cargar los proyectos de Supabase:', e.message)
      error.value = e.message
      // Sin la base solo quedan los repos de GitHub, que son locales
      projects.value = await fetchGithubProjects()
    } finally {
      loading.value = false
    }
  }

  fetchProjects()

  return { projects, loading, error, fetchProjects }
}
