import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchApiSiteConfig } from '../lib/api'

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
    description: 'Desarrollador con más de un año de experiencia y sólida trayectoria en soporte técnico y automatización empresarial. Experto en el diagnóstico de hardware y la implementación de soluciones de software para la mejora de la eficiencia operativa. Dominio de herramientas como Flask, Pandas, n8n y gestión de APIs de SAP. Certificado en Refrigeración N1, Electricidad N1 e inglés (Nivel 7/9), enfocado en la mejora continua y la innovación tecnológica.',
    image_url: '',
    skills: ['Python', 'JavaScript', 'Dart', 'Django', 'Flask', 'Vue', 'Flutter', 'HTML', 'CSS', 'MySQL', 'SQLite3', 'PostgreSQL', 'SQL Server', 'Docker', 'Anaconda', 'VirtualBox', 'Cisco Packet Tracer', 'TensorFlow', 'Rasa', 'CrewAI', 'n8n', 'Odoo', 'SAP', 'FastAPI', 'Django REST API']
  },
  contact: {
    title: 'Contacto',
    subtitle: '¿Tienes un proyecto en mente? Hablemos.',
    email: 'benjaminvelazco.01@gmail.com',
    social: { github: 'https://github.com/BenjiVZ', linkedin: 'https://linkedin.com/in/benjamin-velazco', twitter: '' }
  },
  footer: {
    copyright: '© 2026 MastersLogic. Todos los derechos reservados.',
    tagline: 'Soluciones tecnológicas a tu medida'
  }
}

export function useSiteConfig() {
  const config = ref({})
  const loading = ref(true)
  const error = ref(null)

  async function fetchConfig() {
    loading.value = true
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
      console.warn('Supabase falló, intentando API Django:', e.message)
      try {
        config.value = await fetchApiSiteConfig()
      } catch (e2) {
        console.warn('Using fallback config:', e2.message)
        error.value = e2.message
        config.value = fallbackConfig
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
