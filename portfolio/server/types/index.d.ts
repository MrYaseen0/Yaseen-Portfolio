import { Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  role: 'admin'
  lastLogin?: Date
  loginAttempts: number
  lockedUntil?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

export interface ISession extends Document {
  user: any
  refreshToken: string
  userAgent?: string
  ip?: string
  lastActivity: Date
  expiresAt: Date
  revokedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IActivity extends Document {
  user?: any
  action: string
  ip?: string
  userAgent?: string
  details?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  ip?: string
  createdAt: Date
  updatedAt: Date
}

export interface IHireRequest extends Document {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget?: string
  timeline?: string
  description: string
  status: string
  notes: Array<{ text: string; createdAt: Date }>
  ip?: string
  createdAt: Date
  updatedAt: Date
}

export interface IProject extends Document {
  title: string
  slug: string
  subtitle?: string
  description: string
  gradient: string
  tags: string[]
  features: string[]
  techDetails: Array<{ label: string; value: string }>
  caseStudy?: {
    problem?: string
    solution?: string
    outcome?: string
  }
  github?: string
  liveDemo?: string
  language?: string
  stars: number
  forks: number
  watchers: number
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface IExperience extends Document {
  title: string
  company: string
  location?: string
  type: string
  startDate: Date
  endDate?: Date
  current: boolean
  description?: string
  highlights: string[]
  technologies: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface ITestimonial extends Document {
  name: string
  role?: string
  company?: string
  avatar?: string
  content: string
  rating: number
  project?: string
  featured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface ISettings extends Document {
  profile: {
    name: string
    title: string
    bio: string
    email: string
    phone: string
    location: string
    timezone: string
    avatar: string
  }
  social: {
    github: string
    linkedin: string
    instagram: string
    facebook: string
    twitter: string
    tiktok: string
    whatsapp: string
  }
  seo: {
    title: string
    description: string
    keywords: string
    ogImage: string
    canonical: string
  }
  homepage: {
    heroTitle: string
    heroSubtitle: string
    availableForWork: boolean
    ctaText: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface IVisitor extends Document {
  ip?: string
  userAgent?: string
  page?: string
  referrer?: string
  createdAt: Date
  updatedAt: Date
}
