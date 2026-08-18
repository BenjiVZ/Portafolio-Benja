import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useFlyers() {
  const flyers = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchFlyers() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('flyers')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      flyers.value = data || []
    } catch (e) {
      console.error('No se pudieron cargar los flyers de Supabase:', e.message)
      error.value = e.message
      flyers.value = []
    } finally {
      loading.value = false
    }
  }

  fetchFlyers()

  return { flyers, loading, error, fetchFlyers }
}
