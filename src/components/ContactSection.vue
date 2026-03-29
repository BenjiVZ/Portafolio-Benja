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
          </div>
        </div>

        <div class="contact-form-wrapper">
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="input-group">
                <label class="input-label" for="contact-name">Nombre</label>
                <input id="contact-name" class="input" v-model="form.name" placeholder="Tu nombre" required />
              </div>
              <div class="input-group">
                <label class="input-label" for="contact-email">Email</label>
                <input id="contact-email" class="input" v-model="form.email" type="email" placeholder="tu@email.com" required />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label" for="contact-subject">Asunto</label>
              <input id="contact-subject" class="input" v-model="form.subject" placeholder="¿En qué puedo ayudarte?" />
            </div>
            <div class="input-group">
              <label class="input-label" for="contact-message">Mensaje</label>
              <textarea id="contact-message" class="input" v-model="form.message" placeholder="Cuéntame sobre tu proyecto..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-submit" :disabled="sending">
              <svg v-if="!sending" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              <span v-if="sending" class="spinner"></span>
              {{ sending ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
            <Transition name="slide">
              <p v-if="success" class="form-success">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ¡Mensaje enviado! Te responderé pronto.
              </p>
            </Transition>
            <Transition name="slide">
              <p v-if="errorMsg" class="form-error">{{ errorMsg }}</p>
            </Transition>
          </form>
        </div>
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
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-3xl);
  align-items: start;
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
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-accent);
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
