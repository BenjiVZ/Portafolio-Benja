<template>
  <span ref="el">{{ shown }}{{ sufijo }}</span>
</template>

<script setup>
// Numero que sube desde 0 hasta su valor cuando entra en pantalla.
// Acepta un numero (56) o un texto tipo "1+" / "10+"; en ese caso el
// sufijo se saca del propio texto.
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  suffix: { type: String, default: '' },
  duration: { type: Number, default: 1100 }
})

const parsed = computed(() => {
  if (typeof props.value === 'number') return { n: props.value, s: props.suffix }
  const m = String(props.value).match(/^\s*(\d+)(.*)$/)
  if (!m) return { n: 0, s: props.suffix || String(props.value) }
  return { n: Number(m[1]), s: props.suffix || m[2].trim() }
})

const sufijo = computed(() => parsed.value.s)
const shown = ref(0)
const el = ref(null)
const visible = ref(false)
let frame = null

const reduceMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function animar(hasta) {
  if (frame) cancelAnimationFrame(frame)
  if (reduceMotion) { shown.value = hasta; return }

  const desde = shown.value
  const t0 = performance.now()
  const paso = (t) => {
    const p = Math.min(1, (t - t0) / props.duration)
    // ease-out cubico: arranca rapido y frena al llegar
    const e = 1 - Math.pow(1 - p, 3)
    shown.value = Math.round(desde + (hasta - desde) * e)
    if (p < 1) frame = requestAnimationFrame(paso)
  }
  frame = requestAnimationFrame(paso)
}

// Se anima al entrar en pantalla y cada vez que cambia el dato
// (los proyectos llegan despues del primer render)
watch([visible, () => parsed.value.n], ([v, n]) => {
  if (v) animar(n)
})

let observer = null
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      visible.value = true
      observer.disconnect()
    }
  }, { threshold: 0.4 })
  if (el.value) observer.observe(el.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (frame) cancelAnimationFrame(frame)
})
</script>
