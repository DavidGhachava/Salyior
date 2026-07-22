import { useRef, type CSSProperties } from 'react'
import { m, useInView, useReducedMotion } from 'framer-motion'
import type { ProjectVisual as ProjectVisualType } from '../types'
import { useCompactViewport } from '../hooks/useCompactViewport'
import { SignalGraphic } from './MotionEffects'

const screens: Record<ProjectVisualType, {
  src: string
  alt: string
  width: number
  height: number
  domain: string
  detail: string
  capability?: string
  annotations: [string, string]
}> = {
  arqi: {
    src: '/projects/arqi.webp',
    alt: 'ARQI Georgia property advisory homepage overlooking Mount Kazbek',
    width: 1600,
    height: 910,
    domain: 'arql.netlify.app',
    detail: 'Private property advisory',
    annotations: ['Curated discovery', 'Qualified enquiry path'],
  },
  arrive: {
    src: '/projects/arrive.webp',
    alt: 'Arrive city guide homepage for travellers entering a new city',
    width: 1600,
    height: 904,
    domain: 'guiderp.netlify.app',
    detail: 'City arrival guides',
    capability: 'PWA-ready foundation',
    annotations: ['First-hour essentials', 'PWA-ready structure'],
  },
  kristina: {
    src: '/projects/kristina-languages.webp',
    alt: 'Kristina Beridze Georgian tutor website homepage',
    width: 1600,
    height: 896,
    domain: 'kristinalanguages.com',
    detail: 'Local education platform',
    capability: 'Installable PWA',
    annotations: ['Local SEO pathway', 'Student enquiry flow'],
  },
}

export function ProjectVisual({ type, hero = false }: { type: ProjectVisualType; hero?: boolean }) {
  const reducedMotion = useReducedMotion()
  const compactViewport = useCompactViewport()
  const screen = screens[type]
  const artRef = useRef<HTMLDivElement>(null)
  const inView = useInView(artRef, { margin: '180px 0px' })
  const animateAmbient = !reducedMotion && !compactViewport && inView

  return (
    <div ref={artRef} className={`project-art real-project-art real-project-art--${type} ${hero ? 'project-art--hero' : ''}`}>
      {!compactViewport && <m.span
        className="project-liquid project-liquid--one"
        aria-hidden="true"
        animate={animateAmbient ? { x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.08, 1] } : { x: 0, y: 0, scale: 1 }}
        transition={animateAmbient ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : { duration: .18 }}
      />}

      {!compactViewport && <SignalGraphic className="project-art__signal" compact />}
      {!compactViewport && <m.span
        className="project-liquid project-liquid--two"
        aria-hidden="true"
        animate={animateAmbient ? { x: [0, -14, 0], y: [0, 16, 0], scale: [1, 1.05, 1] } : { x: 0, y: 0, scale: 1 }}
        transition={animateAmbient ? { duration: 11, repeat: Infinity, ease: 'easeInOut' } : { duration: .18 }}
      />}

      <m.div
        className="project-shot project-shot--main"
        whileHover={reducedMotion ? undefined : { y: -7, scale: 1.006 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="project-shot__chrome" aria-hidden="true">
          <span><i /><i /><i /></span>
          <b>{screen.domain}</b>
          <em>•••</em>
        </div>
        <img
          src={screen.src}
          srcSet={`${screen.src.replace(/\.webp$/, '-640.webp')} 640w, ${screen.src.replace(/\.webp$/, '-800.webp')} 800w, ${screen.src} 1600w`}
          sizes={hero ? '(max-width: 767px) calc(100vw - 38px), (max-width: 1100px) calc(100vw - 48px), 1240px' : '(max-width: 767px) calc(100vw - 38px), 620px'}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          loading={hero ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={hero ? 'high' : 'low'}
        />
      </m.div>

      {!hero && (
        <m.div
          className="project-shot project-shot--detail"
          aria-hidden="true"
          whileHover={reducedMotion ? undefined : { y: -5, rotate: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={screen.src} srcSet={`${screen.src.replace(/\.webp$/, '-640.webp')} 640w, ${screen.src.replace(/\.webp$/, '-800.webp')} 800w, ${screen.src} 1600w`} sizes="(max-width: 767px) 34vw, 280px" alt="" width={screen.width} height={screen.height} loading="lazy" decoding="async" fetchPriority="low" />
        </m.div>
      )}

      <div className="project-proof" aria-hidden="true">
        <span><i />Live build</span>
        <strong>{screen.detail}</strong>
        {screen.capability && <em>{screen.capability}</em>}
      </div>
      <div className="project-annotation project-annotation--one" aria-hidden="true"><i /><span>01</span><strong>{screen.annotations[0]}</strong></div>
      <div className="project-annotation project-annotation--two" aria-hidden="true"><i /><span>02</span><strong>{screen.annotations[1]}</strong></div>
    </div>
  )
}

export function OutcomeVisual({ type }: { type: 'booking' | 'search' | 'trust' | 'contact' }) {
  if (type === 'booking') {
    return <div className="outcome-ui outcome-ui--booking" aria-hidden="true"><small>RESERVE A TABLE</small><div><span>Fri, 24 Jul</span><span>7:30 PM</span><span>2 guests</span></div><span className="mock-action">Find a table →</span></div>
  }
  if (type === 'search') {
    return <div className="outcome-ui outcome-ui--search" aria-hidden="true"><small>18 PROPERTIES</small><div className="mini-property"><i /><span><b>Ridge House</b><small>Kazbegi · 4 beds</small></span><em>Enquire</em></div><div className="mini-property"><i /><span><b>Courtyard House</b><small>Tbilisi · 5 beds</small></span><em>View</em></div></div>
  }
  if (type === 'trust') {
    return <div className="outcome-ui outcome-ui--trust" aria-hidden="true"><div className="trust-score"><span>Experience standards</span><strong>Built in</strong></div><div className="trust-bars"><i style={{ '--bar': '92%' } as CSSProperties} /><i style={{ '--bar': '84%' } as CSSProperties} /><i style={{ '--bar': '96%' } as CSSProperties} /></div><small>Fast · Clear · Responsive</small></div>
  }
  return <div className="outcome-ui outcome-ui--contact" aria-hidden="true"><small>PROJECT INQUIRY</small><label>Name<span>Alex Morgan</span></label><label>Interested in<span>New website</span></label><span className="mock-action">Send inquiry →</span></div>
}
