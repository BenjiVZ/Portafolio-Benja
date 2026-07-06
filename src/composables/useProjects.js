import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchApiProjects } from '../lib/api'

const fallbackProjects = [
  {
    id: '1', title: 'E-Commerce Platform',
    description: 'Plataforma completa de comercio electrónico con carrito de compras, pasarela de pagos y panel de administración.',
    short_description: 'Tienda online completa con pagos y admin',
    category: 'web', tech_stack: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    live_url: '#', repo_url: '#', featured: true, image_url: ''
  },
  {
    id: '2', title: 'Task Manager App',
    description: 'Aplicación de gestión de tareas con drag & drop, colaboración en tiempo real y notificaciones push.',
    short_description: 'App de tareas con colaboración en tiempo real',
    category: 'app', tech_stack: ['React', 'Firebase', 'PWA', 'WebSockets'],
    live_url: '#', repo_url: '#', featured: true, image_url: ''
  },
  {
    id: '3', title: 'API REST Microservices',
    description: 'Arquitectura de microservicios con gateway API, autenticación JWT y rate limiting.',
    short_description: 'Backend escalable con microservicios',
    category: 'backend', tech_stack: ['Node.js', 'Docker', 'Redis', 'MongoDB'],
    live_url: '', repo_url: '#', featured: true, image_url: ''
  },
  {
    id: '4', title: 'Dashboard Analytics',
    description: 'Panel de análisis con gráficos interactivos, reportes exportables y filtros avanzados.',
    short_description: 'Dashboard con gráficos en tiempo real',
    category: 'web', tech_stack: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
    live_url: '#', repo_url: '#', featured: false, image_url: ''
  },
  {
    id: '5', title: 'Mobile Fitness App',
    description: 'Aplicación móvil de fitness con tracking de ejercicios, planes personalizados e integración con wearables.',
    short_description: 'App de fitness con tracking y gamificación',
    category: 'app', tech_stack: ['Flutter', 'Dart', 'Firebase', 'REST API'],
    live_url: '#', repo_url: '#', featured: false, image_url: ''
  },
  {
    id: '6', title: 'CLI Dev Tools',
    description: 'Suite de herramientas de línea de comandos para automatización y scaffolding de proyectos.',
    short_description: 'Herramientas CLI para desarrolladores',
    category: 'backend', tech_stack: ['Python', 'Click', 'Shell', 'Docker'],
    live_url: '', repo_url: '#', featured: false, image_url: ''
  }
]

export function useProjects() {
  const projects = ref([])
  const loading = ref(true)
  const error = ref(null)

  async function fetchProjects() {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })

      if (err) throw err
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      projects.value = data
    } catch (e) {
      console.warn('Supabase falló, intentando API Django:', e.message)
      try {
        const apiData = await fetchApiProjects()
        if (apiData.length === 0) throw new Error('Sin datos en la API')
        projects.value = apiData
      } catch (e2) {
        console.warn('Using fallback projects:', e2.message)
        error.value = e2.message
        projects.value = fallbackProjects
      }
    } finally {
      loading.value = false
    }
  }

  fetchProjects()

  return { projects, loading, error, fetchProjects }
}
