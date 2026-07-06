<template>
  <section v-if="testimonials.length" id="testimonials" class="section testimonials">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Testimonios</h2>
        <p class="section-subtitle">Lo que dicen mis clientes sobre mi trabajo</p>
      </div>

      <div class="testimonials-track">
        <div
          v-for="(testimonial, i) in testimonials"
          :key="testimonial.id || i"
          class="testimonial-card"
          v-reveal="i * 100"
        >
          <div class="testimonial-quote">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" opacity="0.15">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>
          <p class="testimonial-text">{{ testimonial.content }}</p>
          <div class="testimonial-author">
            <div class="author-avatar">
              <span>{{ testimonial.name?.charAt(0) || '?' }}</span>
            </div>
            <div class="author-info">
              <span class="author-name">{{ testimonial.name }}</span>
              <span class="author-role">{{ testimonial.role }}{{ testimonial.company ? ` · ${testimonial.company}` : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTestimonials } from '../composables/useTestimonials'

const { testimonials } = useTestimonials()
</script>

<style scoped>
.testimonials {
  background: var(--color-bg-deep);
}

.testimonials-track {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.testimonial-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  position: relative;
  transition: all var(--duration-normal) var(--ease-out);
}

.testimonial-card:hover {
  border-color: var(--color-border-accent);
  box-shadow: var(--shadow-md);
}

.testimonial-quote {
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.testimonial-text {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-xl);
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--color-accent-subtle);
  border: 1px solid var(--color-border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--color-accent);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--color-text);
}

.author-role {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .testimonials-track {
    grid-template-columns: 1fr;
  }
}
</style>
