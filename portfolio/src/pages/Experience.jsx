import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, MapPin, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import BubbleAnimation from '../components/BubbleAnimation'
import usePageMeta from '../hooks/usePageMeta'
import api from '../api'

function formatDate(d) {
  if (!d) return 'Present'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function Experience() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  usePageMeta({
    title: 'Experience',
    description: 'Professional experience of Yaseen Ahmad — Full-Stack Developer with expertise in MERN stack, SaaS architecture, and cloud solutions.',
    path: '/experience',
  })

  useEffect(() => {
    api.getExperiences()
      .then(res => setExperiences(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const typeColors = {
    'full-time': '#E84393',
    'part-time': '#6CB4EE',
    'freelance': '#FD79A8',
    'contract': '#A8D8EA',
    'internship': '#FFD700',
    'volunteer': '#25D366',
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={14} />

      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#9CA3AF',
              textDecoration: 'none', marginBottom: 32,
            }} className="back-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FFF0F6', borderRadius: 100, marginBottom: 16 }}>
              <Briefcase size={16} color="#E84393" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393', textTransform: 'uppercase', letterSpacing: 1 }}>Experience</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
              Work <span style={{
                background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>History</span>
            </h1>
            <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 500, margin: '0 auto' }}>
              My professional journey and career milestones
            </p>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : experiences.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE' }}>
              <Briefcase size={40} color="#F0E6DE" style={{ marginBottom: 16 }} />
              <p style={{ color: '#9CA3AF', fontSize: 16 }}>Experience details coming soon.</p>
              <p style={{ color: '#B0B0C8', fontSize: 13, marginTop: 4 }}>Check back later for my work history.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 40 }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
                background: 'linear-gradient(180deg, #E84393, #6CB4EE)',
                borderRadius: 1,
              }} />

              {experiences.map((exp, i) => (
                <motion.div key={exp._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ marginBottom: 32, position: 'relative' }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: -33, top: 20,
                    width: 14, height: 14, borderRadius: '50%',
                    background: typeColors[exp.type] || '#E84393',
                    border: '3px solid #FFF9F5',
                    boxShadow: `0 0 0 2px ${typeColors[exp.type] || '#E84393'}40`,
                  }} />

                  <div style={{
                    padding: '24px', background: '#FFFFFF', border: '1px solid #F0E6DE',
                    borderRadius: 16, transition: 'all 0.3s',
                  }} className="experience-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{exp.title}</h3>
                      <span style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600,
                        background: `${typeColors[exp.type] || '#E84393'}10`,
                        color: typeColors[exp.type] || '#E84393',
                        textTransform: 'capitalize',
                      }}>{exp.type?.replace('-', ' ')}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#E84393' }}>
                        {exp.company}
                      </span>
                      {exp.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#9CA3AF' }}>
                          <MapPin size={13} /> {exp.location}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 13, color: '#9CA3AF' }}>
                      <Calendar size={13} />
                      <span>{formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                    </div>

                    {exp.description && (
                      <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.7, marginBottom: 12 }}>{exp.description}</p>
                    )}

                    {exp.highlights?.length > 0 && (
                      <ul style={{ margin: '0 0 12px', paddingLeft: 18 }}>
                        {exp.highlights.map((h, j) => (
                          <li key={j} style={{ fontSize: 13, color: '#4A4A68', lineHeight: 1.7, marginBottom: 4 }}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {exp.technologies.map((t, j) => (
                          <span key={j} style={{
                            padding: '3px 10px', background: '#FFF0F6', border: '1px solid #F8C8DC',
                            borderRadius: 100, fontSize: 11, fontWeight: 500, color: '#E84393',
                          }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .experience-card:hover { border-color: #F8C8DC; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(232,67,147,0.08); }
        .back-link:hover { color: #E84393 !important; }
      `}</style>
    </div>
  )
}
