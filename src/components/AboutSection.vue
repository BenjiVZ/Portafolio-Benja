<template>
  <section id="about" class="section about">
    <div class="container">
      <div class="about-grid">
        <div class="about-image-wrapper reveal" ref="imageRef">
          <div class="about-bg-glow"></div>
          <div class="about-image-frame">
            <img
              v-if="aboutData.image_url"
              :src="aboutData.image_url"
              alt="Foto de perfil"
              class="about-image"
            />
            <div v-else class="about-image-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="about-image-border"></div>
          </div>
          <div class="about-exp-badge float">
            <span class="exp-number"><CountUp :value="aboutData.years_exp || '1+'" /></span>
            <span class="exp-label">Año(s) de<br>experiencia</span>
          </div>
        </div>

        <div class="about-content reveal" ref="contentRef">
          <div class="section-header" style="text-align: left;">
            <h2 class="section-title">{{ aboutData.title || 'Sobre Mí' }}</h2>
          </div>

          <p class="about-description">
            {{ aboutData.description || 'Soy un desarrollador apasionado por crear soluciones tecnológicas elegantes y funcionales.' }}
          </p>

          <div class="about-skills">
            <h4 class="skills-title">Tech Stack</h4>
            <div class="skills-grid stagger-children">
              <span
                v-for="(skill, i) in (aboutData.skills || defaultSkills)"
                :key="i"
                class="tech-tag"
              >
                <img
                  v-if="getTechIcon(skill)"
                  :src="getTechIcon(skill)"
                  :alt="skill"
                  class="tech-icon"
                  loading="lazy"
                />
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="about-stats">
            <div class="stat-item">
              <span class="stat-number"><CountUp :value="projectsCount" suffix="+" /></span>
              <span class="stat-label">Proyectos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number"><CountUp :value="companiesCount" suffix="+" /></span>
              <span class="stat-label">Empresas</span>
            </div>
            <div class="stat-item">
              <span class="stat-number"><CountUp :value="aboutData.years_exp || '1+'" /></span>
              <span class="stat-label">Años Exp.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSiteConfig } from '../composables/useSiteConfig'
import { useProjects } from '../composables/useProjects'
import { supabase } from '../lib/supabase'
import { localExperiences } from '../lib/localData'
import { loadWithFallback } from '../lib/dataSource'
// Logos con color de marca (modulo compartido). Antes cada seccion tenia su
// mapa con logos forzados a blanco y en el tema claro desaparecian.
import { getTechIcon } from '../lib/techIcons'
import CountUp from './CountUp.vue'

const { getConfig } = useSiteConfig()
const aboutData = computed(() => getConfig('about'))
const { projects } = useProjects()

const projectsCount = computed(() => projects.value.length || 0)

const experiences = ref([])
const companiesCount = computed(() => {
  const companies = experiences.value.map(e => e.company).filter(Boolean)
  return new Set(companies).size || 0
})
const defaultSkills = [
  'Python', 'JavaScript', 'Dart', 'Django', 'Flask', 'Vue', 'Flutter',
  'HTML', 'CSS', 'MySQL', 'SQLite3', 'PostgreSQL', 'SQL Server',
  'Docker', 'Anaconda', 'VirtualBox', 'Cisco Packet Tracer',
  'TensorFlow', 'Rasa', 'CrewAI', 'n8n', 'Odoo', 'SAP',
  'FastAPI', 'Django REST API'
]


const imageRef = ref(null)
const contentRef = ref(null)

onMounted(async () => {
  // Las animaciones se enganchan primero: antes esperaban al fetch y la
  // seccion se quedaba invisible todo lo que tardara Supabase en fallar.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.15 })

  if (imageRef.value) observer.observe(imageRef.value)
  if (contentRef.value) observer.observe(contentRef.value)

  // El contador de empresas puede llegar despues
  const res = await loadWithFallback({
    nombre: 'Sobre mi (empresas)',
    query: () => supabase.from('experiences').select('company'),
    local: localExperiences,
    onError: [],
    // Pinta lo local al instante; si Supabase contesta, lo reemplaza
    onEarly: valor => { experiences.value = valor }
  })
  experiences.value = res.value || []
})
</script>

<style scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-3xl);
  align-items: center;
}

.about-image-wrapper {
  position: relative;
  z-index: 1;
  /* Del ancho del marco: asi la insignia se ancla a la foto y no a la columna.
     Sin overflow hidden, que recortaba la insignia que sobresale 16px. */
  max-width: 380px;
}

.about-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* El degradado ya se desvanece al 60%: al 100% no se sale del viewport */
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 60%);
  z-index: -1;
  pointer-events: none;
}

.about-image-frame {
  position: relative;
  width: 100%;
  max-width: 380px;
  /* Cuadrado: el logo es 500x500 y con 4:5 + cover se cortaban los lados */
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  /* Blanco fijo: la imagen trae fondo blanco y con contain se veria el borde */
  background: #FFFFFF;
  border: 1px solid var(--color-border);
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}
.about-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%);
  color: var(--color-text-muted);
}

.about-image-border {
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-accent), transparent 60%);
  opacity: 0.3;
  pointer-events: none;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  padding: 1px;
}

.about-exp-badge {
  position: absolute;
  bottom: -16px;
  right: -16px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 16px 20px;
  /* Opaco a proposito: la insignia pisa la foto (fondo blanco) y con el
     fondo translucido el texto se perdia en modo oscuro */
  background: var(--color-bg);
  border: 1px solid var(--color-border-accent);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px var(--color-accent-subtle);
}

.exp-number {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.exp-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  line-height: 1.3;
}

.about-description {
  font-size: var(--text-lg);
  margin-bottom: var(--space-xl);
  line-height: var(--leading-relaxed);
}

.skills-title {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.about-stats {
  display: flex;
  gap: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-accent);
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }

  .about-image-wrapper {
    max-width: 280px;
    margin: 0 auto;
  }

  .about-image-frame {
    max-width: 280px;
  }

  .about-exp-badge {
    right: -8px;
    bottom: -12px;
    padding: 12px 16px;
  }

  .about-stats {
    justify-content: space-between;
  }
}
</style>
