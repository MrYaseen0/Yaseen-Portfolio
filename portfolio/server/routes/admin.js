const express = require('express')
const router = express.Router()
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { anonymizeIp } = require('../middleware/anonymize')
const Contact = require('../models/Contact')
const HireRequest = require('../models/HireRequest')
const Visitor = require('../models/Visitor')
const Activity = require('../models/Activity')
const Session = require('../models/Session')

// GET /api/admin/dashboard - combined dashboard data
router.get('/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const [contacts, hires, visitorCount, recentVisitors] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(20),
      HireRequest.find().sort({ createdAt: -1 }).limit(20),
      Visitor.countDocuments(),
      Visitor.find().sort({ createdAt: -1 }).limit(10).select('ip page createdAt'),
    ])

    const unreadContacts = await Contact.countDocuments({ read: false })
    const newHires = await HireRequest.countDocuments({ status: 'new' })

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentVisitorsWeek = await Visitor.countDocuments({ createdAt: { $gte: weekAgo } })

    res.json({
      success: true,
      data: {
        contacts,
        hires,
        visitorCount,
        recentVisitors,
        unreadContacts,
        newHires,
        recentVisitorsWeek,
      },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch dashboard' })
  }
})

// GET /api/admin/contacts - protected
router.get('/contacts', auth, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch {
    res.status(500).json({ error: 'Failed to fetch contacts' })
  }
})

// GET /api/admin/hires - protected
router.get('/hires', auth, adminOnly, async (req, res) => {
  try {
    const hires = await HireRequest.find().sort({ createdAt: -1 })
    res.json({ success: true, data: hires })
  } catch {
    res.status(500).json({ error: 'Failed to fetch hires' })
  }
})

// GET /api/admin/security - security overview
router.get('/security', auth, adminOnly, async (req, res) => {
  try {
    const [activeSessions, recentActivity, failedLogins, totalSessions] = await Promise.all([
      Session.find({ user: req.user.id, revokedAt: { $exists: false } })
        .select('-refreshToken')
        .sort({ createdAt: -1 }),
      Activity.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50),
      Activity.countDocuments({ user: req.user.id, action: 'login_failed', createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Session.countDocuments({ user: req.user.id }),
    ])

    res.json({
      success: true,
      data: {
        activeSessions,
        recentActivity,
        failedLogins24h: failedLogins,
        totalSessionsEver: totalSessions,
        currentSessionId: null,
      },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch security data' })
  }
})

// POST /api/admin/security/revoke-session - revoke a specific session
router.post('/security/revoke-session', auth, adminOnly, async (req, res) => {
  try {
    const { sessionId } = req.body
    const session = await Session.findOne({ _id: sessionId, user: req.user.id })
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' })
    }
    session.revokedAt = new Date()
    await session.save()

    await Activity.create({
      user: req.user.id,
      action: 'session_revoked',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      details: { sessionId, scope: 'single' },
    })

    res.json({ success: true, message: 'Session revoked.' })
  } catch {
    res.status(500).json({ error: 'Failed to revoke session.' })
  }
})

// POST /api/admin/security/revoke-all - revoke all other sessions
router.post('/security/revoke-all', auth, adminOnly, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    const result = await Session.updateMany(
      { user: req.user.id, revokedAt: { $exists: false }, refreshToken: { $ne: refreshToken } },
      { revokedAt: new Date() }
    )

    await Activity.create({
      user: req.user.id,
      action: 'session_revoked',
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      details: { scope: 'all_others', count: result.modifiedCount },
    })

    res.json({ success: true, message: `${result.modifiedCount} sessions revoked.` })
  } catch {
    res.status(500).json({ error: 'Failed to revoke sessions.' })
  }
})

// PATCH /api/admin/contacts/:id/read - mark as read
router.patch('/contacts/:id/read', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!contact) return res.status(404).json({ error: 'Contact not found.' })

    await Activity.create({
      user: req.user.id,
      action: 'contact_read',
      ip: anonymizeIp(req.ip),
      details: { contactId: req.params.id },
    })

    res.json({ success: true, data: contact })
  } catch {
    res.status(500).json({ error: 'Failed to update' })
  }
})

// DELETE /api/admin/contacts/:id - delete contact
router.delete('/contacts/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ error: 'Contact not found.' })

    await Activity.create({
      user: req.user.id,
      action: 'contact_deleted',
      ip: anonymizeIp(req.ip),
      details: { contactId: req.params.id, name: contact.name },
    })

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

// PATCH /api/admin/hires/:id/status - update hire status
router.patch('/hires/:id/status', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['new', 'contacted', 'discussion', 'proposal-sent', 'working', 'completed', 'declined']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' })
    }

    const hireBefore = await HireRequest.findById(req.params.id)
    if (!hireBefore) return res.status(404).json({ error: 'Hire request not found.' })
    const oldStatus = hireBefore.status

    const hire = await HireRequest.findByIdAndUpdate(req.params.id, { status }, { new: true })

    await Activity.create({
      user: req.user.id,
      action: 'hire_status_changed',
      ip: anonymizeIp(req.ip),
      details: { hireId: req.params.id, from: oldStatus, to: status, clientName: hire.name },
    })

    res.json({ success: true, data: hire })
  } catch {
    res.status(500).json({ error: 'Failed to update' })
  }
})

// DELETE /api/admin/hires/:id - delete hire request
router.delete('/hires/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const hire = await HireRequest.findByIdAndDelete(req.params.id)
    if (!hire) return res.status(404).json({ error: 'Hire request not found.' })

    await Activity.create({
      user: req.user.id,
      action: 'hire_deleted',
      ip: anonymizeIp(req.ip),
      details: { hireId: req.params.id, clientName: hire.name },
    })

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

module.exports = router
