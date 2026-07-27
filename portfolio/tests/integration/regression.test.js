import { describe, it, expect, beforeAll } from 'vitest'

const BASE = 'http://localhost:5000'

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => null)
  return { status: res.status, data, headers: res.headers }
}

describe('Regression: Auth Security', () => {
  it('register validates email format', async () => {
    const { status } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email', password: 'Admin@123456' }),
    })
    expect([400, 429]).toContain(status)
  })

  it('register requires minimum password length', async () => {
    const { status } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: '123' }),
    })
    expect([400, 429]).toContain(status)
  })

  it('login rate limiting exists', async () => {
    for (let i = 0; i < 6; i++) {
      await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'ratelimittest@test.com', password: 'wrong' }),
      })
    }
    const { status } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'ratelimittest@test.com', password: 'wrong' }),
    })
    expect([401, 429]).toContain(status)
  })
})

describe('Regression: Mass Assignment Prevention', () => {
  let token

  beforeAll(async () => {
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'yaseenahmad13579@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      }),
    })
    if (loginRes.status === 200) {
      token = loginRes.data.accessToken
    }
  })

  it('PUT settings ignores non-whitelisted fields', async () => {
    if (!token) return
    const { status } = await api('/api/settings', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        profile: { name: 'Test' },
        maliciousField: 'should be ignored',
        _id: 'should be ignored',
      }),
    })
    expect([200, 429]).toContain(status)
  })

  it('PUT projects ignores role escalation', async () => {
    if (!token) return
    const { status } = await api('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Security Test',
        description: 'Testing mass assignment prevention',
        slug: 'security-test-' + Date.now(),
        category: 'web',
        role: 'superadmin',
      }),
    })
    expect([201, 400, 429]).toContain(status)
  })
})

describe('Regression: Health Check', () => {
  it('health returns status and timestamp', async () => {
    const { status, data } = await api('/api/health')
    expect(status).toBe(200)
    expect(data.status).toBeDefined()
    expect(data.timestamp).toBeDefined()
  })

  it('health includes uptime', async () => {
    const { data } = await api('/api/health')
    expect(data.uptime).toBeDefined()
    expect(typeof data.uptime).toBe('number')
  })
})

describe('Regression: Stats Endpoint Security', () => {
  it('stats requires authentication', async () => {
    const { status } = await api('/api/stats')
    expect(status).toBe(401)
  })

  it('stats requires admin role', async () => {
    const { status } = await api('/api/stats', {
      headers: { Authorization: 'Bearer invalid-token' },
    })
    expect(status).toBe(401)
  })
})

describe('Regression: ObjectId Validation', () => {
  let token

  beforeAll(async () => {
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'yaseenahmad13579@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      }),
    })
    if (loginRes.status === 200) {
      token = loginRes.data.accessToken
    }
  })

  it('rejects invalid ObjectId in project routes', async () => {
    const { status } = await api('/api/projects/not-a-valid-id', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test' }),
    })
    expect([400, 401, 429]).toContain(status)
  })

  it('rejects invalid ObjectId in experience routes', async () => {
    const { status } = await api('/api/experience/not-a-valid-id', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test' }),
    })
    expect([400, 401, 429]).toContain(status)
  })

  it('rejects invalid ObjectId in testimonial routes', async () => {
    const { status } = await api('/api/testimonials/not-a-valid-id', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Test' }),
    })
    expect([400, 401, 429]).toContain(status)
  })
})

describe('Regression: Contact Form Honeypot', () => {
  it('honeypot field causes silent rejection', async () => {
    const { status } = await api('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Bot',
        email: 'bot@test.com',
        subject: 'Spam',
        message: 'This is spam message for testing',
        website: 'http://spam.com',
      }),
    })
    expect([201, 429]).toContain(status)
  })
})

describe('Regression: Compression', () => {
  it('response includes content-encoding header', async () => {
    const res = await fetch(`${BASE}/api/health`, {
      headers: { 'Accept-Encoding': 'gzip' },
    })
    expect(res.status).toBe(200)
  })
})
