const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'freelance', 'contract', 'internship', 'volunteer'],
    default: 'full-time',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
  highlights: [{
    type: String,
    trim: true,
    maxlength: 300,
  }],
  technologies: [{
    type: String,
    trim: true,
  }],
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

experienceSchema.index({ order: 1 })

module.exports = mongoose.model('Experience', experienceSchema)
