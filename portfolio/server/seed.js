const mongoose = require('mongoose')
const User = require('./models/User')
const Experience = require('./models/Experience')
const Testimonial = require('./models/Testimonial')
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  const existingUser = await User.findOne({ email: ADMIN_EMAIL })
  if (!existingUser) {
    await User.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    })
    console.log(`Admin user created: ${ADMIN_EMAIL}`)
  } else {
    console.log('Admin user already exists')
  }

  const expCount = await Experience.countDocuments()
  if (expCount === 0) {
    await Experience.insertMany([
      {
        title: 'Full Stack Developer',
        company: 'Freelance',
        location: 'Remote',
        type: 'freelance',
        startDate: new Date('2023-01-01'),
        current: true,
        description: 'Building scalable web applications using the MERN stack for clients worldwide.',
        highlights: [
          'Developed 20+ production-ready web applications',
          'Built real-time features with Socket.io',
          'Implemented RESTful and GraphQL APIs',
          'Deployed applications on AWS and Vercel',
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Next.js'],
        order: 1,
      },
      {
        title: 'MERN Stack Developer',
        company: 'Tech Solutions',
        location: 'Pakistan',
        type: 'full-time',
        startDate: new Date('2022-06-01'),
        endDate: new Date('2023-01-01'),
        current: false,
        description: 'Developed full-stack web applications using MongoDB, Express, React, and Node.js.',
        highlights: [
          'Built a SaaS dashboard serving 500+ users',
          'Optimized database queries reducing load time by 40%',
          'Integrated third-party APIs including Stripe and AWS S3',
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redis', 'Docker'],
        order: 2,
      },
      {
        title: 'Frontend Developer',
        company: 'Startup Hub',
        location: 'Remote',
        type: 'contract',
        startDate: new Date('2021-09-01'),
        endDate: new Date('2022-06-01'),
        current: false,
        description: 'Designed and developed responsive user interfaces for web applications.',
        highlights: [
          'Created reusable component library used across 3 projects',
          'Improved Core Web Vitals scores by 60%',
          'Mentored 2 junior developers on React best practices',
        ],
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        order: 3,
      },
    ])
    console.log('3 experience entries created')
  } else {
    console.log(`${expCount} experience entries already exist`)
  }

  const testCount = await Testimonial.countDocuments()
  if (testCount === 0) {
    console.log('No testimonials seeded — add them via the admin dashboard.')
  } else {
    console.log(`${testCount} testimonial entries already exist`)
  }

  console.log('Seed complete!')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})
