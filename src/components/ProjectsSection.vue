<template>
  <section id="projects" class="section projects">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Proyectos</h2>
        <p class="section-subtitle">Una selección de mis trabajos más recientes</p>
      </div>

      <!-- Category filters -->
      <div class="project-filters">
        <button
          v-for="cat in visibleCategories"
          :key="cat.value"
          class="filter-btn"
          :class="{ active: activeFilter === cat.value }"
          @click="activeFilter = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid" ref="gridRef">
        <TransitionGroup name="project-card">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
            @click="openProject(project)"
          >
            <div class="project-thumbnail">
              <div v-if="project.image_url" class="project-image" :style="{ backgroundImage: `url(${project.image_url})` }"></div>
              <div v-else class="project-image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <div class="project-overlay">
                <span class="overlay-text">Ver detalle</span>
              </div>
              <span v-if="project.featured" class="project-featured-badge">Destacado</span>
            </div>
            <div class="project-info">
              <div class="project-badges">
                <div class="project-category-badge">{{ getCategoryLabel(project.category) }}</div>
                <div class="project-category-badge sub-badge" v-if="project.subcategory">{{ getCategoryLabel(project.subcategory) }}</div>
              </div>
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-desc">{{ project.short_description || project.description }}</p>
              <div class="project-tech">
                <span v-for="tech in (project.tech_stack || []).slice(0, 4)" :key="tech" class="tech-tag">{{ tech }}</span>
                <span v-for="sub in (project.sub_skills || []).slice(0, 2)" :key="'s-'+sub" class="tech-tag sub-tech">{{ sub }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Project Modal -->
      <Transition name="modal">
        <div v-if="selectedProject" class="modal-overlay" @click.self="selectedProject = null">
          <div class="modal">
            <div class="modal-header">
              <h3>{{ selectedProject.title }}</h3>
              <button class="modal-close" @click="selectedProject = null">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <img v-if="selectedProject.image_url" class="modal-image" :src="selectedProject.image_url" :alt="selectedProject.title" />

            <p class="modal-description">{{ selectedProject.description }}</p>

            <div class="modal-tech">
              <h4 class="modal-tech-title">Tecnologías</h4>
              <div class="modal-tech-list">
                <span v-for="tech in selectedProject.tech_stack" :key="tech" class="tech-tag">{{ tech }}</span>
                <span v-for="sub in (selectedProject.sub_skills || [])" :key="'s-'+sub" class="tech-tag sub-tech">{{ sub }}</span>
              </div>
            </div>

            <div class="modal-actions">
              <a v-if="selectedProject.live_url" :href="selectedProject.live_url" target="_blank" rel="noopener" class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Ver Demo
              </a>
              <a v-if="selectedProject.repo_url" :href="selectedProject.repo_url" target="_blank" rel="noopener" class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                Código
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjects } from '../composables/useProjects'

const { projects } = useProjects()
const activeFilter = ref('all')
const selectedProject = ref(null)
const gridRef = ref(null)

const categories = [
  { label: 'Todos', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Apps', value: 'app' },
  { label: 'Backend', value: 'backend' },
  { label: 'Universitario', value: 'university' },
  { label: 'Pasantías', value: 'internship' },
  { label: 'Laboral', value: 'work' },
  { label: 'Personal', value: 'personal' }
]

const visibleCategories = computed(() => {
  return categories.filter(cat => {
    if (cat.value === 'all') return true
    return projects.value.some(p => p.category === cat.value || p.subcategory === cat.value)
  })
})

const filteredProjects = computed(() => {
  let result = projects.value
  if (activeFilter.value !== 'all') {
    result = result.filter(p => p.category === activeFilter.value || p.subcategory === activeFilter.value)
  }
  // Featured first
  return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
})

function getCategoryLabel(cat) {
  const found = categories.find(c => c.value === cat)
  return found ? found.label : cat
}

function openProject(project) {
  selectedProject.value = project
}
</script>

<style scoped>
.project-filters {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 20px;
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.filter-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.filter-btn.active {
  color: var(--color-bg);
  background: var(--color-accent);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-accent);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-lg);
}

.project-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
}

.project-card:hover {
  border-color: var(--color-accent-subtle);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), 0 0 15px var(--color-accent-subtle);
  transform: translateY(-6px);
}

.project-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 0 1px var(--color-border-accent);
  opacity: 0;
  border-radius: inherit;
  pointer-events: none;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.project-card:hover::after {
  opacity: 1;
}

.project-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-bg-surface);
}

.project-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform var(--duration-slow) var(--ease-out);
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%);
  color: var(--color-text-faint);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-text {
  color: var(--color-accent);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  padding: 8px 20px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
}

.project-featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  background: var(--color-bg-deep);
  color: var(--color-warning);
  border: 1px solid var(--color-warning);
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-info {
  padding: var(--space-xl);
}

.project-badges {
  display: flex;
  gap: 6px;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
}

.project-category-badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
}

.project-category-badge.sub-badge {
  background: rgba(148, 163, 184, 0.1);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.project-title {
  font-size: var(--text-lg);
  margin-bottom: var(--space-sm);
}

.project-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag.sub-tech {
  border-style: dashed;
  opacity: 0.75;
}

/* Modal extra */
.modal-image {
  width: 100%;
  max-height: 420px;
  object-fit: contain;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  background-color: var(--color-bg-surface);
  display: block;
}

.modal-description {
  margin-bottom: var(--space-xl);
  line-height: var(--leading-relaxed);
}

.modal-tech-title {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  margin-bottom: var(--space-sm);
}

.modal-tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
}

/* Transition */
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.4s var(--ease-out);
}

.project-card-enter-from,
.project-card-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(12px);
}

.project-card-move {
  transition: transform 0.4s var(--ease-out);
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
