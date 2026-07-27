const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map(s => s.trim())

const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype']

function sanitizeValue(val) {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    for (const key of Object.keys(val)) {
      if (DANGEROUS_KEYS.includes(key)) {
        delete val[key]
      } else {
        sanitizeValue(val[key])
      }
    }
  }
  return val
}

function csrfProtection(req, res, next) {
  if (req.body && typeof req.body === 'object') sanitizeValue(req.body)
  if (req.params && typeof req.params === 'object') sanitizeValue(req.params)

  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  const origin = req.headers.origin
  const referer = req.headers.referer

  if (origin) {
    if (allowedOrigins.includes(origin)) return next()
    return res.status(403).json({ error: 'CSRF validation failed: invalid origin.' })
  }

  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (allowedOrigins.includes(refererOrigin)) return next()
    } catch {}
    return res.status(403).json({ error: 'CSRF validation failed: invalid referer.' })
  }

  return next()
}

module.exports = { csrfProtection }
