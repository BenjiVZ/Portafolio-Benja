<template>
  <section id="flyers" class="section flyers-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Diseño Publicitario</h2>
        <p class="section-subtitle">Flyers y material gráfico que he diseñado para promocionar productos y servicios</p>
      </div>

      <div class="flyers-grid">
        <div
          v-for="(flyer, index) in flyers"
          :key="flyer.id"
          class="flyer-card"
          :class="{ 'visible': visibleCards.includes(index) }"
          :style="{ '--delay': index * 0.1 + 's' }"
          @click="openLightbox(index)"
        >
          <div class="flyer-image-wrapper">
            <div class="flyer-skeleton" v-if="!loadedImages[index]"></div>
            <img
              :src="flyer.src"
              :alt="flyer.title"
              class="flyer-image"
              :class="{ 'loaded': loadedImages[index] }"
              loading="lazy"
              @load="onImageLoad(index)"
            />
            <div class="flyer-overlay">
              <div class="flyer-zoom-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="flyer-info">
            <h3 class="flyer-title">{{ flyer.title }}</h3>
            <span class="flyer-tag">{{ flyer.tag }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Transition name="lightbox">
      <div v-if="lightboxOpen" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <button class="lightbox-nav lightbox-prev" @click.stop="prevFlyer" v-if="flyers.length > 1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div class="lightbox-content">
          <Transition :name="slideDirection" mode="out-in">
            <img
              :key="activeIndex"
              :src="flyers[activeIndex].src"
              :alt="flyers[activeIndex].title"
              class="lightbox-image"
            />
          </Transition>
          <div class="lightbox-caption">
            <h3>{{ flyers[activeIndex].title }}</h3>
            <span>{{ activeIndex + 1 }} / {{ flyers.length }}</span>
          </div>
        </div>

        <button class="lightbox-nav lightbox-next" @click.stop="nextFlyer" v-if="flyers.length > 1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useFlyers } from '../composables/useFlyers'

const { flyers: rawFlyers } = useFlyers()

// Map to use image_url as src for template compatibility
const flyers = computed(() =>
  rawFlyers.value.map(f => ({ ...f, src: f.image_url || f.src }))
)

const visibleCards = ref([])
const loadedImages = ref({})
const lightboxOpen = ref(false)
const activeIndex = ref(0)
const slideDirection = ref('slide-right')

function onImageLoad(index) {
  loadedImages.value[index] = true
}

// Intersection observer for scroll reveal
let observer = null

function setupObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            if (!isNaN(index) && !visibleCards.value.includes(index)) {
              visibleCards.value.push(index)
            }
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
  }
}

// Watch for flyers data changes and re-observe cards
watch(flyers, async () => {
  await nextTick()
  setupObserver()
  observer.disconnect()
  const cards = document.querySelectorAll('.flyer-card')
  cards.forEach((card, i) => {
    card.dataset.index = i
    observer.observe(card)
  })
}, { immediate: false })

onMounted(() => {
  setupObserver()
  // Also try to observe existing cards (for SSR or instant data)
  nextTick(() => {
    const cards = document.querySelectorAll('.flyer-card')
    cards.forEach((card, i) => {
      card.dataset.index = i
      observer.observe(card)
    })
  })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevFlyer()
  if (e.key === 'ArrowRight') nextFlyer()
}

function openLightbox(index) {
  activeIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevFlyer() {
  slideDirection.value = 'slide-left'
  activeIndex.value = (activeIndex.value - 1 + flyers.value.length) % flyers.value.length
}

function nextFlyer() {
  slideDirection.value = 'slide-right'
  activeIndex.value = (activeIndex.value + 1) % flyers.value.length
}
</script>

<style scoped>
.flyers-section {
  position: relative;
  overflow: hidden;
}

.flyers-section::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 70%);
  opacity: 0.3;
  pointer-events: none;
}

/* ---- Grid ---- */
.flyers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-xl);
}

/* ---- Card ---- */
.flyer-card {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);

  /* Scroll reveal initial state */
  opacity: 0;
  transform: translateY(40px) scale(0.95);
}

.flyer-card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 0.6s var(--ease-out) var(--delay),
              transform 0.6s var(--ease-out) var(--delay),
              border-color var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.flyer-card:hover {
  border-color: var(--color-accent-subtle);
  box-shadow: 0 12px 40px -12px rgba(0, 0, 0, 0.5),
              0 0 20px var(--color-accent-subtle);
  transform: translateY(-6px) scale(1);
}

/* ---- Image ---- */
.flyer-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-bg-surface);
}

/* Skeleton shimmer */
.flyer-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    var(--color-bg-surface) 30%,
    rgba(255, 255, 255, 0.04) 50%,
    var(--color-bg-surface) 70%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.flyer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform var(--duration-slow) var(--ease-out),
              opacity 0.5s ease;
  opacity: 0;
}

.flyer-image.loaded {
  opacity: 1;
}

.flyer-card:hover .flyer-image {
  transform: scale(1.05);
}

/* ---- Overlay ---- */
.flyer-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0) 40%,
    rgba(15, 23, 42, 0.85) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.flyer-card:hover .flyer-overlay {
  opacity: 1;
}

.flyer-zoom-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  transition: transform 0.3s var(--ease-out), background 0.3s;
}

.flyer-card:hover .flyer-zoom-icon {
  transform: scale(1.1);
  background: rgba(34, 197, 94, 0.25);
}

/* ---- Info ---- */
.flyer-info {
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
}

.flyer-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.flyer-tag {
  flex-shrink: 0;
  padding: 4px 12px;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* ============================================
   LIGHTBOX
   ============================================ */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(2, 6, 23, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: rotate(90deg);
}

.lightbox-nav {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lightbox-nav:hover {
  background: var(--color-accent-subtle);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  max-height: 85vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
}

.lightbox-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: var(--space-lg);
  padding: 0 var(--space-sm);
}

.lightbox-caption h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
}

.lightbox-caption span {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
}

/* ---- Lightbox Transition ---- */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: all 0.35s var(--ease-out);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* ---- Slide Transitions ---- */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s var(--ease-out);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .flyers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .flyer-info {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-md);
  }

  .flyer-title {
    font-size: var(--text-sm);
  }

  .lightbox-nav {
    display: none;
  }

  .lightbox-content {
    max-width: 95vw;
  }
}

@media (max-width: 480px) {
  .flyers-grid {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }
}
</style>
