import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env — ' +
    'el sitio no podrá cargar contenido.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // El panel entra con VITE_ADMIN_PASSWORD, no con Supabase Auth: no hay
    // sesion que refrescar. Sin esto el cliente reintenta el refresh_token en
    // bucle (cada vez que la pestaña vuelve al frente) y llena la consola de
    // ERR_NAME_NOT_RESOLVED, tapando los avisos que si importan.
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})
