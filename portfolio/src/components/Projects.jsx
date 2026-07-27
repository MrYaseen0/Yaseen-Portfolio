import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api'

const fallbackProjects = [
  { slug: 'saas-dashboard', title: 'SaaS Dashboard', description: 'A full-featured SaaS dashboard with authentication, analytics, and subscription management.', tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], gradient: 'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)', github: 'https://github.com/MrYaseen0' },
  { slug: 'ecommerce-platform', title: 'E-Commerce Platform', description: 'Modern e-commerce solution with cart, checkout, and admin panel for inventory management.', tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'], gradient: 'linear-gradient(135deg, #6CB4EE 0%, #A8D8EA 100%)', github: 'https://github.com/MrYaseen0' },
  { slug: 'ai-content-generator', title: 'AI Content Generator', description: 'AI-powered content creation tool using OpenAI API for generating blog posts and marketing copy.', tags: ['Next.js', 'OpenAI', 'Prisma', 'Vercel'], gradient: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)', github: 'https://github.com/MrYaseen0' },
  { slug: 'social-media-app', title: 'Social Media App', description: 'Real-time social platform with posts, comments, messaging, and notification system.', tags: ['React', 'Firebase', 'Socket.io', 'Material UI'], gradient: 'linear-gradient(135deg, #FD79A8 0%, #E84393 100%)', github: 'https://github.com/MrYaseen0' },
  { slug: 'portfolio-generator', title: 'Portfolio Generator', description: 'Dynamic portfolio builder allowing developers to create and deploy portfolios in minutes.', tags: ['Next.js', 'MDX', 'Tailwind', 'Vercel'], gradient: 'linear-gradient(135deg, #A8D8EA 0%, #6CB4EE 100%)', github: 'https://github.com/MrYaseen0' },
  { slug: 'task-management', title: 'Task Management', description: 'Kanban-style project management tool with drag-and-drop, deadlines, and team collaboration.', tags: ['React', 'DnD Kit', 'Zustand', 'Supabase'], gradient: 'linear-gradient(135deg, #6CB4EE 0%, #E84393 100%)', github: 'https://github.com/MrYaseen0' },
]

const gradients = [
  'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
  'linear-gradient(135deg, #6CB4EE 0%, #A8D8EA 100%)',
  'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
  'linear-gradient(135deg, #FD79A8 0%, #E84393 100%)',
  'linear-gradient(135deg, #A8D8EA 0%, #6CB4EE 100%)',
  'linear-gradient(135deg, #6CB4EE 0%, #E84393 100%)',
]

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    api.getAllProjects()
      .then(res => {
        const data = res.data || []
        if (data.length > 0) {
          setProjects(data.map((p, i) => ({
            ...p,
            gradient: p.gradient || gradients[i % gradients.length],
            tags: p.tags || [],
            github: p.github || 'https://github.com/MrYaseen0',
          })))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="projects" style={{ padding: '80px 24px', position: 'relative', background: '#FFFFFF' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label" style={{ display: 'inline-flex' }}><span style={{ fontSize: 16 }}>🚀</span> Portfolio</div>
          <h2 className="section-title" style={{ margin: '0 auto 16px' }}>Featured <span style={{ background: 'linear-gradient(135deg, #E84393, #6CB4EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projects</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>A showcase of my recent work and personal projects.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="projects-grid">
          {projects.map((project, i) => (
            <motion.div key={project.slug || project.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }} className="project-card">
              <Link to={`/projects/${project.slug}`} style={{ display: 'block' }}>
                <div style={{ height: 160, background: project.gradient || gradients[i % gradients.length], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)', top: -50, right: -50 }} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.95)', zIndex: 1, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{project.title}</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 16 }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {(project.tags || []).map(tag => (
                      <span key={tag} style={{ padding: '4px 10px', background: '#FFF0F6', border: '1px solid #F8C8DC', borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#E84393' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#E84393' }}>
                    View Details <span className="project-arrow" style={{ transition: 'transform 0.2s' }}>→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="https://github.com/MrYaseen0" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 100, fontSize: 15, fontWeight: 600, color: '#1A1A2E', transition: 'all 0.2s' }} className="view-all-btn">
            View All on GitHub <ArrowUpRight size={18} />
          </a>
        </motion.div>
      </div>
      <style>{`
        .project-card:hover { border-color: #F8C8DC !important; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(232,67,147,0.1); }
        .project-card:hover .project-arrow { transform: translateX(4px); }
        .view-all-btn:hover { border-color: #E84393 !important; color: #E84393 !important; }
        @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
