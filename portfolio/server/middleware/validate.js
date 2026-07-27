const mongoose = require('mongoose')

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function validateObjectId(req, res, next) {
  if (req.params.id && !isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next()
}

module.exports = { isValidObjectId, validateObjectId }
