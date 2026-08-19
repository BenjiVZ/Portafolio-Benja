<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="#hero" class="footer-logo">
            <img :src="logoUrl" alt="MastersLogic" class="footer-logo-img" />
            <span>MastersLogic</span>
          </a>
          <p class="footer-tagline">{{ footerData.tagline || 'Soluciones tecnológicas a tu medida' }}</p>
        </div>

        <div class="footer-links">
          <a href="#about">Sobre Mí</a>
          <a href="#services">Servicios</a>
          <a href="#projects">Proyectos</a>
          <a href="#contact">Contacto</a>
        </div>

        <div class="footer-socials">
          <a v-if="social.github" :href="social.github" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          </a>
          <a v-if="social.linkedin" :href="social.linkedin" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a v-if="social.twitter" :href="social.twitter" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">{{ footerData.copyright || '© 2026 MastersLogic. Todos los derechos reservados.' }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logoUrl from '../assets/logo.png'
import { computed } from 'vue'
import { useSiteConfig } from '../composables/useSiteConfig'

const { getConfig } = useSiteConfig()
const footerData = computed(() => getConfig('footer'))
const contactData = computed(() => getConfig('contact'))
const social = computed(() => contactData.value.social || {})
</script>

<style scoped>
.footer {
  background: var(--color-bg-deep);
  border-top: 1px solid var(--color-border);
  padding: var(--space-2xl) 0;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg) var(--space-2xl);
  margin-bottom: var(--space-xl);
}

/* Sin tope de ancho la descripcion se metia debajo de los enlaces */
.footer-brand {
  flex: 1 1 320px;
  max-width: 420px;
  min-width: 0;
}

.footer-logo {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.footer-logo-img {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.footer-tagline {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.footer-links {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: var(--space-lg);
  /* "Sobre Mi" se partia en dos lineas al comprimirse la fila */
  white-space: nowrap;
}

.footer-links a {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.footer-links a:hover {
  color: var(--color-accent);
}

.footer-socials {
  display: flex;
  flex: 0 0 auto;
  gap: var(--space-sm);
}

.social-link {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.social-link:hover {
  color: var(--color-accent);
}

.footer-bottom {
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.footer-copyright {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .footer-inner {
    flex-direction: column;
    align-items: center;
    gap: var(--space-xl);
    text-align: center;
  }

  .footer-brand {
    flex: 1 1 auto;
    max-width: 520px;
  }

  .footer-logo {
    justify-content: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
