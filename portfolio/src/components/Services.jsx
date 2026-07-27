import React from 'react'
import { motion } from 'framer-motion'
import { Globe, Smartphone, Server, Palette, Database, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

const services = [
  { icon: Globe, title: 'Web Development', description: 'Building fast, responsive web applications with React, Next.js, and modern frameworks.', color: '#E84393', bg: 'rgba(232,67,147,0.06)', features: ['React & Next.js', 'TypeScript', 'Performance'], path: '/services/web-development' },
  { icon: Smartphone, title: 'Mobile Development', description: 'Creating cross-platform mobile apps with React Native and modern mobile technologies.', color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)', features: ['React Native', 'iOS & Android', 'Responsive UI'], path: '/services/mobile-development' },
  { icon: Server, title: 'Backend Engineering', description: 'Designing scalable APIs and server architectures with Node.js and modern databases.', color: '#E84393', bg: 'rgba(232,67,147,0.06)', features: ['Node.js & Express', 'REST & GraphQL', 'Microservices'], path: '/services/backend-engineering' },
  { icon: Database, title: 'Database Design', description: 'Structuring efficient databases with PostgreSQL, MongoDB, and modern ORMs.', color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)', features: ['PostgreSQL', 'MongoDB', 'Prisma ORM'], path: '/services/database-design' },
  { icon: Palette, title: 'UI/UX Design', description: 'Designing intuitive, beautiful interfaces with focus on user experience and accessibility.', color: '#E84393', bg: 'rgba(232,67,147,0.06)', features: ['Figma & Design', 'Tailwind CSS', 'Accessibility'], path: '/services/ui-design' },
  { icon: Shield, title: 'SaaS Architecture', description: 'Building production-grade SaaS products with authentication, billing, and scaling.', color: '#6CB4EE', bg: 'rgba(108,180,238,0.06)', features: ['Auth & Billing', 'Multi-tenancy', 'CI/CD Pipelines'], path: '/services/saas-architecture' },
]

export default function Services() {
  return (
    <section id="services" style={{ padding: '100px 24px', position: 'relative', background: '#FFF9F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="section-label" style={{ display: 'inline-flex' }}><span style={{ fontSize: 16 }}>⚡</span> Services</div>
          <h2 className="section-title" style={{ margin: '0 auto 16px' }}>What I <span style={{ background: 'linear-gradient(135deg, #E84393, #6CB4EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Offer</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Specialized services to bring your digital ideas to life with cutting-edge technology.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="services-grid">
          {services.map((service, i) => (
            <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ padding: '36px 28px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 16, transition: 'all 0.3s', cursor: 'pointer' }} className="service-card">
              <Link to={service.path} style={{ display: 'block' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: service.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <service.icon size={26} color={service.color} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#1A1A2E' }}>{service.title}</h3>
                <p style={{ fontSize: 15, color: '#9CA3AF', lineHeight: 1.7, marginBottom: 20 }}>{service.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {service.features.map(f => (
                    <span key={f} style={{ padding: '5px 12px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 100, fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>{f}</span>
                  ))}
                </div>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: service.color }}>
                  Learn More <span style={{ transition: 'transform 0.2s' }} className="arrow">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .service-card:hover { border-color: #F8C8DC !important; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(232,67,147,0.08); }
        .service-card:hover .arrow { transform: translateX(4px); }
        @media (max-width: 768px) { .services-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
