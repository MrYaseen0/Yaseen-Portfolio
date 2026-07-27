const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
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
  subtitle: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  gradient: {
    type: String,
    default: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  features: [{
    type: String,
    trim: true,
  }],
  techDetails: [{
    label: String,
    value: String,
  }],
  caseStudy: {
    problem: { type: String, trim: true },
    solution: { type: String, trim: true },
    outcome: { type: String, trim: true },
    metrics: [{
      type: { type: String, enum: ['performance', 'speed', 'revenue', 'users'] },
      value: String,
      label: String,
    }],
  },
  github: {
    type: String,
    trim: true,
  },
  liveDemo: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    trim: true,
  },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  watchers: { type: Number, default: 0 },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

projectSchema.index({ order: 1, featured: -1 })

module.exports = mongoose.model('Project', projectSchema)
