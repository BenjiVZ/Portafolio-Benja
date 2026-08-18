<template>
  <section id="contact" class="section contact">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info">
          <div class="section-header" style="text-align: left;">
            <h2 class="section-title">{{ contactData.title || 'Contacto' }}</h2>
          </div>
          <p class="contact-subtitle">{{ contactData.subtitle || '¿Tienes un proyecto en mente? Hablemos.' }}</p>

          <div class="contact-methods">
            <a v-if="contactData.email" :href="`mailto:${contactData.email}`" class="contact-method">
              <div class="method-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span class="method-label">Email</span>
                <span class="method-value">{{ contactData.email }}</span>
              </div>
            </a>
          </div>

          <div class="contact-socials">
            <a v-if="social.github" :href="social.github" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a v-if="social.linkedin" :href="social.linkedin" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a v-if="social.twitter" :href="social.twitter" target="_blank" rel="noopener" class="social-link" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="https://wa.me/584164231973" target="_blank" rel="noopener" class="social-link whatsapp-link" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>

        <!-- Formulario oculto temporalmente
        <div class="contact-form-wrapper">
          <form class="contact-form" @submit.prevent="handleSubmit">
            ...
          </form>
        </div>
        -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { supabase } from '../lib/supabase'
import { useSiteConfig } from '../composables/useSiteConfig'

const { getConfig } = useSiteConfig()
const contactData = computed(() => getConfig('contact'))
const social = computed(() => contactData.value.social || {})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const success = ref(false)
const errorMsg = ref('')

// El formulario está oculto en el template; el contacto se hace por los
// enlaces directos de email, WhatsApp y redes. Si se descomenta, los
// mensajes llegan a contact_messages y se leen desde /admin.
async function handleSubmit() {
  sending.value = true
  success.value = false
  errorMsg.value = ''

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      })

    if (error) throw error

    success.value = true
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
    setTimeout(() => { success.value = false }, 5000)
  } catch (e) {
    errorMsg.value = 'Error al enviar. Intenta de nuevo.'
    console.error(e)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3xl);
  align-items: start;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.contact-subtitle {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xl);
  line-height: var(--leading-relaxed);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.contact-method {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.contact-method:hover {
  border-color: var(--color-border-accent);
  background: var(--color-accent-subtle);
}

.method-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
}

.method-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.method-value {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text);
  font-weight: 500;
}

.contact-socials {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
}

.social-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
  cursor: pointer;
}

.social-link:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
  background: var(--color-accent-subtle);
}

.whatsapp-link:hover {
  color: #25D366;
  border-color: #25D366;
  background: rgba(37, 211, 102, 0.1);
}

/* Form */
.contact-form-wrapper {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.btn-submit {
  margin-top: var(--space-sm);
  width: 100%;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-success {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  /* Mensaje de éxito: verde semántico, no el acento de marca */
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-success);
  font-size: var(--text-sm);
}

.form-error {
  padding: var(--space-md);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
