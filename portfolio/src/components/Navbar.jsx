import React, { useState, useEffect } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import ScrollLink from './ScrollLink'

const serviceLinks = [
  { label: 'Web Development', path: '/services/web-development' },
  { label: 'Mobile Development', path: '/services/mobile-development' },
  { label: 'Backend Engineering', path: '/services/backend-engineering' },
  { label: 'Database Design', path: '/services/database-design' },
  { label: 'UI/UX Design', path: '/services/ui-design' },
  { label: 'SaaS Architecture', path: '/services/saas-architecture' },
]

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services', hasDropdown: true },
  { label: 'Projects', href: '/#projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar({ onMenuClick, onHireClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav aria-label="Main navigation" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 24px', height: 72,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: scrolled || !isHome ? 'rgba(255,249,245,0.92)' : 'transparent',
      backdropFilter: scrolled || !isHome ? 'blur(20px) saturate(180%)' : 'none',
      borderBottom: scrolled || !isHome ? '1px solid rgba(240,230,222,0.8)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo + Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 20, fontFamily: "'Space Grotesk', sans-serif" }}>
            <img src="/assets/stamp-logo.jpg" alt="Yaseen Ahmad" style={{ height: 36, width: 36, borderRadius: 8, objectFit: 'cover' }} />
            <span style={{ color: '#1A1A2E' }}>Yaseen Ahmad</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="nav-links-desktop">
            {navLinks.map(link => (
              link.hasDropdown ? (
                <div key={link.href} style={{ position: 'relative' }}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500, color: '#4A4A68', transition: 'color 0.2s', cursor: 'pointer' }} className="nav-link">
                    {link.label} <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </span>
                  {dropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: -12, marginTop: 8, padding: '8px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 14, boxShadow: '0 8px 32px rgba(232,67,147,0.1)', minWidth: 220, zIndex: 100 }}
                      className="dropdown-menu">
                      {serviceLinks.map(s => (
                        <Link key={s.path} to={s.path} style={{ display: 'block', padding: '10px 16px', fontSize: 14, fontWeight: 500, color: '#4A4A68', borderRadius: 10, transition: 'all 0.15s' }} className="dropdown-item">{s.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <ScrollLink key={link.href} to={link.href} style={{ fontSize: 14, fontWeight: 500, color: '#4A4A68', transition: 'color 0.2s', position: 'relative', textDecoration: 'none' }} className="nav-link">{link.label}</ScrollLink>
              )
            ))}
          </div>
        </div>

        {/* Right: CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onHireClick} aria-label="Open hire form" style={{ padding: '10px 20px', background: '#1A1A2E', borderRadius: 100, fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} className="nav-hire-btn">
            Hire Me
          </button>
          <ScrollLink href={isHome ? '#contact' : '/#contact'} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)', borderRadius: 100, fontSize: 14, fontWeight: 600, color: 'white', border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none' }} className="nav-cta">
            Let's Talk
          </ScrollLink>
          <button onClick={onMenuClick} style={{ background: 'none', border: 'none', color: '#1A1A2E', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hamburger-btn" title="Menu">
            <Menu size={22} />
          </button>
        </div>
      </div>

      <style>{`
        .nav-link:hover { color: #E84393 !important; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: linear-gradient(135deg, #E84393, #6CB4EE); transition: width 0.3s ease; border-radius: 1px; }
        .nav-link:hover::after { width: 100%; }
        .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(232,67,147,0.35); }
        .nav-hire-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(26,26,46,0.3); }
        .dropdown-item:hover { background: #FFF0F6 !important; color: #E84393 !important; }
        .hamburger-btn:hover { color: #E84393 !important; }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
