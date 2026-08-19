<template>
  <!-- Login Gate -->
  <div v-if="!isAuthenticated" class="admin-login">
    <div class="login-card">
      <div class="login-logo">
        <img :src="logoUrl" alt="MastersLogic" class="login-logo-img" />
        <h2>Admin Panel</h2>
        <p>Ingresa la clave para continuar</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label class="input-label">Clave</label>
          <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" class="input" v-model="loginPass" placeholder="Contraseña" autocomplete="current-password" />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>
        <p v-if="loginError" class="login-error">{{ loginError }}</p>
        <button type="submit" class="btn btn-primary" style="width:100%;margin-top:var(--space-sm);" :disabled="loginLoading">
          {{ loginLoading ? 'Verificando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>

  <!-- Admin Panel -->
  <div v-else class="admin">
    <header class="admin-header">
      <div class="admin-header-inner">
        <div class="admin-brand">
          <a href="/" class="admin-logo">
            <img :src="logoUrl" alt="MastersLogic" class="admin-logo-img" />
            <span>MastersLogic</span>
          </a>
          <span class="admin-badge">Admin Panel</span>
        </div>
        <div class="admin-header-actions">
          <span class="conexion" :class="conexionOk === false ? 'conexion-mal' : conexionOk ? 'conexion-bien' : 'conexion-espera'">
            <span class="conexion-punto"></span>
            {{ conexionOk === false ? 'Sin conexión con Supabase' : conexionOk ? 'Supabase conectado' : 'Comprobando…' }}
          </span>
          <a href="/" class="btn btn-ghost btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Ver sitio
          </a>
          <button class="btn btn-ghost btn-sm" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Salir
          </button>
        </div>
      </div>
    </header>

    <nav class="admin-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="admin-tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" />
        {{ tab.label }}
        <span v-if="tab.id === 'messages' && unreadCount > 0" class="tab-badge">{{ unreadCount }}</span>
        <span v-if="tab.id === 'suggestions' && suggestions.length > 0" class="tab-badge">{{ suggestions.length }}</span>
      </button>
    </nav>

    <main class="admin-content">
      <!-- PROJECTS TAB -->
      <div v-if="activeTab === 'projects'" class="admin-panel">
        <div class="panel-header">
          <h2>Proyectos</h2>
          <button class="btn btn-primary btn-sm" @click="openProjectForm()">+ Nuevo Proyecto</button>
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Featured</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in projectsList" :key="p.id">
                <td class="td-title">{{ p.title }}</td>
                <td><span class="badge-neutral badge">{{ p.category }}</span></td>
                <td><span :class="p.featured ? 'badge' : 'badge badge-neutral'">{{ p.featured ? 'Sí' : 'No' }}</span></td>
                <td>{{ p.sort_order }}</td>
                <td class="td-actions">
                  <button class="btn btn-ghost btn-sm" @click="openProjectForm(p)">Editar</button>
                  <button class="btn btn-ghost btn-sm btn-danger" @click="handleDeleteProject(p.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="projectsList.length === 0" class="empty-state">No hay proyectos. Crea el primero.</p>
        </div>
      </div>

      <!-- SUGGESTIONS TAB -->
      <div v-if="activeTab === 'suggestions'" class="admin-panel">
        <div class="panel-header">
          <div>
            <h2>Sugerencias</h2>
            <p class="panel-hint">
              Proyectos que estan en los archivos del repositorio (el export de Django y tus repos de
              GitHub) pero todavia no en Supabase. El sitio publico no los muestra mientras la base
              responda; si Supabase se cae, vuelven a salir solos.
            </p>
          </div>
          <button
            class="btn btn-primary btn-sm"
            :disabled="suggestions.length === 0 || importingAll"
            @click="handleImportAll"
          >
            {{ importingAll ? 'Importando...' : `Importar todos (${suggestions.length})` }}
          </button>
        </div>

        <p v-if="suggestionsError" class="empty-state">{{ suggestionsError }}</p>

        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Origen</th>
                <th>Categoría</th>
                <th>Enlace</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in suggestions" :key="s.origen + '-' + s.id">
                <td class="td-title">
                  {{ s.title }}
                  <span class="suggestion-desc">{{ s.short_description }}</span>
                </td>
                <td><span class="badge badge-neutral">{{ s.origen }}</span></td>
                <td><span class="badge badge-neutral">{{ s.category }}</span></td>
                <td>
                  <a v-if="s.repo_url" :href="s.repo_url" target="_blank" rel="noopener" class="suggestion-link">repo</a>
                  <a v-if="s.live_url" :href="s.live_url" target="_blank" rel="noopener" class="suggestion-link">demo</a>
                  <span v-if="!s.repo_url && !s.live_url">—</span>
                </td>
                <td class="td-actions">
                  <button
                    class="btn btn-ghost btn-sm"
                    :disabled="importingId === s.id"
                    @click="handleImportSuggestion(s)"
                  >
                    {{ importingId === s.id ? 'Importando...' : 'Importar' }}
                  </button>
                  <button class="btn btn-ghost btn-sm" @click="openSuggestionForm(s)">Editar y crear</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="suggestions.length === 0 && !suggestionsError" class="empty-state">
            Todo importado: no queda ningun proyecto local fuera de Supabase.
          </p>
        </div>
      </div>

      <!-- SERVICES TAB -->
      <div v-if="activeTab === 'services'" class="admin-panel">
        <div class="panel-header">
          <h2>Servicios</h2>
          <button class="btn btn-primary btn-sm" @click="openServiceForm()">+ Nuevo Servicio</button>
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Icono</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in servicesList" :key="s.id">
                <td class="td-title">{{ s.title }}</td>
                <td><span class="badge badge-neutral">{{ s.icon_name }}</span></td>
                <td>{{ s.sort_order }}</td>
                <td class="td-actions">
                  <button class="btn btn-ghost btn-sm" @click="openServiceForm(s)">Editar</button>
                  <button class="btn btn-ghost btn-sm btn-danger" @click="handleDeleteService(s.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="servicesList.length === 0" class="empty-state">No hay servicios.</p>
        </div>
      </div>

      <!-- EXPERIENCES TAB -->
      <div v-if="activeTab === 'experiences'" class="admin-panel">
        <div class="panel-header">
          <h2>Experiencia Laboral</h2>
          <button class="btn btn-primary btn-sm" @click="openExperienceForm()">+ Nueva Experiencia</button>
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Empresa</th>
                <th>Período</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="exp in experiencesList" :key="exp.id">
                <td class="td-title">{{ exp.title }}</td>
                <td>{{ exp.company }}</td>
                <td><span class="badge badge-neutral">{{ exp.period }}</span></td>
                <td><span class="badge" :class="exp.is_current ? '' : 'badge-neutral'">{{ exp.is_current ? 'Actual' : 'Finalizado' }}</span></td>
                <td class="td-actions">
                  <button class="btn btn-ghost btn-sm" @click="openExperienceForm(exp)">Editar</button>
                  <button class="btn btn-ghost btn-sm btn-danger" @click="handleDeleteExperience(exp.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="experiencesList.length === 0" class="empty-state">No hay experiencias.</p>
        </div>
      </div>

      <!-- FLYERS TAB -->
      <div v-if="activeTab === 'flyers'" class="admin-panel">
        <div class="panel-header">
          <h2>Flyers</h2>
          <button class="btn btn-primary btn-sm" @click="openFlyerForm()">+ Nuevo Flyer</button>
        </div>
        <div class="flyers-admin-grid">
          <div v-for="f in flyersList" :key="f.id" class="flyer-admin-card">
            <div class="flyer-admin-img">
              <img :src="f.image_url" :alt="f.title" @error="$event.target.style.display='none'" />
            </div>
            <div class="flyer-admin-info">
              <h4>{{ f.title }}</h4>
              <span class="badge badge-neutral">{{ f.tag }}</span>
              <span class="flyer-admin-order">Orden: {{ f.sort_order }}</span>
            </div>
            <div class="flyer-admin-actions">
              <button class="btn btn-ghost btn-sm" @click="openFlyerForm(f)">Editar</button>
              <button class="btn btn-ghost btn-sm btn-danger" @click="handleDeleteFlyer(f.id)">Eliminar</button>
            </div>
          </div>
          <p v-if="flyersList.length === 0" class="empty-state">No hay flyers. Crea el primero.</p>
        </div>
      </div>

      <!-- TESTIMONIALS TAB -->
      <div v-if="activeTab === 'testimonials'" class="admin-panel">
        <div class="panel-header">
          <h2>Testimonios</h2>
          <button class="btn btn-primary btn-sm" @click="openTestimonialForm()">+ Nuevo Testimonio</button>
        </div>
        <div class="admin-table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
                <th>Empresa</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in testimonialsList" :key="t.id">
                <td class="td-title">{{ t.name }}</td>
                <td>{{ t.role }}</td>
                <td><span class="badge badge-neutral">{{ t.company }}</span></td>
                <td>{{ t.sort_order }}</td>
                <td class="td-actions">
                  <button class="btn btn-ghost btn-sm" @click="openTestimonialForm(t)">Editar</button>
                  <button class="btn btn-ghost btn-sm btn-danger" @click="handleDeleteTestimonial(t.id)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="testimonialsList.length === 0" class="empty-state">No hay testimonios.</p>
        </div>
      </div>

      <!-- SITE CONFIG TAB -->
      <div v-if="activeTab === 'config'" class="admin-panel">
        <div class="panel-header">
          <h2>Configuración del Sitio</h2>
          <button class="btn btn-primary btn-sm" @click="saveAllConfig" :disabled="savingConfig">
            {{ savingConfig ? 'Guardando...' : 'Guardar Todo' }}
          </button>
        </div>

        <div class="config-sections">
          <div class="config-section">
            <h3>Hero</h3>
            <div class="config-grid">
              <div class="input-group">
                <label class="input-label">Nombre</label>
                <input class="input" v-model="configForm.hero.name" />
              </div>
              <div class="input-group">
                <label class="input-label">Rol</label>
                <input class="input" v-model="configForm.hero.role" />
              </div>
              <div class="input-group" style="grid-column: 1 / -1;">
                <label class="input-label">Tagline</label>
                <input class="input" v-model="configForm.hero.tagline" />
              </div>
            </div>
          </div>

          <div class="config-section">
            <h3>About</h3>
            <div class="config-grid">
              <div class="input-group" style="grid-column: 1 / -1;">
                <label class="input-label">Descripción</label>
                <textarea class="input" v-model="configForm.about.description" rows="4"></textarea>
              </div>
              <div class="input-group" style="grid-column: 1 / -1;">
                <label class="input-label">Foto de Perfil</label>
                <div class="profile-upload-area">
                  <div class="profile-preview-lg" v-if="configForm.about.image_url">
                    <img :src="configForm.about.image_url" alt="Foto de perfil" @error="$event.target.style.display='none'" />
                  </div>
                  <div class="profile-preview-lg profile-placeholder" v-else>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div class="profile-upload-controls">
                    <label class="btn btn-primary btn-sm profile-upload-btn" :class="{ disabled: uploadingPhoto }">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      {{ uploadingPhoto ? 'Subiendo...' : 'Subir Foto' }}
                      <input type="file" accept="image/*" @change="handlePhotoUpload" style="display:none" :disabled="uploadingPhoto" />
                    </label>
                    <div class="profile-url-row">
                      <input class="input" v-model="configForm.about.image_url" placeholder="o pega una URL..." style="font-size:13px;" />
                      <button type="button" class="btn btn-ghost btn-sm" v-if="configForm.about.image_url" @click="configForm.about.image_url = ''" title="Quitar foto">✕</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="input-group" style="grid-column: 1 / -1;">
                <label class="input-label">Skills</label>
                <div class="skills-tags-container">
                  <span v-for="(skill, i) in skillsList" :key="i" class="skill-tag">
                    {{ skill }}
                    <button type="button" class="skill-tag-remove" @click="removeSkill(i)">&times;</button>
                  </span>
                  <div class="skill-add-wrapper">
                    <input
                      class="input skill-add-input"
                      v-model="newSkillInput"
                      placeholder="Agregar skill..."
                      @keydown.enter.prevent="addSkill"
                    />
                    <button type="button" class="btn btn-primary btn-sm" @click="addSkill">+</button>
                  </div>
                </div>
              </div>
              <div class="form-row" style="grid-column: 1 / -1;">
                <div class="input-group">
                  <label class="input-label">Años de Experiencia</label>
                  <input class="input" v-model="configForm.about.years_exp" placeholder="1+" />
                </div>
              </div>
            </div>
          </div>

          <div class="config-section">
            <h3>Contacto</h3>
            <div class="config-grid">
              <div class="input-group">
                <label class="input-label">Email</label>
                <input class="input" v-model="configForm.contact.email" />
              </div>
              <div class="input-group">
                <label class="input-label">GitHub URL</label>
                <input class="input" v-model="configForm.contact.social.github" />
              </div>
              <div class="input-group">
                <label class="input-label">LinkedIn URL</label>
                <input class="input" v-model="configForm.contact.social.linkedin" />
              </div>
              <div class="input-group">
                <label class="input-label">Twitter URL</label>
                <input class="input" v-model="configForm.contact.social.twitter" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MESSAGES TAB -->
      <div v-if="activeTab === 'messages'" class="admin-panel">
        <div class="panel-header">
          <h2>Mensajes</h2>
          <span class="badge" v-if="unreadCount > 0">{{ unreadCount }} sin leer</span>
        </div>
        <div class="messages-list">
          <div
            v-for="msg in messagesList"
            :key="msg.id"
            class="message-card"
            :class="{ unread: !msg.read }"
            @click="handleMarkRead(msg.id)"
          >
            <div class="message-header">
              <div>
                <span class="message-name">{{ msg.name }}</span>
                <span class="message-email">{{ msg.email }}</span>
              </div>
              <div class="message-meta">
                <span class="message-date">{{ formatDate(msg.created_at) }}</span>
                <button class="btn btn-ghost btn-sm btn-danger" @click.stop="handleDeleteMessage(msg.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <p class="message-subject" v-if="msg.subject">{{ msg.subject }}</p>
            <p class="message-body">{{ msg.message }}</p>
          </div>
          <p v-if="messagesList.length === 0" class="empty-state">No hay mensajes.</p>
        </div>
      </div>
    </main>

    <!-- MODALS -->
    <Transition name="modal">
      <div v-if="showProjectModal" class="modal-overlay" @click.self="showProjectModal = false">
        <div class="modal admin-modal">
          <div class="modal-header">
            <h3>{{ editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h3>
            <button class="modal-close" @click="showProjectModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveProject" class="admin-form">
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Título</label>
                <input class="input" v-model="projectForm.title" required />
              </div>
              <div class="input-group">
                <label class="input-label">Categoría</label>
                <select class="input" v-model="projectForm.category">
                  <option value="web">Web</option>
                  <option value="app">App</option>
                  <option value="backend">Backend</option>
                  <option value="university">Universitario</option>
                  <option value="internship">Pasantías</option>
                  <option value="work">Laboral</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Subcategoría <small style="color:var(--color-text-muted);font-weight:400;">(opcional)</small></label>
                <select class="input" v-model="projectForm.subcategory">
                  <option value="">— Ninguna —</option>
                  <option value="web">Web</option>
                  <option value="app">App</option>
                  <option value="backend">Backend</option>
                  <option value="university">Universitario</option>
                  <option value="internship">Pasantías</option>
                  <option value="work">Laboral</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Descripción corta</label>
              <input class="input" v-model="projectForm.short_description" />
            </div>
            <div class="input-group">
              <label class="input-label">Descripción completa</label>
              <textarea class="input" v-model="projectForm.description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">URL Demo</label>
                <input class="input" v-model="projectForm.live_url" />
              </div>
              <div class="input-group">
                <label class="input-label">URL Repositorio</label>
                <input class="input" v-model="projectForm.repo_url" />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Tech Stack <small style="color:var(--color-text-muted);font-weight:400;">(click para seleccionar)</small></label>
              <div class="tech-selector">
                <span
                  v-for="skill in skillsList"
                  :key="skill"
                  class="tech-chip"
                  :class="{ selected: projectForm.tech_stack.includes(skill) }"
                  @click="toggleProjectTech(skill)"
                >{{ skill }}</span>
                <span v-if="skillsList.length === 0" style="color:var(--color-text-muted);font-size:13px;">Agrega skills en Configuración → About → Skills</span>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Sub-Skills <small style="color:var(--color-text-muted);font-weight:400;">(tecnologías específicas del proyecto)</small></label>
              <div class="skills-tags-container">
                <span v-for="(ss, i) in projectForm.sub_skills" :key="i" class="skill-tag">
                  {{ ss }}
                  <button type="button" class="skill-tag-remove" @click="projectForm.sub_skills.splice(i, 1)">&times;</button>
                </span>
                <div class="skill-add-wrapper">
                  <input class="input skill-add-input" v-model="subSkillInput" placeholder="Ej: Pandas, Selenium..." @keydown.enter.prevent="addSubSkill" />
                  <button type="button" class="btn btn-primary btn-sm" @click="addSubSkill">+</button>
                </div>
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Imagen del Proyecto</label>
              <div class="project-image-upload">
                <div class="project-img-preview" v-if="projectForm.image_url">
                  <img :src="projectForm.image_url" alt="Preview" @error="$event.target.style.display='none'" />
                </div>
                <div class="project-img-preview project-img-placeholder" v-else>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <div class="project-img-controls">
                  <label class="btn btn-primary btn-sm profile-upload-btn" :class="{ disabled: uploadingProjectImg }">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {{ uploadingProjectImg ? 'Subiendo...' : 'Subir Imagen' }}
                    <input type="file" accept="image/*" @change="handleProjectImgUpload" style="display:none" :disabled="uploadingProjectImg" />
                  </label>
                  <div class="profile-url-row">
                    <input class="input" v-model="projectForm.image_url" placeholder="o pega una URL..." style="font-size:13px;" />
                    <button type="button" class="btn btn-ghost btn-sm" v-if="projectForm.image_url" @click="projectForm.image_url = ''" title="Quitar imagen">✕</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Orden</label>
                <input class="input" type="number" v-model.number="projectForm.sort_order" />
              </div>
              <div class="input-group">
                <label class="input-label">Destacado</label>
                <label class="toggle">
                  <input type="checkbox" v-model="projectForm.featured" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="admin.loading.value">
              {{ admin.loading.value ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showTestimonialModal" class="modal-overlay" @click.self="showTestimonialModal = false">
        <div class="modal admin-modal">
          <div class="modal-header">
            <h3>{{ editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio' }}</h3>
            <button class="modal-close" @click="showTestimonialModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveTestimonial" class="admin-form">
            <div class="input-group">
              <label class="input-label">Nombre</label>
              <input class="input" v-model="testimonialForm.name" required />
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Cargo</label>
                <input class="input" v-model="testimonialForm.role" />
              </div>
              <div class="input-group">
                <label class="input-label">Empresa</label>
                <input class="input" v-model="testimonialForm.company" />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Testimonio</label>
              <textarea class="input" v-model="testimonialForm.content" rows="4" required></textarea>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">URL del avatar</label>
                <input class="input" v-model="testimonialForm.avatar_url" placeholder="/media/avatar.jpg" />
              </div>
              <div class="input-group">
                <label class="input-label">Orden</label>
                <input class="input" type="number" v-model.number="testimonialForm.sort_order" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="admin.loading.value">
              {{ admin.loading.value ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showServiceModal" class="modal-overlay" @click.self="showServiceModal = false">
        <div class="modal admin-modal">
          <div class="modal-header">
            <h3>{{ editingService ? 'Editar Servicio' : 'Nuevo Servicio' }}</h3>
            <button class="modal-close" @click="showServiceModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveService" class="admin-form">
            <div class="input-group">
              <label class="input-label">Título</label>
              <input class="input" v-model="serviceForm.title" required />
            </div>
            <div class="input-group">
              <label class="input-label">Descripción</label>
              <textarea class="input" v-model="serviceForm.description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Icono (globe, server, smartphone, message-circle, code)</label>
                <input class="input" v-model="serviceForm.icon_name" />
              </div>
              <div class="input-group">
                <label class="input-label">Orden</label>
                <input class="input" type="number" v-model.number="serviceForm.sort_order" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="admin.loading.value">
              {{ admin.loading.value ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showExperienceModal" class="modal-overlay" @click.self="showExperienceModal = false">
        <div class="modal admin-modal">
          <div class="modal-header">
            <h3>{{ editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia' }}</h3>
            <button class="modal-close" @click="showExperienceModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveExperience" class="admin-form">
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Puesto / Título</label>
                <input class="input" v-model="experienceForm.title" required />
              </div>
              <div class="input-group">
                <label class="input-label">Empresa</label>
                <input class="input" v-model="experienceForm.company" required />
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Ubicación</label>
                <input class="input" v-model="experienceForm.location" placeholder="Caracas, Venezuela" />
              </div>
              <div class="input-group">
                <label class="input-label">Período</label>
                <input class="input" v-model="experienceForm.period" placeholder="Ene 2026 — Actualidad" required />
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label" style="display:flex;align-items:center;gap:8px;">
                  <input type="checkbox" v-model="experienceForm.is_current" style="width:auto;" />
                  Trabajo actual
                </label>
              </div>
              <div class="input-group">
                <label class="input-label">Orden</label>
                <input class="input" type="number" v-model.number="experienceForm.sort_order" />
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Responsabilidades</label>
              <div class="skills-tags-container" style="flex-direction:column;align-items:stretch;">
                <div v-for="(task, i) in experienceForm.tasks" :key="i" style="display:flex;align-items:center;gap:8px;">
                  <span style="flex:1;font-size:13px;color:var(--color-text-secondary);">• {{ task }}</span>
                  <button type="button" class="skill-tag-remove" @click="removeExpTask(i)">&times;</button>
                </div>
                <div class="skill-add-wrapper">
                  <input class="input skill-add-input" v-model="expTaskInput" placeholder="Agregar responsabilidad..." @keydown.enter.prevent="addExpTask" />
                  <button type="button" class="btn btn-primary btn-sm" @click="addExpTask">+</button>
                </div>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label">Tecnologías <small style="color:var(--color-text-muted);font-weight:400;">(click para seleccionar)</small></label>
              <div class="tech-selector">
                <span
                  v-for="skill in skillsList"
                  :key="skill"
                  class="tech-chip"
                  :class="{ selected: experienceForm.techs.includes(skill) }"
                  @click="toggleExpTech(skill)"
                >{{ skill }}</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="admin.loading.value">
              {{ admin.loading.value ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Flyer Modal -->
    <Transition name="modal">
      <div v-if="showFlyerModal" class="modal-overlay" @click.self="showFlyerModal = false">
        <div class="modal admin-modal">
          <div class="modal-header">
            <h3>{{ editingFlyer ? 'Editar Flyer' : 'Nuevo Flyer' }}</h3>
            <button class="modal-close" @click="showFlyerModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSaveFlyer" class="admin-form">
            <div class="input-group">
              <label class="input-label">Título</label>
              <input class="input" v-model="flyerForm.title" required />
            </div>
            <div class="form-row">
              <div class="input-group">
                <label class="input-label">Etiqueta</label>
                <input class="input" v-model="flyerForm.tag" placeholder="Ej: Software ERP" />
              </div>
              <div class="input-group">
                <label class="input-label">Orden</label>
                <input class="input" type="number" v-model.number="flyerForm.sort_order" />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Imagen del Flyer</label>
              <div class="project-image-upload">
                <div class="project-img-preview flyer-img-preview" v-if="flyerForm.image_url">
                  <img :src="flyerForm.image_url" alt="Preview" @error="$event.target.style.display='none'" />
                </div>
                <div class="project-img-preview project-img-placeholder" v-else>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <div class="project-img-controls">
                  <label class="btn btn-primary btn-sm profile-upload-btn" :class="{ disabled: uploadingFlyerImg }">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {{ uploadingFlyerImg ? 'Subiendo...' : 'Subir Imagen' }}
                    <input type="file" accept="image/*" @change="handleFlyerImgUpload" style="display:none" :disabled="uploadingFlyerImg" />
                  </label>
                  <div class="profile-url-row">
                    <input class="input" v-model="flyerForm.image_url" placeholder="o pega una URL..." style="font-size:13px;" />
                    <button type="button" class="btn btn-ghost btn-sm" v-if="flyerForm.image_url" @click="flyerForm.image_url = ''" title="Quitar imagen">✕</button>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="admin.loading.value">
              {{ admin.loading.value ? 'Guardando...' : 'Guardar' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import logoUrl from '../assets/logo.png'
import { ref, reactive, computed, onMounted, h } from 'vue'
import { useAdmin } from '../composables/useAdmin'
import { getProjectSuggestions, toProjectRow } from '../lib/suggestions'

// ── Acceso al panel ──
// La clave sale de VITE_ADMIN_PASSWORD (se define en .env local y en las
// Environment Variables de Vercel).
//
// OJO: Vite incrusta las variables VITE_* en el bundle que descarga el
// navegador, así que esta clave es legible con las devtools. Sirve para
// evitar accesos casuales, no como seguridad real. Lo que de verdad
// protege los datos son las políticas RLS de Supabase.
const CLAVE_ADMIN = import.meta.env.VITE_ADMIN_PASSWORD || ''
const SESSION_KEY = 'portafolio-admin-sesion'

const isAuthenticated = ref(sessionStorage.getItem(SESSION_KEY) === 'ok')
const loginUser = ref('')
const loginPass = ref('')
const loginError = ref('')
const showPassword = ref(false)
const loginLoading = ref(false)

function handleLogin() {
  loginLoading.value = true
  loginError.value = ''

  if (!CLAVE_ADMIN) {
    loginError.value = 'Falta definir VITE_ADMIN_PASSWORD en las variables de entorno'
  } else if (loginPass.value === CLAVE_ADMIN) {
    isAuthenticated.value = true
    sessionStorage.setItem(SESSION_KEY, 'ok')
    loginPass.value = ''
  } else {
    loginError.value = 'Clave incorrecta'
  }

  loginLoading.value = false
}

function handleLogout() {
  sessionStorage.removeItem(SESSION_KEY)
  isAuthenticated.value = false
}

const admin = useAdmin()
const activeTab = ref('projects')

// Data lists
const projectsList = ref([])
const servicesList = ref([])
const experiencesList = ref([])
const flyersList = ref([])
const messagesList = ref([])

// null mientras se comprueba, true/false despues de la primera consulta
const conexionOk = ref(null)

// ── Sugerencias ──
// Proyectos de los archivos del repo que aun no estan en Supabase.
const suggestions = ref([])
const suggestionsError = ref('')
const importingId = ref(null)
const importingAll = ref(false)

async function loadSuggestions() {
  suggestionsError.value = ''
  try {
    suggestions.value = await getProjectSuggestions(projectsList.value)
  } catch (e) {
    suggestions.value = []
    suggestionsError.value = 'No se pudieron leer los archivos locales: ' + e.message
  }
}

async function handleImportSuggestion(s) {
  importingId.value = s.id
  try {
    await admin.createProject(toProjectRow(s))
    projectsList.value = await admin.getProjects() || []
    await loadSuggestions()
  } catch (e) {
    alert('No se pudo importar: ' + e.message)
  } finally {
    importingId.value = null
  }
}

async function handleImportAll() {
  if (!confirm(`Se van a crear ${suggestions.value.length} proyectos en Supabase. ¿Continuar?`)) return
  importingAll.value = true
  const fallidos = []
  // De a uno para que un fallo no tumbe el resto
  for (const s of [...suggestions.value]) {
    try {
      await admin.createProject(toProjectRow(s))
    } catch (e) {
      fallidos.push(`${s.title}: ${e.message}`)
    }
  }
  projectsList.value = await admin.getProjects() || []
  await loadSuggestions()
  importingAll.value = false
  if (fallidos.length) alert(`No se importaron ${fallidos.length}:\n` + fallidos.join('\n'))
}

// Prellena el formulario de proyecto sin marcarlo como edicion,
// para revisar los datos antes de guardarlos en la base.
function openSuggestionForm(s) {
  openProjectForm()
  Object.assign(projectForm, toProjectRow(s))
  projectForm.tech_stack = [...(s.tech_stack || [])]
}

// Config
const configForm = reactive({
  hero: { name: '', role: '', tagline: '', cta_primary: 'Ver Proyectos', cta_secondary: 'Contactar' },
  about: { title: 'Sobre Mí', description: '', image_url: '', skills: [], years_exp: '1+', projects_count: '10+', companies_count: '3+' },
  contact: { title: 'Contacto', subtitle: '', email: '', social: { github: '', linkedin: '', twitter: '' } },
  footer: { copyright: '', tagline: '' }
})
const skillsList = ref([])
const newSkillInput = ref('')
const savingConfig = ref(false)

function addSkill() {
  const skill = newSkillInput.value.trim()
  if (skill && !skillsList.value.includes(skill)) {
    skillsList.value.push(skill)
  }
  newSkillInput.value = ''
}

function removeSkill(index) {
  skillsList.value.splice(index, 1)
}

// Profile Photo Upload
const uploadingPhoto = ref(false)

async function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  uploadingPhoto.value = true
  try {
    const url = await admin.uploadImage(file, 'masterslogic Org')
    configForm.about.image_url = url
  } catch (err) {
    alert('Error subiendo foto: ' + err.message)
  } finally {
    uploadingPhoto.value = false
    event.target.value = ''
  }
}

// Project Image Upload
const uploadingProjectImg = ref(false)

async function handleProjectImgUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  uploadingProjectImg.value = true
  try {
    const url = await admin.uploadImage(file, 'masterslogic Org')
    projectForm.image_url = url
  } catch (err) {
    alert('Error subiendo imagen: ' + err.message)
  } finally {
    uploadingProjectImg.value = false
    event.target.value = ''
  }
}

// Modals
const showProjectModal = ref(false)
const showTestimonialModal = ref(false)
const editingTestimonial = ref(null)
const testimonialsList = ref([])
const testimonialForm = reactive({ name: '', role: '', company: '', content: '', avatar_url: '', sort_order: 0 })
const showServiceModal = ref(false)
const showExperienceModal = ref(false)
const showFlyerModal = ref(false)
const editingProject = ref(null)
const editingService = ref(null)
const editingExperience = ref(null)
const editingFlyer = ref(null)

// Forms
const projectForm = reactive({
  title: '', description: '', short_description: '', category: 'web', subcategory: '',
  image_url: '', tech_stack: [], sub_skills: [], live_url: '', repo_url: '',
  featured: false, sort_order: 0
})
const subSkillInput = ref('')

function addSubSkill() {
  const s = subSkillInput.value.trim()
  if (s && !projectForm.sub_skills.includes(s)) {
    projectForm.sub_skills.push(s)
  }
  subSkillInput.value = ''
}

const serviceForm = reactive({
  title: '', description: '', icon_name: 'code', sort_order: 0
})

const experienceForm = reactive({
  title: '', company: '', location: '', period: '',
  is_current: false, tasks: [], techs: [], sort_order: 0
})
const expTaskInput = ref('')

function addExpTask() {
  const t = expTaskInput.value.trim()
  if (t) { experienceForm.tasks.push(t) }
  expTaskInput.value = ''
}
function removeExpTask(i) { experienceForm.tasks.splice(i, 1) }

// Toggle tech for experience
function toggleExpTech(skill) {
  const idx = experienceForm.techs.indexOf(skill)
  if (idx >= 0) { experienceForm.techs.splice(idx, 1) }
  else { experienceForm.techs.push(skill) }
}

// Toggle tech for projects
function toggleProjectTech(skill) {
  const idx = projectForm.tech_stack.indexOf(skill)
  if (idx >= 0) { projectForm.tech_stack.splice(idx, 1) }
  else { projectForm.tech_stack.push(skill) }
}

const unreadCount = computed(() => messagesList.value.filter(m => !m.read).length)

// Tab icons
const tabs = [
  { id: 'projects', label: 'Proyectos', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' }) },
  { id: 'suggestions', label: 'Sugerencias', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>' }) },
  { id: 'services', label: 'Servicios', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' }) },
  { id: 'experiences', label: 'Experiencia', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' }) },
  { id: 'flyers', label: 'Flyers', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>' }) },
  { id: 'testimonials', label: 'Testimonios', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' }) },
  { id: 'config', label: 'Configuración', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>' }) },
  { id: 'messages', label: 'Mensajes', icon: () => h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, innerHTML: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' }) }
]

// Load data
async function loadAll() {
  try {
    projectsList.value = await admin.getProjects() || []
    // Si la primera consulta paso, la base responde: el panel puede guardar
    conexionOk.value = true
    servicesList.value = await admin.getServices() || []
    try { testimonialsList.value = await admin.getTestimonials() || [] } catch (e) { console.warn('Tabla testimonials no disponible:', e.message) }
    experiencesList.value = await admin.getExperiences() || []
    try { flyersList.value = await admin.getFlyers() || [] } catch(e) { console.warn('Flyers table may not exist yet:', e.message) }
    messagesList.value = await admin.getMessages() || []
    const config = await admin.getSiteConfig()
    if (config.hero) Object.assign(configForm.hero, config.hero)
    if (config.about) {
      Object.assign(configForm.about, config.about)
      skillsList.value = [...(config.about.skills || [])]
    }
    if (config.contact) {
      configForm.contact.email = config.contact.email || ''
      configForm.contact.subtitle = config.contact.subtitle || ''
      if (config.contact.social) Object.assign(configForm.contact.social, config.contact.social)
    }
    if (config.footer) Object.assign(configForm.footer, config.footer)
  } catch (e) {
    console.error('Error loading admin data:', e)
    if (conexionOk.value === null) conexionOk.value = false
  } finally {
    // Fuera del try: si Supabase esta caido, las sugerencias son justo
    // lo unico que si se puede mostrar.
    await loadSuggestions()
  }
}

// Projects
function openProjectForm(project = null) {
  editingProject.value = project
  if (project) {
    Object.assign(projectForm, { ...project })
    projectForm.tech_stack = [...(project.tech_stack || [])]
    projectForm.sub_skills = [...(project.sub_skills || [])]
  } else {
    Object.assign(projectForm, {
      title: '', description: '', short_description: '', category: 'web', subcategory: '',
      image_url: '', tech_stack: [], sub_skills: [], live_url: '', repo_url: '',
      featured: false, sort_order: 0
    })
  }
  subSkillInput.value = ''
  showProjectModal.value = true
}

async function handleSaveProject() {
  const data = { ...projectForm, tech_stack: [...projectForm.tech_stack], sub_skills: [...projectForm.sub_skills] }
  delete data.id
  delete data.created_at

  if (editingProject.value) {
    await admin.updateProject(editingProject.value.id, data)
  } else {
    await admin.createProject(data)
  }
  showProjectModal.value = false
  projectsList.value = await admin.getProjects()
}

async function handleDeleteProject(id) {
  if (!confirm('¿Eliminar este proyecto?')) return
  await admin.deleteProject(id)
  projectsList.value = await admin.getProjects()
}

// Testimonials
function openTestimonialForm(testimonial = null) {
  editingTestimonial.value = testimonial
  if (testimonial) {
    Object.assign(testimonialForm, { ...testimonial })
  } else {
    Object.assign(testimonialForm, { name: '', role: '', company: '', content: '', avatar_url: '', sort_order: 0 })
  }
  showTestimonialModal.value = true
}

async function handleSaveTestimonial() {
  const data = { ...testimonialForm }
  delete data.id
  try {
    if (editingTestimonial.value) {
      await admin.updateTestimonial(editingTestimonial.value.id, data)
    } else {
      await admin.createTestimonial(data)
    }
    showTestimonialModal.value = false
    testimonialsList.value = await admin.getTestimonials()
  } catch (e) {
    alert('Error al guardar: ' + e.message)
  }
}

async function handleDeleteTestimonial(id) {
  if (!confirm('¿Eliminar este testimonio?')) return
  try {
    await admin.deleteTestimonial(id)
    testimonialsList.value = await admin.getTestimonials()
  } catch (e) {
    alert('Error al eliminar: ' + e.message)
  }
}

// Services
function openServiceForm(service = null) {
  editingService.value = service
  if (service) {
    Object.assign(serviceForm, { ...service })
  } else {
    Object.assign(serviceForm, { title: '', description: '', icon_name: 'code', sort_order: 0 })
  }
  showServiceModal.value = true
}

async function handleSaveService() {
  const data = { ...serviceForm }
  delete data.id
  if (editingService.value) {
    await admin.updateService(editingService.value.id, data)
  } else {
    await admin.createService(data)
  }
  showServiceModal.value = false
  servicesList.value = await admin.getServices()
}

async function handleDeleteService(id) {
  if (!confirm('¿Eliminar este servicio?')) return
  await admin.deleteService(id)
  servicesList.value = await admin.getServices()
}

// Experiences
function openExperienceForm(exp = null) {
  editingExperience.value = exp
  if (exp) {
    Object.assign(experienceForm, {
      title: exp.title, company: exp.company, location: exp.location,
      period: exp.period, is_current: exp.is_current,
      tasks: [...(exp.tasks || [])], techs: [...(exp.techs || [])],
      sort_order: exp.sort_order || 0
    })
  } else {
    Object.assign(experienceForm, {
      title: '', company: '', location: '', period: '',
      is_current: false, tasks: [], techs: [], sort_order: 0
    })
  }
  expTaskInput.value = ''
  expTechInput.value = ''
  showExperienceModal.value = true
}

async function handleSaveExperience() {
  const data = { ...experienceForm }
  data.tasks = [...experienceForm.tasks]
  data.techs = [...experienceForm.techs]
  if (editingExperience.value) {
    await admin.updateExperience(editingExperience.value.id, data)
  } else {
    await admin.createExperience(data)
  }
  showExperienceModal.value = false
  experiencesList.value = await admin.getExperiences()
}

async function handleDeleteExperience(id) {
  if (!confirm('¿Eliminar esta experiencia?')) return
  await admin.deleteExperience(id)
  experiencesList.value = await admin.getExperiences()
}


// Config
async function saveAllConfig() {
  savingConfig.value = true
  try {
    configForm.about.skills = [...skillsList.value]
    await admin.updateSiteConfig('hero', configForm.hero)
    await admin.updateSiteConfig('about', configForm.about)
    await admin.updateSiteConfig('contact', configForm.contact)
    await admin.updateSiteConfig('footer', configForm.footer)
    alert('Configuración guardada exitosamente')
  } catch (e) {
    alert('Error al guardar: ' + e.message)
  } finally {
    savingConfig.value = false
  }
}

// Messages
async function handleMarkRead(id) {
  await admin.markMessageRead(id)
  const msg = messagesList.value.find(m => m.id === id)
  if (msg) msg.read = true
}

async function handleDeleteMessage(id) {
  if (!confirm('¿Eliminar este mensaje?')) return
  await admin.deleteMessage(id)
  messagesList.value = messagesList.value.filter(m => m.id !== id)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

// Flyers
const flyerForm = reactive({
  title: '', tag: '', image_url: '', sort_order: 0
})
const uploadingFlyerImg = ref(false)

function openFlyerForm(flyer = null) {
  editingFlyer.value = flyer
  if (flyer) {
    Object.assign(flyerForm, { title: flyer.title, tag: flyer.tag, image_url: flyer.image_url, sort_order: flyer.sort_order || 0 })
  } else {
    Object.assign(flyerForm, { title: '', tag: '', image_url: '', sort_order: 0 })
  }
  showFlyerModal.value = true
}

async function handleSaveFlyer() {
  const data = { ...flyerForm }
  if (editingFlyer.value) {
    await admin.updateFlyer(editingFlyer.value.id, data)
  } else {
    await admin.createFlyer(data)
  }
  showFlyerModal.value = false
  flyersList.value = await admin.getFlyers()
}

async function handleDeleteFlyer(id) {
  if (!confirm('¿Eliminar este flyer?')) return
  await admin.deleteFlyer(id)
  flyersList.value = await admin.getFlyers()
}

async function handleFlyerImgUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  uploadingFlyerImg.value = true
  try {
    const url = await admin.uploadImage(file, 'flyers')
    flyerForm.image_url = url
  } catch (err) {
    alert('Error subiendo imagen: ' + err.message)
  } finally {
    uploadingFlyerImg.value = false
    event.target.value = ''
  }
}

onMounted(loadAll)
</script>

<style scoped>
.admin {
  min-height: 100vh;
  background: var(--color-bg);
}

.admin-header {
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-lg);
}

.admin-header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.admin-logo {
  font-family: var(--font-heading);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.admin-logo-img {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.admin-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

@media (max-width: 768px) {
  .admin-header-inner {
    height: auto;
    padding: var(--space-sm) 0;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
}

.admin-badge {
  padding: 4px 12px;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-accent);
}


.admin-tabs {
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-lg);
  display: flex;
  gap: 2px;
  max-width: var(--max-width);
  margin: 0 auto;
  overflow-x: auto;
}

.admin-tab {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 14px 20px;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  white-space: nowrap;
}

.admin-tab:hover {
  color: var(--color-text);
}

.admin-tab.active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.tab-badge {
  background: var(--color-accent);
  color: var(--color-bg);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: var(--radius-full);
  min-width: 20px;
  text-align: center;
}

.admin-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

.admin-panel {
  animation: fadeIn 0.3s var(--ease-out);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.panel-header h2 {
  font-size: var(--text-2xl);
}

/* Estado de la conexion */
.conexion {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.conexion-punto {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-faint);
}

.conexion-bien { color: var(--color-success); border-color: rgba(34, 197, 94, 0.35); }
.conexion-bien .conexion-punto { background: var(--color-success); }

.conexion-mal { color: var(--color-warning); border-color: rgba(245, 158, 11, 0.35); }
.conexion-mal .conexion-punto { background: var(--color-warning); }

/* Sugerencias */
.panel-hint {
  margin-top: var(--space-xs);
  max-width: 620px;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}

.suggestion-desc {
  display: block;
  margin-top: 2px;
  max-width: 420px;
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-text-muted);
}

.suggestion-link {
  color: var(--color-accent);
  font-size: var(--text-sm);
  text-decoration: none;
  margin-right: var(--space-sm);
}

.suggestion-link:hover {
  text-decoration: underline;
}

/* Table */
.admin-table-wrapper {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-muted);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
}

.admin-table td {
  padding: 14px 16px;
  font-size: var(--text-sm);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.admin-table tr:hover td {
  background: var(--color-accent-subtle);
}

.td-title {
  font-weight: 600;
  color: var(--color-text);
}

.td-actions {
  display: flex;
  gap: var(--space-xs);
}

.btn-danger {
  color: var(--color-error) !important;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}

.empty-state {
  padding: var(--space-2xl);
  text-align: center;
  color: var(--color-text-muted);
}

/* Config */
.config-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.config-section {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.config-section h3 {
  margin-bottom: var(--space-md);
  font-size: var(--text-lg);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

/* Messages */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.message-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.message-card.unread {
  border-left: 3px solid var(--color-accent);
}

.message-card:hover {
  border-color: var(--color-border-strong);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: var(--space-sm);
}

.message-name {
  font-weight: 600;
  color: var(--color-text);
  margin-right: var(--space-sm);
}

.message-email {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.message-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.message-date {
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  white-space: nowrap;
}

.message-subject {
  font-weight: 600;
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.message-body {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}

/* Admin form */
.admin-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.admin-modal {
  max-width: 640px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

/* Toggle */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--color-bg-surface);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-out);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  left: 3px;
  bottom: 3px;
  background: var(--color-text);
  border-radius: 50%;
  transition: all var(--duration-fast) var(--ease-out);
}

.toggle input:checked + .toggle-slider {
  background: var(--color-accent);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(22px);
  background: var(--color-bg);
}

@media (max-width: 768px) {
  .admin-tabs {
    padding: 0 var(--space-md);
  }

  .admin-tab {
    padding: 12px 14px;
    font-size: var(--text-xs);
  }

  .admin-table-wrapper {
    overflow-x: auto;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Skill Tags */
.skills-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  padding: 12px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  min-height: 52px;
  align-items: center;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--color-accent-subtle);
  border: 1px solid var(--color-border-accent);
  border-radius: var(--radius-full);
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: 500;
  white-space: nowrap;
}

.skill-tag-remove {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
  opacity: 0.6;
  transition: opacity var(--duration-fast) var(--ease-out);
}

.skill-tag-remove:hover {
  opacity: 1;
  color: var(--color-error);
}

.skill-add-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
  min-width: 160px;
}

.skill-add-input {
  flex: 1;
  min-width: 120px;
  padding: 6px 12px !important;
  font-size: var(--text-sm) !important;
}

/* Profile Photo Upload */
.profile-upload-area {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
}

.profile-preview-lg {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--color-border-accent);
  flex-shrink: 0;
}

.profile-preview-lg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-preview-lg.profile-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  border-style: dashed;
  border-color: var(--color-border);
}

.profile-upload-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}

.profile-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: fit-content;
}

.profile-upload-btn.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.profile-url-row {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.profile-url-row .input {
  flex: 1;
}

/* Project Image Upload */
.project-image-upload {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.project-img-preview {
  width: 120px;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 2px solid var(--color-border-accent);
  flex-shrink: 0;
}

.project-img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-img-preview.project-img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-surface);
  color: var(--color-text-muted);
  border-style: dashed;
  border-color: var(--color-border);
}

.project-img-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}

/* Tech Selector Chips */
.tech-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  min-height: 48px;
  max-height: 200px;
  overflow-y: auto;
}

.tech-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  user-select: none;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.tech-chip:hover {
  background: rgba(148, 163, 184, 0.15);
  border-color: var(--color-text-muted);
  color: var(--color-text-secondary);
}

.tech-chip.selected {
  background: var(--color-accent-subtle);
  border-color: var(--color-border-accent);
  color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent-glow);
}

.tech-chip.selected:hover {
  background: rgba(52, 211, 153, 0.2);
}

/* ── Login Screen ── */
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  background-image: radial-gradient(circle at 50% 30%, rgba(226, 232, 240, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%);
  padding: var(--space-lg);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px var(--color-accent-subtle);
  animation: loginFadeIn 0.5s var(--ease-out);
}

@keyframes loginFadeIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.login-logo {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.login-logo-img {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  margin: 0 auto var(--space-md);
  border: 2px solid var(--color-border-accent);
  box-shadow: 0 0 20px var(--color-accent-glow);
}

.login-logo h2 {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: var(--space-xs);
}

.login-logo p {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.password-wrapper {
  position: relative;
}

.password-wrapper .input {
  padding-right: 44px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color var(--duration-fast) var(--ease-out);
}

.password-toggle:hover {
  color: var(--color-accent);
}

.login-error {
  color: var(--color-error);
  font-size: var(--text-sm);
  text-align: center;
  padding: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
}

/* Flyers Admin Grid */
.flyers-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-lg);
}

.flyer-admin-card {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.2s;
}

.flyer-admin-card:hover {
  border-color: var(--color-accent-subtle);
}

.flyer-admin-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--color-bg-surface);
  overflow: hidden;
}

.flyer-admin-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.flyer-admin-info {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flyer-admin-info h4 {
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
}

.flyer-admin-order {
  font-size: 12px;
  color: var(--color-text-faint);
}

.flyer-admin-actions {
  padding: 0 var(--space-md) var(--space-md);
  display: flex;
  gap: var(--space-xs);
}

.flyer-img-preview {
  aspect-ratio: 3 / 4;
  max-height: 300px;
}

.flyer-img-preview img {
  object-fit: cover;
  object-position: top center;
}
</style>
