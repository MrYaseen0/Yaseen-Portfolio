const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login', 'logout', 'login_failed', 'register',
      'contact_read', 'contact_deleted',
      'hire_status_changed', 'hire_deleted',
      'settings_updated', 'password_changed',
      'session_revoked', 'unauthorized_access',
    ],
  },
  ip: String,
  userAgent: String,
  details: mongoose.Schema.Types.Mixed,
}, { timestamps: true })

activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
activitySchema.index({ user: 1, action: 1 })

module.exports = mongoose.model('Activity', activitySchema)
