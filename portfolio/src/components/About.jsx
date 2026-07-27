import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Layers, Zap, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import BubbleAnimation from './BubbleAnimation'

const stats = [
  { value: '1K+', label: 'Followers', icon: Users, color: '#E84393' },
  { value: '50+', label: 'Projects', icon: Layers, color: '#6CB4EE' },
  { value: '3+', label: 'Years Experience', icon: Code2, color: '#E84393' },
  { value: '100%', label: 'Dedication', icon: Zap, color: '#6CB4EE' },
]

const highlights = [
  'Full-Stack Development',
  'SaaS Applications',
  'React & Next.js',
  'TypeScript',
  'Node.js',
  'Tailwind CSS',
]

export default function About() {
  return (
    <section id="about" style={{
      padding: '80px 24px',
      position: 'relative',
      background: '#FFFFFF',
    }}>
      <BubbleAnimation count={16} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          marginBottom: 80,
        }} className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: '32px 24px',
                background: '#FFF9F5',
                border: '1px solid #F0E6DE',
                borderRadius: 16,
                textAlign: 'center',
                transition: 'all 0.3s',
              }}
              className="stat-card"
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: stat.color === '#E84393' ? 'rgba(232,67,147,0.08)' : 'rgba(108,180,238,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <stat.icon size={24} color={stat.color} />
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 36,
                fontWeight: 700,
                marginBottom: 4,
                background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* About content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }} className="about-grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label">
              <span style={{ fontSize: 16 }}>👋</span> About Me
            </div>
            <h2 className="section-title">
              Turning Ideas Into<br />
              <span style={{
                background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Digital Reality</span>
            </h2>
            <p style={{
              fontSize: 17,
              color: '#4A4A68',
              lineHeight: 1.8,
              marginBottom: 24,
            }}>
              I'm Yaseen Ahmad, a Full-Stack Developer and Software Engineering Student from Peshawar, Pakistan. 
              I specialize in building production-grade SaaS applications using modern web technologies.
            </p>
            <p style={{
              fontSize: 17,
              color: '#4A4A68',
              lineHeight: 1.8,
              marginBottom: 32,
            }}>
              With expertise in Next.js, TypeScript, and React, I create scalable, performant applications 
              that solve real-world problems. I'm passionate about clean code, great UX, and continuous learning.
            </p>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              {highlights.map(tag => (
                <span key={tag} style={{
                  padding: '8px 16px',
                  background: '#FFF0F6',
                  border: '1px solid #F8C8DC',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#E84393',
                }}>{tag}</span>
              ))}
            </div>

            <Link to="/experience" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20,
              padding: '10px 20px', background: '#FFFFFF', border: '1.5px solid #F0E6DE',
              borderRadius: 100, fontSize: 14, fontWeight: 600, color: '#E84393',
              textDecoration: 'none', transition: 'all 0.2s',
            }} className="about-exp-btn">
              View Experience <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              position: 'relative',
            }}
          >
            {/* Code block visual */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #F0E6DE',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(232,67,147,0.06)',
            }}>
              {/* Window header */}
              <div style={{
                padding: '14px 18px',
                borderBottom: '1px solid #F0E6DE',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFF9F5',
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF6B6B' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFD93D' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#6BCB77' }} />
                <span style={{ marginLeft: 12, fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>developer.tsx</span>
              </div>
              {/* Code content */}
              <pre style={{
                padding: 24,
                fontSize: 14,
                lineHeight: 1.9,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                color: '#4A4A68',
                overflow: 'auto',
                background: '#FFFFFF',
              }}>
                <code>{`const developer = {
  name: "Yaseen Ahmad",
  role: "Full-Stack Developer",
  location: "Peshawar, PK",
  skills: [
    "React", "Next.js", "TypeScript",
    "Node.js", "Tailwind CSS",
    "PostgreSQL", "MongoDB"
  ],
  passion: "Building SaaS apps",
  status: "🟢 Available for work"
};

export default developer;`}</code>
              </pre>
            </div>

            {/* Floating decorative elements */}
            <div style={{
              position: 'absolute',
              top: -16,
              right: -16,
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(232,67,147,0.1), rgba(108,180,238,0.1))',
              border: '1px solid rgba(232,67,147,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <Code2 size={28} color="#E84393" />
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .stat-card:hover {
          border-color: #F8C8DC !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(232,67,147,0.08);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
