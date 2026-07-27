const jwt = require('jsonwebtoken')
const User = require('../models/User')

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

function setTokenCookies(res, accessToken, refreshToken) {
  const isProduction = process.env.NODE_ENV === 'production'

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh',
  })
}

function clearTokenCookies(res) {
  res.clearCookie('accessToken', { path: '/' })
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' })
}

async function auth(req, res, next) {
  let token = null

  // Try Authorization header first, then cookie
  const authHeader = req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' })
    }
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      return res.status(423).json({ error: 'Account is locked.' })
    }
    req.user = decoded
    req.userDoc = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.', code: 'TOKEN_EXPIRED' })
    }
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

async function authOptional(req, res, next) {
  let token = null
  const authHeader = req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.replace('Bearer ', '')
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch {
    // ignore invalid tokens for optional auth
  }
  next()
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' })
  }
  next()
}

module.exports = { auth, authOptional, adminOnly, generateTokens, setTokenCookies, clearTokenCookies }
