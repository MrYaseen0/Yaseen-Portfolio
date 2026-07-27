import { describe, it, expect } from 'vitest'

const BASE = 'http://localhost:5000'

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = res.headers.get('content-type')?.includes('json')
    ? await res.json().catch(() => null)
    : null
  return { status: res.status, data, headers: res.headers }
}

describe('Smoke Tests - Critical Paths', () => {
  describe('Server Health', () => {
    it('server is running', async () => {
      const { status } = await api('/api/health')
      expect(status).toBe(200)
    })

    it('health returns ok status', async () => {
      const { data } = await api('/api/health')
      expect(data.status).toBe('ok')
    })
  })

  describe('Public API Endpoints', () => {
    it('experience endpoint responds', async () => {
      const { status } = await api('/api/experience')
      expect(status).toBe(200)
    })

    it('testimonials endpoint responds', async () => {
      const { status } = await api('/api/testimonials')
      expect(status).toBe(200)
    })

    it('projects endpoint responds', async () => {
      const { status } = await api('/api/projects')
      expect(status).toBe(200)
    })

    it('settings endpoint responds', async () => {
      const { status } = await api('/api/settings')
      expect(status).toBe(200)
    })

    it('github repos endpoint responds', async () => {
      const { status } = await api('/api/github/repos')
      expect(status).toBe(200)
    })
  })

  describe('Auth Endpoints', () => {
    it('login endpoint accepts POST', async () => {
      const { status } = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      })
      expect([400, 401, 429]).toContain(status)
    })

    it('me endpoint requires auth', async () => {
      const { status } = await api('/api/auth/me')
      expect([401, 429]).toContain(status)
    })
  })

  describe('Protected Endpoints Block Unauthorized', () => {
    it('admin dashboard blocks without auth', async () => {
      const { status } = await api('/api/admin/dashboard')
      expect(status).toBe(401)
    })

    it('stats blocks without auth', async () => {
      const { status } = await api('/api/stats')
      expect(status).toBe(401)
    })
  })

  describe('Route Handling', () => {
    it('404 for unknown API routes', async () => {
      const { status } = await api('/api/this-does-not-exist')
      expect([404, 405]).toContain(status)
    })
  })
})
