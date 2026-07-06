<template>
  <section id="experience" class="section experience">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Experiencia</h2>
        <p class="section-subtitle">Mi trayectoria profesional</p>
      </div>

      <div class="timeline">
        <div
          v-for="(job, i) in experiences"
          :key="i"
          class="timeline-item reveal"
          :ref="el => { if (el) itemRefs[i] = el }"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line" v-if="i < experiences.length - 1"></div>
          </div>

          <div class="timeline-card">
            <div class="card-header">
              <div class="card-titles">
                <h3 class="job-title">{{ job.title }}</h3>
                <span class="job-company">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                    <path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
                  </svg>
                  {{ job.company }}
                </span>
              </div>
              <div class="card-meta">
                <span class="job-badge" :class="{ 'badge-active': job.is_current }">
                  {{ job.is_current ? 'Actual' : job.period }}
                </span>
                <span class="job-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ job.location }}
                </span>
                <span class="job-period-text">{{ job.period }}</span>
              </div>
            </div>

            <ul class="job-tasks">
              <li v-for="(task, j) in job.tasks" :key="j">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span>{{ task }}</span>
              </li>
            </ul>

            <div class="job-techs" v-if="job.techs && job.techs.length">
              <span v-for="(tech, k) in job.techs" :key="k" class="tech-tag">
                <img
                  v-if="getTechIcon(tech)"
                  :src="getTechIcon(tech)"
                  :alt="tech"
                  class="tech-icon"
                  loading="lazy"
                />
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { fetchApiExperiences } from '../lib/api'

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'
const techIconMap = {
  'python': `${DEVICON_BASE}/python/python-original.svg`,
  'javascript': `${DEVICON_BASE}/javascript/javascript-original.svg`,
  'dart': `${DEVICON_BASE}/dart/dart-original.svg`,
  'django': `${DEVICON_BASE}/django/django-plain.svg`,
  'flask': `${DEVICON_BASE}/flask/flask-original.svg`,
  'vue': `${DEVICON_BASE}/vuejs/vuejs-original.svg`,
  'flutter': `${DEVICON_BASE}/flutter/flutter-original.svg`,
  'html': `${DEVICON_BASE}/html5/html5-original.svg`,
  'css': `${DEVICON_BASE}/css3/css3-original.svg`,
  'mysql': `${DEVICON_BASE}/mysql/mysql-original.svg`,
  'postgresql': `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
  'docker': `${DEVICON_BASE}/docker/docker-original.svg`,
  'tensorflow': `${DEVICON_BASE}/tensorflow/tensorflow-original.svg`,
  'fastapi': `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
  'pandas': `${DEVICON_BASE}/pandas/pandas-original.svg`,
  'n8n': `https://cdn.simpleicons.org/n8n/white`,
  'sap': `https://cdn.simpleicons.org/sap/white`,
  'odoo': `https://cdn.simpleicons.org/odoo/white`,
  'rasa': `https://cdn.simpleicons.org/rasa/white`,
  'electron': `${DEVICON_BASE}/electron/electron-original.svg`,
}

function getTechIcon(name) {
  return techIconMap[name.toLowerCase()] || null
}

// Fallback data
const fallbackExperiences = [
  {
    title: 'Desarrollador', company: 'Damasco', location: 'Caracas, Venezuela',
    period: 'Ene 2026 — Actualidad', is_current: true,
    tasks: ['Automatización de flujos de trabajo', 'Integración de API de SAP', 'Automatizaciones con n8n'],
    techs: ['Python', 'SAP', 'n8n']
  }
]

const experiences = ref([])
const itemRefs = ref([])

async function loadExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
    experiences.value = data
  } catch (e) {
    console.warn('Supabase falló, intentando API Django:', e.message)
    try {
      const apiData = await fetchApiExperiences()
      if (apiData.length === 0) throw new Error('Sin datos en la API')
      experiences.value = apiData
    } catch (e2) {
      console.warn('Using fallback experiences:', e2.message)
      experiences.value = fallbackExperiences
    }
  }
}

onMounted(async () => {
  await loadExperiences()

  await nextTick()

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })

  itemRefs.value.forEach(el => {
    if (el) observer.observe(el)
  })
})
</script>

<style scoped>
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: flex;
  gap: var(--space-xl);
  padding-bottom: var(--space-2xl);
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 4px solid var(--color-bg-deep);
  box-shadow: 0 0 0 2px var(--color-border-strong), 0 0 12px var(--color-accent-glow);
  position: relative;
  z-index: 2;
  transition: all var(--duration-normal) var(--ease-out);
}

.timeline-item:hover .marker-dot {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px var(--color-accent), 0 0 15px var(--color-accent);
}

.timeline-item:first-child .marker-dot {
  width: 18px;
  height: 18px;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 4px var(--color-accent-subtle), var(--shadow-accent); }
  50% { box-shadow: 0 0 0 8px var(--color-accent-subtle), 0 0 20px var(--color-accent-glow); }
}

.marker-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, var(--color-accent), var(--color-border));
  margin-top: 8px;
  border-radius: 1px;
}

.timeline-card {
  flex: 1;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.timeline-card:hover {
  border-color: var(--color-accent-subtle);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), 0 0 15px var(--color-accent-subtle);
  transform: translateY(-4px);
}

.timeline-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 0 1px var(--color-border-accent);
  opacity: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.timeline-item:hover .timeline-card::after {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.card-titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.job-title {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
}

.job-company {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-base);
  color: var(--color-accent);
  font-weight: 500;
}

.card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
  flex-shrink: 0;
}

.job-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  background: rgba(148, 163, 184, 0.1);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  white-space: nowrap;
}

.job-badge.badge-active {
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  border-color: var(--color-border-accent);
  animation: pulse-badge 3s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.job-location {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.job-period-text {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  font-family: var(--font-mono);
}

.job-tasks {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-lg) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.job-tasks li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

.job-tasks li svg {
  flex-shrink: 0;
  color: var(--color-accent);
  margin-top: 3px;
}

.job-techs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

/* ── Reveal animation ── */
.timeline-item.reveal {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out);
}

.timeline-item.reveal.visible {
  opacity: 1;
  transform: translateX(0);
}

.timeline-item:nth-child(2).reveal {
  transition-delay: 0.15s;
}

.timeline-item:nth-child(3).reveal {
  transition-delay: 0.3s;
}

@media (max-width: 768px) {
  .timeline-item {
    gap: var(--space-md);
  }

  .card-header {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .card-meta {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .timeline-marker {
    width: 16px;
  }

  .marker-dot {
    width: 12px;
    height: 12px;
  }

  .timeline-item:first-child .marker-dot {
    width: 14px;
    height: 14px;
  }
}
</style>
