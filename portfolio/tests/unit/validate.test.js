import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isValidObjectId, validateObjectId } from '../../server/middleware/validate.js'

describe('isValidObjectId', () => {
  it('returns true for valid ObjectId', () => {
    expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true)
  })

  it('returns false for invalid ObjectId', () => {
    expect(isValidObjectId('invalid')).toBe(false)
    expect(isValidObjectId('123')).toBe(false)
    expect(isValidObjectId('')).toBe(false)
  })

  it('returns false for null/undefined', () => {
    expect(isValidObjectId(null)).toBe(false)
    expect(isValidObjectId(undefined)).toBe(false)
  })
})

describe('validateObjectId middleware', () => {
  let req, res, next

  beforeEach(() => {
    req = { params: {} }
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }
    next = vi.fn()
  })

  it('calls next for valid ObjectId', () => {
    req.params.id = '507f1f77bcf86cd799439011'
    validateObjectId(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('returns 400 for invalid ObjectId', () => {
    req.params.id = 'invalid'
    validateObjectId(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' })
  })

  it('calls next when no id param', () => {
    validateObjectId(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
