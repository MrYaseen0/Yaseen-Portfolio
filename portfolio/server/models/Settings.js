const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  profile: {
    name: { type: String, default: 'Yaseen Ahmad', maxlength: 100 },
    title: { type: String, default: 'Full-Stack Developer', maxlength: 200 },
    bio: { type: String, default: '', maxlength: 2000 },
    email: { type: String, default: '', maxlength: 200 },
    phone: { type: String, default: '', maxlength: 50 },
    location: { type: String, default: 'Peshawar, Pakistan', maxlength: 200 },
    timezone: { type: String, default: 'UTC +5:00', maxlength: 50 },
    avatar: { type: String, default: '/assets/developer-pic.png', maxlength: 500 },
  },
  social: {
    github: { type: String, default: 'https://github.com/MrYaseen0', maxlength: 500 },
    linkedin: { type: String, default: 'https://linkedin.com/in/yaseen-ahmad-489967280', maxlength: 500 },
    instagram: { type: String, default: 'https://instagram.com/yaseenahmadexe', maxlength: 500 },
    facebook: { type: String, default: 'https://www.facebook.com/share/1HN9vegPhd/', maxlength: 500 },
    twitter: { type: String, default: '', maxlength: 500 },
    tiktok: { type: String, default: 'https://tiktok.com/@mryaseen.exe', maxlength: 500 },
    whatsapp: { type: String, default: '923189370042', maxlength: 50 },
  },
  seo: {
    title: { type: String, default: 'Yaseen Ahmad | Full-Stack Developer', maxlength: 200 },
    description: { type: String, default: 'Full-Stack Developer specializing in MERN stack. Building production-grade SaaS applications and web apps.', maxlength: 500 },
    keywords: { type: String, default: 'Yaseen Ahmad, Full-Stack Developer, MERN Stack, React Developer, Node.js, MongoDB', maxlength: 500 },
    ogImage: { type: String, default: '/assets/developer-pic.png', maxlength: 500 },
    canonical: { type: String, default: 'https://yaseenahmad.dev', maxlength: 500 },
  },
  homepage: {
    heroTitle: { type: String, default: 'I build scalable web applications that help businesses grow.', maxlength: 300 },
    heroSubtitle: { type: String, default: 'Full-Stack Developer specializing in MERN stack, SaaS architecture, and modern cloud solutions.', maxlength: 500 },
    availableForWork: { type: Boolean, default: true },
    ctaText: { type: String, default: 'Hire Me', maxlength: 50 },
  },
}, { timestamps: true })

module.exports = mongoose.model('Settings', settingsSchema)
