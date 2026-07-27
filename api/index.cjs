const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const crypto = require('crypto')
const cookieParser = require('cookie-parser')
const { csrfProtection } = require('./portfolio/server/middleware/csrf')
const logger = require('./portfolio/server/lib/logger')

const contactRoutes = require('./portfolio/server/routes/contact')
const hireRoutes = require('./portfolio/server/routes/hire')
const statsRoutes = require('./portfolio/server/routes/stats')
const adminRoutes = require('./portfolio/server/routes/admin')
const authRoutes = require('./portfolio/server/routes/auth')
const githubRoutes = require('./portfolio/server/routes/github')
const experienceRoutes = require('./portfolio/server/routes/experience')
const testimonialRoutes = require('./portfolio/server/routes/testimonials')
const projectRoutes = require('./portfolio/server/routes/projects')
const settingsRoutes = require('./portfolio/server/routes/settings')
const sitemapRoutes = require('./portfolio/server/routes/sitemap')
const blogRoutes = require('./portfolio/server/routes/blog')
const proposalRoutes = require('./portfolio/server/routes/proposal')
const notificationRoutes = require('./portfolio/server/routes/notifications')

const app = express()

let isConnected = false

async function connectDB() {
  if (isConnected) return
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
    logger.info('Connected to MongoDB (serverless)')
  } catch (err) {
    logger.error('MongoDB connection error', { message: err.message })
    throw err
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    res.status(503).json({ error: 'Database unavailable' })
  }
})

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
app.use(morgan('short'))
app.use(cookieParser())

app.use((req, res, next) => {
  req.id = crypto.randomUUID()
  res.setHeader('X-Request-Id', req.id)
  next()
})

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

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json({ status: dbStatus === 'connected' ? 'ok' : 'degraded', db: dbStatus, uptime: process.uptime(), timestamp: new Date() })
})

app.all('/api/{*splat}', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

app.use((err, req, res, _next) => {
  logger.error('Unhandled error', { message: err.message, requestId: req.id, path: req.path })
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  })
})

module.exports = app
