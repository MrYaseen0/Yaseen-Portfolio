const API_BASE = '/api'

class ApiService {
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const text = await res.text()
      let data
      try { data = JSON.parse(text) } catch { data = { error: text || 'Invalid response' } }

      if (!res.ok) {
        const error = new Error(data.error || data.errors?.[0]?.msg || 'Request failed')
        error.status = res.status
        error.code = data.code
        throw error
      }
      return data
    } catch (err) {
      clearTimeout(timeout)
      if (err.name === 'AbortError') {
        const error = new Error('Request timed out')
        error.status = 408
        throw error
      }
      throw err
    }
  }

  // Public
  submitContact(form) { return this.request('/contact', { method: 'POST', body: JSON.stringify(form) }) }
  submitHire(form) { return this.request('/hire', { method: 'POST', body: JSON.stringify(form) }) }
  recordVisit(page) { return this.request('/stats/visit', { method: 'POST', body: JSON.stringify({ page }) }) }
  getStats() { return this.request('/stats') }
  getGithubRepos() { return this.request('/github/repos') }
  getGithubStats() { return this.request('/github/stats') }

  // Experience
  getExperiences() { return this.request('/experience') }
  createExperience(data) { return this.request('/experience', { method: 'POST', body: JSON.stringify(data) }) }
  updateExperience(id, data) { return this.request(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  deleteExperience(id) { return this.request(`/experience/${id}`, { method: 'DELETE' }) }

  // Testimonials
  getTestimonials() { return this.request('/testimonials') }
  createTestimonial(data) { return this.request('/testimonials', { method: 'POST', body: JSON.stringify(data) }) }
  updateTestimonial(id, data) { return this.request(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  deleteTestimonial(id) { return this.request(`/testimonials/${id}`, { method: 'DELETE' }) }

  // Projects (admin CRUD)
  getAllProjects() { return this.request('/projects') }
  getProjectBySlug(slug) { return this.request(`/projects/${slug}`) }
  createProject(data) { return this.request('/projects', { method: 'POST', body: JSON.stringify(data) }) }
  updateProject(id, data) { return this.request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  deleteProject(id) { return this.request(`/projects/${id}`, { method: 'DELETE' }) }

  // Settings
  getSettings() { return this.request('/settings') }
  updateSettings(data) { return this.request('/settings', { method: 'PUT', body: JSON.stringify(data) }) }

  // Auth
  login(email, password) { return this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }) }
  register(email, password) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }) }
  getMe() { return this.request('/auth/me') }
  logout() { return this.request('/auth/logout', { method: 'POST' }) }
  refreshToken() { return this.request('/auth/refresh', { method: 'POST' }) }
  getSessions() { return this.request('/auth/sessions') }
  getActivity(page = 1) { return this.request(`/auth/activity?page=${page}`) }
  logoutAll() { return this.request('/auth/logout-all', { method: 'POST' }) }
  changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Admin
  getDashboard() { return this.request('/admin/dashboard') }
  getSecurity() { return this.request('/admin/security') }
  revokeSession(sessionId) {
    return this.request('/admin/security/revoke-session', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    })
  }
  revokeAllSessions() { return this.request('/admin/security/revoke-all', { method: 'POST' }) }
  getAdminContacts() { return this.request('/admin/contacts') }
  markRead(id) { return this.request(`/admin/contacts/${id}/read`, { method: 'PATCH' }) }
  deleteContact(id) { return this.request(`/admin/contacts/${id}`, { method: 'DELETE' }) }
  getAdminHires() { return this.request('/admin/hires') }
  updateHireStatus(id, status) { return this.request(`/admin/hires/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }) }
  deleteHire(id) { return this.request(`/admin/hires/${id}`, { method: 'DELETE' }) }
}

const api = new ApiService()
export default api
