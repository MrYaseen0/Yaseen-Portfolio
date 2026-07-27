import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, MessageSquare, Briefcase, Eye, TrendingUp, Clock } from 'lucide-react'
import usePageMeta from '../../hooks/usePageMeta'
import api from '../../api'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function AnalyticsDashboard() {
  usePageMeta({ title: 'Analytics Dashboard', path: '/admin/analytics' })

  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#9CA3AF' }}>Loading analytics...</div>
  if (!stats) return <div style={{ padding: '120px 24px', textAlign: 'center', color: '#9CA3AF' }}>Failed to load analytics.</div>

  const cards = [
    { label: 'Total Visitors', value: stats.totalVisitors, icon: Users, color: '#6CB4EE' },
    { label: 'Unique IPs', value: stats.uniqueIPs, icon: Eye, color: '#10b981' },
    { label: 'Messages', value: stats.totalMessages, icon: MessageSquare, color: '#E84393', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : null },
    { label: 'Hire Requests', value: stats.totalHires, icon: Briefcase, color: '#F59E0B', badge: stats.newHires > 0 ? `${stats.newHires} new` : null },
    { label: 'This Week', value: stats.recentVisitors, icon: TrendingUp, color: '#8B5CF6' },
  ]

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: '#FFF9F5' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 14, textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to Admin
        </Link>

        <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 32 }}>
          Analytics
        </h1>

        {/* Summary Cards */}
        <motion.div variants={container} initial="hidden" animate="show" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40,
        }}>
          {cards.map(c => (
            <motion.div key={c.label} variants={item} style={{
              background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #F0E6DE',
              position: 'relative',
            }}>
              <c.icon size={20} color={c.color} style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
                {c.value}
              </div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>{c.label}</div>
              {c.badge && (
                <span style={{
                  position: 'absolute', top: 16, right: 16,
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(232,67,147,0.08)', color: '#E84393',
                }}>{c.badge}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Visitors Chart (text-based) */}
        {stats.dailyVisitors?.length > 0 && (
          <motion.div variants={item} initial="hidden" animate="show" style={{
            background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #F0E6DE', marginBottom: 24,
          }}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 20 }}>
              <Clock size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Daily Visitors (Last 7 Days)
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {stats.dailyVisitors.map(d => {
                const max = Math.max(...stats.dailyVisitors.map(x => x.count))
                const h = max > 0 ? (d.count / max) * 140 : 0
                return (
                  <div key={d._id} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{d.count}</div>
                    <div style={{
                      height: h || 4, background: 'linear-gradient(180deg, #E84393, #6CB4EE)',
                      borderRadius: 6, minHeight: 4,
                    }} />
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{d._id.slice(5)}</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Top Pages */}
        {stats.topPages?.length > 0 && (
          <motion.div variants={item} initial="hidden" animate="show" style={{
            background: '#FFFFFF', borderRadius: 16, padding: 24, border: '1px solid #F0E6DE',
          }}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
              <Eye size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Top Pages
            </h3>
            {stats.topPages.map((p, i) => (
              <div key={p._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: i < stats.topPages.length - 1 ? '1px solid #F0E6DE' : 'none',
              }}>
                <span style={{ fontSize: 14, color: '#4A4A68' }}>{p._id}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393' }}>{p.count} visits</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
