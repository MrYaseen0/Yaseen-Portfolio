import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import BubbleAnimation from '../components/BubbleAnimation'
import usePageMeta from '../hooks/usePageMeta'
import api from '../api'

const fallbackTestimonials = [
  { name: 'Sarah Johnson', role: 'CEO', company: 'TechStart', content: 'Yaseen delivered our SaaS dashboard ahead of schedule. His attention to detail and clean code made our product launch a huge success.', rating: 5 },
  { name: 'Ahmed Khan', role: 'Founder', company: 'E-Shop PK', content: 'Built our entire e-commerce platform from scratch. Professional, responsive, and delivers quality work. Highly recommended!', rating: 5 },
  { name: 'Maria Garcia', role: 'Product Manager', company: 'InnovateCo', content: 'Working with Yaseen was a great experience. He understood our requirements perfectly and built exactly what we needed.', rating: 5 },
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  usePageMeta({
    title: 'Testimonials',
    description: 'Client testimonials and reviews for Yaseen Ahmad — Full-Stack Developer specializing in MERN stack.',
    path: '/testimonials',
  })

  useEffect(() => {
    api.getTestimonials()
      .then(res => setTestimonials(res.data.length > 0 ? res.data : fallbackTestimonials))
      .catch(() => setTestimonials(fallbackTestimonials))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={14} />

      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
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
              <Quote size={16} color="#E84393" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393', textTransform: 'uppercase', letterSpacing: 1 }}>Testimonials</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
              Client <span style={{
                background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Reviews</span>
            </h1>
            <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 500, margin: '0 auto' }}>
              What clients say about working with me
            </p>
          </motion.div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonials-grid">
              {testimonials.map((t, i) => (
                <motion.div key={t._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    padding: '28px 24px', background: '#FFFFFF', border: '1px solid #F0E6DE',
                    borderRadius: 16, display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s',
                  }}
                  className="testimonial-card"
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={16} color={j < (t.rating || 5) ? '#FFD700' : '#F0E6DE'} fill={j < (t.rating || 5) ? '#FFD700' : 'none'} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.8, flex: 1, marginBottom: 20, fontStyle: 'italic' }}>
                    "{t.content}"
                  </p>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid #F0E6DE', paddingTop: 16 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10, background: `hsl(${i * 60}, 70%, 92%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 700, color: `hsl(${i * 60}, 60%, 45%)`,
                    }}>
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                        {t.role}{t.company ? ` @ ${t.company}` : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{
              marginTop: 48, padding: '32px', background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
              borderRadius: 16, textAlign: 'center', color: 'white',
            }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Ready to start your project?</h2>
            <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 20 }}>Let's build something great together.</p>
            <a href="/#contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
              background: 'white', borderRadius: 100, color: '#E84393', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }} className="hire-cta-btn">Hire Me</a>
          </motion.div>
        </div>
      </section>

      <style>{`
        .testimonial-card:hover { border-color: #F8C8DC; transform: translateY(-3px); box-shadow: 0 6px 24px rgba(232,67,147,0.08); }
        .back-link:hover { color: #E84393 !important; }
        .hire-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(255,255,255,0.3); }
        @media (max-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
