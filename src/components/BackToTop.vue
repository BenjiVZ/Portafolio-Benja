<template>
  <Transition name="btt">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" aria-label="Volver arriba">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function handleScroll() {
  visible.value = window.scrollY > 600
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--ease-out);
}

.back-to-top:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  box-shadow: var(--shadow-accent);
  transform: translateY(-3px);
}

.btt-enter-active,
.btt-leave-active {
  transition: all var(--duration-normal) var(--ease-out);
}

.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 768px) {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 42px;
    height: 42px;
  }
}
</style>
