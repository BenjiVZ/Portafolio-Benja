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
            <span class="exp-number">{{ aboutData.years_exp || '1+' }}</span>
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
              <span class="stat-number">{{ projectsCount }}+</span>
              <span class="stat-label">Proyectos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ companiesCount }}+</span>
              <span class="stat-label">Empresas</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ aboutData.years_exp || '1+' }}</span>
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

// Tech icon mapping using Devicon CDN
const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'
const techIconMap = {
  'python': `${DEVICON_BASE}/python/python-original.svg`,
  'javascript': `${DEVICON_BASE}/javascript/javascript-original.svg`,
  'dart': `${DEVICON_BASE}/dart/dart-original.svg`,
  'django': `${DEVICON_BASE}/django/django-plain.svg`,
  'flask': `${DEVICON_BASE}/flask/flask-original.svg`,
  'vue': `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  'vue.js': `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  'vuejs': `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  'flutter': `${DEVICON_BASE}/flutter/flutter-original.svg`,
  'html': `${DEVICON_BASE}/html5/html5-original.svg`,
  'html5': `${DEVICON_BASE}/html5/html5-original.svg`,
  'css': `${DEVICON_BASE}/css3/css3-original.svg`,
  'css3': `${DEVICON_BASE}/css3/css3-original.svg`,
  'mysql': `${DEVICON_BASE}/mysql/mysql-original.svg`,
  'sqlite3': `${DEVICON_BASE}/sqlite/sqlite-original.svg`,
  'sqlite': `${DEVICON_BASE}/sqlite/sqlite-original.svg`,
  'postgresql': `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  'postgres': `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  'sql server': `${DEVICON_BASE}/microsoftsqlserver/microsoftsqlserver-plain.svg`,
  'docker': `${DEVICON_BASE}/docker/docker-original.svg`,
  'anaconda': `${DEVICON_BASE}/anaconda/anaconda-original.svg`,
  'tensorflow': `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
  'fastapi': `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
  'react': `${DEVICON_BASE}/react/react-original.svg`,
  'node.js': `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  'nodejs': `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
  'typescript': `${DEVICON_BASE}/typescript/typescript-original.svg`,
  'git': `${DEVICON_BASE}/git/git-original.svg`,
  'linux': `${DEVICON_BASE}/linux/linux-original.svg`,
  'mongodb': `${DEVICON_BASE}/mongodb/mongodb-original.svg`,
  'redis': `${DEVICON_BASE}/redis/redis-original.svg`,
  'supabase': `${DEVICON_BASE}/supabase/supabase-original.svg`,
  'firebase': `${DEVICON_BASE}/firebase/firebase-original.svg`,
  'odoo': `https://cdn.simpleicons.org/odoo/white`,
  'n8n': `https://cdn.simpleicons.org/n8n/white`,
  'sap': `https://cdn.simpleicons.org/sap/white`,
  'sap api': `https://cdn.simpleicons.org/sap/white`,
  'html/css': `${DEVICON_BASE}/html5/html5-original.svg`,
  'c#': `${DEVICON_BASE}/csharp/csharp-original.svg`,
  'git/github': `${DEVICON_BASE}/git/git-original.svg`,
  'rasa': `https://cdn.simpleicons.org/rasa/white`,
  'virtualbox': `https://cdn.simpleicons.org/virtualbox/white`,
  'cisco packet tracer': `https://cdn.simpleicons.org/cisco/white`,
  'crewai': `https://cdn.simpleicons.org/crewai/white`,
  'django rest api': `${DEVICON_BASE}/djangorest/djangorest-original.svg`,
  'electron': `${DEVICON_BASE}/electron/electron-original.svg`,
}

function getTechIcon(name) {
  return techIconMap[name.toLowerCase()] || null
}

const imageRef = ref(null)
const contentRef = ref(null)

onMounted(async () => {
  // Load companies count
  try {
    const { data, error } = await supabase.from('experiences').select('company')
    if (error) throw error
    experiences.value = data || []
  } catch (e) {
    console.warn('No se pudo cargar la experiencia:', e.message)
  }

  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.15 })

  if (imageRef.value) observer.observe(imageRef.value)
  if (contentRef.value) observer.observe(contentRef.value)
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
  /* Contiene el resplandor de fondo, que mide 120% y se salía del viewport */
  overflow: hidden;
}

.about-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 60%);
  z-index: -1;
  pointer-events: none;
}

.about-image-frame {
  position: relative;
  width: 100%;
  max-width: 380px;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
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
  background: var(--color-bg-elevated);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
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

  .about-image-frame {
    max-width: 280px;
    margin: 0 auto;
  }

  .about-exp-badge {
    right: 0;
  }

  .about-stats {
    justify-content: space-between;
  }
}
</style>
