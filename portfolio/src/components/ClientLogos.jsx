import React from 'react'
import { motion } from 'framer-motion'

const defaultLogos = [
  { name: 'Client 1', url: '/logos/client1.svg' },
  { name: 'Client 2', url: '/logos/client2.svg' },
  { name: 'Client 3', url: '/logos/client3.svg' },
  { name: 'Client 4', url: '/logos/client4.svg' },
  { name: 'Client 5', url: '/logos/client5.svg' },
]

export default function ClientLogos({ logos = defaultLogos, title = 'Trusted By' }) {
  if (!logos || logos.length === 0) return null

  return (
    <section style={{ padding: '48px 0', background: '#FFF9F5' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 24 }}>
          {title}
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 48, flexWrap: 'wrap',
          }}
        >
          {logos.map((logo, i) => (
            <motion.img
              key={i}
              src={logo.url}
              alt={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{ height: 32, objectFit: 'contain', filter: 'grayscale(100%)' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
