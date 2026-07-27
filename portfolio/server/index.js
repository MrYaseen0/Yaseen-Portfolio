const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const crypto = require('crypto')
const path = require('path')
const cookieParser = require('cookie-parser')
const { csrfProtection } = require('./middleware/csrf')
const logger = require('./lib/logger')
require('dotenv').config({ path: path.join(__dirname, '.env') })

const contactRoutes = require('./routes/contact')
const hireRoutes = require('./routes/hire')
const statsRoutes = require('./routes/stats')
const adminRoutes = require('./routes/admin')
const authRoutes = require('./routes/auth')
const githubRoutes = require('./routes/github')
const experienceRoutes = require('./routes/experience')
const testimonialRoutes = require('./routes/testimonials')
const projectRoutes = require('./routes/projects')
const settingsRoutes = require('./routes/settings')
const sitemapRoutes = require('./routes/sitemap')
const blogRoutes = require('./routes/blog')
const proposalRoutes = require('./routes/proposal')
const notificationRoutes = require('./routes/notifications')

const app = express()
const PORT = process.env.PORT || 5000

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET']
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`)
    process.exit(1)
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'short' : 'combined'))
app.use(cookieParser())

// Request ID middleware
app.use((req, res, next) => {
  req.id = crypto.randomUUID()
  res.setHeader('X-Request-Id', req.id)
  next()
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many submissions, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many auth attempts, please try again later.' },
})

// CORS
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',').map(s => s.trim())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(csrfProtection)

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/contact', strictLimiter, contactRoutes)
app.use('/api/hire', strictLimiter, hireRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/testimonials', testimonialRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/proposal', proposalRoutes)
app.use('/api/notifications', notificationRoutes)
app.use(sitemapRoutes)

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json({ status: dbStatus === 'connected' ? 'ok' : 'degraded', db: dbStatus, uptime: process.uptime(), timestamp: new Date() })
})

// API 404
app.all('/api/{*splat}', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

// Centralized error handler
app.use((err, req, res, _next) => {
  logger.error('Unhandled error', { message: err.message, requestId: req.id, path: req.path })
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Connect to MongoDB and start server
let server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    logger.error('MongoDB connection error', { message: err.message })
    process.exit(1)
  })

// Graceful shutdown
function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`)
  if (server) {
    server.close(() => {
      mongoose.connection.close(false).then(() => {
        logger.info('Server shut down')
        process.exit(0)
      })
    })
  } else {
    process.exit(0)
  }
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

module.exports = app
