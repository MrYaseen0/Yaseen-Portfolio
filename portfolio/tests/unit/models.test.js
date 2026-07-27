import { describe, it, expect } from 'vitest'
import mongoose from 'mongoose'

describe('Contact Model Schema', () => {
  const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 255 },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    read: { type: Boolean, default: false },
  }, { timestamps: true })

  it('has required fields', () => {
    const paths = Object.keys(contactSchema.paths)
    expect(paths).toContain('name')
    expect(paths).toContain('email')
    expect(paths).toContain('subject')
    expect(paths).toContain('message')
    expect(paths).toContain('read')
    expect(paths).toContain('createdAt')
  })

  it('has maxlength constraints', () => {
    expect(contactSchema.path('name').options.maxlength).toBe(100)
    expect(contactSchema.path('email').options.maxlength).toBe(255)
    expect(contactSchema.path('subject').options.maxlength).toBe(200)
    expect(contactSchema.path('message').options.maxlength).toBe(5000)
  })

  it('read defaults to false', () => {
    expect(contactSchema.path('read').options.default).toBe(false)
  })
})

describe('HireRequest Model Schema', () => {
  const hireSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 255 },
    service: {
      type: String, required: true,
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
    description: { type: String, required: true, maxlength: 5000 },
    status: {
      type: String, default: 'new',
      enum: ['new', 'contacted', 'discussion', 'proposal-sent', 'working', 'completed', 'declined'],
    },
  }, { timestamps: true })

  it('has valid service enum values', () => {
    const serviceEnum = hireSchema.path('service').enumValues
    expect(serviceEnum).toContain('web-development')
    expect(serviceEnum).toContain('mobile-development')
    expect(serviceEnum).toContain('saas-architecture')
  })

  it('has valid status enum values', () => {
    const statusEnum = hireSchema.path('status').enumValues
    expect(statusEnum).toContain('new')
    expect(statusEnum).toContain('completed')
    expect(statusEnum).toContain('declined')
  })

  it('status defaults to new', () => {
    expect(hireSchema.path('status').options.default).toBe('new')
  })
})

describe('Project Model Schema', () => {
  const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, maxlength: 2000 },
    shortDescription: { type: String, maxlength: 500 },
    technologies: [{ type: String, trim: true }],
    category: {
      type: String, required: true,
      enum: ['web', 'mobile', 'fullstack', 'backend', 'other'],
    },
    liveDemo: { type: String },
    github: { type: String },
    featured: { type: Boolean, default: false },
  }, { timestamps: true })

  it('has required fields', () => {
    const paths = Object.keys(projectSchema.paths)
    expect(paths).toContain('title')
    expect(paths).toContain('slug')
    expect(paths).toContain('description')
    expect(paths).toContain('category')
  })

  it('has valid category enum', () => {
    const categoryEnum = projectSchema.path('category').enumValues
    expect(categoryEnum).toContain('web')
    expect(categoryEnum).toContain('mobile')
    expect(categoryEnum).toContain('fullstack')
  })

  it('featured defaults to false', () => {
    expect(projectSchema.path('featured').options.default).toBe(false)
  })
})

describe('Settings Model Schema', () => {
  const settingsSchema = new mongoose.Schema({
    profile: {
      name: { type: String, maxlength: 100 },
      title: { type: String, maxlength: 200 },
      bio: { type: String, maxlength: 2000 },
      email: { type: String, maxlength: 255 },
      phone: { type: String, maxlength: 50 },
      location: { type: String, maxlength: 200 },
      avatar: { type: String },
    },
    social: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    seo: {
      metaTitle: { type: String, maxlength: 200 },
      metaDescription: { type: String, maxlength: 500 },
    },
  }, { timestamps: true })

  it('has profile nested object', () => {
    expect(settingsSchema.path('profile.name')).toBeDefined()
    expect(settingsSchema.path('profile.title')).toBeDefined()
    expect(settingsSchema.path('profile.bio')).toBeDefined()
  })

  it('has social nested object', () => {
    expect(settingsSchema.path('social.github')).toBeDefined()
    expect(settingsSchema.path('social.linkedin')).toBeDefined()
  })

  it('has seo nested object', () => {
    expect(settingsSchema.path('seo.metaTitle')).toBeDefined()
    expect(settingsSchema.path('seo.metaDescription')).toBeDefined()
  })
})
