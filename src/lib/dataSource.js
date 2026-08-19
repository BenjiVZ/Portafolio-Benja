// ============================================
// Carga de datos con tope de espera.
//
// Cuando el proyecto de Supabase no existe (o no hay red), el fetch del
// navegador tarda unos 7 segundos en rendirse. Todo ese rato las secciones
// se quedan en modo esqueleto. Aqui se corta a los 2,5 s y se pasa al
// respaldo local, que se lee de archivos y es practicamente instantaneo.
// ============================================

export const TIMEOUT_MS = 2500

// Si a los 700 ms Supabase sigue sin contestar, se pinta ya el respaldo local
// para no dejar la pantalla en esqueletos. Si la base responde despues, sus
// datos reemplazan a los locales.
export const EARLY_MS = 700

// Si una seccion ya comprobo que Supabase no responde, las demas no vuelven
// a esperar el tope completo: se van directo al respaldo.
let supabaseCaido = false

export function marcarSupabaseCaido() {
  supabaseCaido = true
}

export function withTimeout(promise, ms = TIMEOUT_MS) {
  let id
  const limite = new Promise((_, reject) => {
    id = setTimeout(() => reject(new Error(`Supabase no respondio en ${ms}ms`)), ms)
  })
  return Promise.race([promise, limite]).finally(() => clearTimeout(id))
}

/**
 * Intenta Supabase y cae al respaldo local si falla, tarda de mas o
 * devuelve cero filas.
 *
 * @param {object}   opts
 * @param {Function} opts.query     () => consulta de supabase-js
 * @param {Function} opts.local     () => datos de los archivos del repo
 * @param {Function} [opts.transform] convierte las filas de Supabase
 * @param {*}        [opts.onError]  valor (o funcion) si tambien falla el respaldo
 * @param {Function} [opts.onEarly]  recibe el respaldo a los EARLY_MS si la base tarda
 * @returns {Promise<{ value: *, usingLocal: boolean, error: string|null }>}
 */
export async function loadWithFallback({ query, local, transform, onError = null, onEarly }) {
  if (!supabaseCaido) {
    let resuelta = false
    const consulta = withTimeout(query()).finally(() => { resuelta = true })

    // Adelanto: pinta lo local mientras la base sigue pensando
    if (onEarly) {
      setTimeout(async () => {
        if (resuelta) return
        try {
          const valor = await local()
          if (!resuelta) onEarly(valor)
        } catch (e) { /* si falla, el flujo normal se encarga */ }
      }, EARLY_MS)
    }

    try {
      const { data, error } = await consulta
      if (error) throw error
      if (!data || data.length === 0) throw new Error('Sin datos en Supabase')
      return { value: transform ? await transform(data) : data, usingLocal: false, error: null }
    } catch (e) {
      console.warn('Supabase no respondio, usando respaldo local:', e.message)
      supabaseCaido = true
      return { ...(await respaldo(local, onError)), error: e.message }
    }
  }

  return { ...(await respaldo(local, onError)), error: 'Supabase marcado como caido' }
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
