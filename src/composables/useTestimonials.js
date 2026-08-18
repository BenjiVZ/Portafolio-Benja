import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useTestimonials() {
  const testimonials = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchTestimonials() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      testimonials.value = data || []
    } catch (e) {
      console.error('No se pudieron cargar los testimonios de Supabase:', e.message)
      error.value = e.message
      testimonials.value = []
    } finally {
      loading.value = false
    }
  }

  fetchTestimonials()

  return { testimonials, loading, error, fetchTestimonials }
}
