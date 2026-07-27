import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, GitFork, Code2, RefreshCw, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon } from './SocialIcons'
import BubbleAnimation from './BubbleAnimation'
import api from '../api'

const langColors = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3776AB', HTML: '#E34F26',
  CSS: '#1572B6', React: '#61DAFB', 'C++': '#00599C', Java: '#ED8B00', Go: '#00ADD8',
  'C#': '#239120', Ruby: '#CC342D', PHP: '#777BB4', Dart: '#0175C2', Shell: '#89E051',
  'Jupyter Notebook': '#DA5B0B', Lua: '#000080', EJS: '#A91E50',
}

function formatDate(d) {
  const date = new Date(d)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(d) {
  const seconds = Math.floor((Date.now() - new Date(d)) / 1000)
  if (seconds < 60) return 'just now'
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function GitHubProjects({ fullPage = false }) {
  const [repos, setRepos] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [reposRes, statsRes] = await Promise.all([
        api.getGithubRepos(),
        api.getGithubStats(),
      ])
      setRepos(reposRes.data.filter(r => !r.fork))
      setStats(statsRes.data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const languages = [...new Set(repos.map(r => r.language).filter(Boolean))]
  const filtered = filter === 'all' ? repos : repos.filter(r => r.language === filter)

  return (
    <section id="github" style={{
      padding: fullPage ? '100px 24px 60px' : '100px 24px',
      background: '#FFF9F5', position: 'relative', overflow: 'hidden',
      minHeight: fullPage ? '100vh' : 'auto',
    }}>
      {fullPage && <BubbleAnimation count={14} />}

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, #F0E6DE, transparent)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {fullPage && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            style={{ marginBottom: 24 }}>
            <Link to="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#9CA3AF',
              textDecoration: 'none', transition: 'color 0.2s',
            }} className="back-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#FFF0F6', borderRadius: 100, marginBottom: 16 }}>
            <GithubIcon size={16} color="#E84393" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#E84393', textTransform: 'uppercase', letterSpacing: 1 }}>GitHub</span>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#1A1A2E', marginBottom: 12 }}>
            Open Source <span style={{
              background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Projects</span>
          </h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 500, margin: '0 auto' }}>
            Real-time data from my GitHub profile. {fullPage ? 'All repositories.' : 'Top projects.'}
          </p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Repositories', value: stats.public_repos, icon: Code2 },
              { label: 'Followers', value: stats.followers, icon: Star },
              { label: 'Following', value: stats.following, icon: GitFork },
              { label: 'Gists', value: stats.public_gists, icon: ExternalLink },
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                style={{ textAlign: 'center', minWidth: 100 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#E84393' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#9CA3AF' }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Language Filter */}
        {fullPage && languages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{
              padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1.5px solid ${filter === 'all' ? '#E84393' : '#F0E6DE'}`,
              background: filter === 'all' ? '#FFF0F6' : '#FFFFFF',
              color: filter === 'all' ? '#E84393' : '#4A4A68',
            }}>All ({repos.length})</button>
            {languages.map(lang => (
              <button key={lang} onClick={() => setFilter(lang)} style={{
                padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: `1.5px solid ${filter === lang ? (langColors[lang] || '#E84393') : '#F0E6DE'}`,
                background: filter === lang ? `${langColors[lang] || '#E84393'}10` : '#FFFFFF',
                color: filter === lang ? (langColors[lang] || '#E84393') : '#4A4A68',
              }}>{lang} ({repos.filter(r => r.language === lang).length})</button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RefreshCw size={28} color="#E84393" className="spin" />
            <p style={{ marginTop: 12, color: '#9CA3AF', fontSize: 14 }}>Loading repositories...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#FFFFFF', borderRadius: 16, border: '1px solid #F0E6DE' }}>
            <p style={{ color: '#FF4757', fontSize: 14 }}>{error}</p>
            <button onClick={fetchData} style={{
              marginTop: 12, padding: '8px 20px', background: '#FFF0F6', border: '1px solid #F8C8DC',
              borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#E84393',
            }}>Retry</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="github-grid">
            {(fullPage ? filtered : filtered.slice(0, 6)).map((repo, i) => (
              <motion.div key={repo.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{
                  padding: '22px 20px', background: '#FFFFFF', border: '1px solid #F0E6DE',
                  borderRadius: 14, transition: 'all 0.3s', display: 'flex', flexDirection: 'column',
                }}
                className="github-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                    background: langColors[repo.language] ? `${langColors[repo.language]}15` : '#F5F0EB',
                    color: langColors[repo.language] || '#4A4A68',
                    border: `1px solid ${langColors[repo.language] || '#F0E6DE'}`,
                  }}>{repo.language || 'N/A'}</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#9CA3AF' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star size={12} /> {repo.stargazers_count}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><GitFork size={12} /> {repo.forks_count}</span>
                  </div>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A2E', marginBottom: 6 }}>{repo.name}</h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
                  {repo.description || 'No description available.'}
                </p>
                {repo.topics?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
                    {repo.topics.slice(0, 4).map(t => (
                      <span key={t} style={{ padding: '2px 8px', background: '#FFF0F6', borderRadius: 6, fontSize: 11, color: '#E84393' }}>{t}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 11, color: '#B0B0C8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={11} /> {formatDate(repo.created_at)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={11} /> {timeAgo(repo.updated_at)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '8px 12px', background: '#1A1A2E', borderRadius: 8, color: 'white',
                      fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    className="github-btn"
                  ><GithubIcon size={13} color="white" /> Code</a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noopener noreferrer"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '8px 12px', background: '#FFFFFF', border: '1px solid #F0E6DE', borderRadius: 8,
                        color: '#4A4A68', fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                      }}
                      className="github-btn-secondary"
                    ><ExternalLink size={13} /> Live</a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!fullPage && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/github" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
              background: '#1A1A2E', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s',
            }} className="github-view-all">
              <GithubIcon size={16} color="white" /> View All Projects
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .github-card:hover { border-color: #F8C8DC; transform: translateY(-3px); box-shadow: 0 6px 24px rgba(232,67,147,0.08); }
        .github-btn:hover { background: #E84393 !important; }
        .github-btn-secondary:hover { border-color: #E84393 !important; color: #E84393 !important; }
        .github-view-all:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(26,26,46,0.2); }
        .back-link:hover { color: #E84393 !important; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .github-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .github-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
