import { describe, it, expect, vi, beforeEach } from 'vitest'
import jwt from 'jsonwebtoken'
import { generateTokens, setTokenCookies, clearTokenCookies, adminOnly } from '../../server/middleware/auth.js'

process.env.JWT_SECRET = 'test-secret'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'

describe('generateTokens', () => {
  it('generates access and refresh tokens', () => {
    const user = { _id: '507f1f77bcf86cd799439011', role: 'admin' }
    const tokens = generateTokens(user)

    expect(tokens.accessToken).toBeDefined()
    expect(tokens.refreshToken).toBeDefined()
    expect(typeof tokens.accessToken).toBe('string')
    expect(typeof tokens.refreshToken).toBe('string')
  })

  it('access token contains user id and role', () => {
    const user = { _id: '507f1f77bcf86cd799439011', role: 'admin' }
    const tokens = generateTokens(user)
    const decoded = jwt.verify(tokens.accessToken, 'test-secret')

    expect(decoded.id).toBe(user._id)
    expect(decoded.role).toBe('admin')
  })

  it('refresh token has type refresh', () => {
    const user = { _id: '507f1f77bcf86cd799439011', role: 'admin' }
    const tokens = generateTokens(user)
    const decoded = jwt.verify(tokens.refreshToken, 'test-refresh-secret')

    expect(decoded.type).toBe('refresh')
  })
})

describe('setTokenCookies', () => {
  it('sets access and refresh cookies', () => {
    const res = {
      cookie: vi.fn(),
    }
    setTokenCookies(res, 'access-token', 'refresh-token')

    expect(res.cookie).toHaveBeenCalledTimes(2)
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access-token', expect.objectContaining({
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    }))
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.objectContaining({
      httpOnly: true,
      path: '/api/auth/refresh',
    }))
  })
})

describe('clearTokenCookies', () => {
  it('clears both cookies', () => {
    const res = {
      clearCookie: vi.fn(),
    }
    clearTokenCookies(res)

    expect(res.clearCookie).toHaveBeenCalledTimes(2)
    expect(res.clearCookie).toHaveBeenCalledWith('accessToken', { path: '/' })
    expect(res.clearCookie).toHaveBeenCalledWith('refreshToken', { path: '/api/auth/refresh' })
  })
})

describe('adminOnly middleware', () => {
  let req, res, next

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
  })

  it('calls next for admin user', () => {
    req = { user: { role: 'admin' } }
    adminOnly(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 403 for non-admin user', () => {
    req = { user: { role: 'user' } }
    adminOnly(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required.' })
  })

  it('returns 403 when no user', () => {
    req = {}
    adminOnly(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
  })
})
