const express = require('express')
const { body, validationResult } = require('express-validator')
const { auth, adminOnly } = require('../middleware/auth')
const { validateObjectId } = require('../middleware/validate')
const { responseCache, clearCache } = require('../middleware/cache')
const router = express.Router()
const Project = require('../models/Project')

const validateProject = [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title required'),
  body('slug').trim().isLength({ min: 2, max: 200 }).withMessage('Slug required'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description required'),
]

// GET /api/projects - public (supports ?page, ?limit, ?tag, ?search, ?featured)
router.get('/', responseCache(5 * 60 * 1000), async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 50))
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.tag) filter.tags = { $in: [req.query.tag] }
    if (req.query.featured === 'true') filter.featured = true
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ]
    }

    const [projects, total] = await Promise.all([
      Project.find(filter).sort({ order: 1, featured: -1 }).skip(skip).limit(limit),
      Project.countDocuments(filter),
    ])

    res.json({
      success: true,
      data: projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// GET /api/projects/structured-data - public (JSON-LD for all projects)
router.get('/structured-data', responseCache(10 * 60 * 1000), async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 }).limit(6)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Yaseen Ahmad — Portfolio Projects",
      "description": "Featured projects by Yaseen Ahmad, Full-Stack Developer specializing in MERN stack.",
      "url": "https://yaseenahmad.dev",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": projects.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "CreativeWork",
            "name": p.title,
            "description": p.description,
            "url": `https://yaseenahmad.dev/project/${p.slug}`,
            "creator": { "@type": "Person", "name": "Yaseen Ahmad" },
            "keywords": p.tags?.join(', '),
            "programmingLanguage": p.language,
          },
        })),
      },
    }
    res.json(structuredData)
  } catch {
    res.status(500).json({ error: 'Failed to generate structured data' })
  }
})

// GET /api/projects/:slug - public
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json({ success: true, data: project })
  } catch {
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

// POST /api/projects - admin only
router.post('/', auth, adminOnly, validateProject, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const existing = await Project.findOne({ slug: req.body.slug })
    if (existing) {
      return res.status(400).json({ error: 'A project with this slug already exists.' })
    }
    const project = await Project.create(req.body)
    clearCache('/api/projects')
    res.status(201).json({ success: true, data: project })
  } catch {
    res.status(500).json({ error: 'Failed to create project' })
  }
})

// PUT /api/projects/:id - admin only
router.put('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const allowed = ['title', 'slug', 'subtitle', 'description', 'gradient', 'tags', 'github', 'liveDemo', 'language', 'featured', 'order', 'problem', 'solution', 'outcome', 'technologies']
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }
    if (updates.slug) {
      const existing = await Project.findOne({ slug: updates.slug, _id: { $ne: req.params.id } })
      if (existing) {
        return res.status(400).json({ error: 'A project with this slug already exists.' })
      }
    }
    const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ error: 'Not found' })
    clearCache('/api/projects')
    res.json({ success: true, data: project })
  } catch {
    res.status(500).json({ error: 'Failed to update project' })
  }
})

// DELETE /api/projects/:id - admin only
router.delete('/:id', auth, adminOnly, validateObjectId, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ error: 'Not found' })
    clearCache('/api/projects')
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

module.exports = router
