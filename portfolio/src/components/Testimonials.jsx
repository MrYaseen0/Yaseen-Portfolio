import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BubbleAnimation from './BubbleAnimation'
import api from '../api'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    api.getTestimonials()
      .then(res => setTestimonials(res.data || []))
      .catch(() => {})
  }, [])

  return (
    <section id="testimonials" style={{ padding: '100px 24px', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={10} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FFF0F6', borderRadius: 100, marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>💬</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393', textTransform: 'uppercase', letterSpacing: 1 }}>Testimonials</span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            What Clients <span style={{
              background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Say</span>
          </h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 500, margin: '0 auto' }}>
            Feedback from clients and collaborators who trusted me with their projects
          </p>
        </motion.div>

        {testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <Quote size={48} color="#F0E6DE" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8 }}>Testimonials coming soon.</p>
            <p style={{ fontSize: 14, color: '#B0B0C8' }}>Check back after Yaseen's next client project.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div key={t._id || t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{
                  padding: '28px 24px', background: '#FFF9F5', border: '1px solid #F0E6DE',
                  borderRadius: 16, position: 'relative', transition: 'all 0.3s',
                }}
                className="testimonial-card"
              >
                <Quote size={28} color="#F8C8DC" style={{ position: 'absolute', top: 16, right: 16 }} />
                <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                  {Array.from({ length: t.rating || 5 }).map((_, j) => (
                    <Star key={j} size={14} color="#FFD700" fill="#FFD700" />
                  ))}
                </div>
                <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i % 2 === 0 ? 'rgba(232,67,147,0.08)' : 'rgba(108,180,238,0.08)',
                    fontWeight: 700, fontSize: 14, color: i % 2 === 0 ? '#E84393' : '#6CB4EE',
                  }}>{t.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{t.role}{t.company ? `, ${t.company}` : ''}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {testimonials.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/testimonials" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 24px', background: '#FFFFFF', border: '1.5px solid #F0E6DE',
              borderRadius: 100, fontSize: 14, fontWeight: 600, color: '#E84393',
              textDecoration: 'none', transition: 'all 0.2s',
            }} className="testimonials-viewall">
              View All Testimonials <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .testimonial-card:hover { border-color: #F8C8DC; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(232,67,147,0.08); }
        @media (max-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
