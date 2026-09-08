import { ref, computed } from 'vue'

// El valor inicial ya lo puso el script de index.html antes de pintar,
// asi que aqui solo se lee para no provocar un parpadeo.
const KEY = 'portafolio-tema'
const theme = ref(document.documentElement.getAttribute('data-theme') || 'dark')

function apply(t) {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  // El color de la barra del navegador en movil acompana al tema
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', t === 'light' ? '#F8FAFC' : '#0F172A')
}

// Mientras el visitante no elija, se sigue al sistema si cambia en caliente
try {
  if (!localStorage.getItem(KEY)) {
    window.matchMedia('(prefers-color-scheme: light)')
      .addEventListener('change', e => apply(e.matches ? 'light' : 'dark'))
  }
} catch (e) { /* sin localStorage (modo privado estricto): se queda como arranco */ }

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggle() {
    const siguiente = isDark.value ? 'light' : 'dark'
    apply(siguiente)
    try { localStorage.setItem(KEY, siguiente) } catch (e) { /* no persiste, pero funciona */ }
  }

  return { theme, isDark, toggle }
}
