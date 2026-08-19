// ============================================
// Registro de donde salio cada seccion: de Supabase o del respaldo local.
//
// El indicador NO se le muestra a quien visita el portafolio. Se enciende
// con ?debug en la URL (queda guardado en la pestana) o corriendo en local
// con npm run dev. Para apagarlo: ?debug=0
// ============================================

import { reactive } from 'vue'

export const origenes = reactive({})

const CLAVE = 'portafolio-debug-origen'

function leerFlag() {
  if (typeof window === 'undefined') return false

  const url = new URLSearchParams(window.location.search)
  if (url.has('debug')) {
    const encendido = url.get('debug') !== '0' && url.get('debug') !== 'false'
    sessionStorage.setItem(CLAVE, encendido ? '1' : '0')
    return encendido
  }

  if (sessionStorage.getItem(CLAVE) === '0') return false
  return sessionStorage.getItem(CLAVE) === '1' || import.meta.env.DEV
}

export const debugOrigen = leerFlag()

export function registrarOrigen(nombre, { usingLocal, error, total }) {
  if (!nombre) return
  origenes[nombre] = {
    fuente: usingLocal ? 'respaldo' : 'supabase',
    total,
    motivo: error || null
  }
}
