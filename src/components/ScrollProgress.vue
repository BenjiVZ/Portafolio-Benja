<template>
  <div class="scroll-progress" :style="{ transform: `scaleX(${progress})` }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function update() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-accent);
  transform-origin: left;
  transform: scaleX(0);
  z-index: calc(var(--z-navbar) + 1);
  pointer-events: none;
  box-shadow: 0 0 8px var(--color-accent-glow);
}
</style>
