import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useServices() {
  const services = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchServices() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      services.value = data || []
    } catch (e) {
      console.error('No se pudieron cargar los servicios de Supabase:', e.message)
      error.value = e.message
      services.value = []
    } finally {
      loading.value = false
    }
  }

  fetchServices()

  return { services, loading, error, fetchServices }
}
