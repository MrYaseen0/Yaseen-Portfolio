import { useEffect } from 'react'

const SITE_NAME = 'Yaseen Ahmad | Full-Stack Developer'
const DEFAULT_DESCRIPTION = 'Full-Stack Developer specializing in MERN stack. Building production-grade SaaS applications and web apps.'
const DEFAULT_IMAGE = 'https://yaseenahmad.dev/assets/developer-pic.jpg'
const BASE_URL = 'https://yaseenahmad.dev'

export default function usePageMeta({ title, description, image, path, type = 'website' } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME
    const desc = description || DEFAULT_DESCRIPTION
    const img = image || DEFAULT_IMAGE
    const url = path ? `${BASE_URL}${path}` : BASE_URL

    document.title = fullTitle

    const setMeta = (name, content, property = false) => {
      const attr = property ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', desc)
    setMeta('og:title', fullTitle, true)
    setMeta('og:description', desc, true)
    setMeta('og:image', img, true)
    setMeta('og:url', url, true)
    setMeta('og:type', type, true)
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', img)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [title, description, image, path, type])
}
