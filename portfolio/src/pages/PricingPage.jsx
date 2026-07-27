import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Zap, Star, Rocket } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import BubbleAnimation from '../components/BubbleAnimation'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: '$1,000',
    priceNote: 'starting from',
    description: 'Perfect for small businesses and startups needing a professional web presence.',
    color: '#6CB4EE',
    bg: 'rgba(108,180,238,0.06)',
    features: [
      'Responsive landing page or simple website',
      'Up to 5 pages',
      'Mobile-first design',
      'Basic SEO setup',
      'Contact form integration',
      '1 revision round',
      '7-day delivery',
    ],
    cta: 'Get Started',
    ctaLink: '/#contact',
  },
  {
    name: 'Professional',
    icon: Star,
    price: '$3,000',
    priceNote: 'starting from',
    description: 'For businesses needing a full-stack web application with database and API.',
    color: '#E84393',
    bg: 'rgba(232,67,147,0.06)',
    popular: true,
    features: [
      'Full-stack web application',
      'React + Node.js + MongoDB',
      'User authentication & roles',
      'REST API development',
      'Admin dashboard',
      'Database design & optimization',
      '3 revision rounds',
      '14-day delivery',
      '30-day support',
    ],
    cta: 'Most Popular',
    ctaLink: '/#contact',
  },
  {
    name: 'Enterprise',
    icon: Rocket,
    price: '$5,000+',
    priceNote: 'starting from',
    description: 'For complex SaaS platforms, e-commerce, or enterprise-grade applications.',
    color: '#E84393',
    bg: 'linear-gradient(135deg, rgba(232,67,147,0.06), rgba(108,180,238,0.06))',
    features: [
      'Custom SaaS or e-commerce platform',
      'Microservices architecture',
      'Payment integration (Stripe)',
      'Real-time features (WebSocket)',
      'Performance optimization',
      'CI/CD pipeline setup',
      'Cloud deployment (AWS/Vercel)',
      'Unlimited revisions',
      '60-day support',
      'Priority communication',
    ],
    cta: 'Contact Me',
    ctaLink: '/#contact',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PricingPage() {
  usePageMeta({
    title: 'Pricing',
    description: 'Transparent pricing for Full-Stack Development services. Starter, Professional, and Enterprise packages available.',
    path: '/pricing',
  })

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={15} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Back */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 60 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            Transparent Pricing
          </h1>
          <p style={{ fontSize: 17, color: '#6B7280', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Choose the plan that fits your project. All plans include clean code, responsive design, and direct communication.
          </p>
        </motion.div>

        {/* Plans */}
        <motion.div variants={container} initial="hidden" animate="show" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 24,
          alignItems: 'start',
        }}>
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item} style={{
              background: '#FFFFFF', borderRadius: 20, border: plan.popular ? '2px solid #E84393' : '1px solid #F0E6DE',
              padding: 32, position: 'relative', overflow: 'hidden',
              boxShadow: plan.popular ? '0 8px 40px rgba(232,67,147,0.12)' : '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg, #E84393, #FD79A8)',
                  color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px',
                  borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5,
                }}>Popular</div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: plan.popular ? 'rgba(232,67,147,0.08)' : plan.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <plan.icon size={22} color={plan.color} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 20, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                  {plan.name}
                </h3>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>{plan.priceNote}</span>
                <div style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#1A1A2E' }}>
                  {plan.price}
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5, marginBottom: 24 }}>
                {plan.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 14, color: '#4A4A68' }}>
                    <Check size={16} color={plan.popular ? '#E84393' : '#6CB4EE'} style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={plan.ctaLink} style={{
                display: 'block', textAlign: 'center', padding: '14px 0',
                background: plan.popular ? 'linear-gradient(135deg, #E84393, #FD79A8)' : 'transparent',
                border: plan.popular ? 'none' : '2px solid #F0E6DE',
                borderRadius: 12, color: plan.popular ? 'white' : '#1A1A2E',
                fontSize: 15, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ fontSize: 15, color: '#9CA3AF', marginBottom: 12 }}>
            Not sure which plan is right? Let's talk.
          </p>
          <Link to="/#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', background: '#1A1A2E', borderRadius: 12,
            color: 'white', fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>
            Schedule a Free Consultation
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
