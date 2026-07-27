const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { responseCache } = require('../middleware/cache')
const router = express.Router()
const Testimonial = require('../models/Testimonial')

const validateTestimonial = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name required'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content required (10-1000 chars)'),
]

// GET /api/testimonials - public (supports ?page, ?limit, ?featured)
router.get('/', responseCache(5 * 60 * 1000), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50))
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.featured === 'true') filter.featured = true

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter).sort({ order: 1, featured: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: testimonials,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' })
  }
})

// POST /api/testimonials - admin only
router.post('/', auth, adminOnly, validateTestimonial, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const testimonial = await Testimonial.create(req.body)
    res.status(201).json({ success: true, data: testimonial })
  } catch {
    res.status(500).json({ error: 'Failed to create testimonial' })
  }
})

// PUT /api/testimonials/:id - admin only
router.put('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const allowed = ['name', 'role', 'company', 'avatar', 'content', 'rating', 'project', 'featured', 'order']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!testimonial) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true, data: testimonial })
  } catch {
    res.status(500).json({ error: 'Failed to update testimonial' })
  }
})

// DELETE /api/testimonials/:id - admin only
router.delete('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
})

module.exports = router
