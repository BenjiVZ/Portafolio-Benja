import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localFlyers } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'

export function useFlyers() {
  const flyers = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchFlyers() {
    loading.value = true
    error.value = null

    const res = await loadWithFallback({
      query: () => supabase.from('flyers').select('*').order('sort_order', { ascending: true }),
      local: localFlyers,
      onError: [],
      // Corta el esqueleto sin esperar el tope completo
      onEarly: valor => { flyers.value = valor; loading.value = false }
    })

    flyers.value = res.value || []
    error.value = res.error
    loading.value = false
  }

  fetchFlyers()

  return { flyers, loading, error, fetchFlyers }
}
