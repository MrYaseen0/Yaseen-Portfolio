import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Briefcase, CheckCircle, MessageCircle } from 'lucide-react'
import api from '../api'

const services = [
  { value: 'web-development', label: '🌐 Web Development' },
  { value: 'mobile-development', label: '📱 Mobile Development' },
  { value: 'backend-engineering', label: '⚡ Backend Engineering' },
  { value: 'database-design', label: '🗄️ Database Design' },
  { value: 'ui-design', label: '🎨 UI/UX Design' },
  { value: 'saas-architecture', label: '☁️ SaaS Architecture' },
  { value: 'other', label: '💡 Other' },
]

const budgets = [
  { value: 'under-1000', label: 'Under $1,000' },
  { value: '1000-5000', label: '$1,000 - $5,000' },
  { value: '5000-10000', label: '$5,000 - $10,000' },
  { value: '10000-25000', label: '$10,000 - $25,000' },
  { value: '25000-plus', label: '$25,000+' },
  { value: 'discuss', label: "Let's Discuss" },
]

const timelines = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-weeks', label: '1-2 Weeks' },
  { value: '1-month', label: '1 Month' },
  { value: '2-3-months', label: '2-3 Months' },
  { value: 'flexible', label: 'Flexible' },
]

export default function HireModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    service: '', budget: '', timeline: '', description: '',
  })
  const [status, setStatus] = useState('idle')
  const modalRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !modalRef.current) return
      const focusable = modalRef.current.querySelectorAll('input, select, textarea, button, [href], [tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    const timer = setTimeout(() => { modalRef.current?.querySelector('input')?.focus() }, 100)
    return () => { document.removeEventListener('keydown', handleKeyDown); clearTimeout(timer) }
  }, [open, onClose])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const next = () => setStep(s => Math.min(s + 1, 3))
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.submitHire(form)
      setStatus('sent')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    background: '#FFF9F5',
    border: '1.5px solid #F0E6DE',
    borderRadius: 12,
    fontSize: 14,
    color: '#1A1A2E',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
  }

  const labelStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1A1A2E',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Hire Yaseen"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFFFFF', borderRadius: 24, width: '100%', maxWidth: 560,
              maxHeight: '90vh', overflow: 'auto', position: 'relative',
              boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 28px 16px', borderBottom: '1px solid #F0E6DE',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(232,67,147,0.08)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Briefcase size={20} color="#E84393" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, margin: 0, color: '#1A1A2E' }}>
                    Hire Yaseen
                  </h3>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                    Step {step} of 3
                  </p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={onClose} style={{
                  background: '#F5F0EB', border: 'none', borderRadius: 10,
                  width: 34, height: 34, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#4A4A68',
                }}>
                <X size={18} />
              </motion.button>
            </div>

            {/* Progress */}
            <div style={{ padding: '16px 28px 0' }}>
              <div style={{ height: 4, background: '#F0E6DE', borderRadius: 4 }}>
                <motion.div animate={{ width: `${(step / 3) * 100}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #E84393, #6CB4EE)', borderRadius: 4 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {status === 'sent' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ padding: '60px 28px', textAlign: 'center' }}>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                  <CheckCircle size={64} color="#25D366" />
                </motion.div>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 700, margin: '20px 0 8px', color: '#1A1A2E' }}>
                  Request Submitted!
                </h3>
                <p style={{ fontSize: 15, color: '#4A4A68', marginBottom: 24 }}>
                  Yaseen will review your project and get back to you within 24 hours.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href={`https://wa.me/923189370042?text=${encodeURIComponent(`Hi Yaseen! I just submitted a hire request for: ${form.service || 'a project'}. Let's discuss!`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: '12px 24px', background: '#25D366', border: 'none', borderRadius: 12,
                      color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                    }}>
                    <MessageCircle size={18} /> Chat on WhatsApp
                  </a>
                  <button onClick={onClose} style={{
                    padding: '12px 32px', background: '#E84393', border: 'none', borderRadius: 12,
                    color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}>Close</button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '20px 28px 24px' }}>
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600, margin: 0, color: '#1A1A2E' }}>
                      👋 Your Info
                    </h4>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} className="hire-input" placeholder="John Doe" value={form.name} onChange={e => update('name', e.target.value)} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input style={inputStyle} className="hire-input" type="email" placeholder="john@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input style={inputStyle} className="hire-input" placeholder="+1 234 567" value={form.phone} onChange={e => update('phone', e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Company</label>
                        <input style={inputStyle} className="hire-input" placeholder="Acme Inc." value={form.company} onChange={e => update('company', e.target.value)} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600, margin: 0, color: '#1A1A2E' }}>
                      🛠️ Project Details
                    </h4>
                    <div>
                      <label style={labelStyle}>Service Needed *</label>
                      <select style={selectStyle} className="hire-input" value={form.service} onChange={e => update('service', e.target.value)} required>
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Budget</label>
                        <select style={selectStyle} className="hire-input" value={form.budget} onChange={e => update('budget', e.target.value)}>
                          <option value="">Select budget...</option>
                          {budgets.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Timeline</label>
                        <select style={selectStyle} className="hire-input" value={form.timeline} onChange={e => update('timeline', e.target.value)}>
                          <option value="">Select timeline...</option>
                          {timelines.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600, margin: 0, color: '#1A1A2E' }}>
                      📝 Project Description
                    </h4>
                    <div>
                      <label style={labelStyle}>Tell me about your project *</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }}
                        className="hire-input"
                        placeholder="Describe your project, goals, and any specific requirements..."
                        value={form.description}
                        onChange={e => update('description', e.target.value)}
                        required
                      />
                    </div>
                    <div style={{
                      padding: '14px 16px', background: '#FFF0F6', border: '1px solid #F8C8DC',
                      borderRadius: 12, fontSize: 13, color: '#4A4A68', lineHeight: 1.6,
                    }}>
                      <strong style={{ color: '#E84393' }}>💡 Tip:</strong> The more details you provide, the faster Yaseen can respond with an accurate estimate.
                    </div>
                  </motion.div>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
                  {step > 1 ? (
                    <button type="button" onClick={prev} style={{
                      padding: '12px 24px', background: '#F5F0EB', border: 'none', borderRadius: 12,
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#4A4A68',
                    }}>← Back</button>
                  ) : <div />}

                  {step < 3 ? (
                    <button type="button" onClick={next} style={{
                      padding: '12px 28px', background: 'linear-gradient(135deg, #E84393, #FD79A8)', border: 'none',
                      borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'white',
                      boxShadow: '0 2px 10px rgba(232,67,147,0.25)',
                    }}>Next →</button>
                  ) : (
                    <button type="submit" disabled={status === 'sending'} style={{
                      padding: '12px 28px',
                      background: status === 'error' ? '#FF4757' : 'linear-gradient(135deg, #E84393, #6CB4EE)',
                      border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer', color: 'white',
                      boxShadow: '0 2px 10px rgba(232,67,147,0.25)', opacity: status === 'sending' ? 0.7 : 1,
                    }}>
                      {status === 'sending' ? '⏳ Submitting...' : status === 'error' ? '❌ Error — Retry' : '🚀 Submit Request'}
                    </button>
                  )}
                </div>
                {status === 'error' && (
                  <div role="alert" style={{ marginTop: 12, padding: '10px 14px', background: '#FFF0F0', border: '1px solid #FFD4D4', borderRadius: 8, fontSize: 13, color: '#D32F2F', textAlign: 'center' }}>
                    Failed to submit request. Please try again.
                  </div>
                )}
              </form>
            )}

            <style>{`
              .hire-input:focus {
                border-color: #E84393 !important;
                box-shadow: 0 0 0 3px rgba(232,67,147,0.08);
                background: #FFFFFF !important;
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
