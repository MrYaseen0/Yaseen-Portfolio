import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Globe, Smartphone, Server, Palette, Database, Shield, ArrowRight } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'

const services = [
  {
    icon: Globe, title: 'Web Development', path: '/services/web-development',
    description: 'Building fast, responsive web applications with React, Next.js, and modern frameworks.',
    color: '#E84393', bg: 'rgba(232,67,147,0.06)',
    features: ['React & Next.js', 'TypeScript', 'Performance Optimization'],
  },
  {
    icon: Smartphone, title: 'Mobile Development', path: '/services/mobile-development',
    description: 'Creating cross-platform mobile apps with React Native and modern mobile technologies.',
    color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)',
    features: ['React Native', 'iOS & Android', 'Responsive UI'],
  },
  {
    icon: Server, title: 'Backend Engineering', path: '/services/backend-engineering',
    description: 'Designing scalable APIs and server architectures with Node.js and modern databases.',
    color: '#E84393', bg: 'rgba(232,67,147,0.06)',
    features: ['Node.js & Express', 'REST & GraphQL', 'Microservices'],
  },
  {
    icon: Database, title: 'Database Design', path: '/services/database-design',
    description: 'Structuring efficient databases with PostgreSQL, MongoDB, and modern ORMs.',
    color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)',
    features: ['PostgreSQL', 'MongoDB', 'Prisma ORM'],
  },
  {
    icon: Palette, title: 'UI/UX Design', path: '/services/ui-design',
    description: 'Designing intuitive, beautiful interfaces with a focus on user experience.',
    color: '#E84393', bg: 'rgba(232,67,147,0.06)',
    features: ['Figma & Design Systems', 'Prototyping', 'User Research'],
  },
  {
    icon: Shield, title: 'SaaS Architecture', path: '/services/saas-architecture',
    description: 'Architecting scalable SaaS platforms with multi-tenancy and billing integration.',
    color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)',
    features: ['Multi-tenancy', 'Stripe Integration', 'Deployment'],
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ServicesPage() {
  usePageMeta({
    title: 'Services',
    description: 'Full-Stack Development Services — Web Development, Mobile Apps, Backend Engineering, Database Design, UI/UX, and SaaS Architecture.',
    path: '/services',
  })

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 100,
            background: 'rgba(232,67,147,0.06)', color: '#E84393',
            fontSize: 13, fontWeight: 600, letterSpacing: 0.5, marginBottom: 16,
          }}>What I Offer</span>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, color: '#1A1A2E',
            fontFamily: "'Space Grotesk', sans-serif", marginBottom: 16,
          }}>My Services</h1>
          <p style={{ fontSize: 17, color: '#9CA3AF', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Full-stack development services tailored to bring your ideas to life with modern technologies.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            gap: 24,
          }}
        >
          {services.map(s => (
            <motion.div key={s.path} variants={item}>
              <Link to={s.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: 32, background: '#FFFFFF', borderRadius: 20,
                  border: '1px solid #F0E6DE', height: '100%',
                  transition: 'all 0.3s ease', cursor: 'pointer',
                }} className="service-card">
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', background: s.bg, marginBottom: 20,
                  }}>
                    <s.icon size={26} color={s.color} />
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: '#1A1A2E', marginBottom: 10 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 16 }}>
                    {s.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {s.features.map(f => (
                      <span key={f} style={{
                        padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                        background: s.bg, color: s.color,
                      }}>{f}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: s.color }}>
                    Learn More <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            marginTop: 60, padding: 48, background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
            borderRadius: 24, textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            Need a Custom Solution?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
            Let's discuss your project and find the right approach.
          </p>
          <a href="/#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px',
            background: 'white', borderRadius: 100, fontSize: 15, fontWeight: 600,
            color: '#E84393', textDecoration: 'none', transition: 'transform 0.2s',
          }} className="service-cta-btn">
            Get in Touch <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>

      <style>{`
        .service-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(232,67,147,0.1); border-color: rgba(232,67,147,0.2); }
        .service-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )
}
