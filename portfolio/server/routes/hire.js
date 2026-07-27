const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { anonymizeIp } = require('../middleware/anonymize')
const Notification = require('../models/Notification')
const router = express.Router()
const HireRequest = require('../models/HireRequest')

const validateHire = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('service').isIn(['web-development', 'mobile-development', 'backend-engineering', 'database-design', 'ui-design', 'saas-architecture', 'other']).withMessage('Valid service required'),
  body('budget').optional().isIn(['under-1000', '1000-5000', '5000-10000', '10000-25000', '25000-plus', 'discuss']),
  body('timeline').optional().isIn(['asap', '1-2-weeks', '1-month', '2-3-months', 'flexible']),
  body('description').trim().isLength({ min: 20, max: 5000 }).withMessage('Description must be 20-5000 characters'),
]

// POST /api/hire - public (submit hire request)
router.post('/', validateHire, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, email, phone, company, service, budget, timeline, description } = req.body
    const hire = await HireRequest.create({
      name, email, phone, company, service, budget, timeline, description, ip: anonymizeIp(req.ip),
    })
    Notification.create({
      type: 'hire',
      title: 'New Hire Request',
      message: `${name} wants to hire you for ${service}`,
      link: '/admin',
      metadata: { email, name, service, budget },
    }).catch(() => {})
    res.status(201).json({ success: true, data: hire })
  } catch {
    res.status(500).json({ error: 'Failed to submit request.' })
  }
})

// GET /api/hire - admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const hires = await HireRequest.find().sort({ createdAt: -1 })
    res.json({ success: true, data: hires })
  } catch {
    res.status(500).json({ error: 'Failed to fetch requests' })
  }
})

// PATCH /api/hire/:id/status - admin only
router.patch('/:id/status', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const { status } = req.body
    const hire = await HireRequest.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json({ success: true, data: hire })
  } catch {
    res.status(500).json({ error: 'Failed to update' })
  }
})

// DELETE /api/hire/:id - admin only
router.delete('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    await HireRequest.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete' })
  }
})

module.exports = router
