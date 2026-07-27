import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, ExternalLink } from 'lucide-react'

export default function CalendlyModal({ open, onClose }) {
  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFF9F5', borderRadius: 20, width: '100%', maxWidth: 700,
            maxHeight: '90vh', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid #F0E6DE',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={20} color="#E84393" />
              <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                Book a Free Consultation
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                borderRadius: 8, color: '#9CA3AF',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Calendly embed or fallback */}
          {import.meta.env.VITE_CALENDLY_URL ? (
            <iframe
              src={`${import.meta.env.VITE_CALENDLY_URL}?embed_domain=${window.location.host}&embed_type=Inline`}
              style={{ width: '100%', minWidth: 320, height: 600, border: 'none' }}
              frameBorder="0"
              title="Book a consultation"
            />
          ) : (
            <div style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <Calendar size={48} color="#E84393" style={{ marginBottom: 16, opacity: 0.5 }} />
              <p style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 8, maxWidth: 400 }}>
                Add your Calendly URL to <code style={{ background: '#F0E6DE', padding: '2px 6px', borderRadius: 4, fontSize: 13 }}>VITE_CALENDLY_URL</code> in your env to enable inline booking.
              </p>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 24px', background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                  borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}
              >
                Open Calendly <ExternalLink size={14} />
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
