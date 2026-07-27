const mongoose = require('mongoose')

const hireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  service: {
    type: String,
    required: true,
    enum: ['web-development', 'mobile-development', 'backend-engineering', 'database-design', 'ui-design', 'saas-architecture', 'other'],
  },
  budget: {
    type: String,
    enum: ['under-1000', '1000-5000', '5000-10000', '10000-25000', '25000-plus', 'discuss'],
  },
  timeline: {
    type: String,
    enum: ['asap', '1-2-weeks', '1-month', '2-3-months', 'flexible'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'discussion', 'proposal-sent', 'working', 'completed', 'declined'],
    default: 'new',
  },
  notes: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
  ip: String,
}, {
  timestamps: true,
})

hireSchema.index({ status: 1, createdAt: -1 })
hireSchema.index({ email: 1 })

module.exports = mongoose.model('HireRequest', hireSchema)
