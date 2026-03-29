import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const fallbackServices = [
  { id: '1', title: 'Desarrollo Web', description: 'Creo aplicaciones web modernas, responsivas y de alto rendimiento usando las últimas tecnologías.', icon_name: 'globe' },
  { id: '2', title: 'Desarrollo Backend', description: 'Diseño e implemento APIs robustas, bases de datos optimizadas y arquitecturas escalables.', icon_name: 'server' },
  { id: '3', title: 'Aplicaciones Móviles', description: 'Desarrollo apps nativas y multiplataforma con experiencias de usuario fluidas.', icon_name: 'smartphone' },
  { id: '4', title: 'Consultoría Tech', description: 'Te ayudo a elegir las mejores tecnologías y arquitecturas para tu proyecto.', icon_name: 'message-circle' }
]

export function useServices() {
  const services = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchServices() {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      services.value = (data && data.length > 0) ? data : fallbackServices
    } catch (e) {
      console.warn('Using fallback services:', e.message)
      error.value = e.message
      services.value = fallbackServices
    } finally {
      loading.value = false
    }
  }

  fetchServices()

  return { services, loading, error, fetchServices }
}
