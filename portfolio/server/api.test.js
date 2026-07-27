import { describe, it, expect } from 'vitest'

const BASE = 'http://localhost:5000'

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => null)
  return { status: res.status, data, headers: res.headers }
}

describe('Health Check', () => {
  it('GET /api/health returns ok', async () => {
    const { status, data } = await api('/api/health')
    expect(status).toBe(200)
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
  })
})

describe('Auth Endpoints', () => {
  it('POST /api/auth/login fails with wrong password', async () => {
    const { status, data } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'wrongpassword' }),
    })
    expect([401, 429]).toContain(status)
    if (status === 401) expect(data.error).toBeDefined()
  })

  it('POST /api/auth/login fails with missing fields', async () => {
    const { status } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    expect([400, 429]).toContain(status)
  })

  it('GET /api/auth/me fails without token', async () => {
    const { status } = await api('/api/auth/me')
    expect([401, 429]).toContain(status)
  })
})

describe('Public Endpoints (no auth required)', () => {
  it('GET /api/experience returns wrapped array', async () => {
    const { status, data } = await api('/api/experience')
    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('GET /api/testimonials returns wrapped array', async () => {
    const { status, data } = await api('/api/testimonials')
    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('GET /api/projects returns wrapped array', async () => {
    const { status, data } = await api('/api/projects')
    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('GET /api/settings returns object', async () => {
    const { status, data } = await api('/api/settings')
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })

  it('GET /api/github/repos returns data', async () => {
    const { status, data } = await api('/api/github/repos')
    expect(status).toBe(200)
    expect(data).toBeDefined()
  })
})

describe('Public Endpoints (contact/hire submit without auth)', () => {
  it('POST /api/contact fails validation without required fields', async () => {
    const { status } = await api('/api/contact', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    expect([400, 429]).toContain(status)
  })

  it('POST /api/hire fails validation without required fields', async () => {
    const { status } = await api('/api/hire', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    expect([400, 429]).toContain(status)
  })
})

describe('Admin Endpoints (require admin role)', () => {
  it('GET /api/admin/contacts fails without auth', async () => {
    const { status } = await api('/api/admin/contacts')
    expect([401, 429]).toContain(status)
  })

  it('GET /api/admin/hires fails without auth', async () => {
    const { status } = await api('/api/admin/hires')
    expect([401, 429]).toContain(status)
  })

  it('GET /api/admin/security fails without auth', async () => {
    const { status } = await api('/api/admin/security')
    expect([401, 404, 429]).toContain(status)
  })

  it('POST /api/projects fails without auth', async () => {
    const { status } = await api('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', description: 'Test project' }),
    })
    expect([401, 400, 429]).toContain(status)
  })

  it('POST /api/experience fails without auth', async () => {
    const { status } = await api('/api/experience', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', company: 'Test', startDate: '2024-01-01' }),
    })
    expect([401, 400, 429]).toContain(status)
  })

  it('POST /api/testimonials fails without auth', async () => {
    const { status } = await api('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', content: 'Great work!', rating: 5 }),
    })
    expect([401, 400, 429]).toContain(status)
  })

  it('PUT /api/settings fails without auth', async () => {
    const { status } = await api('/api/settings', {
      method: 'PUT',
      body: JSON.stringify({}),
    })
    expect([401, 429]).toContain(status)
  })
})

describe('Rate Limiting', () => {
  it('GET /api/health is accessible', async () => {
    const { status } = await api('/api/health')
    expect(status).toBe(200)
  })
})

describe('404 Handling', () => {
  it('GET /api/nonexistent returns 404 or error', async () => {
    const { status } = await api('/api/nonexistent')
    expect([404, 405]).toContain(status)
  })
})
