import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'
import api from '../api'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    api.getMe()
      .then(() => onLogin())
      .catch(() => setChecking(false))
  }, [onLogin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      if (isRegister) {
        await api.register(email, password)
      } else {
        await api.login(email, password)
      }
      onLogin()
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF9F5' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393', borderRadius: '50%' }} />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#FFF9F5', padding: 24,
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 420, background: '#FFFFFF', borderRadius: 20,
          border: '1px solid #F0E6DE', boxShadow: '0 12px 48px rgba(0,0,0,0.06)', overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '32px 32px 24px', textAlign: 'center',
          background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 700, color: 'white', margin: 0 }}>
            Admin {isRegister ? 'Setup' : 'Login'}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
            {isRegister ? 'Create your admin account' : 'Secure access to dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                background: '#FFF0F0', border: '1px solid #FFD0D0', borderRadius: 10,
                marginBottom: 16, fontSize: 13, color: '#FF4757',
              }}>
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6, display: 'block' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@example.com"
                style={{
                  width: '100%', padding: '12px 14px 12px 40px', background: '#FFF9F5', border: '1.5px solid #F0E6DE',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
                className="admin-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E', marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#9CA3AF" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="Min 8 characters"
                style={{
                  width: '100%', padding: '12px 40px 12px 40px', background: '#FFF9F5', border: '1.5px solid #F0E6DE',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
                className="admin-input"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {isRegister && (
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                Must contain uppercase letter and number
              </p>
            )}
          </div>

          <button type="submit" disabled={status === 'sending'} style={{
            width: '100%', padding: '13px', background: 'linear-gradient(135deg, #E84393, #6CB4EE)',
            border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 600,
            cursor: status === 'sending' ? 'not-allowed' : 'pointer', opacity: status === 'sending' ? 0.7 : 1,
            fontFamily: 'inherit',
          }}>
            {status === 'sending' ? 'Processing...' : isRegister ? 'Create Account' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError('') }}
              style={{ background: 'none', border: 'none', fontSize: 13, color: '#9CA3AF', cursor: 'pointer' }}>
              {isRegister ? 'Already have an account? Login' : 'First time? Create admin account'}
            </button>
          </div>
        </form>
      </motion.div>

      <style>{`
        .admin-input:focus { border-color: #E84393 !important; box-shadow: 0 0 0 3px rgba(232,67,147,0.08); background: #FFFFFF !important; }
        .admin-input::placeholder { color: #C0B8D0; }
      `}</style>
    </div>
  )
}
