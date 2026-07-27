const express = require('express')
const User = require('../models/User')
const Session = require('../models/Session')
const Activity = require('../models/Activity')
const { auth, generateTokens, setTokenCookies, clearTokenCookies } = require('../middleware/auth')
const { anonymizeIp } = require('../middleware/anonymize')
const router = express.Router()

// POST /api/auth/register - create admin (first time only)
router.post('/register', async (req, res) => {
  try {
    const existing = await User.countDocuments()
    if (existing > 0) {
      return res.status(403).json({ error: 'Admin already registered.' })
    }

    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address required.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' })
    }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must contain uppercase and numbers.' })
    }

    const user = await User.create({ email, password, role: 'admin' })
    const { accessToken, refreshToken } = generateTokens(user)

    const session = await Session.create({
      user: user._id,
      refreshToken,
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await Activity.create({
      user: user._id,
      action: 'register',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
    })

    setTokenCookies(res, accessToken, refreshToken)

    res.status(201).json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role },
      sessionId: session._id,
    })
  } catch {
    res.status(500).json({ error: 'Registration failed.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      await Activity.create({
        action: 'login_failed',
        ip: anonymizeIp(req.ip),
        userAgent: req.headers['user-agent'],
        details: { email, reason: 'user_not_found' },
      })
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      return res.status(423).json({ error: 'Account locked. Try again later.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      user.loginAttempts += 1
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
      }
      await user.save()

      await Activity.create({
        user: user._id,
        action: 'login_failed',
        ip: anonymizeIp(req.ip),
        userAgent: req.headers['user-agent'],
        details: { reason: 'wrong_password', attempts: user.loginAttempts },
      })

      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    user.loginAttempts = 0
    user.lockedUntil = undefined
    user.lastLogin = new Date()
    await user.save()

    const { accessToken, refreshToken } = generateTokens(user)

    const session = await Session.create({
      user: user._id,
      refreshToken,
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    await Activity.create({
      user: user._id,
      action: 'login',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
    })

    setTokenCookies(res, accessToken, refreshToken)

    res.json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role },
      sessionId: session._id,
    })
  } catch {
    res.status(500).json({ error: 'Login failed.' })
  }
})

// POST /api/auth/refresh - refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided.' })
    }

    let decoded
    try {
      decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch {
      return res.status(401).json({ error: 'Invalid refresh token.' })
    }

    const session = await Session.findOne({
      refreshToken,
      user: decoded.id,
      revokedAt: { $exists: false },
    })

    if (!session) {
      return res.status(401).json({ error: 'Refresh token not found or revoked.' })
    }

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id })
      return res.status(401).json({ error: 'Refresh token expired.' })
    }

    const user = await User.findById(decoded.id)
    if (!user || (user.lockedUntil && user.lockedUntil > Date.now())) {
      return res.status(401).json({ error: 'User unavailable.' })
    }

    // Rotate refresh token
    const newTokens = generateTokens(user)
    session.refreshToken = newTokens.refreshToken
    session.lastActivity = new Date()
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await session.save()

    setTokenCookies(res, newTokens.accessToken, newTokens.refreshToken)

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Token refresh failed.' })
  }
})

// POST /api/auth/logout - revoke session
router.post('/logout', auth, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      await Session.findOneAndUpdate(
        { refreshToken },
        { revokedAt: new Date() }
      )
    }

    await Activity.create({
      user: req.user.id,
      action: 'logout',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
    })

    clearTokenCookies(res)
    res.json({ success: true, message: 'Logged out successfully.' })
  } catch {
    res.status(500).json({ error: 'Logout failed.' })
  }
})

// POST /api/auth/logout-all - revoke all sessions
router.post('/logout-all', auth, async (req, res) => {
  try {
    await Session.updateMany(
      { user: req.user.id, revokedAt: { $exists: false } },
      { revokedAt: new Date() }
    )

    await Activity.create({
      user: req.user.id,
      action: 'session_revoked',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      details: { scope: 'all_sessions' },
    })

    clearTokenCookies(res)
    res.json({ success: true, message: 'All sessions revoked.' })
  } catch {
    res.status(500).json({ error: 'Failed to revoke sessions.' })
  }
})

// GET /api/auth/me - verify token
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -loginAttempts -lockedUntil')
    if (!user) return res.status(404).json({ error: 'User not found.' })
    res.json({ success: true, user })
  } catch {
    res.status(500).json({ error: 'Failed.' })
  }
})

// GET /api/auth/sessions - list active sessions
router.get('/sessions', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user.id,
      revokedAt: { $exists: false },
    }).select('-refreshToken').sort({ createdAt: -1 })

    res.json({ success: true, data: sessions })
  } catch {
    res.status(500).json({ error: 'Failed to fetch sessions.' })
  }
})

// GET /api/auth/activity - get activity log
router.get('/activity', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const [activities, total] = await Promise.all([
      Activity.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Activity.countDocuments({ user: req.user.id }),
    ])

    res.json({
      success: true,
      data: activities,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch activity log.' })
  }
})

// POST /api/auth/change-password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required.' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' })
    }

    const user = await User.findById(req.user.id)
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }

    user.password = newPassword
    await user.save()

    // Revoke all other sessions
    await Session.updateMany(
      { user: user._id, refreshToken: { $ne: req.cookies?.refreshToken } },
      { revokedAt: new Date() }
    )

    await Activity.create({
      user: user._id,
      action: 'password_changed',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
    })

    res.json({ success: true, message: 'Password changed. Other sessions revoked.' })
  } catch {
    res.status(500).json({ error: 'Failed to change password.' })
  }
})

module.exports = router
