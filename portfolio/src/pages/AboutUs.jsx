import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, ExternalLink, GraduationCap, Rocket, Heart, Users, Code2, Globe } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons'
import { Link } from 'react-router-dom'
import BubbleAnimation from '../components/BubbleAnimation'
import usePageMeta from '../hooks/usePageMeta'

const socialLinks = [
  { icon: GithubIcon, href: 'https://github.com/MrYaseen0', label: 'GitHub', username: '@MrYaseen0' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/yaseen-ahmad-489967280', label: 'LinkedIn', username: 'yaseen-ahmad' },
  { icon: InstagramIcon, href: 'https://www.instagram.com/yaseenahmadexe', label: 'Instagram', username: '@yaseenahmadexe' },
  { icon: FacebookIcon, href: 'https://www.facebook.com/share/1HN9vegPhd/', label: 'Facebook', username: 'Yaseen Ahmad' },
]

const highlights = [
  { icon: Code2, title: 'Full-Stack Developer', desc: 'Building end-to-end web applications with modern technologies' },
  { icon: Rocket, title: 'SaaS Builder', desc: 'Creating production-grade SaaS products from concept to deployment' },
  { icon: GraduationCap, title: 'Software Engineering Student', desc: 'Pursuing knowledge in computer science and software architecture' },
  { icon: Globe, title: 'Freelance Developer', desc: 'Available for freelance projects and collaborations worldwide' },
]

const timeline = [
  { year: '2023', title: 'Started Coding Journey', desc: 'Began learning web development with HTML, CSS, and JavaScript' },
  { year: '2023', title: 'React & Next.js', desc: 'Dove deep into React ecosystem and built multiple projects' },
  { year: '2024', title: 'Full-Stack Development', desc: 'Expanded to backend with Node.js, databases, and API design' },
  { year: '2024', title: 'SaaS & Freelancing', desc: 'Started building SaaS products and taking freelance projects' },
  { year: '2025', title: '1K+ Followers', desc: 'Grew community to over 1,000 followers across platforms' },
]

export default function AboutUs() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  usePageMeta({
    title: 'About',
    description: 'Learn about Yaseen Ahmad — Full-Stack Developer specializing in MERN stack, SaaS architecture, and modern cloud solutions.',
    path: '/about',
  })

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={20} />

      {/* Hero */}
      <section style={{ padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', margin: '0 auto 24px', border: '4px solid #FFFFFF', boxShadow: '0 8px 40px rgba(232,67,147,0.12)', overflow: 'hidden', background: '#FFF0F6' }}>
              <img src="/assets/developer-pic.jpg" alt="Yaseen Ahmad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
              Yaseen Ahmad
            </h1>
            <p style={{ fontSize: 18, color: '#E84393', fontWeight: 600, marginBottom: 16 }}>
              Full-Stack Developer · Software Engineering Student
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9CA3AF' }}><MapPin size={15} color="#E84393" /> Peshawar, Pakistan</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9CA3AF' }}><Briefcase size={15} color="#6CB4EE" /> Freelance Developer</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9CA3AF' }}><Users size={15} color="#E84393" /> 1K+ Followers</span>
            </div>
            <p style={{ fontSize: 16, color: '#4A4A68', lineHeight: 1.8, maxWidth: 700, margin: '0 auto' }}>
              Building production-grade SaaS applications with Next.js, TypeScript & React. Passionate about clean code, great UX, and continuous learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="about-grid-sub">
            {highlights.map((h, i) => (
              <motion.div key={h.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '28px 24px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 16, transition: 'all 0.3s' }}
                className="about-highlight-card"
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: i % 2 === 0 ? 'rgba(232,67,147,0.06)' : 'rgba(108,180,238,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <h.icon size={24} color={i % 2 === 0 ? '#E84393' : '#6CB4EE'} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>{h.title}</h3>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.7 }}>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Detail */}
      <section style={{ padding: '60px 24px', background: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>About Me</h2>
            <p style={{ fontSize: 16, color: '#9CA3AF' }}>My journey in tech and what drives me</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="about-detail-grid">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p style={{ fontSize: 16, color: '#4A4A68', lineHeight: 1.9, marginBottom: 20 }}>
                I'm Yaseen Ahmad, a passionate Full-Stack Developer and Software Engineering Student based in Peshawar, Pakistan. I specialize in building production-grade SaaS applications using modern web technologies.
              </p>
              <p style={{ fontSize: 16, color: '#4A4A68', lineHeight: 1.9, marginBottom: 20 }}>
                With expertise in Next.js, TypeScript, and React, I create scalable, performant applications that solve real-world problems. I believe in writing clean, maintainable code and creating exceptional user experiences.
              </p>
              <p style={{ fontSize: 16, color: '#4A4A68', lineHeight: 1.9, marginBottom: 28 }}>
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, and sharing my knowledge with the developer community. I'm always open to new opportunities and collaborations.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Prisma'].map(t => (
                  <span key={t} style={{ padding: '6px 14px', background: '#FFF0F6', border: '1px solid #F8C8DC', borderRadius: 100, fontSize: 13, fontWeight: 500, color: '#E84393' }}>{t}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              {/* Info cards */}
              {[
                { label: 'Name', value: 'Yaseen Ahmad', icon: Users },
                { label: 'Username', value: '@MrYaseen0', icon: Code2 },
                { label: 'Pronouns', value: 'he/him', icon: Heart },
                { label: 'Location', value: 'Peshawar, Pakistan', icon: MapPin },
                { label: 'Role', value: 'Freelance Developer', icon: Briefcase },
                { label: 'Timezone', value: 'UTC +5:00 (PKT)', icon: Globe },
              ].map((info, i) => (
                <div key={info.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 12, marginBottom: 10, transition: 'all 0.2s' }} className="info-card">
                  <info.icon size={18} color={i % 2 === 0 ? '#E84393' : '#6CB4EE'} />
                  <div><div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>{info.label}</div><div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{info.value}</div></div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '60px 24px', background: '#FFF9F5', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>My Journey</h2>
            <p style={{ fontSize: 16, color: '#9CA3AF' }}>A timeline of my growth as a developer</p>
          </motion.div>

          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, #E84393, #6CB4EE)' }} />
            {timeline.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ position: 'relative', marginBottom: 32, paddingLeft: 24 }}>
                <div style={{ position: 'absolute', left: -26, top: 6, width: 14, height: 14, borderRadius: '50%', background: i % 2 === 0 ? '#E84393' : '#6CB4EE', border: '3px solid #FFF9F5', boxShadow: `0 0 0 2px ${i % 2 === 0 ? '#E84393' : '#6CB4EE'}30` }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#E84393', marginBottom: 4 }}>{t.year}</div>
                <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>{t.title}</h4>
                <p style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 1.6 }}>{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section style={{ padding: '60px 24px', background: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>Connect With Me</h2>
            <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 40 }}>Find me across the web</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="social-grid-sub">
            {socialLinks.map((s, i) => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 14, transition: 'all 0.3s', textAlign: 'left' }}
                className="social-connect-card"
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(232,67,147,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <s.icon size={22} color="#E84393" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>{s.username}</div>
                </div>
                <ExternalLink size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
              </motion.a>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ marginTop: 40 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg, #E84393, #6CB4EE)', borderRadius: 100, color: '#FFFFFF', fontWeight: 600, fontSize: 15, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 16px rgba(232,67,147,0.25)' }} className="about-cta">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        .about-highlight-card:hover { border-color: #F8C8DC; transform: translateY(-3px); box-shadow: 0 6px 24px rgba(232,67,147,0.08); }
        .info-card:hover { border-color: #F8C8DC; }
        .social-connect-card:hover { border-color: #F8C8DC; transform: translateY(-3px); box-shadow: 0 6px 24px rgba(232,67,147,0.08); }
        .about-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(232,67,147,0.3); }
        @media (max-width: 768px) {
          .about-grid-sub, .about-detail-grid, .social-grid-sub { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
