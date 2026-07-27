import { lazy, Suspense, useEffect } from 'react'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { PageSignalTransition, SignalRail } from './components/MotionEffects'
import { PageMetadata } from './components/PageMetadata'
import { useLocation } from './lib/router'
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
  const path = location.pathname !== '/' ? location.pathname.replace(/\/$/, '') : '/'
  let page

  if (path === '/') page = <HomePage />
  else if (path === '/work') page = <WorkPage />
  else if (/^\/work\/[^/]+$/.test(path)) page = <ProjectPage />
  else if (path === '/services') page = <ServicesPage />
  else if (path === '/process') page = <ProcessPage />
  else if (path === '/contact') page = <ContactPage />
  else if (path === '/privacy') page = <LegalPage type="privacy" />
  else if (path === '/terms') page = <LegalPage type="terms" />
  else page = <NotFoundPage />

  return <><a className="skip-link" href="#main-content">Skip to content</a><ScrollManager /><PageMetadata /><PageSignalTransition routeKey={path} /><SignalRail /><SiteHeader /><div id="main-content"><Suspense fallback={<div className="route-loader" role="status"><span />Loading page…</div>}>{page}</Suspense></div><SiteFooter /></>
}

export default function App() {
  return <AppShell />
}
