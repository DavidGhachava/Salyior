import { useEffect, useRef } from 'react'
import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion'
import { useCompactViewport } from '../hooks/useCompactViewport'

export function SignalGraphic({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  const reducedMotion = useReducedMotion()
  const compactViewport = useCompactViewport()
  const signalRef = useRef<SVGSVGElement>(null)
  const inView = useInView(signalRef, { margin: '120px 0px', once: true })
  const visible = Boolean(reducedMotion || inView)
  if (compactViewport) return null
  return (
    <svg ref={signalRef} className={`signal-graphic ${compact ? 'signal-graphic--compact' : ''} ${className}`.trim()} viewBox="0 0 1200 240" preserveAspectRatio="none" aria-hidden="true">
      <m.path className="signal-path signal-path--cyan" d="M-20 62H328c42 0 46 70 90 70h172c45 0 47-70 91-70h539" initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }} transition={{ duration: 1.45, delay: .15, ease: [0.22, 1, 0.36, 1] }} />
      <m.path className="signal-path signal-path--white" d="M-20 178h405c48 0 49-70 96-70h143c48 0 48 70 96 70h500" initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 }} transition={{ duration: 1.6, delay: .28, ease: [0.22, 1, 0.36, 1] }} />
      <m.circle className="signal-node signal-node--cyan" cx="328" cy="62" r="5" initial={reducedMotion ? false : { scale: 0 }} animate={{ scale: visible ? 1 : 0 }} transition={{ delay: 1.05, type: 'spring', stiffness: 260, damping: 18 }} />
      <m.circle className="signal-node signal-node--white" cx="720" cy="178" r="5" initial={reducedMotion ? false : { scale: 0 }} animate={{ scale: visible ? 1 : 0 }} transition={{ delay: 1.18, type: 'spring', stiffness: 260, damping: 18 }} />
    </svg>
  )
}

export function SignalRail() {
  const railRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      railRef.current?.style.setProperty('--signal-progress', `${Math.min(1, window.scrollY / travel)}`)
    }
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
  return <div ref={railRef} className="signal-rail" aria-hidden="true"><i /><b /><span /></div>
}

export function PageSignalTransition({ routeKey }: { routeKey: string }) {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null
  return (
    <AnimatePresence mode="sync">
      <m.div key={routeKey} className="page-signal-transition" aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>
        <m.i initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 1] }} transition={{ duration: .58, times: [0, .6, 1], ease: [0.22, 1, 0.36, 1] }} />
        <m.b initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 1] }} transition={{ duration: .64, delay: .04, times: [0, .6, 1], ease: [0.22, 1, 0.36, 1] }} />
      </m.div>
    </AnimatePresence>
  )
}

export function LiquidBackdrop({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion()
  const compactViewport = useCompactViewport()
  const backdropRef = useRef<HTMLDivElement>(null)
  const inView = useInView(backdropRef, { margin: '180px 0px' })
  const animateAmbient = !reducedMotion && !compactViewport && inView

  if (compactViewport) return null

  return (
    <div ref={backdropRef} className={`liquid-backdrop ${compact ? 'liquid-backdrop--compact' : ''}`} aria-hidden="true">
      <m.span
        className="liquid-blob liquid-blob--one"
        animate={animateAmbient ? { x: [0, 34, -8, 0], y: [0, -18, 14, 0], scale: [1, 1.08, .97, 1], rotate: [0, 9, -5, 0] } : { x: 0, y: 0, scale: 1, rotate: 0 }}
        transition={animateAmbient ? { duration: 14, repeat: Infinity, ease: 'easeInOut' } : { duration: .18 }}
      />
      <m.span
        className="liquid-blob liquid-blob--two"
        animate={animateAmbient ? { x: [0, -28, 12, 0], y: [0, 22, -9, 0], scale: [1, .95, 1.06, 1], rotate: [0, -11, 6, 0] } : { x: 0, y: 0, scale: 1, rotate: 0 }}
        transition={animateAmbient ? { duration: 17, repeat: Infinity, ease: 'easeInOut' } : { duration: .18 }}
      />
      <svg className="liquid-ribbon" viewBox="0 0 1200 720" preserveAspectRatio="none">
        <m.path
          d="M-70 560C160 350 280 670 502 472c195-175 329-142 503-36 113 70 191 42 279-62"
          initial={reducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: .55 }}
          transition={{ duration: 1.8, delay: .25, ease: [0.22, 1, 0.36, 1] }}
        />
        <m.path
          d="M-100 616C146 430 328 731 548 518c168-163 318-126 476-20 114 76 201 58 301-20"
          initial={reducedMotion ? undefined : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: .22 }}
          transition={{ duration: 2.1, delay: .4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  )
}
