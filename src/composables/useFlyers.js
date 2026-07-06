import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchApiFlyers } from '../lib/api'

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
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      flyers.value = data
    } catch (e) {
      console.warn('Supabase falló, intentando API Django:', e.message)
      try {
        const apiData = await fetchApiFlyers()
        if (apiData.length === 0) throw new Error('Sin datos en la API')
        flyers.value = apiData
      } catch (e2) {
        console.warn('Using fallback flyers:', e2.message)
        error.value = e2.message
        flyers.value = fallbackFlyers
      }
    } finally {
      loading.value = false
    }
  }

  fetchFlyers()

  return { flyers, loading, error, fetchFlyers }
}
