import React from 'react'
import { Heart, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollLink from './ScrollLink'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/MrYaseen0', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/yaseen-ahmad-489967280', label: 'LinkedIn' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaseenahmadexe', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://www.facebook.com/share/1HN9vegPhd/', label: 'Facebook' },
]

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'GitHub', path: '/github' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{
      padding: '60px 24px 30px',
      borderTop: '1px solid #F0E6DE',
      position: 'relative',
      background: '#FFF9F5',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: 48,
          marginBottom: 48,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontWeight: 700,
              fontSize: 22,
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: 16,
            }}>
              <img
                src="/assets/stamp-logo.jpg"
                alt="Yaseen Ahmad"
                style={{ height: 40, width: 40, borderRadius: 10, objectFit: 'cover' }}
              />
              <span style={{ color: '#1A1A2E' }}>Yaseen<span style={{ color: '#E84393' }}>.</span></span>
            </Link>
            <p style={{
              fontSize: 15,
              color: '#9CA3AF',
              lineHeight: 1.7,
              marginBottom: 20,
              maxWidth: 320,
            }}>
              Full-Stack Developer building production-grade SaaS applications with modern web technologies.
            </p>
            <div style={{
              display: 'flex',
              gap: 10,
            }}>
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    border: '1px solid #F0E6DE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF',
                    transition: 'all 0.2s',
                    background: '#FFFFFF',
                  }}
                  className="footer-social"
                  title={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: '#1A1A2E',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>Quick Links</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {navLinks.map(link => (
                link.path ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    style={{
                      fontSize: 14,
                      color: '#9CA3AF',
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <ScrollLink
                    key={link.href}
                    to={link.href}
                    style={{
                      fontSize: 14,
                      color: '#9CA3AF',
                      transition: 'color 0.2s',
                      textDecoration: 'none',
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </ScrollLink>
                )
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              color: '#1A1A2E',
              marginBottom: 20,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>Connect</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <a
                href="https://github.com/MrYaseen0"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#9CA3AF', transition: 'color 0.2s' }}
                className="footer-link"
              >
                github.com/MrYaseen0
              </a>
              <a
                href="https://linkedin.com/in/yaseen-ahmad-489967280"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#9CA3AF', transition: 'color 0.2s' }}
                className="footer-link"
              >
                linkedin.com/in/yaseen-ahmad
              </a>
              <a
                href="https://www.instagram.com/yaseenahmadexe"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#9CA3AF', transition: 'color 0.2s' }}
                className="footer-link"
              >
                @yaseenahmadexe
              </a>
              <a
                href="https://www.facebook.com/share/1HN9vegPhd/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#9CA3AF', transition: 'color 0.2s' }}
                className="footer-link"
              >
                Facebook
              </a>
              <a
                href="https://www.tiktok.com/@mryaseen.exe"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: '#9CA3AF', transition: 'color 0.2s' }}
                className="footer-link"
              >
                @mryaseen.exe
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #F0E6DE',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{
            fontSize: 13,
            color: '#B0B0C8',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            © {new Date().getFullYear()} Yaseen Ahmad. Built with <Heart size={14} color="#E84393" fill="#E84393" /> using React
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              border: '1px solid #F0E6DE',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9CA3AF',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            className="scroll-top-btn"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .footer-social:hover {
          border-color: #E84393 !important;
          color: #E84393 !important;
          transform: translateY(-2px);
        }
        .footer-link:hover {
          color: #E84393 !important;
        }
        .scroll-top-btn:hover {
          border-color: #E84393 !important;
          color: #E84393 !important;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </footer>
  )
}
