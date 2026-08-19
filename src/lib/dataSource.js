// ============================================
// Carga de datos con tope de espera.
//
// Regla: manda Supabase. Si la base contesta, se usa lo que diga — aunque
// una tabla venga vacia. El respaldo local (los JSON del repo) entra
// unicamente cuando no hay conexion con Supabase.
//
// El tope existe porque con el proyecto de Supabase borrado el fetch del
// navegador tarda unos 7 segundos en rendirse, y todo ese rato las
// secciones se quedan en modo esqueleto.
// ============================================

export const TIMEOUT_MS = 2500

// Si a los 700 ms Supabase sigue sin contestar, se pinta ya el respaldo local
// para no dejar la pantalla en esqueletos. Si la base responde despues, sus
// datos reemplazan a los locales.
export const EARLY_MS = 700

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
 * @param {Function} [opts.onEarly]  recibe el respaldo a los EARLY_MS si la base tarda
 * @returns {Promise<{ value: *, usingLocal: boolean, error: string|null }>}
 */
export async function loadWithFallback({ query, local, transform, onError = null, onEarly }) {
  if (!supabaseCaido) {
    let resuelta = false
    const consulta = withTimeout(query()).finally(() => { resuelta = true })

    // Adelanto: pinta lo local mientras la base sigue pensando. Si luego
    // contesta, lo de la base pisa a lo local igual.
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
      // data puede ser [] y esta bien: la base dice que no hay nada
      const filas = data || []
      return { value: transform ? await transform(filas) : filas, usingLocal: false, error: null }
    } catch (e) {
      console.warn('Supabase fallo, usando respaldo local:', e.message)
      // Solo un fallo de conexion condena a las demas secciones. Un error de
      // la propia base (tabla que no existe, permisos) es cosa de esa tabla.
      if (esFalloDeConexion(e)) supabaseCaido = true
      return { ...(await respaldo(local, onError)), error: e.message }
    }
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
