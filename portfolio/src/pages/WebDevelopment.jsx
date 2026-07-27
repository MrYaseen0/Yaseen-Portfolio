import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  'Server-Side Rendering & Static Generation',
  'API Routes & Middleware',
  'Database Integration with Prisma',
  'Authentication & Authorization',
  'Payment Integration (Stripe)',
  'Real-time Features with WebSockets',
  'SEO Optimization & Meta Tags',
  'Performance Monitoring & Analytics',
]

const techStack = [
  { name: 'Next.js', level: 95, color: '#1A1A2E' },
  { name: 'React', level: 95, color: '#6CB4EE' },
  { name: 'TypeScript', level: 90, color: '#3178C6' },
  { name: 'Tailwind CSS', level: 95, color: '#38BDF8' },
  { name: 'Prisma', level: 85, color: '#E84393' },
  { name: 'Vercel', level: 90, color: '#1A1A2E' },
]

export default function WebDevelopment() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(rgba(232,67,147,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px', pointerEvents: 'none',
        }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,67,147,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E84393', fontWeight: 600, fontSize: 14, transition: 'gap 0.2s' }} className="back-link">
                <ArrowLeft size={18} /> Back to Home
              </Link>
              <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6CB4EE', fontWeight: 600, fontSize: 14, transition: 'gap 0.2s' }} className="back-link">
                View All Services
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FFF0F6', border: '1px solid #F8C8DC', borderRadius: 100, marginBottom: 20 }}>
              <Globe size={16} color="#E84393" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393' }}>Web Development</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.15, marginBottom: 16 }}>
              Building Modern <br />
              <span style={{ background: 'linear-gradient(135deg, #E84393, #6CB4EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Web Applications</span>
            </h1>
            <p style={{ fontSize: 18, color: '#4A4A68', lineHeight: 1.8, maxWidth: 600 }}>
              Creating fast, responsive, and scalable web applications using React, Next.js, and modern frameworks. From concept to deployment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>What's Included</h2>
            <p style={{ fontSize: 16, color: '#9CA3AF' }}>Every web project includes these capabilities</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="features-grid-sub">
            {features.map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 12, transition: 'all 0.2s' }}
                className="feature-item"
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(232,67,147,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={16} color="#E84393" />
                </div>
                <span style={{ fontSize: 15, fontWeight: 500, color: '#1A1A2E' }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '80px 24px', background: '#FFF9F5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="tech-grid-sub">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>Tech Stack</h2>
              <p style={{ fontSize: 16, color: '#4A4A68', lineHeight: 1.8 }}>
                I use the latest technologies to build performant, scalable web applications. Each tool is chosen specifically for the project's needs.
              </p>
            </motion.div>
            <div>
              {techStack.map((tech, i) => (
                <motion.div key={tech.name} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{ marginBottom: 20 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{tech.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393' }}>{tech.level}%</span>
                  </div>
                  <div style={{ width: '100%', height: 8, background: '#FFF0F6', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${tech.level}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #E84393, #6CB4EE)', borderRadius: 4 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .back-link:hover { gap: 12px !important; }
        .feature-item:hover { border-color: #F8C8DC; box-shadow: 0 2px 12px rgba(232,67,147,0.06); }
        @media (max-width: 768px) {
          .features-grid-sub { grid-template-columns: 1fr !important; }
          .tech-grid-sub { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
