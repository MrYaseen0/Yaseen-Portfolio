const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  referrer: String,
}, {
  timestamps: true,
})

visitorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
visitorSchema.index({ ip: 1 })
visitorSchema.index({ page: 1 })

module.exports = mongoose.model('Visitor', visitorSchema)
