// ============================================
// Carga de datos con tope de espera.
//
// Regla: manda Supabase. Si la base contesta, se usa lo que diga — aunque
// una tabla venga vacia. El respaldo local (los JSON del repo) entra
// unicamente cuando Supabase lleva 1 minuto sin dar una respuesta valida:
// hasta entonces se reintenta y las secciones esperan en modo esqueleto.
// ============================================

import { registrarOrigen } from './origen'

// Tiempo que se espera a Supabase antes de mostrar el respaldo local
export const TIMEOUT_MS = 60000

// Pausa entre reintentos mientras no se cumple el minuto
const REINTENTO_MS = 5000

// Si una seccion ya comprobo que no hay conexion, las demas no vuelven
// a esperar el tope completo: se van directo al respaldo.
let supabaseCaido = false

export function marcarSupabaseCaido() {
  supabaseCaido = true
}

// Se agoto el tope de espera: la base no dio senales
class TiempoAgotado extends Error {
  constructor(ms) {
    super(`Supabase no respondio en ${ms}ms`)
    this.name = 'TiempoAgotado'
  }
}

export function withTimeout(promise, ms = TIMEOUT_MS) {
  let id
  const limite = new Promise((_, reject) => {
    id = setTimeout(() => reject(new TiempoAgotado(ms)), ms)
  })
  return Promise.race([promise, limite]).finally(() => clearTimeout(id))
}

// Los errores de PostgREST traen `code` (por ejemplo 42P01, tabla inexistente):
// esos si llegaron a la base. Sin codigo es que la peticion nunca llego.
function esFalloDeConexion(e) {
  return e instanceof TiempoAgotado || !e?.code
}

/**
 * Lee de Supabase y solo cae al respaldo local si la base no responde.
 * Una tabla vacia es una respuesta valida: devuelve vacio, no el respaldo.
 *
 * @param {object}   opts
 * @param {Function} opts.query     () => consulta de supabase-js
 * @param {Function} opts.local     () => datos de los archivos del repo
 * @param {Function} [opts.transform] convierte las filas de Supabase
 * @param {*}        [opts.onError]  valor (o funcion) si tambien falla el respaldo
 * @returns {Promise<{ value: *, usingLocal: boolean, error: string|null }>}
 */
export async function loadWithFallback({ query, local, transform, onError = null, nombre }) {
  const res = await intentar({ query, local, transform, onError })
  registrarOrigen(nombre, {
    usingLocal: res.usingLocal,
    error: res.error,
    total: Array.isArray(res.value) ? res.value.length : undefined
  })
  return res
}

const esperar = ms => new Promise(resolve => setTimeout(resolve, ms))

async function intentar({ query, local, transform, onError }) {
  if (!supabaseCaido) {
    const inicio = Date.now()
    let ultimoError = null

    // Reintenta hasta cumplir el minuto: el respaldo local solo entra
    // cuando Supabase lleva todo ese tiempo sin dar una respuesta valida.
    while (Date.now() - inicio < TIMEOUT_MS) {
      try {
        const { data, error } = await withTimeout(query(), TIMEOUT_MS - (Date.now() - inicio))
        if (error) throw error
        // data puede ser [] y esta bien: la base dice que no hay nada
        const filas = data || []
        return { value: transform ? await transform(filas) : filas, usingLocal: false, error: null }
      } catch (e) {
        ultimoError = e
        // Un error de la propia base (tabla que no existe, permisos) si
        // llego al servidor: no se insiste, se va al respaldo de una vez.
        if (!esFalloDeConexion(e)) break
        const restante = TIMEOUT_MS - (Date.now() - inicio)
        if (restante > 0) await esperar(Math.min(REINTENTO_MS, restante))
      }
    }

    console.warn('Supabase fallo, usando respaldo local:', ultimoError?.message)
    // Solo un fallo de conexion condena a las demas secciones. Un error de
    // la propia base (tabla que no existe, permisos) es cosa de esa tabla.
    if (esFalloDeConexion(ultimoError)) supabaseCaido = true
    return { ...(await respaldo(local, onError)), error: ultimoError?.message || 'Sin conexion con Supabase' }
  }

  return { ...(await respaldo(local, onError)), error: 'Sin conexion con Supabase' }
}

async function respaldo(local, onError) {
  try {
    return { value: await local(), usingLocal: true }
  } catch (e) {
    console.error('Respaldo local tambien fallo:', e.message)
    try {
      return { value: typeof onError === 'function' ? await onError() : onError, usingLocal: true }
    } catch (e2) {
      return { value: null, usingLocal: true }
    }
  }
}
