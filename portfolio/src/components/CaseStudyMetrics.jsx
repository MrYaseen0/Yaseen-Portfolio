import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react'

const iconMap = {
  performance: TrendingUp,
  speed: Clock,
  revenue: DollarSign,
  users: Users,
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CaseStudyMetrics({ metrics = [] }) {
  if (!metrics || metrics.length === 0) return null

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16, margin: '32px 0',
      }}
    >
      {metrics.map((m, i) => {
        const Icon = iconMap[m.type] || TrendingUp
        return (
          <motion.div key={i} variants={item} style={{
            background: '#FFFFFF', borderRadius: 14, padding: '20px 16px',
            border: '1px solid #F0E6DE', textAlign: 'center',
          }}>
            <Icon size={20} color="#E84393" style={{ marginBottom: 8 }} />
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 28, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
              {m.value}
            </div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{m.label}</div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
