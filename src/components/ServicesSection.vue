<template>
  <section id="services" class="section services">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Servicios</h2>
        <p class="section-subtitle">Soluciones tecnológicas adaptadas a tus necesidades</p>
      </div>

      <div class="services-grid stagger-children" ref="gridRef">
        <div
          v-for="(service, i) in services"
          :key="service.id || i"
          class="service-card card"
        >
          <div class="service-icon-wrapper">
            <component :is="getIcon(service.icon_name)" />
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h, onMounted, ref } from 'vue'
import { useServices } from '../composables/useServices'

const { services } = useServices()
const gridRef = ref(null)

const icons = {
  globe: () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' }),
  server: () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>' }),
  smartphone: () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>' }),
  'message-circle': () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>' }),
  code: () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', innerHTML: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' })
}

function getIcon(name) {
  return icons[name] || icons.code
}

onMounted(() => {
  if (!gridRef.value) return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1 })
  observer.observe(gridRef.value)
})
</script>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-lg);
}

.service-card {
  text-align: center;
  padding: var(--space-2xl) var(--space-xl);
}

.service-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  margin-bottom: var(--space-lg);
  border: 1px solid var(--color-border-accent);
  transition: all var(--duration-normal) var(--ease-out);
}

.service-card:hover .service-icon-wrapper {
  background: var(--color-accent);
  color: var(--color-bg);
  box-shadow: var(--shadow-accent);
}

.service-title {
  font-size: var(--text-xl);
  margin-bottom: var(--space-sm);
}

.service-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}
</style>
