import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontSize: 120, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
          background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1, marginBottom: 16,
        }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 32, lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
            background: 'linear-gradient(135deg, #E84393 0%, #6CB4EE 100%)',
            borderRadius: 100, fontSize: 14, fontWeight: 600, color: 'white', textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }} className="notfound-btn">
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
            background: '#FFFFFF', border: '1.5px solid #F0E6DE', borderRadius: 100,
            fontSize: 14, fontWeight: 600, color: '#4A4A68', cursor: 'pointer',
            transition: 'all 0.2s',
          }} className="notfound-back">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
        <style>{`
          .notfound-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(232,67,147,0.35); }
          .notfound-back:hover { border-color: #E84393; color: #E84393; }
        `}</style>
      </div>
    </div>
  )
}
