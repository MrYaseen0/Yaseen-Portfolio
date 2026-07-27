import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Mail, Briefcase, Eye, Clock, RefreshCw, LogOut, Shield,
  CheckCircle, XCircle, Trash2, Globe, Folder, Settings, Plus, Star,
  Smartphone, Monitor, Activity, Key, BarChart2, FileText
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import BubbleAnimation from '../components/BubbleAnimation'
import api from '../api'

const STATUSES = ['new', 'contacted', 'discussion', 'proposal-sent', 'working', 'completed', 'declined']
const STATUS_COLORS = {
  new: '#E84393', contacted: '#6CB4EE', discussion: '#FFD700',
  'proposal-sent': '#A8D8EA', working: '#FD79A8', completed: '#25D366', declined: '#FF4757',
}
const STATUS_LABELS = {
  new: 'New', contacted: 'Contacted', discussion: 'Discussion',
  'proposal-sent': 'Proposal Sent', working: 'Working', completed: 'Completed', declined: 'Declined',
}
const SERVICE_LABELS = {
  'web-development': 'Web Dev', 'mobile-development': 'Mobile',
  'backend-engineering': 'Backend', 'database-design': 'Database',
  'ui-design': 'UI/UX', 'saas-architecture': 'SaaS', 'other': 'Other',
}

export default function AdminDashboard({ isAuthed }) {
  const [data, setData] = useState(null)
  const [security, setSecurity] = useState(null)
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState('idle')
  const [sessionWarning, setSessionWarning] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthed) {
      navigate('/admin/login')
      return
    }
    fetchData()
    const timer = setTimeout(() => {
      setSessionWarning(true)
    }, 14 * 60 * 1000)
    return () => clearTimeout(timer)
  }, [isAuthed, navigate, fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [dashRes, secRes, projRes, settingsRes, expRes, testRes] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getSecurity().catch(() => null),
        api.getAllProjects().catch(() => ({ data: [] })),
        api.getSettings().catch(() => ({ data: null })),
        api.getExperiences().catch(() => ({ data: [] })),
        api.getTestimonials().catch(() => ({ data: [] })),
      ])
      if (dashRes?.success) setData(dashRes.data)
      if (secRes?.success) setSecurity(secRes.data)
      if (projRes?.data) setProjects(projRes.data)
      if (settingsRes?.data) setSettings(settingsRes.data)
      if (expRes?.data) setExperiences(expRes.data)
      if (testRes?.data) setTestimonials(testRes.data)
    } catch (err) {
      if (err.status === 401) {
        navigate('/admin/login')
        return
      }
    }
    setLoading(false)
  }, [navigate])

  const handleLogout = async () => {
    try { await api.logout() } catch {}
    navigate('/admin/login')
  }

  const handleMarkRead = async (id) => {
    try {
      await api.markRead(id)
      setData(prev => ({
        ...prev,
        contacts: prev.contacts.map(c => c._id === id ? { ...c, read: true } : c),
        unreadContacts: Math.max(0, prev.unreadContacts - 1),
      }))
    } catch {}
  }

  const handleDeleteContact = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      await api.deleteContact(id)
      setData(prev => ({
        ...prev,
        contacts: prev.contacts.filter(c => c._id !== id),
      }))
    } catch {}
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateHireStatus(id, status)
      setData(prev => ({
        ...prev,
        hires: prev.hires.map(h => h._id === id ? { ...h, status } : h),
      }))
    } catch {}
  }

  const handleDeleteHire = async (id) => {
    if (!confirm('Delete this hire request?')) return
    try {
      await api.deleteHire(id)
      setData(prev => ({
        ...prev,
        hires: prev.hires.filter(h => h._id !== id),
      }))
    } catch {}
  }

  const handleRevokeSession = async (sessionId) => {
    try {
      await api.revokeSession(sessionId)
      setSecurity(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(s => s._id !== sessionId),
      }))
    } catch {}
  }

  const handleRevokeAll = async () => {
    if (!confirm('Revoke all other sessions?')) return
    try {
      await api.revokeAllSessions()
      setSecurity(prev => ({ ...prev, activeSessions: prev.activeSessions.slice(0, 1) }))
    } catch {}
  }

  const handleRefreshSession = async () => {
    try {
      await api.refreshToken()
      setSessionWarning(false)
    } catch {
      handleLogout()
    }
  }

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.newPass) return
    if (pwForm.newPass !== pwForm.confirm) { setPwStatus('mismatch'); return }
    if (pwForm.newPass.length < 6) { setPwStatus('short'); return }
    setPwStatus('sending')
    try {
      await api.changePassword(pwForm.current, pwForm.newPass)
      setPwStatus('done')
      setPwForm({ current: '', newPass: '', confirm: '' })
      setTimeout(() => setPwStatus('idle'), 3000)
    } catch {
      setPwStatus('error')
      setTimeout(() => setPwStatus('idle'), 3000)
    }
  }

  // Project handlers
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectForm, setProjectForm] = useState({ title: '', slug: '', subtitle: '', description: '', gradient: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)', tags: '', github: '', liveDemo: '', language: '', featured: false })

  const handleSaveProject = async () => {
    try {
      const payload = {
        ...projectForm,
        tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      if (editingProject) {
        const res = await api.updateProject(editingProject._id, payload)
        setProjects(prev => prev.map(p => p._id === editingProject._id ? res.data : p))
      } else {
        const res = await api.createProject(payload)
        setProjects(prev => [...prev, res.data])
      }
      setShowProjectForm(false)
      setEditingProject(null)
      setProjectForm({ title: '', slug: '', subtitle: '', description: '', gradient: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)', tags: '', github: '', liveDemo: '', language: '', featured: false })
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEditProject = (p) => {
    setEditingProject(p)
    setProjectForm({
      title: p.title || '', slug: p.slug || '', subtitle: p.subtitle || '',
      description: p.description || '', gradient: p.gradient || '',
      tags: (p.tags || []).join(', '), github: p.github || '', liveDemo: p.liveDemo || '',
      language: p.language || '', featured: p.featured || false,
    })
    setShowProjectForm(true)
  }

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.deleteProject(id)
      setProjects(prev => prev.filter(p => p._id !== id))
    } catch {}
  }

  // Settings handlers
  const [settingsForm, setSettingsForm] = useState({})
  const [savingSettings, setSavingSettings] = useState(false)

  const handleSaveSettings = async () => {
    setSavingSettings(true)
    try {
      await api.updateSettings(settingsForm)
      setSettings(prev => ({ ...prev, ...settingsForm }))
      alert('Settings saved!')
    } catch (err) {
      alert(err.message)
    }
    setSavingSettings(false)
  }

  // Experience handlers
  const [showExpForm, setShowExpForm] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', type: 'full-time', startDate: '', endDate: '', current: false, description: '', highlights: '', technologies: '' })

  const handleSaveExp = async () => {
    try {
      const payload = {
        ...expForm,
        highlights: expForm.highlights ? expForm.highlights.split('\n').filter(Boolean) : [],
        technologies: expForm.technologies ? expForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      if (editingExp) {
        const res = await api.updateExperience(editingExp._id, payload)
        setExperiences(prev => prev.map(e => e._id === editingExp._id ? res.data : e))
      } else {
        const res = await api.createExperience(payload)
        setExperiences(prev => [...prev, res.data])
      }
      setShowExpForm(false)
      setEditingExp(null)
      setExpForm({ title: '', company: '', location: '', type: 'full-time', startDate: '', endDate: '', current: false, description: '', highlights: '', technologies: '' })
    } catch (err) { alert(err.message) }
  }

  const handleEditExp = (e) => {
    setEditingExp(e)
    setExpForm({
      title: e.title || '', company: e.company || '', location: e.location || '',
      type: e.type || 'full-time', startDate: e.startDate ? e.startDate.split('T')[0] : '',
      endDate: e.endDate ? e.endDate.split('T')[0] : '', current: e.current || false,
      description: e.description || '', highlights: (e.highlights || []).join('\n'),
      technologies: (e.technologies || []).join(', '),
    })
    setShowExpForm(true)
  }

  const handleDeleteExp = async (id) => {
    if (!confirm('Delete this experience?')) return
    try { await api.deleteExperience(id); setExperiences(prev => prev.filter(e => e._id !== id)) } catch {}
  }

  // Testimonial handlers
  const [showTestForm, setShowTestForm] = useState(false)
  const [editingTest, setEditingTest] = useState(null)
  const [testForm, setTestForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, project: '', featured: false })

  const handleSaveTest = async () => {
    try {
      if (editingTest) {
        const res = await api.updateTestimonial(editingTest._id, testForm)
        setTestimonials(prev => prev.map(t => t._id === editingTest._id ? res.data : t))
      } else {
        const res = await api.createTestimonial(testForm)
        setTestimonials(prev => [...prev, res.data])
      }
      setShowTestForm(false)
      setEditingTest(null)
      setTestForm({ name: '', role: '', company: '', content: '', rating: 5, project: '', featured: false })
    } catch (err) { alert(err.message) }
  }

  const handleEditTest = (t) => {
    setEditingTest(t)
    setTestForm({ name: t.name || '', role: t.role || '', company: t.company || '', content: t.content || '', rating: t.rating || 5, project: t.project || '', featured: t.featured || false })
    setShowTestForm(true)
  }

  const handleDeleteTest = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try { await api.deleteTestimonial(id); setTestimonials(prev => prev.filter(t => t._id !== id)) } catch {}
  }

  const stats = data ? [
    { icon: Users, label: 'Visitors', value: data.visitorCount, color: '#E84393' },
    { icon: Mail, label: 'Messages', value: data.unreadContacts, color: '#6CB4EE' },
    { icon: Briefcase, label: 'New Hires', value: data.newHires, color: '#FD79A8' },
    { icon: Eye, label: 'This Week', value: data.recentVisitorsWeek || 0, color: '#A8D8EA' },
  ] : []

  const tabs = [
    { key: 'overview', label: 'Messages', icon: Mail, count: data?.unreadContacts },
    { key: 'hires', label: 'Hire Requests', icon: Briefcase, count: data?.newHires },
    { key: 'projects', label: 'Projects', icon: Folder },
    { key: 'experience', label: 'Experience', icon: Clock },
    { key: 'testimonials', label: 'Reviews', icon: Star },
    { key: 'visitors', label: 'Visitors', icon: Globe },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#FFF9F5', position: 'relative', overflow: 'hidden' }}>
      <BubbleAnimation count={10} />

      <section style={{ padding: '40px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 28, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
                Dashboard
              </h1>
              <p style={{ fontSize: 14, color: '#9CA3AF', margin: '4px 0 0' }}>Monitor your portfolio</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={fetchData} style={{
                padding: '10px 20px', background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#4A4A68',
              }}><RefreshCw size={14} /> Refresh</button>
              <Link to="/admin/analytics" style={{
                padding: '10px 20px', background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#4A4A68', textDecoration: 'none',
              }}><BarChart2 size={14} /> Analytics</Link>
              <Link to="/admin/blog" style={{
                padding: '10px 20px', background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#4A4A68', textDecoration: 'none',
              }}><FileText size={14} /> Blog</Link>
              <button onClick={handleLogout} style={{
                padding: '10px 20px', background: '#FFF0F6', border: '1.5px solid #F8C8DC', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#E84393',
              }}><LogOut size={14} /> Logout</button>
            </div>
          </div>

          {sessionWarning && (
            <div style={{
              padding: '12px 20px', background: '#FFF3CD', border: '1px solid #FFD700', borderRadius: 10,
              marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <p style={{ fontSize: 13, color: '#856404', margin: 0 }}>
                Your session is about to expire. Please refresh to stay logged in.
              </p>
              <button onClick={handleRefreshSession} style={{
                padding: '6px 16px', background: '#FFD700', border: 'none', borderRadius: 6,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#856404',
              }}>Refresh Session</button>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393', borderRadius: '50%', margin: '0 auto' }} />
              <p style={{ marginTop: 16, color: '#9CA3AF' }}>Loading...</p>
            </div>
          ) : !data ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE' }}>
              <p style={{ color: '#FF4757' }}>Failed to load data.</p>
              <button onClick={fetchData} style={{ marginTop: 12, padding: '8px 20px', background: '#FFF0F6', border: '1px solid #F8C8DC', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#E84393' }}>Retry</button>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }} className="admin-stats-grid">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    style={{ padding: 20, background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <s.icon size={20} color={s.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E' }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    padding: '10px 18px', borderRadius: 10, border: '1.5px solid',
                    borderColor: tab === t.key ? '#E84393' : '#F0E6DE',
                    background: tab === t.key ? '#FFF0F6' : '#FFFFFF',
                    color: tab === t.key ? '#E84393' : '#4A4A68',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <t.icon size={14} /> {t.label}
                    {t.count > 0 && (
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', background: tab === t.key ? '#E84393' : '#F0E6DE',
                        color: tab === t.key ? 'white' : '#4A4A68', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{t.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {tab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', overflow: 'hidden' }}>
                    {data.contacts?.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No messages yet</div>
                    ) : data.contacts?.map((c, i) => (
                      <div key={c._id} style={{
                        padding: '16px 20px', borderBottom: i < data.contacts.length - 1 ? '1px solid #F0E6DE' : 'none',
                        display: 'flex', alignItems: 'flex-start', gap: 14, background: !c.read ? '#FFFBFD' : 'transparent',
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10, background: 'rgba(232,67,147,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#E84393',
                        }}>{c.name?.[0]?.toUpperCase()}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{c.name}</span>
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{c.email}</span>
                            {!c.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E84393' }} />}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#4A4A68', marginBottom: 2 }}>{c.subject}</div>
                          <div style={{ fontSize: 13, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                            <span style={{ fontSize: 11, color: '#B0B0C8' }}>
                              <Clock size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {new Date(c.createdAt).toLocaleString()}
                            </span>
                            {!c.read && (
                              <button onClick={() => handleMarkRead(c._id)} style={{
                                padding: '3px 10px', background: '#F0F8FF', border: '1px solid #D0E8FF', borderRadius: 6,
                                fontSize: 11, cursor: 'pointer', color: '#6CB4EE',
                              }}>Mark Read</button>
                            )}
                            <button onClick={() => handleDeleteContact(c._id)} style={{
                              padding: '3px 10px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6,
                              fontSize: 11, cursor: 'pointer', color: '#FF4757',
                            }}><Trash2 size={11} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {tab === 'hires' && (
                  <motion.div key="hires" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', overflow: 'hidden' }}>
                    {data.hires?.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No hire requests yet</div>
                    ) : data.hires?.map((h, i) => (
                      <div key={h._id} style={{ padding: '16px 20px', borderBottom: i < data.hires.length - 1 ? '1px solid #F0E6DE' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{h.name}</span>
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{h.email}</span>
                            {h.company && <span style={{ fontSize: 12, color: '#6CB4EE' }}>@ {h.company}</span>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <select value={h.status} onChange={(e) => handleStatusChange(h._id, e.target.value)}
                              style={{
                                padding: '4px 8px', borderRadius: 8, border: `1.5px solid ${STATUS_COLORS[h.status]}`,
                                background: `${STATUS_COLORS[h.status]}10`, color: STATUS_COLORS[h.status],
                                fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none',
                              }}>
                              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                            </select>
                            <button onClick={() => handleDeleteHire(h._id)} style={{
                              padding: '4px 8px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6,
                              fontSize: 11, cursor: 'pointer', color: '#FF4757',
                            }}><Trash2 size={12} /></button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                          <span style={{ padding: '3px 10px', background: '#FFF0F6', borderRadius: 6, fontSize: 12, color: '#E84393' }}>
                            {SERVICE_LABELS[h.service] || h.service}
                          </span>
                          {h.budget && <span style={{ padding: '3px 10px', background: '#F0F8FF', borderRadius: 6, fontSize: 12, color: '#6CB4EE' }}>{h.budget}</span>}
                          {h.timeline && <span style={{ padding: '3px 10px', background: '#FFF9F5', borderRadius: 6, fontSize: 12, color: '#4A4A68' }}>{h.timeline}</span>}
                        </div>
                        <div style={{ fontSize: 13, color: '#4A4A68', lineHeight: 1.6 }}>{h.description}</div>
                        <div style={{ fontSize: 11, color: '#B0B0C8', marginTop: 6 }}>
                          <Clock size={11} style={{ display: 'inline', verticalAlign: -1 }} /> {new Date(h.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {tab === 'visitors' && (
                  <motion.div key="visitors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', overflow: 'hidden' }}>
                    {data.recentVisitors?.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No visitors yet</div>
                    ) : data.recentVisitors?.map((v, i) => (
                      <div key={v._id} style={{
                        padding: '12px 20px', borderBottom: i < data.recentVisitors.length - 1 ? '1px solid #F0E6DE' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Globe size={14} color="#6CB4EE" />
                          <span style={{ fontSize: 13, color: '#4A4A68', fontFamily: 'monospace' }}>{v.ip || 'Unknown'}</span>
                          <span style={{ fontSize: 12, color: '#9CA3AF' }}>→ {v.page}</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#B0B0C8' }}>{new Date(v.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {tab === 'projects' && (
                  <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Folder size={18} /> Projects ({projects.length})
                        </h3>
                        <button onClick={() => { setEditingProject(null); setProjectForm({ title: '', slug: '', subtitle: '', description: '', gradient: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)', tags: '', github: '', liveDemo: '', language: '', featured: false }); setShowProjectForm(true) }} style={{
                          padding: '8px 16px', background: '#E84393', border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 4,
                        }}><Plus size={14} /> Add Project</button>
                      </div>

                      {showProjectForm && (
                        <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE', marginBottom: 16 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>{editingProject ? 'Edit Project' : 'New Project'}</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="project-form-grid">
                            <input placeholder="Title" value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="slug-url" value={projectForm.slug} onChange={e => setProjectForm(p => ({ ...p, slug: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Subtitle" value={projectForm.subtitle} onChange={e => setProjectForm(p => ({ ...p, subtitle: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Language" value={projectForm.language} onChange={e => setProjectForm(p => ({ ...p, language: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Tags (comma separated)" value={projectForm.tags} onChange={e => setProjectForm(p => ({ ...p, tags: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2' }} className="admin-input" />
                            <textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2', resize: 'vertical' }} className="admin-input" />
                            <input placeholder="GitHub URL" value={projectForm.github} onChange={e => setProjectForm(p => ({ ...p, github: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Live Demo URL" value={projectForm.liveDemo} onChange={e => setProjectForm(p => ({ ...p, liveDemo: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button onClick={handleSaveProject} style={{ padding: '8px 20px', background: '#E84393', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white' }}>{editingProject ? 'Update' : 'Create'}</button>
                            <button onClick={() => { setShowProjectForm(false); setEditingProject(null) }} style={{ padding: '8px 20px', background: '#F0E6DE', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A4A68' }}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {projects.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No projects yet. Add your first project!</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {projects.map(p => (
                            <div key={p._id} style={{
                              padding: '14px 16px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 10,
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                            }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{p.title}</span>
                                  {p.featured && <span style={{ padding: '2px 8px', background: '#E8439310', borderRadius: 6, fontSize: 10, fontWeight: 600, color: '#E84393' }}>Featured</span>}
                                </div>
                                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{p.slug} {p.language ? `· ${p.language}` : ''}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleEditProject(p)} style={{ padding: '4px 12px', background: '#F0F8FF', border: '1px solid #D0E8FF', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#6CB4EE' }}>Edit</button>
                                <button onClick={() => handleDeleteProject(p._id)} style={{ padding: '4px 12px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#FF4757' }}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {tab === 'experience' && (
                  <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Clock size={18} /> Experience ({experiences.length})
                        </h3>
                        <button onClick={() => { setEditingExp(null); setExpForm({ title: '', company: '', location: '', type: 'full-time', startDate: '', endDate: '', current: false, description: '', highlights: '', technologies: '' }); setShowExpForm(true) }} style={{
                          padding: '8px 16px', background: '#E84393', border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 4,
                        }}><Plus size={14} /> Add</button>
                      </div>

                      {showExpForm && (
                        <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE', marginBottom: 16 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>{editingExp ? 'Edit' : 'New'} Experience</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="project-form-grid">
                            <input placeholder="Job Title" value={expForm.title} onChange={e => setExpForm(p => ({ ...p, title: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Company" value={expForm.company} onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Location" value={expForm.location} onChange={e => setExpForm(p => ({ ...p, location: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <select value={expForm.type} onChange={e => setExpForm(p => ({ ...p, type: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#FFFFFF' }} className="admin-input">
                              <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="freelance">Freelance</option><option value="contract">Contract</option><option value="internship">Internship</option><option value="volunteer">Volunteer</option>
                            </select>
                            <input type="date" placeholder="Start Date" value={expForm.startDate} onChange={e => setExpForm(p => ({ ...p, startDate: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input type="date" placeholder="End Date" value={expForm.endDate} onChange={e => setExpForm(p => ({ ...p, endDate: e.target.value }))} disabled={expForm.current} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', opacity: expForm.current ? 0.5 : 1 }} className="admin-input" />
                            <textarea placeholder="Description" value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2', resize: 'vertical' }} className="admin-input" />
                            <textarea placeholder="Highlights (one per line)" value={expForm.highlights} onChange={e => setExpForm(p => ({ ...p, highlights: e.target.value }))} rows={2} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2', resize: 'vertical' }} className="admin-input" />
                            <input placeholder="Technologies (comma separated)" value={expForm.technologies} onChange={e => setExpForm(p => ({ ...p, technologies: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2' }} className="admin-input" />
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4A4A68', cursor: 'pointer' }}>
                              <input type="checkbox" checked={expForm.current} onChange={e => setExpForm(p => ({ ...p, current: e.target.checked }))} /> Current position
                            </label>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button onClick={handleSaveExp} style={{ padding: '8px 20px', background: '#E84393', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white' }}>{editingExp ? 'Update' : 'Create'}</button>
                            <button onClick={() => { setShowExpForm(false); setEditingExp(null) }} style={{ padding: '8px 20px', background: '#F0E6DE', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A4A68' }}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {experiences.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No experience entries yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {experiences.map(e => (
                            <div key={e._id} style={{ padding: '14px 16px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{e.title} @ {e.company}</div>
                                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{e.type?.replace('-', ' ')} {e.location ? `· ${e.location}` : ''}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleEditExp(e)} style={{ padding: '4px 12px', background: '#F0F8FF', border: '1px solid #D0E8FF', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#6CB4EE' }}>Edit</button>
                                <button onClick={() => handleDeleteExp(e._id)} style={{ padding: '4px 12px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#FF4757' }}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {tab === 'testimonials' && (
                  <motion.div key="testimonials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Star size={18} /> Testimonials ({testimonials.length})
                        </h3>
                        <button onClick={() => { setEditingTest(null); setTestForm({ name: '', role: '', company: '', content: '', rating: 5, project: '', featured: false }); setShowTestForm(true) }} style={{
                          padding: '8px 16px', background: '#E84393', border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', gap: 4,
                        }}><Plus size={14} /> Add</button>
                      </div>

                      {showTestForm && (
                        <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE', marginBottom: 16 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>{editingTest ? 'Edit' : 'New'} Testimonial</h4>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="project-form-grid">
                            <input placeholder="Client Name" value={testForm.name} onChange={e => setTestForm(p => ({ ...p, name: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Role" value={testForm.role} onChange={e => setTestForm(p => ({ ...p, role: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <input placeholder="Company" value={testForm.company} onChange={e => setTestForm(p => ({ ...p, company: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            <select value={testForm.rating} onChange={e => setTestForm(p => ({ ...p, rating: parseInt(e.target.value) }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#FFFFFF' }} className="admin-input">
                              <option value={5}>5 Stars</option><option value={4}>4 Stars</option><option value={3}>3 Stars</option><option value={2}>2 Stars</option><option value={1}>1 Star</option>
                            </select>
                            <textarea placeholder="Testimonial content" value={testForm.content} onChange={e => setTestForm(p => ({ ...p, content: e.target.value }))} rows={3} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', gridColumn: 'span 2', resize: 'vertical' }} className="admin-input" />
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button onClick={handleSaveTest} style={{ padding: '8px 20px', background: '#E84393', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'white' }}>{editingTest ? 'Update' : 'Create'}</button>
                            <button onClick={() => { setShowTestForm(false); setEditingTest(null) }} style={{ padding: '8px 20px', background: '#F0E6DE', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#4A4A68' }}>Cancel</button>
                          </div>
                        </div>
                      )}

                      {testimonials.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No testimonials yet.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {testimonials.map(t => (
                            <div key={t._id} style={{ padding: '14px 16px', background: '#FFF9F5', border: '1px solid #F0E6DE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{t.name} {t.company ? `@ ${t.company}` : ''}</div>
                                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{t.content}"</div>
                                <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} color={j < (t.rating || 5) ? '#FFD700' : '#F0E6DE'} fill={j < (t.rating || 5) ? '#FFD700' : 'none'} />)}</div>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleEditTest(t)} style={{ padding: '4px 12px', background: '#F0F8FF', border: '1px solid #D0E8FF', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#6CB4EE' }}>Edit</button>
                                <button onClick={() => handleDeleteTest(t._id)} style={{ padding: '4px 12px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6, fontSize: 11, cursor: 'pointer', color: '#FF4757' }}>Delete</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {tab === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Settings size={18} /> Site Settings
                      </h3>

                      {settings && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          {/* Profile */}
                          <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE' }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>Profile</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="settings-grid">
                              <input placeholder="Name" defaultValue={settings.profile?.name} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, name: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Title" defaultValue={settings.profile?.title} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, title: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Email" defaultValue={settings.profile?.email} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, email: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Phone" defaultValue={settings.profile?.phone} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, phone: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Location" defaultValue={settings.profile?.location} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, location: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Avatar URL" defaultValue={settings.profile?.avatar} onChange={e => setSettingsForm(p => ({ ...p, profile: { ...p.profile, avatar: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            </div>
                          </div>

                          {/* Social Links */}
                          <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE' }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>Social Links</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="settings-grid">
                              {Object.entries(settings.social || {}).map(([key, val]) => (
                                <input key={key} placeholder={key} defaultValue={val} onChange={e => setSettingsForm(p => ({ ...p, social: { ...p.social, [key]: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              ))}
                            </div>
                          </div>

                          {/* SEO */}
                          <div style={{ padding: 16, background: '#FFF9F5', borderRadius: 12, border: '1px solid #F0E6DE' }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 12px' }}>SEO Settings</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <input placeholder="Site Title" defaultValue={settings.seo?.title} onChange={e => setSettingsForm(p => ({ ...p, seo: { ...p.seo, title: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <textarea placeholder="Meta Description" defaultValue={settings.seo?.description} onChange={e => setSettingsForm(p => ({ ...p, seo: { ...p.seo, description: e.target.value } }))} rows={2} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }} className="admin-input" />
                              <input placeholder="Keywords" defaultValue={settings.seo?.keywords} onChange={e => setSettingsForm(p => ({ ...p, seo: { ...p.seo, keywords: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                              <input placeholder="Canonical URL" defaultValue={settings.seo?.canonical} onChange={e => setSettingsForm(p => ({ ...p, seo: { ...p.seo, canonical: e.target.value } }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                            </div>
                          </div>

                          <button onClick={handleSaveSettings} disabled={savingSettings} style={{
                            padding: '10px 24px', background: '#E84393', border: 'none', borderRadius: 10,
                            fontSize: 14, fontWeight: 600, cursor: savingSettings ? 'not-allowed' : 'pointer',
                            opacity: savingSettings ? 0.7 : 1, color: 'white', alignSelf: 'flex-start',
                          }}>{savingSettings ? 'Saving...' : 'Save Settings'}</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {tab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Change Password */}
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20, marginBottom: 16 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Key size={18} /> Change Password
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="project-form-grid">
                        <input type="password" placeholder="Current password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                        <div />
                        <input type="password" placeholder="New password (min 6 chars)" value={pwForm.newPass} onChange={e => setPwForm(p => ({ ...p, newPass: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                        <input type="password" placeholder="Confirm new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} style={{ padding: '8px 12px', border: '1.5px solid #F0E6DE', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} className="admin-input" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                        <button onClick={handleChangePassword} disabled={pwStatus === 'sending'} style={{
                          padding: '8px 20px', background: '#E84393', border: 'none', borderRadius: 8,
                          fontSize: 13, fontWeight: 600, cursor: pwStatus === 'sending' ? 'not-allowed' : 'pointer',
                          color: 'white', opacity: pwStatus === 'sending' ? 0.6 : 1,
                        }}>{pwStatus === 'sending' ? 'Updating...' : 'Update Password'}</button>
                        {pwStatus === 'done' && <span style={{ fontSize: 13, color: '#25D366', fontWeight: 500 }}>Password updated!</span>}
                        {pwStatus === 'error' && <span style={{ fontSize: 13, color: '#FF4757', fontWeight: 500 }}>Current password is incorrect</span>}
                        {pwStatus === 'mismatch' && <span style={{ fontSize: 13, color: '#FF4757', fontWeight: 500 }}>Passwords don't match</span>}
                        {pwStatus === 'short' && <span style={{ fontSize: 13, color: '#FF4757', fontWeight: 500 }}>Min 6 characters</span>}
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20, marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Shield size={18} /> Active Sessions
                        </h3>
                        <button onClick={handleRevokeAll} style={{
                          padding: '6px 14px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 8,
                          fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#FF4757',
                        }}>Revoke All Others</button>
                      </div>
                      {security?.activeSessions?.length === 0 ? (
                        <p style={{ color: '#9CA3AF', fontSize: 13 }}>No active sessions</p>
                      ) : security?.activeSessions?.map(s => (
                        <div key={s._id} style={{
                          padding: '12px 16px', borderBottom: '1px solid #F0E6DE',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {s.userAgent?.includes('Mobile') ? <Smartphone size={14} color="#6CB4EE" /> : <Monitor size={14} color="#6CB4EE" />}
                            <div>
                              <div style={{ fontSize: 13, color: '#4A4A68' }}>{s.ip || 'Unknown IP'}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF' }}>
                                Last active: {new Date(s.lastActivity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => handleRevokeSession(s._id)} style={{
                            padding: '4px 10px', background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 6,
                            fontSize: 11, cursor: 'pointer', color: '#FF4757',
                          }}>Revoke</button>
                        </div>
                      ))}
                    </div>

                    {/* Activity Log */}
                    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE', padding: 20 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={18} /> Recent Activity
                      </h3>
                      {security?.recentActivity?.length === 0 ? (
                        <p style={{ color: '#9CA3AF', fontSize: 13 }}>No activity yet</p>
                      ) : security?.recentActivity?.map(a => (
                        <div key={a._id} style={{
                          padding: '10px 0', borderBottom: '1px solid #F0E6DE',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {a.action === 'login' && <CheckCircle size={14} color="#25D366" />}
                            {a.action === 'login_failed' && <XCircle size={14} color="#FF4757" />}
                            {a.action === 'logout' && <LogOut size={14} color="#9CA3AF" />}
                            {a.action === 'session_revoked' && <Shield size={14} color="#FFD700" />}
                            {a.action === 'password_changed' && <Key size={14} color="#6CB4EE" />}
                            {!['login', 'login_failed', 'logout', 'session_revoked', 'password_changed'].includes(a.action) && <Activity size={14} color="#E84393" />}
                            <div>
                              <span style={{ fontSize: 13, color: '#4A4A68', fontWeight: 500 }}>
                                {a.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              {a.details && (
                                <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 8 }}>
                                  {typeof a.details === 'object' ? JSON.stringify(a.details) : a.details}
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(a.createdAt).toLocaleString()}</div>
                            {a.ip && <div style={{ fontSize: 10, color: '#B0B0C8', fontFamily: 'monospace' }}>{a.ip}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) { .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .project-form-grid, .settings-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
