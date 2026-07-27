import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDown, MapPin, Briefcase, Download, DollarSign } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons'
import BubbleAnimation from './BubbleAnimation'

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/MrYaseen0', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/yaseen-ahmad-489967280', label: 'LinkedIn' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaseenahmadexe', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://www.facebook.com/share/1HN9vegPhd/', label: 'Facebook' },
]

export default function Hero({ onHireClick }) {
  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 24px 80px',
      background: 'linear-gradient(180deg, #FFF9F5 0%, #FFFFFF 50%, #FFF0F6 100%)',
    }}>
      <BubbleAnimation count={22} />
      {/* Soft pink glow top right */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-5%',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,67,147,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      {/* Soft blue glow bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        left: '-5%',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,180,238,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Subtle dot pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(232,67,147,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }} className="hero-grid">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 18px',
            background: '#FFFFFF',
            border: '1px solid #F0E6DE',
            borderRadius: 100,
            marginBottom: 28,
            boxShadow: '0 2px 8px rgba(232,67,147,0.06)',
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16,185,129,0.4)',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4A4A68' }}>
              Available for freelance work
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 8,
            letterSpacing: '-1.5px',
            color: '#1A1A2E',
          }}>
            Hi, I'm
          </h1>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(40px, 6vw, 68px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-1.5px',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Yaseen Ahmad</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: '#4A4A68',
            lineHeight: 1.8,
            marginBottom: 16,
            maxWidth: 520,
          }}>
            I build scalable web applications that help businesses grow. Full-Stack Developer specializing in MERN stack, SaaS architecture, and modern cloud solutions.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              color: '#9CA3AF',
              fontWeight: 500,
            }}>
              <MapPin size={16} color="#E84393" />
              <span>Peshawar, Pakistan</span>
            </div>
            <div style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#F0E6DE',
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              color: '#9CA3AF',
              fontWeight: 500,
            }}>
              <Briefcase size={16} color="#6CB4EE" />
              <span>Freelance Developer</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}>
            <button
              onClick={onHireClick}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                color: 'white',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(232,67,147,0.25)',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hero-btn-primary"
            >
              Hire Me
            </button>
            <a
              href="#projects"
              style={{
                padding: '14px 32px',
                background: '#FFFFFF',
                border: '1.5px solid #F0E6DE',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                color: '#1A1A2E',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              className="hero-btn-secondary"
            >
              View Work
            </a>
            <Link
              to="/pricing"
              style={{
                padding: '14px 32px',
                background: '#FFFFFF',
                border: '1.5px solid #F0E6DE',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                color: '#1A1A2E',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
              }}
              className="hero-btn-secondary"
            >
              <DollarSign size={16} /> Pricing
            </Link>
            <a
              href="/resume.pdf"
              download
              style={{
                padding: '14px 32px',
                background: '#FFFFFF',
                border: '1.5px solid #F0E6DE',
                borderRadius: 100,
                fontSize: 15,
                fontWeight: 600,
                color: '#1A1A2E',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
              className="hero-btn-secondary"
            >
              <Download size={18} /> Resume
            </a>
          </div>

          {/* Trust Stats */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '20+', label: 'Projects Built' },
              { value: 'MERN', label: 'Stack Specialist' },
              { value: '100%', label: 'Client Focused' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#E84393' }}>{stat.value}</span>
                <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
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
                  borderRadius: 12,
                  border: '1.5px solid #F0E6DE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  transition: 'all 0.2s',
                  background: '#FFFFFF',
                }}
                className="social-link"
                title={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right - Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{
            position: 'relative',
            width: 420,
            height: 420,
          }} className="hero-image-wrapper">
            {/* Gradient glow behind image */}
            <div style={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(232,67,147,0.15) 0%, rgba(108,180,238,0.15) 100%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            {/* Decorative ring */}
            <div style={{
              position: 'absolute',
              inset: -12,
              borderRadius: '50%',
              border: '2px dashed rgba(232,67,147,0.15)',
              animation: 'spin 25s linear infinite',
            }} />

            {/* Second ring */}
            <div style={{
              position: 'absolute',
              inset: -24,
              borderRadius: '50%',
              border: '1.5px dashed rgba(108,180,238,0.1)',
              animation: 'spin 35s linear infinite reverse',
            }} />

            {/* Profile image */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #FFFFFF',
              position: 'relative',
              background: '#FFF0F6',
              boxShadow: '0 8px 40px rgba(232,67,147,0.12)',
            }}>
              <img
                src="/assets/developer-pic.png"
                alt="Yaseen Ahmad - Developer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Floating badge - Tech stack */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: 20,
                right: -10,
                padding: '12px 20px',
                background: '#FFFFFF',
                border: '1px solid #F0E6DE',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <span style={{ fontSize: 20 }}>⚛️</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>React & Next.js</span>
            </motion.div>

            {/* Floating badge - Follower count */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute',
                top: 40,
                left: -20,
                padding: '12px 20px',
                background: '#FFFFFF',
                border: '1px solid #F0E6DE',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px rgba(16,185,129,0.3)',
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>1K+ Followers</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 12, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 500 }}>
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={20} color="#E84393" />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(232,67,147,0.35) !important;
        }
        .hero-btn-secondary:hover {
          border-color: #E84393 !important;
          color: #E84393 !important;
          box-shadow: 0 4px 16px rgba(232,67,147,0.1);
        }
        .social-link:hover {
          border-color: #E84393 !important;
          color: #E84393 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(232,67,147,0.12);
        }
        .hero-image-wrapper {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px !important;
          }
          .hero-image-wrapper {
            width: 280px !important;
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  )
}
