const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  role: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  avatar: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  project: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

testimonialSchema.index({ order: 1, featured: -1 })

module.exports = mongoose.model('Testimonial', testimonialSchema)
