<template>
  <div v-if="debugOrigen" class="origen-panel" :class="{ colapsado }">
    <button class="origen-toggle" @click="colapsado = !colapsado; tocado = true">
      <span class="origen-punto" :class="hayRespaldo ? 'punto-respaldo' : 'punto-supabase'"></span>
      {{ colapsado ? resumen : 'Origen de los datos' }}
    </button>

    <div v-if="!colapsado" class="origen-cuerpo">
      <div v-for="(info, seccion) in origenes" :key="seccion" class="origen-fila">
        <span class="origen-seccion">{{ seccion }}</span>
        <span class="origen-etiqueta" :class="info.fuente === 'respaldo' ? 'et-respaldo' : 'et-supabase'">
          {{ info.fuente }}
        </span>
        <span class="origen-total" v-if="info.total !== undefined">{{ info.total }}</span>
      </div>

      <p v-if="motivo" class="origen-motivo">{{ motivo }}</p>
      <p class="origen-ayuda">Solo tú ves esto. Apagar: <code>?debug=0</code></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { origenes, debugOrigen } from '../lib/origen'

const colapsado = ref(true)
const tocado = ref(false)

const lista = computed(() => Object.values(origenes))
const hayRespaldo = computed(() => lista.value.some(i => i.fuente === 'respaldo'))

const resumen = computed(() => {
  const total = lista.value.length
  if (!total) return 'cargando…'
  const respaldo = lista.value.filter(i => i.fuente === 'respaldo').length
  if (respaldo === 0) return `Supabase (${total}/${total})`
  if (respaldo === total) return `Respaldo local (${total}/${total})`
  return `Mezcla: ${total - respaldo} Supabase / ${respaldo} respaldo`
})

// Si algo salio del respaldo se abre solo: es el caso que interesa mirar.
// Si todo vino de Supabase, se queda como una pastilla discreta.
watch(hayRespaldo, hay => {
  if (hay && !tocado.value) colapsado.value = false
})

// El motivo es el mismo para todas cuando se cae la conexion
const motivo = computed(() => {
  const conMotivo = lista.value.find(i => i.motivo)
  return conMotivo ? conMotivo.motivo : ''
})
</script>

<style scoped>
.origen-panel {
  position: fixed;
  left: var(--space-md);
  bottom: var(--space-md);
  z-index: 900;
  max-width: min(340px, calc(100vw - 2 * var(--space-md)));
  background: rgba(11, 17, 32, 0.94);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  font-size: var(--text-xs);
  overflow: hidden;
}

.origen-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  font-family: var(--font-mono, monospace);
  cursor: pointer;
}

.origen-punto {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.punto-supabase { background: var(--color-success); }
.punto-respaldo { background: var(--color-warning, #F59E0B); }

.origen-cuerpo {
  padding: 0 12px 10px;
}

.origen-fila {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 4px 0;
  border-top: 1px solid var(--color-border);
}

.origen-seccion {
  flex: 1;
  min-width: 0;
  color: var(--color-text-muted);
}

.origen-etiqueta {
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
}

.et-supabase {
  background: rgba(34, 197, 94, 0.15);
  color: var(--color-success);
}

.et-respaldo {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning, #F59E0B);
}

.origen-total {
  min-width: 24px;
  text-align: right;
  color: var(--color-text-faint);
  font-family: var(--font-mono, monospace);
}

.origen-motivo {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-faint);
  line-height: 1.4;
}

.origen-ayuda {
  margin-top: 6px;
  color: var(--color-text-faint);
}

.origen-ayuda code {
  font-family: var(--font-mono, monospace);
}
</style>
