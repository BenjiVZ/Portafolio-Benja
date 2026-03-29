<template>
  <section id="hero" class="hero">
    <div class="hero-grid-bg"></div>
    <div class="hero-glow"></div>

    <div class="container hero-content">
      <div class="hero-badge fade-in-up">
        <span class="status-dot pulse-glow"></span>
        Disponible para proyectos
      </div>

      <h1 class="hero-title fade-in-up" style="animation-delay: 0.1s">
        MastersLogic
      </h1>

      <div class="hero-role fade-in-up" style="animation-delay: 0.2s">
        <span class="role-prefix">&gt;_</span>
        <span class="role-text">{{ displayText }}</span>
        <span class="typing-cursor"></span>
      </div>

      <p class="hero-tagline fade-in-up" style="animation-delay: 0.3s">
        {{ heroData.tagline || 'Construyo experiencias digitales que importan' }}
      </p>

      <div class="hero-ctas fade-in-up" style="animation-delay: 0.4s">
        <a href="#projects" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          {{ heroData.cta_primary || 'Ver Proyectos' }}
        </a>
        <a href="#contact" class="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {{ heroData.cta_secondary || 'Contactar' }}
        </a>
      </div>

      <div class="hero-scroll fade-in-up" style="animation-delay: 0.6s">
        <a href="#about" class="scroll-indicator" aria-label="Scroll down">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSiteConfig } from '../composables/useSiteConfig'

const { getConfig } = useSiteConfig()
const heroData = computed(() => getConfig('hero'))

// Typing effect
const roles = ['Desarrollador Full Stack', 'Automatización Empresarial', 'Integración de APIs', 'Soporte Técnico']
const currentRoleIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const displayText = ref('')
let typingInterval = null

function typeEffect() {
  const currentRole = roles[currentRoleIndex.value]

  if (!isDeleting.value) {
    displayText.value = currentRole.substring(0, currentCharIndex.value + 1)
    currentCharIndex.value++

    if (currentCharIndex.value === currentRole.length) {
      setTimeout(() => { isDeleting.value = true }, 2000)
    }
  } else {
    displayText.value = currentRole.substring(0, currentCharIndex.value - 1)
    currentCharIndex.value--

    if (currentCharIndex.value === 0) {
      isDeleting.value = false
      currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
    }
  }
}

onMounted(() => {
  typingInterval = setInterval(typeEffect, isDeleting.value ? 50 : 100)
})

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(34, 197, 94, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%);
}

.hero-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: var(--navbar-height);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 20px;
  background: var(--color-accent-subtle);
  border: 1px solid var(--color-border-accent);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-accent);
  margin-bottom: var(--space-xl);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.hero-title {
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-lg);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.hero-role {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  color: var(--color-accent);
  margin-bottom: var(--space-xl);
  min-height: 1.5em;
}

.role-prefix {
  color: var(--color-text-muted);
  font-weight: 700;
}

.role-text {
  color: var(--color-accent);
}

.hero-tagline {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  max-width: 550px;
  margin: 0 auto var(--space-2xl);
  line-height: var(--leading-relaxed);
}

.hero-ctas {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-scroll {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
}

.scroll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  transition: all var(--duration-normal) var(--ease-out);
  animation: float 3s ease-in-out infinite;
}

.scroll-indicator:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .hero-role {
    font-size: var(--text-base);
  }

  .hero-tagline {
    font-size: var(--text-base);
  }

  .hero-ctas {
    flex-direction: column;
    align-items: center;
  }

  .hero-ctas .btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>
