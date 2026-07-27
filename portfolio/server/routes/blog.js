const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const { auth } = require('../middleware/auth')
const { responseCache: cache } = require('../middleware/cache')

// Public: list published posts (paginated)
router.get('/', cache(300), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = { published: true }
    if (req.query.tag) filter.tags = req.query.tag.toLowerCase()
    if (req.query.category) filter.category = req.query.category

    const [posts, total] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).select('-content'),
      Blog.countDocuments(filter),
    ])

    res.json({
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Public: get single post by slug
router.get('/:slug', cache(300), async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })

    post.views += 1
    await post.save()

    res.json(post)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: create post
router.post('/', auth, async (req, res) => {
  try {
    const post = await Blog.create(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Admin: update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Admin: delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
