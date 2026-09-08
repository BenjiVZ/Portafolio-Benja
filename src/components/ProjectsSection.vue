<template>
  <section id="projects" class="section projects">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Proyectos</h2>
        <p class="section-subtitle">Una selección de mis trabajos más recientes</p>
      </div>

      <!-- Skeleton mientras carga la data -->
      <div v-if="loading" class="projects-grid" aria-busy="true">
        <div v-for="n in 6" :key="'sk-' + n" class="project-card sk-card">
          <div class="skeleton sk-thumb"></div>
          <div class="project-info">
            <div class="skeleton sk-line w-40"></div>
            <div class="skeleton sk-line w-80"></div>
            <div class="skeleton sk-line w-60"></div>
          </div>
        </div>
      </div>

      <!-- Category filters -->
      <div v-if="!loading" class="project-filters">
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
      <div v-if="!loading" class="projects-grid" ref="gridRef">
        <!-- appear: la primera tanda tambien entra escalonada, no solo al filtrar -->
        <TransitionGroup name="project-card" appear>
          <div
            v-for="(project, idx) in visibleProjects"
            :key="project.id"
            class="project-card"
            :class="{ 'is-featured': project.featured }"
            :style="{ '--i': idx % PAGE }"
            v-spotlight
            v-tilt
            @click="openProject(project)"
          >
            <div class="project-thumbnail">
              <div v-if="project.image_url" class="project-image" :style="{ backgroundImage: `url(${project.image_url})` }"></div>
              <!-- Sin imagen: portada generada con el tono de la categoria y el monograma del titulo -->
              <div v-else class="project-image-placeholder" :style="placeholderStyle(project)">
                <span class="placeholder-monogram">{{ monogram(project.title) }}</span>
                <span v-if="project.tech_stack?.[0]" class="placeholder-tech">{{ project.tech_stack[0] }}</span>
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

      <!-- Paginado: 56 tarjetas seguidas eran una pared; se muestran de a 9 -->
      <div v-if="!loading && hiddenCount > 0" class="projects-more">
        <button class="btn btn-secondary" @click="showMore">
          Ver más proyectos
          <span class="more-count">+{{ Math.min(PAGE, hiddenCount) }}</span>
        </button>
        <p class="projects-count">Mostrando {{ visibleProjects.length }} de {{ filteredProjects.length }}</p>
      </div>
      <div v-else-if="!loading && filteredProjects.length > PAGE" class="projects-more">
        <button class="btn btn-ghost" @click="showLess">Ver menos</button>
      </div>

      <!-- Project Modal -->
      <Transition name="modal">
        <div v-if="selectedProject" class="modal-overlay" @click.self="selectedProject = null">
          <div class="modal project-modal">
            <div class="modal-header">
              <div class="modal-heading">
                <div class="project-badges">
                  <span class="project-category-badge">{{ getCategoryLabel(selectedProject.category) }}</span>
                  <span v-if="selectedProject.subcategory" class="project-category-badge sub-badge">{{ getCategoryLabel(selectedProject.subcategory) }}</span>
                  <span v-if="selectedProject.featured" class="modal-featured">★ Destacado</span>
                </div>
                <h3>{{ selectedProject.title }}</h3>
              </div>
              <button class="modal-close" @click="selectedProject = null" aria-label="Cerrar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <!-- Portada: la imagen real o la misma generada de la tarjeta -->
            <div class="modal-cover" :style="selectedProject.image_url ? null : placeholderStyle(selectedProject)">
              <img v-if="selectedProject.image_url" class="modal-cover-img" :src="selectedProject.image_url" :alt="selectedProject.title" />
              <template v-else>
                <span class="placeholder-monogram">{{ monogram(selectedProject.title) }}</span>
                <span v-if="selectedProject.tech_stack?.[0]" class="placeholder-tech">{{ selectedProject.tech_stack[0] }}</span>
              </template>
            </div>

            <!-- Las descripciones traen listas escritas con " - " en una sola linea:
                 se separan en parrafo + viñetas para que se puedan leer -->
            <div class="modal-description">
              <p v-if="modalDesc.intro">{{ modalDesc.intro }}</p>
              <ul v-if="modalDesc.items.length" class="modal-desc-list">
                <li v-for="(item, i) in modalDesc.items" :key="i">{{ item }}</li>
              </ul>
              <p v-if="modalDesc.cierre">{{ modalDesc.cierre }}</p>
            </div>

            <div class="modal-tech">
              <h4 class="modal-tech-title">
                Tecnologías
                <span class="modal-tech-count">{{ modalTechs.length }}</span>
              </h4>
              <div class="modal-tech-grid">
                <div
                  v-for="(t, i) in modalTechs"
                  :key="t.name"
                  class="tech-card"
                  :class="{ 'is-sub': t.sub }"
                  :style="{ '--i': i }"
                  :title="t.name"
                >
                  <span class="tech-card-icon">
                    <img v-if="t.icon" :src="t.icon" :alt="t.name" loading="lazy" @error="t.icon = null" />
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  </span>
                  <span class="tech-card-name">{{ t.name }}</span>
                </div>
              </div>
            </div>

            <!-- Sin enlaces a repos por decision del autor (ver _meta en repos-github.json) -->
            <p v-if="!selectedProject.live_url && !selectedProject.repo_url" class="modal-nolinks">
              Este proyecto no tiene demo pública.
            </p>
            <div v-else class="modal-actions">
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useProjects } from '../composables/useProjects'
import { getTechIcon } from '../lib/techIcons'

const { projects, loading } = useProjects()

// Descripcion del modal partida en intro + viñetas + cierre. Los textos vienen
// del export de Django con las viñetas pegadas como " - Item - Item". Si no hay
// al menos dos, se deja como un parrafo normal.
const modalDesc = computed(() => {
  const p = selectedProject.value
  const texto = String(p?.description || p?.short_description || '').trim()
  const partes = texto.split(/\s+-\s+/)
  if (partes.length < 3) return { intro: texto, items: [], cierre: '' }

  const intro = partes[0]
  let items = partes.slice(1)
  let cierre = ''
  // Si el ultimo item lleva un punto y sigue una frase larga, esa frase es el cierre
  const ultimo = items[items.length - 1]
  const corte = ultimo.search(/\.\s+[A-ZÁÉÍÓÚ]/)
  if (corte > 0) {
    items[items.length - 1] = ultimo.slice(0, corte + 1)
    cierre = ultimo.slice(corte + 1).trim()
  }
  return { intro, items: items.map(s => s.replace(/\.?\s*$/, '')), cierre }
})

// Tecnologias del modal con su logo. Objetos reactivos para poder quitar el
// icono si la CDN no lo tiene (@error) y caer al generico.
const modalTechs = computed(() => {
  const p = selectedProject.value
  if (!p) return []
  const principales = (p.tech_stack || []).map(name => ({ name, icon: getTechIcon(name), sub: false }))
  const extras = (p.sub_skills || []).map(name => ({ name, icon: getTechIcon(name), sub: true }))
  return [...principales, ...extras]
})
const activeFilter = ref('all')
const selectedProject = ref(null)
const gridRef = ref(null)

const categories = [
  { label: 'Todos', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Apps', value: 'app' },
  { label: 'Backend', value: 'backend' },
  { label: 'Sistemas', value: 'sistemas' },
  { label: 'Universitario', value: 'university' },
  { label: 'Pasantías', value: 'internship' },
  { label: 'Laboral', value: 'work' },
  { label: 'Personal', value: 'personal' },
  { label: 'Futuros', value: 'future' }
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

// ── Paginado ──
const PAGE = 9
const visibleCount = ref(PAGE)
const visibleProjects = computed(() => filteredProjects.value.slice(0, visibleCount.value))
const hiddenCount = computed(() => Math.max(0, filteredProjects.value.length - visibleCount.value))

function showMore() {
  visibleCount.value += PAGE
}

function showLess() {
  visibleCount.value = PAGE
  gridRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Al cambiar de filtro se vuelve a la primera pagina
watch(activeFilter, () => { visibleCount.value = PAGE })

// ── Portada generada ──
// Tono por categoria, siempre poco saturado para no romper la paleta gris.
const CATEGORY_HUE = {
  web: 210, app: 160, backend: 265, sistemas: 190, university: 35,
  internship: 300, work: 20, personal: 230, future: 130
}

function placeholderStyle(project) {
  const h = CATEGORY_HUE[project.category] ?? 220
  return {
    background: `linear-gradient(135deg, hsl(${h} 26% 21%) 0%, hsl(${h + 25} 30% 12%) 100%)`
  }
}

// "Cloud de Música" -> "CM", "SHOWROOTS" -> "SH". Se saltan conectores.
const CONECTORES = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'con', 'en', 'para', 'a', 'un', 'una', 'por', 'sobre'])

function monogram(title = '') {
  const words = String(title)
    .replace(/[^\p{L}\p{N} ]/gu, ' ')
    .split(/\s+/)
    .filter(w => w && !CONECTORES.has(w.toLowerCase()))
  if (!words.length) return '<>'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function openProject(project) {
  selectedProject.value = project
}

// Bloquea el scroll del fondo mientras el modal está abierto
watch(selectedProject, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

function handleKeydown(e) {
  if (e.key === 'Escape' && selectedProject.value) {
    selectedProject.value = null
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
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
  color: var(--color-on-accent);
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
  /* --rx / --ry los pone la directiva v-tilt; --ty lo pone el hover */
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0));
  transform-style: preserve-3d;
}

.project-card:hover {
  --ty: -6px;
  border-color: var(--color-accent-subtle);
  box-shadow: var(--shadow-card-hover);
}

/* Destacado: el anillo del borde gira con un degradado de acento */
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.project-card.is-featured::after {
  opacity: 1;
  box-shadow: none;
  padding: 1px;
  background: conic-gradient(
    from var(--angle),
    transparent 0%,
    var(--color-accent) 12%,
    transparent 28%,
    transparent 60%,
    var(--color-warning) 74%,
    transparent 88%
  );
  /* Solo queda el anillo de 1px: se recorta el interior */
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: girar-borde 5s linear infinite;
}

@keyframes girar-borde {
  to { --angle: 360deg; }
}

@media (prefers-reduced-motion: reduce) {
  .project-card.is-featured::after { animation: none; }
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
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* El degradado de fondo llega inline, por categoria */
}

/* Brillo suave en una esquina para que no sea un rectangulo plano */
.project-image-placeholder::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 25% 15%, rgba(255, 255, 255, 0.09), transparent 55%);
}

.placeholder-monogram {
  position: relative;
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgba(226, 232, 240, 0.9);
  transition: transform var(--duration-slow) var(--ease-out);
}

.project-card:hover .placeholder-monogram {
  transform: scale(1.06);
}

.placeholder-tech {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.projects-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-2xl);
}

.more-count {
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  font-size: var(--text-xs);
}

.projects-count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-faint);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
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
  /* Mas discreta: con la mitad de las tarjetas destacadas, el borde con
     resplandor competia con el contenido */
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.4);
  backdrop-filter: blur(6px);
  padding: 3px 10px;
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
  background: var(--color-chip);
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

/* ── Modal de proyecto ── */
.project-modal {
  max-width: 780px;
}

.modal-heading {
  min-width: 0;
}

.modal-heading h3 {
  margin-top: var(--space-sm);
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
}

.modal-featured {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.modal-cover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-xl);
  border: 1px solid var(--color-border);
  background: var(--color-bg-surface);
}

.modal-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 25% 15%, rgba(255, 255, 255, 0.09), transparent 55%);
}

.modal-cover-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.modal-description {
  margin-bottom: var(--space-xl);
  line-height: var(--leading-relaxed);
}

.modal-description p + ul,
.modal-description ul + p {
  margin-top: var(--space-md);
}

.modal-desc-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-desc-list li {
  position: relative;
  padding-left: 1.4em;
  color: var(--color-text-secondary);
}

.modal-desc-list li::before {
  content: '';
  position: absolute;
  left: 0.35em;
  top: 0.62em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.modal-tech-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.modal-tech-count {
  padding: 1px 8px;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

/* Cada tecnologia es una ficha con el logo sobre una baldosa blanca:
   asi los logos de marca (Django verde oscuro, GitHub negro) se ven en
   los dos temas. */
.modal-tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: var(--space-md) var(--space-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  animation: fadeInUp 0.4s var(--ease-out) both;
  animation-delay: calc(var(--i, 0) * 40ms);
}

.tech-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
  box-shadow: 0 6px 16px var(--color-accent-glow);
}

.tech-card.is-sub {
  border-style: dashed;
}

.tech-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #FFFFFF;
  border: 1px solid var(--color-border);
  color: var(--color-text-faint);
}

.tech-card-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.tech-card-name {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}

.modal-nolinks {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
}

/* Skeleton */
.sk-card {
  pointer-events: none;
}

.sk-thumb {
  aspect-ratio: 16 / 10;
  border-radius: 0;
}

/* Transition */
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.4s var(--ease-out);
}

/* Entrada escalonada: cada tarjeta espera 60ms mas que la anterior (--i) */
.project-card-enter-active {
  transition-delay: calc(var(--i, 0) * 60ms);
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
