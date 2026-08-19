import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localServices } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'

export function useServices() {
  const services = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchServices() {
    loading.value = true
    error.value = null

    const res = await loadWithFallback({
      nombre: 'Servicios',
      query: () => supabase.from('services').select('*').order('sort_order', { ascending: true }),
      local: localServices,
      onError: [],
      // Corta el esqueleto sin esperar el tope completo
      onEarly: valor => { services.value = valor; loading.value = false }
    })

    services.value = res.value || []
    error.value = res.error
    loading.value = false
  }

  fetchServices()

  return { services, loading, error, fetchServices }
}
