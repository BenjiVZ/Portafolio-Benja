import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/variables.css'
import './assets/styles/base.css'
import './assets/styles/components.css'
import './assets/styles/animations.css'

const app = createApp(App)
app.use(router)

// v-reveal — anima elementos al entrar en viewport. Valor opcional = delay en ms.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

app.directive('reveal', {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value) el.style.transitionDelay = `${binding.value}ms`
    revealObserver.observe(el)
  },
  unmounted(el) {
    revealObserver.unobserve(el)
  }
})

// v-spotlight — resplandor que sigue al cursor dentro de la card.
app.directive('spotlight', {
  mounted(el) {
    el.classList.add('spotlight')
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }, { passive: true })
  }
})

app.mount('#app')
