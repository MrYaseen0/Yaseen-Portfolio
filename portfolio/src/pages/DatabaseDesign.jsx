import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Database } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  'PostgreSQL & MongoDB design',
  'Prisma & Drizzle ORM',
  'Data modeling & normalization',
  'Query optimization & indexing',
  'Database migrations & seeding',
  'Connection pooling & caching',
  'Backup & recovery strategies',
  'Real-time data synchronization',
]

const techStack = [
  { name: 'PostgreSQL', level: 88 },
  { name: 'MongoDB', level: 90 },
  { name: 'Prisma', level: 85 },
  { name: 'Redis', level: 78 },
  { name: 'Supabase', level: 85 },
  { name: 'Firebase', level: 82 },
]

export default function DatabaseDesign() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <div style={{ minHeight: '100vh', paddingTop: 72 }}>
      <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(108,180,238,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#E84393', fontWeight: 600, fontSize: 14, marginBottom: 32 }} className="back-link"><ArrowLeft size={18} /> Back to Home</Link></motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, marginBottom: 20 }}>
              <Database size={16} color="#6CB4EE" /><span style={{ fontSize: 13, fontWeight: 600, color: '#6CB4EE' }}>Database Design</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: '#1A1A2E', lineHeight: 1.15, marginBottom: 16 }}>
              Efficient <span style={{ background: 'linear-gradient(135deg, #6CB4EE, #A8D8EA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Data Architecture</span>
            </h1>
            <p style={{ fontSize: 18, color: '#4A4A68', lineHeight: 1.8, maxWidth: 600 }}>Structuring efficient databases that power your applications. From schema design to optimization.</p>
          </motion.div>
        </div>
      </section>
      <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="tech-grid-sub">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 24 }}>Capabilities</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {features.map((f, i) => (
                  <motion.div key={f} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 12 }} className="feature-item">
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(108,180,238,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} color="#6CB4EE" /></div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A2E' }}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 24 }}>Tech Stack</h2>
              {techStack.map((tech, i) => (
                <motion.div key={tech.name} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{tech.name}</span><span style={{ fontSize: 13, fontWeight: 600, color: '#6CB4EE' }}>{tech.level}%</span></div>
                  <div style={{ width: '100%', height: 8, background: '#EFF6FF', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${tech.level}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.1, ease: 'easeOut' }} style={{ height: '100%', background: 'linear-gradient(90deg, #6CB4EE, #A8D8EA)', borderRadius: 4 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <style>{`.back-link:hover{gap:12px!important;}.feature-item:hover{border-color:#BFDBFE;box-shadow:0 2px 12px rgba(108,180,238,0.06);}@media(max-width:768px){.tech-grid-sub{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}
