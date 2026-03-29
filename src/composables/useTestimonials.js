import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const fallbackTestimonials = [
  { id: '1', name: 'María García', role: 'CEO', company: 'TechStart', content: 'Excelente trabajo, superó nuestras expectativas. El resultado fue una plataforma robusta y con un diseño impecable.', avatar_url: '' },
  { id: '2', name: 'Carlos Rodríguez', role: 'CTO', company: 'InnovateLab', content: 'Profesional, puntual y con un dominio técnico impresionante. Entendió perfectamente lo que necesitábamos.', avatar_url: '' },
  { id: '3', name: 'Ana Martínez', role: 'Product Manager', company: 'DataFlow', content: 'Su capacidad para resolver problemas complejos y comunicar soluciones de forma clara es excepcional.', avatar_url: '' }
]

export function useTestimonials() {
  const testimonials = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchTestimonials() {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      testimonials.value = (data && data.length > 0) ? data : fallbackTestimonials
    } catch (e) {
      console.warn('Using fallback testimonials:', e.message)
      error.value = e.message
      testimonials.value = fallbackTestimonials
    } finally {
      loading.value = false
    }
  }

  fetchTestimonials()

  return { testimonials, loading, error, fetchTestimonials }
}
