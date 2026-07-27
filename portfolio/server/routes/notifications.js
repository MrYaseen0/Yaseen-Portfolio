const express = require('express')
const router = express.Router()
const Notification = require('../models/Notification')
const { auth } = require('../middleware/auth')
const { responseCache: cache } = require('../middleware/cache')

// Admin: list notifications (paginated)
router.get('/', auth, cache(30), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.unread === 'true') filter.read = false
    if (req.query.type) filter.type = req.query.type

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ read: false }),
    ])

    res.json({
      data: notifications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      unreadCount,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, { read: true }, { new: true }
    )
    if (!notification) return res.status(404).json({ error: 'Not found' })
    res.json(notification)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: mark all as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true })
    res.json({ message: 'All marked as read' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) return res.status(404).json({ error: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Helper: create notification (called internally)
router._create = async function (type, title, message, link, metadata) {
  try {
    return await Notification.create({ type, title, message, link, metadata })
  } catch {
    return null
  }
}

module.exports = router
