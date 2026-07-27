const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  userAgent: String,
  ip: String,
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  revokedAt: Date,
}, { timestamps: true })

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ user: 1, revokedAt: 1 })
sessionSchema.index({ refreshToken: 1 })

module.exports = mongoose.model('Session', sessionSchema)
