import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localProjects } from '../lib/localData'
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
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      // Los repos de GitHub se guardan en el repo, no en la base
      projects.value = await mergeWithGithub(data)
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      error.value = e.message
      // Respaldo: los JSON del repo, fusionados igual con los repos de GitHub
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

  return { projects, loading, error, fetchProjects }
}
