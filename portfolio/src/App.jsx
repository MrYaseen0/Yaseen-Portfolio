import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Drawer from './components/Drawer'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Testimonials from './components/Testimonials'
import ErrorBoundary from './components/ErrorBoundary'
import WhatsAppButton from './components/WhatsAppButton'
import ChatBot from './components/ChatBot'
import HireModal from './components/HireModal'
import api from './api'

const AboutUs = lazy(() => import('./pages/AboutUs'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const WebDevelopment = lazy(() => import('./pages/WebDevelopment'))
const MobileDevelopment = lazy(() => import('./pages/MobileDevelopment'))
const BackendEngineering = lazy(() => import('./pages/BackendEngineering'))
const DatabaseDesign = lazy(() => import('./pages/DatabaseDesign'))
const UIDesign = lazy(() => import('./pages/UIDesign'))
const SaaSArchitecture = lazy(() => import('./pages/SaaSArchitecture'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const GitHubProjects = lazy(() => import('./components/GitHubProjects'))
const Experience = lazy(() => import('./pages/Experience'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'))
const BlogEditor = lazy(() => import('./pages/admin/BlogEditor'))

function LoadingSpinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #F0E6DE', borderTopColor: '#E84393',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto',
        }} />
        <p style={{ marginTop: 12, color: '#9CA3AF', fontSize: 13 }}>Loading...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}

function HomePage({ onHireClick }) {
  return (
    <>
      <Hero onHireClick={onHireClick} />
      <About />
      <Services />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}

function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  useEffect(() => {
    api.recordVisit(location.pathname).catch(() => {})
  }, [location.pathname])

  useEffect(() => {
    api.getMe()
      .then(() => setIsAdmin(true))
      .catch(() => {})
      .finally(() => setAuthChecked(true))
  }, [])

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {!isAdminPage && <Navbar onMenuClick={() => setDrawerOpen(true)} onHireClick={() => setHireOpen(true)} />}
      {!isAdminPage && <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />}
      <HireModal open={hireOpen} onClose={() => setHireOpen(false)} />
      <main id="main-content">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage onHireClick={() => setHireOpen(true)} />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/mobile-development" element={<MobileDevelopment />} />
          <Route path="/services/backend-engineering" element={<BackendEngineering />} />
          <Route path="/services/database-design" element={<DatabaseDesign />} />
          <Route path="/services/ui-design" element={<UIDesign />} />
          <Route path="/services/saas-architecture" element={<SaaSArchitecture />} />
          <Route path="/github" element={<GitHubProjects fullPage />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/admin/analytics" element={
            authChecked ? <AnalyticsDashboard isAuthed={isAdmin} /> : <LoadingSpinner />
          } />
          <Route path="/admin/blog" element={
            authChecked ? <BlogEditor isAuthed={isAdmin} /> : <LoadingSpinner />
          } />
          <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
          <Route path="/admin/*" element={
            authChecked ? (
              <AdminDashboard isAuthed={isAdmin} onLogin={() => setIsAdmin(true)} />
            ) : (
              <LoadingSpinner />
            )
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
      {!isAdminPage && <ChatBot />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  )
}

export default App
