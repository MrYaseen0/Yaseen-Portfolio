import React from 'react'
import { motion } from 'framer-motion'
import BubbleAnimation from './BubbleAnimation'

const skillCategories = [
  {
    title: 'Frontend',
    color: '#E84393',
    bg: 'rgba(232,67,147,0.06)',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'HTML/CSS', level: 98 },
      { name: 'JavaScript', level: 95 },
    ],
  },
  {
    title: 'Backend',
    color: '#6CB4EE',
    bg: 'rgba(108,180,238,0.06)',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 88 },
      { name: 'Python', level: 80 },
      { name: 'REST APIs', level: 92 },
      { name: 'GraphQL', level: 78 },
    ],
  },
  {
    title: 'Database & Tools',
    color: '#E84393',
    bg: 'rgba(232,67,147,0.06)',
    skills: [
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 88 },
      { name: 'Prisma', level: 85 },
      { name: 'Git/GitHub', level: 92 },
      { name: 'Docker', level: 75 },
      { name: 'Vercel', level: 90 },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" style={{
      padding: '80px 24px',
      position: 'relative',
      background: '#FFF9F5',
    }}>
      <BubbleAnimation count={14} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div className="section-label" style={{ display: 'inline-flex' }}>
            <span style={{ fontSize: 16 }}>🛠️</span> Tech Stack
          </div>
          <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
            My <span style={{
              background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Skills</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Technologies and tools I work with to build amazing products.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }} className="skills-grid">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.15, duration: 0.5 }}
              style={{
                padding: '32px 28px',
                background: '#FFFFFF',
                border: '1px solid #F0E6DE',
                borderRadius: 16,
                transition: 'all 0.3s',
              }}
              className="skill-category-card"
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 28,
              }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: cat.color,
                  boxShadow: `0 0 8px ${cat.color}30`,
                }} />
                <h3 style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1A1A2E',
                }}>{cat.title}</h3>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}>
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#4A4A68' }}>{skill.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{skill.level}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: 6,
                      background: '#FFF0F6',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: ci * 0.15 + si * 0.05, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}AA)`,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .skill-category-card:hover {
          border-color: #F8C8DC !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(232,67,147,0.08);
        }
        @media (max-width: 768px) {
          .skills-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
