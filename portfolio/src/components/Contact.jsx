import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, MapPin, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon, TiktokIcon } from './SocialIcons'
import api from '../api'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'yaseenahmad.exe@gmail.com', href: 'mailto:yaseenahmad.exe@gmail.com' },
  { icon: Phone, label: 'Phone / WhatsApp', value: '+92 318 937 0042', href: 'https://wa.me/923189370042' },
  { icon: MapPin, label: 'Location', value: 'Peshawar, Pakistan', href: '#' },
]

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/MrYaseen0', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/yaseen-ahmad-489967280', label: 'LinkedIn' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaseenahmadexe', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://www.facebook.com/share/1HN9vegPhd/', label: 'Facebook' },
  { icon: TiktokIcon, href: 'https://www.tiktok.com/@mryaseen.exe', label: 'TikTok' },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.website) return
    setStatus('sending')
    try {
      await api.submitContact(formData)
      setStatus('sent')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    background: '#FFF9F5',
    border: '1.5px solid #F0E6DE',
    borderRadius: 12,
    fontSize: 15,
    color: '#1A1A2E',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  }

  return (
    <section id="contact" style={{
      padding: '100px 24px',
      position: 'relative',
      background: '#FFFFFF',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <div className="section-label" style={{ display: 'inline-flex' }}>
            <span style={{ fontSize: 16 }}>💬</span> Contact
          </div>
          <h2 className="section-title" style={{ margin: '0 auto 16px' }}>
            Let's Work <span style={{
              background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Together</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Have a project in mind? Let's discuss how I can help bring your ideas to life.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 40,
          alignItems: 'start',
        }} className="contact-grid">
          {/* Left - Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              padding: '32px 28px',
              background: '#FFF9F5',
              border: '1px solid #F0E6DE',
              borderRadius: 16,
              marginBottom: 24,
            }}>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 24,
                color: '#1A1A2E',
              }}>Get in Touch</h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}>
                {contactInfo.map(info => (
                  <a
                    key={info.label}
                    href={info.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '12px 16px',
                      background: '#FFFFFF',
                      border: '1px solid #F0E6DE',
                      borderRadius: 12,
                      transition: 'all 0.2s',
                    }}
                    className="contact-info-item"
                  >
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'rgba(232,67,147,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <info.icon size={20} color="#E84393" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500 }}>{info.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A2E' }}>{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div style={{
              padding: '28px',
              background: '#FFF9F5',
              border: '1px solid #F0E6DE',
              borderRadius: 16,
            }}>
              <h4 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 20,
                color: '#1A1A2E',
              }}>Follow Me</h4>
              <div style={{
                display: 'flex',
                gap: 12,
              }}>
                {socialLinks.map(social => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      border: '1px solid #F0E6DE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9CA3AF',
                      transition: 'all 0.2s',
                      background: '#FFFFFF',
                    }}
                    className="contact-social-link"
                    title={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
              <a
                href="https://wa.me/923189370042?text=Hi%20Yaseen!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '14px 20px',
                  background: '#25D366',
                  border: 'none',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: 16,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                className="whatsapp-contact-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right - Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                padding: '36px 32px',
                background: '#FFF9F5',
                border: '1px solid #F0E6DE',
                borderRadius: 16,
              }}
            >
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 28,
                color: '#1A1A2E',
              }}>Send a Message</h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }} className="form-grid">
                <div>
                  <label htmlFor="contact-name" className="sr-only">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="sr-only">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginBottom: 16 }}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="sr-only">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{
                    ...inputStyle,
                    marginBottom: 24,
                    resize: 'vertical',
                    minHeight: 140,
                  }}
                  className="form-input"
                  required
                />
              </div>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  background: status === 'sent'
                    ? 'linear-gradient(135deg, #25D366, #20BA5C)'
                    : status === 'error'
                    ? 'linear-gradient(135deg, #FF4757, #FF6B81)'
                    : 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'white',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 16px rgba(232,67,147,0.25)',
                  opacity: status === 'sending' ? 0.7 : 1,
                }}
                className="submit-btn"
              >
                {status === 'sending' ? '⏳ Sending...' : status === 'sent' ? '✅ Message Sent!' : status === 'error' ? '❌ Failed — Try Again' : <><Send size={18} /> Send Message</>}
              </button>
              {status === 'error' && (
                <div role="alert" style={{ marginTop: 12, padding: '10px 14px', background: '#FFF0F0', border: '1px solid #FFD4D4', borderRadius: 8, fontSize: 13, color: '#D32F2F', textAlign: 'center' }}>
                  Failed to send message. Please try again or contact directly via email.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        .form-input:focus {
          border-color: #E84393 !important;
          box-shadow: 0 0 0 3px rgba(232,67,147,0.08);
          background: #FFFFFF !important;
        }
        .form-input::placeholder { color: #B0B0C8; }
        .contact-info-item:hover {
          border-color: #F8C8DC !important;
          box-shadow: 0 2px 12px rgba(232,67,147,0.06);
        }
        .contact-social-link:hover {
          border-color: #E84393 !important;
          color: #E84393 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(232,67,147,0.1);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(232,67,147,0.3);
        }
        .whatsapp-contact-btn:hover {
          background: #20BA5C !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(37,211,102,0.3);
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
