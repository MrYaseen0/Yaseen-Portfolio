const cache = new Map()

function responseCache(ttlMs = 60000) {
  return (req, res, next) => {
    if (req.method !== 'GET') return next()

    const key = `${req.originalUrl}`
    const cached = cache.get(key)

    if (cached && Date.now() - cached.timestamp < ttlMs) {
      res.setHeader('X-Cache', 'HIT')
      return res.status(cached.status).json(cached.data)
    }

    const originalJson = res.json.bind(res)
    res.json = (data) => {
      cache.set(key, { data, status: res.statusCode, timestamp: Date.now() })
      res.setHeader('X-Cache', 'MISS')
      return originalJson(data)
    }

    next()
  }
}

function clearCache(pattern) {
  if (!pattern) {
    cache.clear()
    return
  }
  for (const key of cache.keys()) {
    if (key.includes(pattern)) cache.delete(key)
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, val] of cache.entries()) {
    if (now - val.timestamp > 300000) cache.delete(key)
  }
}, 60000)

module.exports = { responseCache, clearCache }
