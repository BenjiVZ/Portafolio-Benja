import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localSiteConfig } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'

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

    const res = await loadWithFallback({
      query: () => supabase.from('site_config').select('key, value'),
      // La tabla guarda una fila por clave; el sitio espera un objeto
      transform: rows => Object.fromEntries(rows.map(r => [r.key, r.value])),
      local: localSiteConfig,
      onError: {},
      onEarly: valor => { config.value = valor; loading.value = false }
    })

    config.value = res.value || {}
    error.value = res.error
    loading.value = false
  }

  function getConfig(key) {
    return config.value[key] || fallbackConfig[key] || {}
  }

  fetchConfig()

  return { config, loading, error, getConfig, fetchConfig }
}
