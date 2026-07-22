import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../data/site'
import { Brand, ButtonLink, Icon } from './Primitives'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') {
      if (location.pathname.startsWith('/work')) setActiveHref('/#work')
      else if (location.pathname === '/services') setActiveHref('/#services')
      else if (location.pathname === '/process') setActiveHref('/#process')
      else setActiveHref(null)
      return
    }

    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const marker = Math.min(260, window.innerHeight * .38)
      const visible = navigation
        .map((item) => ({ item, element: document.getElementById(item.href.split('#')[1]) }))
        .filter((entry): entry is { item: typeof navigation[number]; element: HTMLElement } => Boolean(entry.element))
        .find(({ element }) => {
          const bounds = element.getBoundingClientRect()
          return bounds.top <= marker && bounds.bottom > marker
        })
      setActiveHref(visible?.item.href ?? null)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }
    updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [location.pathname])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="nav-shell">
        <Link className="nav-brand" to="/" aria-label="SALYIOR home">
          <Brand />
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.label} to={item.href} className={activeHref === item.href ? 'is-active' : ''} aria-current={activeHref === item.href ? 'location' : undefined}>{item.label}</Link>
          ))}
        </nav>

        <ButtonLink href={location.pathname === '/contact' ? 'mailto:hello@salyior.com' : '/contact'} className="nav-cta">
          {location.pathname === '/contact' ? 'Email the studio' : 'Start a project'}
        </ButtonLink>

        <button
          className="menu-trigger"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((current) => !current)}
        >
          <Icon name={open ? 'close' : 'menu'} size={20} />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map((item, index) => (
            <Link key={item.label} to={item.href} className={activeHref === item.href ? 'is-active' : ''} aria-current={activeHref === item.href ? 'location' : undefined} tabIndex={open ? 0 : -1}>
              <span>0{index + 1}</span>{item.label}<Icon name="arrow-up-right" />
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <p>Founder-led web studio</p>
          <p>Remote studio · Working worldwide</p>
          <ButtonLink href={location.pathname === '/contact' ? 'mailto:hello@salyior.com' : '/contact'} tabIndex={open ? 0 : -1}>
            {location.pathname === '/contact' ? 'Email the studio' : 'Start a project'}
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}
