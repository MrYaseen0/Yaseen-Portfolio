const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'MrYaseen0'
let reposCache = { data: null, timestamp: 0 }
let statsCache = { data: null, timestamp: 0 }
const CACHE_TTL = 30 * 60 * 1000

const githubLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many GitHub requests.' },
})

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timer)
    return res
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

// GET /api/github/repos - fetch user repos
router.get('/repos', githubLimiter, async (req, res) => {
  try {
    if (reposCache.data && Date.now() - reposCache.timestamp < CACHE_TTL) {
      return res.json({ success: true, data: reposCache.data, cached: true })
    }

    const response = await fetchWithTimeout(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
      { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Portfolio-App' } }
    )

    if (!response.ok) throw new Error('GitHub API error')

    const repos = await response.json()
    const data = repos.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage,
      language: r.language,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      watchers_count: r.watchers_count,
      topics: r.topics,
      created_at: r.created_at,
      updated_at: r.updated_at,
      size: r.size,
      default_branch: r.default_branch,
      fork: r.fork,
    }))

    reposCache = { data, timestamp: Date.now() }
    res.json({ success: true, data })
  } catch {
    if (reposCache.data) {
      return res.json({ success: true, data: reposCache.data, cached: true, stale: true })
    }
    res.status(500).json({ error: 'Failed to fetch GitHub repos.' })
  }
})

// GET /api/github/stats - user stats
router.get('/stats', githubLimiter, async (req, res) => {
  try {
    if (statsCache.data && Date.now() - statsCache.timestamp < CACHE_TTL) {
      return res.json({ success: true, data: statsCache.data, cached: true })
    }

    const response = await fetchWithTimeout(
      `https://api.github.com/users/${GITHUB_USERNAME}`,
      { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Portfolio-App' } }
    )

    if (!response.ok) throw new Error('GitHub API error')
    const user = await response.json()

    const data = {
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      public_gists: user.public_gists,
      created_at: user.created_at,
    }

    statsCache = { data, timestamp: Date.now() }
    res.json({ success: true, data })
  } catch {
    if (statsCache.data) {
      return res.json({ success: true, data: statsCache.data, cached: true, stale: true })
    }
    res.status(500).json({ error: 'Failed to fetch GitHub stats.' })
  }
})

module.exports = router
