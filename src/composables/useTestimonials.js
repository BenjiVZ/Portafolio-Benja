import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localTestimonials } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'

export function useTestimonials() {
  const testimonials = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchTestimonials() {
    loading.value = true
    error.value = null

    const res = await loadWithFallback({
      nombre: 'Testimonios',
      query: () => supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
      // src/data/testimonios.json mas lo agregado desde el admin local
      local: localTestimonials,
      onError: [],
      // Pinta lo local al instante; si Supabase contesta, lo reemplaza
      onEarly: valor => { testimonials.value = valor; loading.value = false }
    })

    testimonials.value = res.value || []
    error.value = res.error
    loading.value = false
  }

  fetchTestimonials()

  return { testimonials, loading, error, fetchTestimonials }
}
