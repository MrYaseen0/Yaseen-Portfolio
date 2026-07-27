import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Star, GitFork, Calendar, Code2, Layers, Zap, Clock, Download, Eye, Shield, Globe, Smartphone } from 'lucide-react'
import { GithubIcon } from '../components/SocialIcons'
import { Link, useParams } from 'react-router-dom'
import BubbleAnimation from '../components/BubbleAnimation'
import usePageMeta from '../hooks/usePageMeta'
import api from '../api'

const gradients = [
  'linear-gradient(135deg, #E84393 0%, #FD79A8 100%)',
  'linear-gradient(135deg, #6CB4EE 0%, #A8D8EA 100%)',
  'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
  'linear-gradient(135deg, #FD79A8 0%, #E84393 100%)',
  'linear-gradient(135deg, #A8D8EA 0%, #6CB4EE 100%)',
  'linear-gradient(135deg, #6CB4EE 0%, #E84393 100%)',
]

const defaultTechIcons = [Globe, Shield, Layers, Zap, Smartphone, Globe]

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [allProjects, setAllProjects] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  usePageMeta({
    title: project?.title,
    description: project?.description,
    path: `/project/${slug}`,
    type: 'article',
  })

  useEffect(() => {
    setLoading(true)
    api.getProjectBySlug(slug)
      .then(res => {
        const p = res.data
        if (p) {
          setProject({
            ...p,
            gradient: p.gradient || gradients[0],
            tags: p.tags || [],
            features: p.features || [],
            techDetails: p.techDetails || [],
            caseStudy: p.caseStudy || null,
            github: p.github || 'https://github.com/MrYaseen0',
            stars: p.stars || 0,
            forks: p.forks || 0,
            watchers: p.watchers || 0,
            language: p.language || 'JavaScript',
            updated: p.updated || '',
            created: p.created || '',
            size: p.size || '',
            license: p.license || 'MIT',
          })
        }
      })
      .catch(() => setProject(null))

    api.getAllProjects()
      .then(res => {
        const projects = res.data || []
        const map = {}
        projects.forEach(p => { map[p.slug] = p })
        setAllProjects(map)
      })
      .catch(() => {})

    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF9F5' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393', borderRadius: '50%' }} />
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF9F5' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, color: '#1A1A2E', marginBottom: 16 }}>Project not found</h2>
          <Link to="/" style={{ color: '#E84393', fontWeight: 600 }}>&larr; Back to Home</Link>
        </div>
      </div>
    )
  }

  const otherProjects = Object.entries(allProjects).filter(([key]) => key !== slug)

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={14} />

      {/* Hero Banner */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E84393', fontWeight: 600, fontSize: 14, marginBottom: 32 }} className="back-link">
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Gradient Banner */}
            <div style={{ height: 220, background: project.gradient, borderRadius: 20, position: 'relative', overflow: 'hidden', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.12)', top: -80, right: -60 }} />
              <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.08)', bottom: -40, left: -40 }} />
              <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.06)', top: 30, left: 60 }} />
              <div style={{ textAlign: 'center', zIndex: 1, padding: '0 20px' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>{project.title}</span>
                {project.subtitle && <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8, fontWeight: 500 }}>{project.subtitle}</div>}
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 24, padding: '16px 20px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 14 }}>
              {project.stars > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><Star size={16} color="#E84393" /> {project.stars} Stars</span>}
              {project.forks > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><GitFork size={16} color="#6CB4EE" /> {project.forks} Forks</span>}
              {project.watchers > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><Eye size={16} color="#E84393" /> {project.watchers} Watchers</span>}
              {project.language && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><Code2 size={16} color="#6CB4EE" /> {project.language}</span>}
              {project.updated && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><Clock size={16} color="#E84393" /> Updated {project.updated}</span>}
              {project.size && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#4A4A68' }}><Download size={16} color="#E84393" /> {project.size}</span>}
            </div>

            <p style={{ fontSize: 17, color: '#4A4A68', lineHeight: 1.8, marginBottom: 24 }}>{project.description}</p>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {project.tags.map(t => (
                  <span key={t} style={{ padding: '6px 14px', background: '#FFF0F6', border: '1px solid #F8C8DC', borderRadius: 100, fontSize: 13, fontWeight: 500, color: '#E84393' }}>{t}</span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#1A1A2E', borderRadius: 12, color: '#FFFFFF', fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
                className="project-action-btn"
              ><GithubIcon size={18} /> View on GitHub</a>
              {project.liveDemo && (
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 12, color: '#1A1A2E', fontWeight: 600, fontSize: 15, transition: 'all 0.2s' }}
                  className="project-action-btn-secondary"
                ><ExternalLink size={18} /> Live Demo</a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Details */}
      {project.techDetails.length > 0 && (
        <section style={{ padding: '60px 24px', background: '#FFFFFF', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Tech Stack</h2>
              <p style={{ fontSize: 15, color: '#9CA3AF' }}>Technologies used in this project</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="tech-detail-grid">
              {project.techDetails.map((t, i) => {
                const Icon = t.icon || defaultTechIcons[i % defaultTechIcons.length]
                return (
                  <motion.div key={t.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 12, transition: 'all 0.2s' }}
                    className="tech-detail-card"
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: i % 2 === 0 ? 'rgba(232,67,147,0.06)' : 'rgba(108,180,238,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} color={i % 2 === 0 ? '#E84393' : '#6CB4EE'} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{t.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.value}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Features</h2>
              <p style={{ fontSize: 15, color: '#9CA3AF' }}>What this project includes</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="project-features-grid">
              {project.features.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 12, transition: 'all 0.2s' }}
                  className="project-feature-item"
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: i % 2 === 0 ? '#E84393' : '#6CB4EE', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A2E' }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Study */}
      {project.caseStudy && (
        <section style={{ padding: '60px 24px', background: '#FFFFFF', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Case Study</h2>
              <p style={{ fontSize: 15, color: '#9CA3AF' }}>How this project solves real problems</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="case-study-grid">
              {[
                { label: 'Problem', text: project.caseStudy.problem, color: '#E84393', emoji: '01' },
                { label: 'Solution', text: project.caseStudy.solution, color: '#6CB4EE', emoji: '02' },
                { label: 'Outcome', text: project.caseStudy.outcome, color: '#25D366', emoji: '03' },
              ].map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ padding: '24px 20px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 14 }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: `${item.color}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                    fontSize: 14, fontWeight: 800, color: item.color,
                  }}>{item.emoji}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>{item.label}</h3>
                  <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.7 }}>{item.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Hire CTA */}
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{
                marginTop: 32, padding: '24px 32px', background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
                borderRadius: 16, textAlign: 'center', color: 'white',
              }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Need a similar solution?</h3>
              <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>I can build custom applications tailored to your business needs.</p>
              <a href="/#contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                background: 'white', borderRadius: 100, color: '#E84393', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', transition: 'all 0.2s',
              }} className="hire-cta-btn">Hire Me</a>
            </motion.div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      {otherProjects.length > 0 && (
        <section style={{ padding: '60px 24px', background: '#FFFFFF', position: 'relative', zIndex: 2 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
          <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 32 }}>Other Projects</motion.h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              {otherProjects.map(([key, p]) => (
                <Link key={key} to={`/projects/${key}`}
                  style={{ padding: '10px 20px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 100, fontSize: 14, fontWeight: 500, color: '#4A4A68', transition: 'all 0.2s' }}
                  className="other-project-link"
                >{p.title}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .back-link:hover { gap: 12px !important; }
        .project-action-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(26,26,46,0.2); }
        .project-action-btn-secondary:hover { border-color: #E84393; color: #E84393; }
        .tech-detail-card:hover { border-color: #F8C8DC; }
        .project-feature-item:hover { border-color: #F8C8DC; }
        .other-project-link:hover { border-color: #E84393; color: #E84393; background: #FFF0F6; }
        .hire-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(255,255,255,0.3); }
        @media (max-width: 768px) {
          .project-features-grid, .tech-detail-grid, .case-study-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
