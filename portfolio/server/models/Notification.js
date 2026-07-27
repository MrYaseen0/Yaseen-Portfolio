const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['contact', 'hire', 'blog_comment', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  link: {
    type: String,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, { timestamps: true })

notificationSchema.index({ read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
