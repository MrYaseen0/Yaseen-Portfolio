const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { anonymizeIp } = require('../middleware/anonymize')
const { sendAutoReply } = require('../lib/email')
const Notification = require('../models/Notification')
const router = express.Router()
const Contact = require('../models/Contact')

const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('subject').trim().isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters'),
]

// POST /api/contact - public (submit contact form)
router.post('/', validateContact, async (req, res) => {
  if (req.body.website) {
    return res.status(201).json({ success: true })
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, email, subject, message } = req.body
    const contact = await Contact.create({ name, email, subject, message, ip: anonymizeIp(req.ip) })
    sendAutoReply(email, name, subject).catch(() => {})
    Notification.create({
      type: 'contact',
      title: 'New Contact Message',
      message: `${name} sent a message: ${subject}`,
      link: '/admin',
      metadata: { email, name },
    }).catch(() => {})
    res.status(201).json({ success: true, data: contact })
  } catch {
    res.status(500).json({ error: 'Failed to send message.' })
  }
})

// GET /api/contact - admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// PATCH /api/contact/:id/read - admin only
router.patch('/:id/read', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    res.json({ success: true, data: contact })
  } catch {
    res.status(500).json({ error: 'Failed to update' })
  }
})

// DELETE /api/contact/:id - admin only
router.delete('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

module.exports = router
