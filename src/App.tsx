import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { PageSignalTransition, SignalRail } from './components/MotionEffects'
import { PageMetadata } from './components/PageMetadata'
import { HomePage } from './pages/HomePage'

const loadSupportingPages = () => import('./pages/SupportingPages')
const WorkPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.WorkPage })))
const ProjectPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.ProjectPage })))
const ServicesPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.ServicesPage })))
const ProcessPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.ProcessPage })))
const ContactPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.ContactPage })))
const LegalPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.LegalPage })))
const NotFoundPage = lazy(() => loadSupportingPages().then((module) => ({ default: module.NotFoundPage })))

function ScrollManager() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
  return null
}

function AppShell() {
  const location = useLocation()
  return <><a className="skip-link" href="#main-content">Skip to content</a><ScrollManager /><PageMetadata /><PageSignalTransition routeKey={location.pathname} /><SignalRail /><SiteHeader /><div id="main-content"><Suspense fallback={<div className="route-loader" role="status"><span />Loading page…</div>}><Routes><Route path="/" element={<HomePage />} /><Route path="/work" element={<WorkPage />} /><Route path="/work/:slug" element={<ProjectPage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/process" element={<ProcessPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/privacy" element={<LegalPage type="privacy" />} /><Route path="/terms" element={<LegalPage type="terms" />} /><Route path="*" element={<NotFoundPage />} /></Routes></Suspense></div><SiteFooter /></>
}

export default function App() {
  return <BrowserRouter><AppShell /></BrowserRouter>
}
