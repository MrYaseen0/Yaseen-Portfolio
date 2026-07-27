import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit3, Trash2, Eye, EyeOff, Save, X } from 'lucide-react'
import usePageMeta from '../../hooks/usePageMeta'
import api from '../../api'

const categories = ['tutorial', 'project', 'thoughts', 'news', 'guide']

function PostEditor({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    tags: post?.tags?.join(', ') || '',
    category: post?.category || 'thoughts',
    published: post?.published || false,
  })
  const [saving, setSaving] = useState(false)

  const handleSlugGenerate = () => {
    setForm(f => ({ ...f, slug: f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      if (post?._id) {
        await api.put(`/blog/${post._id}`, data)
      } else {
        await api.post('/blog', data)
      }
      onSave()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
      background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 24, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>
          {post?._id ? 'Edit Post' : 'New Post'}
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} onBlur={handleSlugGenerate}
              style={inputStyle} placeholder="Post title" />
          </div>
          <div>
            <label style={labelStyle}>Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              style={inputStyle} placeholder="post-slug" />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            style={{ ...inputStyle, minHeight: 60 }} placeholder="Brief summary..." />
        </div>

        <div>
          <label style={labelStyle}>Content (Markdown)</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            style={{ ...inputStyle, minHeight: 300, fontFamily: 'monospace', fontSize: 13 }}
            placeholder="Write your post content here..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              style={inputStyle} placeholder="react, nodejs, tutorial" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#4A4A68' }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
              Published
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ ...btnStyle, background: '#F0E6DE', color: '#4A4A68' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={{ ...btnStyle, background: 'linear-gradient(135deg, #E84393, #FD79A8)', color: 'white' }}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, color: '#9CA3AF', marginBottom: 6, fontWeight: 600 }
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #F0E6DE', borderRadius: 10, fontSize: 14, outline: 'none', background: '#FFF9F5' }
const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' }

export default function BlogEditor() {
  usePageMeta({ title: 'Blog Editor', path: '/admin/blog' })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = list, 'new' = new post, {_id} = edit
  const [filter, setFilter] = useState('all')

  const loadPosts = () => {
    setLoading(true)
    api.get('/blog?limit=50')
      .then(res => setPosts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPosts() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    await api.delete(`/blog/${id}`)
    loadPosts()
  }

  const handleTogglePublish = async (post) => {
    await api.put(`/blog/${post._id}`, { published: !post.published })
    loadPosts()
  }

  const filtered = filter === 'all' ? posts : posts.filter(p => filter === 'published' ? p.published : !p.published)

  if (editing !== null) {
    return (
      <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#FFF9F5' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <Link to="/admin/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
            <ArrowLeft size={16} /> Back to Posts
          </Link>
          <PostEditor
            post={editing === 'new' ? null : editing}
            onSave={() => { setEditing(null); loadPosts() }}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#FFF9F5' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Admin
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 700, color: '#1A1A2E' }}>Blog Posts</h1>
          <button onClick={() => setEditing('new')} style={{ ...btnStyle, background: 'linear-gradient(135deg, #E84393, #FD79A8)', color: 'white' }}>
            <Plus size={16} /> New Post
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['all', 'published', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 20, border: '1px solid #F0E6DE',
              background: filter === f ? '#E84393' : '#FFFFFF',
              color: filter === f ? 'white' : '#6B7280',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>No posts found.</div>
        ) : (
          filtered.map(post => (
            <motion.div key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
              background: '#FFFFFF', borderRadius: 14, border: '1px solid #F0E6DE',
              padding: '16px 20px', marginBottom: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: post.published ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)', color: post.published ? '#10b981' : '#9CA3AF', fontWeight: 600 }}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>{post.category}</span>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{post.title}</h4>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '4px 0 0' }}>{post.excerpt?.slice(0, 80)}...</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleTogglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'}
                  style={{ ...iconBtnStyle, color: post.published ? '#10b981' : '#9CA3AF' }}>
                  {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => setEditing(post)} title="Edit" style={{ ...iconBtnStyle, color: '#6CB4EE' }}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => handleDelete(post._id)} title="Delete" style={{ ...iconBtnStyle, color: '#EF4444' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

const iconBtnStyle = { background: 'none', border: '1px solid #F0E6DE', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }
