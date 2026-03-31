<template>
  <section class="laptop-scroll" ref="sectionRef">
    <div class="laptop-scroll__sticky">
      <img
        v-for="(src, i) in frameSources"
        :key="i"
        :src="src"
        :class="['laptop-scroll__frame', { active: currentFrame === i }]"
        alt=""
        loading="eager"
      />
      <!-- Degradado superior -->
      <div class="laptop-scroll__gradient-top"></div>
      <!-- Degradado inferior -->
      <div class="laptop-scroll__gradient-bottom"></div>
      <!-- Fade out final -->
      <div
        class="laptop-scroll__fade"
        :style="{ opacity: fadeOpacity }"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const TOTAL_FRAMES = 17
const sectionRef = ref(null)
const currentFrame = ref(0)
const fadeOpacity = ref(0)

const frameSources = computed(() => {
  const sources = []
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    sources.push(`/frames/${i}.svg`)
  }
  return sources
})

function handleScroll() {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const sectionHeight = section.offsetHeight - window.innerHeight

  const scrolled = -rect.top
  const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))

  currentFrame.value = Math.min(
    TOTAL_FRAMES - 1,
    Math.floor(progress * TOTAL_FRAMES)
  )

  if (progress > 0.8) {
    fadeOpacity.value = (progress - 0.8) / 0.2
  } else {
    fadeOpacity.value = 0
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.laptop-scroll {
  position: relative;
  height: 300vh;
  z-index: 1;
}

.laptop-scroll__sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--color-bg, #0F172A);
}

.laptop-scroll__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  opacity: 0;
  pointer-events: none;
}

.laptop-scroll__frame.active {
  opacity: 1;
}

/* Degradado superior — funde con el Hero */
.laptop-scroll__gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to bottom,
    var(--color-bg, #0F172A) 0%,
    rgba(15, 23, 42, 0.7) 40%,
    transparent 100%
  );
  z-index: 2;
  pointer-events: none;
}

/* Degradado inferior — funde con la siguiente sección */
.laptop-scroll__gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to top,
    var(--color-bg, #0F172A) 0%,
    rgba(15, 23, 42, 0.7) 40%,
    transparent 100%
  );
  z-index: 2;
  pointer-events: none;
}

/* Fade out completo al final del scroll */
.laptop-scroll__fade {
  position: absolute;
  inset: 0;
  background: var(--color-bg, #0F172A);
  pointer-events: none;
  z-index: 3;
}
</style>
