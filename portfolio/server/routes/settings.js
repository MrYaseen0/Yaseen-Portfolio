const express = require('express')
const { auth, adminOnly } = require('../middleware/auth')
const { responseCache, clearCache } = require('../middleware/cache')
const router = express.Router()
const Settings = require('../models/Settings')

// GET /api/settings - public (returns public settings only)
router.get('/', responseCache(10 * 60 * 1000), async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }
    res.json({
      success: true,
      data: {
        profile: settings.profile,
        social: settings.social,
        seo: settings.seo,
        homepage: settings.homepage,
      },
    })
  } catch {
    res.status(500).json({ error: 'Failed to fetch settings' })
  }
})

// PUT /api/settings - admin only (update settings)
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings({})
    }

    const allowedProfile = ['name', 'title', 'bio', 'email', 'phone', 'location', 'timezone', 'avatar']
    const allowedSocial = ['github', 'linkedin', 'instagram', 'facebook', 'twitter', 'tiktok', 'whatsapp']
    const allowedSeo = ['title', 'description', 'keywords', 'ogImage']
    const allowedHomepage = ['heroTitle', 'heroSubtitle', 'availableForWork', 'ctaText']

    const { profile, social, seo, homepage } = req.body
    if (profile) {
      for (const key of allowedProfile) {
        if (profile[key] !== undefined) settings.profile[key] = profile[key]
      }
    }
    if (social) {
      for (const key of allowedSocial) {
        if (social[key] !== undefined) settings.social[key] = social[key]
      }
    }
    if (seo) {
      for (const key of allowedSeo) {
        if (seo[key] !== undefined) settings.seo[key] = seo[key]
      }
    }
    if (homepage) {
      for (const key of allowedHomepage) {
        if (homepage[key] !== undefined) settings.homepage[key] = homepage[key]
      }
    }

    await settings.save()
    clearCache('/api/settings')
    res.json({ success: true, data: settings })
  } catch {
    res.status(500).json({ error: 'Failed to update settings' })
  }
})

module.exports = router
