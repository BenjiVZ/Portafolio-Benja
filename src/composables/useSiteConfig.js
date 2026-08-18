import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localSiteConfig } from '../lib/localData'

// Respaldo mínimo para que el sitio no aparezca vacío mientras carga
// o si la tabla site_config quedara sin filas.
const fallbackConfig = {
  hero: {
    name: 'MastersLogic',
    role: 'Desarrollador Full Stack',
    tagline: 'Automatización empresarial, APIs, soporte técnico y soluciones de software a medida',
    cta_primary: 'Ver Proyectos',
    cta_secondary: 'Contactar'
  },
  about: {
    title: 'Sobre Mí',
    description: '',
    image_url: '',
    skills: []
  },
  contact: {
    title: 'Contacto',
    subtitle: '¿Tienes un proyecto en mente? Hablemos.',
    email: '',
    social: { github: '', linkedin: '', twitter: '' }
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} MastersLogic. Todos los derechos reservados.`,
    tagline: 'Soluciones tecnológicas a tu medida'
  }
}

export function useSiteConfig() {
  const config = ref({})
  const loading = ref(true)
  const error = ref(null)

  async function fetchConfig() {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase
        .from('site_config')
        .select('key, value')

      if (err) throw err
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')

      const configMap = {}
      data.forEach(row => {
        configMap[row.key] = row.value
      })
      config.value = configMap
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      error.value = e.message
      try {
        config.value = await localSiteConfig()
      } catch (e2) {
        console.error('Respaldo local tambien fallo:', e2.message)
        config.value = {}
      }
    } finally {
      loading.value = false
    }
  }

  function getConfig(key) {
    return config.value[key] || fallbackConfig[key] || {}
  }

  fetchConfig()

  return { config, loading, error, getConfig, fetchConfig }
}
