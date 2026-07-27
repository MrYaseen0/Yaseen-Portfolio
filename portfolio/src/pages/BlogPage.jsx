import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import BubbleAnimation from '../components/BubbleAnimation'
import api from '../api'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const categoryColors = {
  tutorial: '#6CB4EE',
  project: '#E84393',
  thoughts: '#9CA3AF',
  news: '#10b981',
  guide: '#F59E0B',
}

export default function BlogPage() {
  usePageMeta({
    title: 'Blog',
    description: 'Articles, tutorials, and insights on Full-Stack Development, React, Node.js, and modern web technologies.',
    path: '/blog',
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/blog?page=${page}&limit=6`)
      .then(res => {
        setPosts(res.data.data)
        setPagination(res.data.pagination)
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={15} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
            Blog
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.6 }}>
            Thoughts, tutorials, and insights on building for the web.
          </p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>No posts yet.</p>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>Check back soon for articles and tutorials.</p>
          </div>
        ) : (
          <>
            <motion.div variants={container} initial="hidden" animate="show" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 20,
            }}>
              {posts.map(post => (
                <motion.article key={post._id} variants={item} style={{
                  background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE',
                  overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
                }} whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                  {post.coverImage && (
                    <img src={post.coverImage} alt="" style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: `${categoryColors[post.category] || '#9CA3AF'}15`,
                        color: categoryColors[post.category] || '#9CA3AF',
                        textTransform: 'uppercase', letterSpacing: 0.5,
                      }}>{post.category}</span>
                      <span style={{ fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {post.readTime} min
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 8, lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {post.tags?.slice(0, 2).map(tag => (
                          <span key={tag} style={{ fontSize: 11, color: '#9CA3AF', background: '#F0E6DE', padding: '2px 8px', borderRadius: 6 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#E84393', fontWeight: 600 }}>
                        Read <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 40, height: 40, borderRadius: 10, border: '1px solid #F0E6DE',
                    background: p === page ? '#E84393' : '#FFFFFF',
                    color: p === page ? 'white' : '#6B7280',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
