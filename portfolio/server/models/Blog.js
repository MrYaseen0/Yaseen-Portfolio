const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  category: {
    type: String,
    enum: ['tutorial', 'project', 'thoughts', 'news', 'guide'],
    default: 'thoughts',
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true })

blogSchema.index({ tags: 1 })
blogSchema.index({ published: 1, publishedAt: -1 })

module.exports = mongoose.model('Blog', blogSchema)
