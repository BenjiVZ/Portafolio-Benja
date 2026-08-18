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
        <a :href="waLink()" target="_blank" rel="noopener" class="btn btn-wa">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          WhatsApp
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
import { waLink } from '../lib/site'

const { getConfig } = useSiteConfig()
const heroData = computed(() => getConfig('hero'))

// Typing effect
const roles = ['Desarrollador Full Stack', 'Automatización Empresarial', 'Integración de APIs', 'Soporte Técnico']
const displayText = ref('')
let roleIndex = 0
let charIndex = 0
let deleting = false
let typingTimeout = null

const TYPE_SPEED = 90
const DELETE_SPEED = 45
const HOLD_FULL = 2200
const HOLD_EMPTY = 400

function typeEffect() {
  const role = roles[roleIndex]
  let delay

  if (!deleting) {
    charIndex++
    displayText.value = role.substring(0, charIndex)
    if (charIndex === role.length) {
      deleting = true
      delay = HOLD_FULL
    } else {
      delay = TYPE_SPEED
    }
  } else {
    charIndex--
    displayText.value = role.substring(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      roleIndex = (roleIndex + 1) % roles.length
      delay = HOLD_EMPTY
    } else {
      delay = DELETE_SPEED
    }
  }

  typingTimeout = setTimeout(typeEffect, delay)
}

onMounted(() => {
  typingTimeout = setTimeout(typeEffect, TYPE_SPEED)
})

onUnmounted(() => {
  if (typingTimeout) clearTimeout(typingTimeout)
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
    linear-gradient(rgba(226, 232, 240, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(226, 232, 240, 0.035) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 70%);
}

.hero-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  /* Cuadrado pero acotado al viewport: 600px fijos desbordaban en móvil */
  width: min(600px, 100vw);
  height: min(600px, 100vw);
  background: radial-gradient(circle, var(--color-accent-subtle) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: var(--navbar-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - var(--navbar-height));
  padding-bottom: var(--space-xl);
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
  /* Junto al margin-top:auto de .hero-scroll reparte el espacio sobrante
     arriba y abajo, centrando el bloque y dejando la flecha al fondo. */
  margin-top: auto;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  /* Verde de estado, no de marca: comunica disponibilidad */
  background: var(--color-success);
}

.hero-title {
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  margin-bottom: var(--space-lg);
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-sec), var(--color-accent));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  /* Lleva también la animación de .fade-in-up: declarar solo heroGradient
     la sobrescribía y el título se quedaba en opacity 0. */
  animation:
    fadeInUp 0.6s var(--ease-out) forwards,
    heroGradient 6s linear infinite;
}

@keyframes heroGradient {
  to { background-position: 200% center; }
}

.btn-wa {
  background: rgba(37, 211, 102, 0.12);
  color: #25d366;
  border: 1px solid rgba(37, 211, 102, 0.4);
}

.btn-wa:hover {
  background: #25d366;
  color: #06281a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.hero-role {
  display: flex;
  align-items: center;
  justify-content: center;
  /* El texto se escribe en runtime: sin wrap desbordaba en pantallas
     estrechas y arrastraba scroll horizontal. */
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  color: var(--color-accent);
  margin-bottom: var(--space-xl);
  min-height: 1.5em;
  max-width: 100%;
  padding: 0 var(--space-md);
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
  margin-top: auto;
  padding-top: var(--space-xl);
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
