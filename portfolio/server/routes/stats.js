const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const Visitor = require('../models/Visitor')
const Contact = require('../models/Contact')
const HireRequest = require('../models/HireRequest')
const { auth, adminOnly } = require('../middleware/auth')
const { anonymizeIp } = require('../middleware/anonymize')

const visitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many visit requests.' },
})

// POST /api/stats/visit - record a visit (rate limited)
router.post('/visit', visitLimiter, async (req, res) => {
  try {
    await Visitor.create({
      ip: anonymizeIp(req.ip),
      userAgent: req.headers['user-agent'],
      page: req.body.page || '/',
      referrer: req.headers.referer,
    })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to record visit' })
  }
})

// GET /api/stats - admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments()
    const uniqueIPs = await Visitor.distinct('ip').then(ips => ips.length)
    const totalMessages = await Contact.countDocuments()
    const unreadMessages = await Contact.countDocuments({ read: false })
    const totalHires = await HireRequest.countDocuments()
    const newHires = await HireRequest.countDocuments({ status: 'new' })

    // Recent 7 days visitors
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentVisitors = await Visitor.countDocuments({ createdAt: { $gte: weekAgo } })

    // Daily visitors for last 7 days
    const dailyVisitors = await Visitor.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Most visited pages
    const topPages = await Visitor.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    res.json({
      success: true,
      data: {
        totalVisitors,
        uniqueIPs,
        totalMessages,
        unreadMessages,
        totalHires,
        newHires,
        recentVisitors,
        dailyVisitors,
        topPages,
      },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

module.exports = router
