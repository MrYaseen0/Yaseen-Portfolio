const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { responseCache } = require('../middleware/cache')
const router = express.Router()
const Experience = require('../models/Experience')

const validateExperience = [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title required'),
  body('company').trim().isLength({ min: 2, max: 200 }).withMessage('Company required'),
  body('startDate').isISO8601().withMessage('Start date required'),
]

// GET /api/experience - public (supports ?page, ?limit)
router.get('/', responseCache(5 * 60 * 1000), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50))
    const skip = (page - 1) * limit

    const [experiences, total] = await Promise.all([
      Experience.find().sort({ order: 1, startDate: -1 }).skip(skip).limit(limit),
      Experience.countDocuments(),
    ])

    res.json({
      success: true,
      data: experiences,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch experiences' })
  }
})

// POST /api/experience - admin only (create)
router.post('/', auth, adminOnly, validateExperience, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const experience = await Experience.create(req.body)
    res.status(201).json({ success: true, data: experience })
  } catch {
    res.status(500).json({ error: 'Failed to create experience' })
  }
})

// PUT /api/experience/:id - admin only (update)
router.put('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const allowed = ['title', 'company', 'location', 'type', 'startDate', 'endDate', 'current', 'description', 'highlights', 'technologies', 'order']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    const experience = await Experience.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!experience) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true, data: experience })
  } catch {
    res.status(500).json({ error: 'Failed to update experience' })
  }
})

// DELETE /api/experience/:id - admin only
router.delete('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id)
    if (!experience) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete experience' })
  }
})

module.exports = router
