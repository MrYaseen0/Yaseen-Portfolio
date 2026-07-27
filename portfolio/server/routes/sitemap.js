const express = require('express')
const router = express.Router()
const Project = require('../models/Project')

const BASE_URL = 'https://yaseenahmad.dev'

const staticPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'monthly', priority: '0.8' },
  { path: '/services/web-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/mobile-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/backend-engineering', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/database-design', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/ui-design', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/saas-architecture', changefreq: 'monthly', priority: '0.7' },
  { path: '/experience', changefreq: 'monthly', priority: '0.6' },
  { path: '/testimonials', changefreq: 'monthly', priority: '0.6' },
  { path: '/pricing', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/github', changefreq: 'weekly', priority: '0.7' },
]

router.get('/sitemap.xml', async (req, res) => {
  try {
    const projects = await Project.find().select('slug updatedAt').sort({ order: 1 })

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for (const page of staticPages) {
      xml += `  <url>\n`
      xml += `    <loc>${BASE_URL}${page.path}</loc>\n`
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
      xml += `    <priority>${page.priority}</priority>\n`
      xml += `  </url>\n`
    }

    for (const project of projects) {
      const lastmod = project.updatedAt ? project.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      xml += `  <url>\n`
      xml += `    <loc>${BASE_URL}/project/${project.slug}</loc>\n`
      xml += `    <lastmod>${lastmod}</lastmod>\n`
      xml += `    <changefreq>monthly</changefreq>\n`
      xml += `    <priority>0.7</priority>\n`
      xml += `  </url>\n`
    }

    xml += '</urlset>'

    res.header('Content-Type', 'application/xml')
    res.send(xml)
  } catch {
    res.status(500).send('Error generating sitemap')
  }
})

module.exports = router
