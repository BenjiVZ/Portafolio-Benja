// Datos de contacto compartidos por los componentes de conversión
export const WHATSAPP_PHONE = '584221647956'

export function waLink(text = 'Hola! Vi tu portafolio y me interesa conversar sobre un proyecto.') {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

// De https://github.com/BenjiVZ saca "BenjiVZ": cada cuenta usa el mismo icono,
// asi que el nombre es lo unico que las distingue al pasar el cursor.
export function usuarioGithub(url) {
  const m = String(url || '').match(/github\.com\/([^/?#]+)/i)
  return m ? m[1] : 'GitHub'
}
