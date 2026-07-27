import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, User, Briefcase, Server, Mail, X, Star, MessageSquare, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'

const menuItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'About', path: '/about', icon: User },
  { label: 'Services', path: '/services', icon: Server },
  { label: 'Projects', path: '/#projects', icon: Briefcase },
  { label: 'Experience', path: '/experience', icon: Star },
  { label: 'Pricing', path: '/pricing', icon: Briefcase },
  { label: 'Blog', path: '/blog', icon: MessageSquare },
  { label: 'Testimonials', path: '/testimonials', icon: MessageSquare },
  { label: 'Contact', path: '/#contact', icon: Mail },
]

const socialItems = [
  { icon: GithubIcon, href: 'https://github.com/MrYaseen0', label: 'GitHub', color: '#1A1A2E' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/yaseen-ahmad-489967280', label: 'LinkedIn', color: '#0a66c2' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaseenahmadexe', label: 'Instagram', color: '#E84393' },
  { icon: FacebookIcon, href: 'https://www.facebook.com/share/1HN9vegPhd/', label: 'Facebook', color: '#1877f2' },
]

export default function Drawer({ open, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const drawerRef = useRef(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape' && open) onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const handleNavClick = (path) => {
    onClose()
    if (path.startsWith('/#')) {
      const id = path.slice(2)
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.4)',
          backdropFilter: 'blur(4px)', zIndex: 2000,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer - Right side */}
      <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Navigation menu" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
        background: 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 100%)',
        zIndex: 2001, padding: '32px 24px',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid #F0E6DE',
        boxShadow: open ? '-8px 0 40px rgba(232,67,147,0.08)' : 'none',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
          <Link to="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/stamp-logo.jpg" alt="Logo" style={{ height: 34, width: 34, borderRadius: 8 }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#1A1A2E' }}>
              Yaseen Ahmad<span style={{ color: '#E84393' }}>.</span>
            </span>
          </Link>
          <button onClick={onClose} aria-label="Close menu" style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 8 }}>
            <X size={22} />
          </button>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {menuItems.map(item => {
            const isHash = item.path.startsWith('/#')
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname === item.path
            return isHash ? (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, fontSize: 15, fontWeight: 600, transition: 'all 0.2s',
                  background: 'transparent', color: '#4A4A68',
                  border: '1px solid transparent', cursor: 'pointer', width: '100%', textAlign: 'left',
                }}
                className="drawer-item"
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, fontSize: 15, fontWeight: 600, transition: 'all 0.2s',
                  background: isActive ? 'rgba(232,67,147,0.06)' : 'transparent',
                  color: isActive ? '#E84393' : '#4A4A68',
                  border: isActive ? '1px solid rgba(232,67,147,0.12)' : '1px solid transparent',
                }}
                className="drawer-item"
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Social links */}
        <div style={{ borderTop: '1px solid #F0E6DE', paddingTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>Connect</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {socialItems.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #F0E6DE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', background: '#FFFFFF', transition: 'all 0.2s' }}
                className="drawer-social" title={s.label}
              ><s.icon size={16} /></a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .drawer-item:hover { background: rgba(232,67,147,0.04) !important; color: #E84393 !important; }
        .drawer-service-item:hover { background: #FFF0F6 !important; color: #E84393 !important; }
        .drawer-social:hover { border-color: #E84393 !important; color: #E84393 !important; transform: translateY(-2px); }
      `}</style>
    </>
  )
}
