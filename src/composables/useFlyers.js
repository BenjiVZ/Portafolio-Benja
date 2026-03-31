import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const fallbackFlyers = [
  { id: '1', title: 'Sistema de Gestión Integral', tag: 'Software ERP', image_url: '/flyers/1.png', sort_order: 1 },
  { id: '2', title: 'Smart Inventory', tag: 'Control de Stock', image_url: '/flyers/2.png', sort_order: 2 },
  { id: '3', title: 'Gestión Comercial y Preventas', tag: 'Sistema POS', image_url: '/flyers/3.png', sort_order: 3 },
  { id: '4', title: 'Repair Service', tag: 'Soporte Técnico', image_url: '/flyers/4.png', sort_order: 4 },
  { id: '5', title: 'Soluciones DEV', tag: 'Servicios Tech', image_url: '/flyers/5.png', sort_order: 5 },
]

export function useFlyers() {
  const flyers = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchFlyers() {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('flyers')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      flyers.value = (data && data.length > 0) ? data : fallbackFlyers
    } catch (e) {
      console.warn('Using fallback flyers:', e.message)
      error.value = e.message
      flyers.value = fallbackFlyers
    } finally {
      loading.value = false
    }
  }

  fetchFlyers()

  return { flyers, loading, error, fetchFlyers }
}
