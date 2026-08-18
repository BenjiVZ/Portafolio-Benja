import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localServices } from '../lib/localData'

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
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      services.value = data
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      error.value = e.message
      services.value = await localServices().catch(() => [])
    } finally {
      loading.value = false
    }
  }

  fetchServices()

  return { services, loading, error, fetchServices }
}
