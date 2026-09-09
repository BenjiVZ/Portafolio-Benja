import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { localProjects, localServices, localExperiences, localFlyers, localSiteConfig } from '../lib/localData'

// ============================================
// Panel de administración: escribe directo en Supabase.
// Los repos de GitHub no se gestionan aquí — viven en
// src/data/repos-github.json y se editan en el repo.
// ============================================

// Con Supabase caido, las LECTURAS caen a los JSON del repo en cualquier
// entorno (es lo mismo que muestra el sitio publico). Las ESCRITURAS solo
// tienen plan B en `npm run dev`: el backend de vite.config.js guarda en
// public/data y public/media. En produccion el error llega al panel.
const enDev = import.meta.env.DEV

// true cuando la ultima lectura tuvo que usar el respaldo: el panel lo usa
// para el indicador de conexion (antes un respaldo exitoso se leia como
// "Supabase conectado").
const usandoLocal = ref(false)

async function remotoOLocal(remota, local, { escritura = false } = {}) {
  try {
    return await remota()
  } catch (e) {
    if (escritura && !enDev) {
      throw new Error('Sin conexión con Supabase. En producción no se puede guardar; para editar el respaldo local ejecuta npm run dev.')
    }
    console.warn('Supabase no disponible, usando respaldo local:', e.message)
    if (!escritura) usandoLocal.value = true
    return local()
  }
}

async function guardarProyectoLocal(row) {
  const res = await fetch('/__local/proyecto', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(row)
  })
  if (!res.ok) throw new Error('La edicion local fallo: ' + res.status)
  return res.json()
}

async function subirImagenLocal(file) {
  const res = await fetch(`/__local/upload?nombre=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    headers: { 'content-type': file.type || 'application/octet-stream' },
    body: file
  })
  if (!res.ok) throw new Error('La subida local fallo: ' + res.status)
  return (await res.json()).url
}

export function useAdmin() {
  const loading = ref(false)
  const error = ref(null)

  // ── Projects CRUD ──
  async function getProjects() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true })
        if (err) throw err
        return data
      },
      () => localProjects()
    )
  }

  async function createProject(project) {
    loading.value = true
    try {
      return await remotoOLocal(
        async () => {
          const { data, error: err } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single()
          if (err) throw err
          return data
        },
        () => guardarProyectoLocal({ id: `nuevo-${Date.now()}`, ...project }),
        { escritura: true }
      )
    } finally { loading.value = false }
  }

  async function updateProject(id, updates) {
    loading.value = true
    try {
      return await remotoOLocal(
        async () => {
          const { data, error: err } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
          if (err) throw err
          return data
        },
        () => guardarProyectoLocal({ id, ...updates }),
        { escritura: true }
      )
    } finally { loading.value = false }
  }

  async function deleteProject(id) {
    loading.value = true
    try {
      return await remotoOLocal(
        async () => {
          const { error: err } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
          if (err) throw err
        },
        // Los JSON del repo no se tocan: el proyecto queda marcado como
        // eliminado en proyectos-edit.json y localProjects() lo filtra
        () => guardarProyectoLocal({ id, _eliminado: true }),
        { escritura: true }
      )
    } finally { loading.value = false }
  }

  // ── Services CRUD ──
  async function getServices() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true })
        if (err) throw err
        return data
      },
      () => localServices()
    )
  }

  async function createService(service) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function updateService(id, updates) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function deleteService(id) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Experiences CRUD ──
  async function getExperiences() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase
          .from('experiences')
          .select('*')
          .order('sort_order', { ascending: true })
        if (err) throw err
        return data
      },
      () => localExperiences()
    )
  }

  async function createExperience(experience) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('experiences')
        .insert(experience)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function updateExperience(id, updates) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function deleteExperience(id) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id)
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Site Config ──
  async function getSiteConfig() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase
          .from('site_config')
          .select('*')
        if (err) throw err
        const configMap = {}
        ;(data || []).forEach(row => { configMap[row.key] = row.value })
        return configMap
      },
      () => localSiteConfig()
    )
  }

  async function updateSiteConfig(key, value) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('site_config')
        .upsert({ key, value, updated_at: new Date().toISOString() })
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Contact Messages ──
  async function getMessages() {
    const { data, error: err } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) throw err
    return data
  }

  async function markMessageRead(id) {
    const { error: err } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id)
    if (err) throw err
  }

  async function deleteMessage(id) {
    const { error: err } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  // ── Flyers CRUD ──
  async function getFlyers() {
    return remotoOLocal(
      async () => {
        const { data, error: err } = await supabase
          .from('flyers')
          .select('*')
          .order('sort_order', { ascending: true })
        if (err) throw err
        return data
      },
      () => localFlyers()
    )
  }

  async function createFlyer(flyer) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('flyers')
        .insert(flyer)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function updateFlyer(id, updates) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('flyers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function deleteFlyer(id) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('flyers')
        .delete()
        .eq('id', id)
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Testimonials CRUD ──
  async function getTestimonials() {
    const { data, error: err } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
    if (err) throw err
    return data
  }

  async function createTestimonial(testimonial) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function updateTestimonial(id, updates) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('testimonials')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function deleteTestimonial(id) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Image Upload ──
  async function uploadImage(file, bucket = 'portfolio') {
    loading.value = true
    try {
      return await remotoOLocal(
        async () => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

          const { error: err } = await supabase.storage
            .from(bucket)
            .upload(fileName, file)
          if (err) throw err

          const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName)

          return data.publicUrl
        },
        () => subirImagenLocal(file),
        { escritura: true }
      )
    } finally { loading.value = false }
  }

  return {
    loading, error, usandoLocal,
    // Projects
    getProjects, createProject, updateProject, deleteProject,
    // Services
    getServices, createService, updateService, deleteService,
    // Experiences
    getExperiences, createExperience, updateExperience, deleteExperience,
    // Flyers
    getFlyers, createFlyer, updateFlyer, deleteFlyer,
    // Testimonials
    getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
    // Config
    getSiteConfig, updateSiteConfig,
    // Messages
    getMessages, markMessageRead, deleteMessage,
    // Images
    uploadImage
  }
}
