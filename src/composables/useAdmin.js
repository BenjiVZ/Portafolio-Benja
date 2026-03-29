import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export function useAdmin() {
  const loading = ref(false)
  const error = ref(null)

  // ── Projects CRUD ──
  async function getProjects() {
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (err) throw err
    return data
  }

  async function createProject(project) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function updateProject(id, updates) {
    loading.value = true
    try {
      const { data, error: err } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (err) throw err
      return data
    } finally { loading.value = false }
  }

  async function deleteProject(id) {
    loading.value = true
    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      if (err) throw err
    } finally { loading.value = false }
  }

  // ── Services CRUD ──
  async function getServices() {
    const { data, error: err } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
    if (err) throw err
    return data
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
    const { data, error: err } = await supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true })
    if (err) throw err
    return data
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

  // ── Site Config CRUD ──
  async function getSiteConfig() {
    const { data, error: err } = await supabase
      .from('site_config')
      .select('*')
    if (err) throw err
    const configMap = {}
    data.forEach(row => { configMap[row.key] = row.value })
    return configMap
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

  // ── Image Upload ──
  async function uploadImage(file, bucket = 'portfolio') {
    loading.value = true
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: err } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)
      if (err) throw err

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return data.publicUrl
    } finally { loading.value = false }
  }

  return {
    loading, error,
    // Projects
    getProjects, createProject, updateProject, deleteProject,
    // Services
    getServices, createService, updateService, deleteService,
    // Experiences
    getExperiences, createExperience, updateExperience, deleteExperience,
    // Config
    getSiteConfig, updateSiteConfig,
    // Messages
    getMessages, markMessageRead, deleteMessage,
    // Images
    uploadImage
  }
}
