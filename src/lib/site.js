// Datos de contacto compartidos por los componentes de conversión
export const WHATSAPP_PHONE = '584164231973'

export function waLink(text = 'Hola! Vi tu portafolio y me interesa conversar sobre un proyecto.') {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}
