import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localFlyers } from '../lib/localData'

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
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      flyers.value = data
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      error.value = e.message
      flyers.value = await localFlyers().catch(() => [])
    } finally {
      loading.value = false
    }
  }

  fetchFlyers()

  return { flyers, loading, error, fetchFlyers }
}
