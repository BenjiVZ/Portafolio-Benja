<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, hidden: isHidden }">
    <div class="navbar-inner">
      <a href="#hero" class="navbar-logo">
        <img src="/logo.jpeg" alt="MastersLogic" class="logo-img" />
        <span class="logo-text">MastersLogic</span>
      </a>

      <div class="navbar-links" :class="{ open: menuOpen }">
        <a v-for="link in links" :key="link.href" :href="link.href" class="nav-link" @click="menuOpen = false">
          {{ link.label }}
        </a>
      </div>

      <button class="menu-toggle" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menú">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const links = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Servicios', href: '#services' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Contacto', href: '#contact' }
]

const isScrolled = ref(false)
const isHidden = ref(false)
const menuOpen = ref(false)
let lastScrollY = 0

function handleScroll() {
  const currentScrollY = window.scrollY
  isScrolled.value = currentScrollY > 50
  isHidden.value = currentScrollY > lastScrollY && currentScrollY > 300
  lastScrollY = currentScrollY

  if (menuOpen.value && currentScrollY > 300) {
    menuOpen.value = false
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: var(--z-navbar);
  transition: all var(--duration-normal) var(--ease-out);
  transform: translateY(0);
}

.navbar.hidden {
  transform: translateY(calc(-100% - 32px));
}

.navbar-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.navbar.scrolled .navbar-inner {
  background: rgba(15, 23, 42, 0.92);
  border-color: var(--color-border-strong);
}

.navbar-logo {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.logo-img {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.logo-text {
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
}

.navbar-logo:hover {
  opacity: 0.85;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link {
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.nav-link:hover {
  color: var(--color-accent);
  background: var(--color-accent-subtle);
}

/* Hamburger */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.menu-toggle span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text);
  border-radius: var(--radius-full);
  transition: all var(--duration-normal) var(--ease-out);
  transform-origin: center;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.menu-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .navbar {
    top: 12px;
    left: 12px;
    right: 12px;
  }

  .menu-toggle {
    display: flex;
  }

  .navbar-links {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    flex-direction: column;
    padding: var(--space-md);
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: all var(--duration-normal) var(--ease-out);
  }

  .navbar-links.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
    text-align: center;
  }
}
</style>
