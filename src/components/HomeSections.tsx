import { useEffect, useRef, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { Link } from '../lib/Link'
import { faqs, outcomes, principles, processStages, projects } from '../data/site'
import { useI18n } from '../i18n/I18nProvider'
import type { Project } from '../types'
import { ButtonLink, Container, Icon, SectionIntro, SectionLabel } from './Primitives'
import { OutcomeVisual, ProjectVisual } from './ProjectVisual'
import { LiquidBackdrop, SignalGraphic } from './MotionEffects'

function usePinnedSequence(count: number, disabled: boolean) {
  const sectionRef = useRef<HTMLElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (disabled) return
    let frame = 0

    const update = () => {
      frame = 0
      const section = sectionRef.current
      if (!section) return
      const bounds = section.getBoundingClientRect()
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
      const travel = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -bounds.top / travel))
      const next = Math.min(count - 1, Math.floor(progress * count))
      if (next !== activeRef.current) {
        activeRef.current = next
        setActive(next)
      }
    }

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [count, disabled])

  const select = (index: number) => {
    activeRef.current = index
    setActive(index)
    if (disabled || !sectionRef.current) return
    const sectionTop = window.scrollY + sectionRef.current.getBoundingClientRect().top
    const travel = sectionRef.current.offsetHeight - window.innerHeight
    window.scrollTo({ top: sectionTop + travel * (index / Math.max(1, count - 1)), behavior: 'smooth' })
  }

  return { active, sectionRef, select }
}

export function Hero() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const [activeProject, setActiveProject] = useState(0)
  const initial = reducedMotion ? false : { y: 18 }

  const stackPosition = (index: number) => (index - activeProject + projects.length) % projects.length

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <LiquidBackdrop />
      <SignalGraphic className="hero-signal" />
      <Container>
        <div className="hero-layout">
          <m.div className="hero-main" initial={initial} animate={{ y: 0 }} transition={{ duration: .58, delay: .03, ease: [0.22, 1, 0.36, 1] }}>
            <div className="hero-eyebrow"><SectionLabel>{t('Independent digital studio')}</SectionLabel><span>{t('Remote · Worldwide')}</span></div>
            <h1 id="hero-title" aria-label={t('Be the business they find—trust and choose.')}><span className="hero-title__first">{t('Be the business')}</span><span>{t('they find—')}</span><span className="hero-title__accent">{t('trust and choose.')}</span></h1>
          </m.div>
          <m.div className="hero-support" initial={initial} animate={{ y: 0 }} transition={{ duration: .58, delay: .08, ease: [0.22, 1, 0.36, 1] }}>
            <p>{t('Websites built to earn trust and drive action.')}</p>
            <div className="hero-actions">
              <ButtonLink href="/contact">{t('Start your project')}</ButtonLink>
              <ButtonLink href="/#work" variant="secondary" icon="arrow-right">{t('View selected work')}</ButtonLink>
            </div>
            <div className="hero-signal-logic" aria-label="SALYIOR customer journey"><span>{t('Attention')}</span><i /><span>{t('Clarity')}</span><i /><span>{t('Action')}</span></div>
            <div className="hero-proof" aria-label="SALYIOR capabilities"><span><b>03</b>{t('Live products')}</span><span><b>01</b>{t('Partner from strategy to launch')}</span><span><b>SEO</b>{t('Built into the foundation')}</span></div>
          </m.div>

          <m.div className="hero-stage" initial={reducedMotion ? false : { opacity: 0, x: 30, scale: .975 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: .85, delay: .24, ease: [0.22, 1, 0.36, 1] }}>
            <img className="hero-stage__mark" src="/brand/salyior-mark.webp" alt="" width="560" height="519" decoding="async" aria-hidden="true" />
            <SignalGraphic className="hero-stage__signal" compact />
            <div className="hero-stage__top"><span><i />{t('Live proof')}</span><span>{t('Choose the signal')}</span></div>
            <div className="hero-project-stack">
              {projects.map((project, index) => {
                const position = stackPosition(index)
                return (
                  <article key={project.slug} className="hero-project-card" data-position={position} aria-hidden={position !== 0}>
                    <div className="hero-project-card__chrome"><span><i /><i /><i /></span><b>{new URL(project.url).hostname.replace('www.', '')}</b><em>•••</em></div>
                    <img src={project.image} srcSet={`${project.image.replace(/\.webp$/, '-640.webp')} 640w, ${project.image.replace(/\.webp$/, '-800.webp')} 800w, ${project.image} 1600w`} sizes="(max-width: 767px) 78vw, 520px" alt={position === 0 ? project.imageAlt : ''} width={project.imageWidth} height={project.imageHeight} loading={position === 0 ? 'eager' : 'lazy'} decoding="async" fetchPriority={position === 0 ? 'high' : 'low'} />
                    <div className="hero-project-card__meta"><span>{project.number} · {t(project.industry)}</span><strong>{project.title}</strong><Link to={`/work/${project.slug}`} tabIndex={position === 0 ? 0 : -1} aria-label={`${t('View project')}: ${project.title}`}><Icon name="arrow-up-right" /></Link></div>
                  </article>
                )
              })}
            </div>
            <div className="hero-stage__controls" aria-label={t('Featured projects')}>
              {projects.map((project, index) => <button key={project.slug} type="button" className={activeProject === index ? 'is-active' : ''} aria-pressed={activeProject === index} onClick={() => setActiveProject(index)}><span>{project.number}</span>{project.title}</button>)}
            </div>
            <p className="hero-stage__caption"><span>{t('Selected interface')}</span><strong>{t(projects[activeProject].commercialGoal)}</strong></p>
          </m.div>
        </div>
        <div className="hero-ticker" aria-hidden="true"><span>{t('Strategy')}</span><i /> <span>UI/UX</span><i /> <span>{t('Development')}</span><i /> <span>{t('Technical SEO')}</span><i /> <span>{t('Performance')}</span></div>
      </Container>
    </section>
  )
}

function ProjectInfo({ project }: { project: Project }) {
  const { t } = useI18n()
  return (
    <div className="project-info reveal">
      <div className="project-info__top">
        <span>{project.number}</span>
        <span>{t(project.type)}</span>
      </div>
      <p className="project-info__industry">{t(project.industry)}</p>
      <h3>{project.title}</h3>
      <p>{t(project.summary)}</p>
      <div className="project-info__objective"><span>{t('Commercial objective')}</span><p>{t(project.commercialGoal)}</p></div>
      <ul aria-label={t('Services')}>
        {project.services.map((service) => <li key={service}>{t(service)}</li>)}
      </ul>
      <Link to={`/work/${project.slug}`} className="arrow-link">{t('View project')} <Icon name="arrow-up-right" /></Link>
    </div>
  )
}

export function SelectedWork() {
  const { t } = useI18n()
  return (
    <section className="section section--work" id="work" aria-labelledby="work-title">
      <Container>
        <SectionIntro
          label={t('Selected work')}
          title={<span id="work-title">{t('Digital experiences built around real business decisions.')}</span>}
          copy={t('Three working products across real estate, tourism and education—each built around what the customer needs to understand, trust and do next.')}
        />

        <div className="project-list">
          <article className="project-feature project-feature--left">
            <div className="project-feature__visual reveal"><ProjectVisual type={projects[0].visual} /></div>
            <ProjectInfo project={projects[0]} />
          </article>
          <article className="project-feature project-feature--right">
            <ProjectInfo project={projects[1]} />
            <div className="project-feature__visual reveal"><ProjectVisual type={projects[1].visual} /></div>
          </article>
          <article className="project-feature project-feature--wide">
            <div className="project-wide__intro reveal">
              <div><span>{projects[2].number}</span><span>{t(projects[2].type)}</span></div>
              <div><p>{t(projects[2].industry)}</p><h3>{projects[2].title}</h3></div>
              <p>{t(projects[2].summary)}</p>
              <Link to={`/work/${projects[2].slug}`} className="arrow-link">{t('View project')} <Icon name="arrow-up-right" /></Link>
            </div>
            <div className="project-feature__visual reveal"><ProjectVisual type={projects[2].visual} /></div>
          </article>
        </div>
      </Container>
    </section>
  )
}

export function BusinessOutcomes() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const { active: activeOutcome, sectionRef, select: selectOutcome } = usePinnedSequence(outcomes.length, Boolean(reducedMotion))
  const outcome = outcomes[activeOutcome]
  const outcomePaths = [
    ['Attention', 'Availability', 'Reservation'],
    ['Search', 'Relevance', 'Enquiry'],
    ['First look', 'Confidence', 'Conversation'],
    ['Intent', 'Clarity', 'Action'],
  ]

  return (
    <section
      ref={sectionRef}
      className={`section section--outcomes ${reducedMotion ? 'section--outcomes-static' : ''}`}
      id="services"
      aria-labelledby="outcomes-title"
      style={{ '--outcome-steps': outcomes.length } as React.CSSProperties}
    >
      <div className="outcomes-sticky">
        <Container>
        <SectionIntro
          label={t('Business outcomes')}
          title={<span id="outcomes-title">{t('Designed around what your customer does next.')}</span>}
          copy={t('A strong website doesn’t stop at looking credible. It helps the right person find what matters and take the next valuable step.')}
        />
        <div className="outcomes-console reveal">
          <div className="outcome-selector" aria-label={t('Choose a business outcome')}>
            {outcomes.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={activeOutcome === index ? 'is-active' : ''}
                aria-pressed={activeOutcome === index}
                aria-controls="active-outcome"
                onClick={() => selectOutcome(index)}
                onFocus={() => reducedMotion && selectOutcome(index)}
              >
                <span>{item.number}</span>
                <strong>{t(item.title)}</strong>
                <i><Icon name="arrow-right" /></i>
              </button>
            ))}
          </div>
          <article className="outcome-stage" id="active-outcome" data-number={outcome.number} aria-live="polite">
            <div className="outcome-stage__copy">
              <p className="outcome-stage__label"><i />{t('Commercial outcome')}</p>
              <h3>{t(outcome.title)}</h3>
              <p>{t(outcome.description)}</p>
            </div>
            <div className="outcome-path" aria-label={t('Customer journey')}>
              {outcomePaths[activeOutcome].map((step, index) => (
                <div key={step}><span>0{index + 1}</span><strong>{t(step)}</strong></div>
              ))}
            </div>
            <div className="outcome-stage__visual" aria-hidden="true"><OutcomeVisual type={outcome.visual} /></div>
            {!reducedMotion && <div className="outcome-scroll-status" aria-hidden="true"><span>{t('Scroll to explore')}</span><i><b style={{ width: `${((activeOutcome + 1) / outcomes.length) * 100}%` }} /></i><span>{String(activeOutcome + 1).padStart(2, '0')} / {String(outcomes.length).padStart(2, '0')}</span></div>}
          </article>
        </div>
        </Container>
      </div>
    </section>
  )
}

export function StudioApproach() {
  const { t } = useI18n()
  return (
    <section className="section section--approach" id="studio" aria-labelledby="approach-title">
      <Container className="approach-grid">
        <div className="approach-heading reveal">
          <SectionLabel>{t('The SALYIOR approach')}</SectionLabel>
          <h2 id="approach-title">{t('Built as a business asset—not decoration.')}</h2>
          <p>{t('We build the complete path from someone discovering your business to contacting, booking or buying from it.')}</p>
        </div>
        <div className="principles-list">
          {principles.map((principle) => (
            <article className="principle reveal" key={principle.number}>
              <span>{principle.number}</span>
              <div><h3>{t(principle.title)}</h3><p>{t(principle.description)}</p></div>
            </article>
          ))}
        </div>
        <aside className="studio-belief reveal">
          <SignalGraphic className="studio-belief__signal" compact />
          <div><img src="/brand/salyior-mark.webp" alt="" width="84" height="78" loading="lazy" decoding="async" /><span>{t('Founder-led by design')}</span></div>
          <blockquote>{t('“Too many strong businesses are represented by websites that underestimate them.”')}</blockquote>
          <p>{t('SALYIOR exists to close that gap—with clear thinking, distinctive execution and one accountable partner from direction to launch.')}</p>
        </aside>
      </Container>
    </section>
  )
}

export function Process() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const { active, sectionRef, select: selectStage } = usePinnedSequence(processStages.length, Boolean(reducedMotion))

  return (
    <section
      ref={sectionRef}
      className={`section section--process ${reducedMotion ? 'section--process-static' : ''}`}
      id="process"
      aria-labelledby="process-title"
      style={{ '--process-steps': processStages.length } as React.CSSProperties}
    >
      <div className="process-sticky">
        <Container>
        <SectionIntro
          label={t('The process')}
          title={<span id="process-title">{t('A clear process.')}<br />{t('No disappearing acts.')}</span>}
          copy={t('Scroll through five deliberate stages. Every step has a purpose, a deliverable and a clear approval point.')}
        />
        <div className="process-desktop reveal" style={{ '--process-active': active + 1 } as React.CSSProperties}>
          <div className="process-track" style={{ '--progress': `${active * 25}%` } as React.CSSProperties}>
            {processStages.map((stage, index) => (
              <button key={stage.number} type="button" className={active === index ? 'is-active' : ''} onClick={() => selectStage(index)} aria-pressed={active === index}>
                <span>{stage.number}</span><strong>{t(stage.title)}</strong>
              </button>
            ))}
          </div>
          <div className="process-detail" aria-live="polite">
            <span className="process-detail__number">{processStages[active].number}</span>
            <div><p>{t('Current stage')}</p><h3>{t(processStages[active].title)}</h3></div>
            <p>{t(processStages[active].description)}</p>
          </div>
          <div className="process-scroll-cue" aria-hidden="true"><span>{t('Scroll to advance')}</span><i><b /></i><span>{String(active + 1).padStart(2, '0')} / {String(processStages.length).padStart(2, '0')}</span></div>
        </div>
        <div className="process-mobile">
          {processStages.map((stage) => (
            <article key={stage.number}><span>{stage.number}</span><div><h3>{t(stage.title)}</h3><p>{t(stage.description)}</p></div></article>
          ))}
        </div>
        </Container>
      </div>
    </section>
  )
}

export function Investment() {
  const { t } = useI18n()
  return (
    <section className="section section--investment" aria-labelledby="investment-title">
      <Container>
        <div className="investment-panel reveal">
          <div className="investment-main">
            <SectionLabel>{t('Typical starting scopes')}</SectionLabel>
            <h2 id="investment-title">{t('Custom websites')}<br /><span>{t('from $500.')}</span></h2>
            <p>{t('Every project is scoped around the outcome, content and functionality it actually needs. We recommend the smallest solution that can do the job properly.')}</p>
            <ButtonLink href="/contact">{t('Discuss your project')}</ButtonLink>
            <small>{t('Final scope, price and timeline are agreed before work begins.')}</small>
          </div>
          <div className="scope-list">
            <article>
              <div><h3>{t('Essential website')}</h3><strong>$500–$800</strong></div>
              <p>{t('A focused custom website for presenting one offer clearly and converting attention into contact.')}</p>
              <ul><li>{t('Custom conversion-focused landing page')}</li><li>{t('SEO and performance foundations')}</li><li>{t('Contact actions and deployment')}</li></ul>
            </article>
            <article>
              <div><h3>{t('Growth website')}</h3><strong>$800–$1,500</strong></div>
              <p>{t('A richer multi-page presence for businesses that need more content, stronger proof and practical integrations.')}</p>
              <ul><li>{t('Custom multi-page design')}</li><li>{t('Conversion-led content structure')}</li><li>{t('Analytics and business integrations')}</li></ul>
            </article>
            <article className="scope-list__advanced">
              <div><h3>{t('Advanced website')} <em>{t('Extended capability')}</em></h3><strong>{t('From $1,500+')}</strong></div>
              <p>{t('A custom digital platform for more complex customer journeys, operations or repeat use.')}</p>
              <ul><li>{t('Booking, payments, CMS or filtering')}</li><li>{t('Custom integrations and workflows')}</li><li>{t('Installable app experience where valuable')}</li></ul>
              <small>{t('Offline tools and opt-in notifications can be included when they support the customer experience.')}</small>
            </article>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function CarePlan() {
  const { t } = useI18n()
  const inclusions = ['Managed hosting', 'Backups', 'Uptime monitoring', 'Basic security monitoring', 'Dependency maintenance', 'Periodic form checks', '15 min. small changes']
  return (
    <section className="section section--care" aria-labelledby="care-title">
      <Container>
        <div className="care-intro reveal"><SectionLabel>{t('After launch')}</SectionLabel><h2 id="care-title">{t('Launch is not where support has to end.')}</h2></div>
        <div className="care-panel reveal">
          <div className="care-plan"><p>SALYIOR Care</p><div><strong>$59</strong><span>{t('/ month')}</span></div><p>{t('Quiet, practical support that keeps your website maintained after it goes live.')}</p></div>
          <ul>{inclusions.map((item) => <li key={item}><span><Icon name="check" size={16} /></span>{t(item)}</li>)}</ul>
          <div className="care-notes"><p>{t('Unused edit time does not accumulate.')}</p><p>{t('Larger work is quoted separately.')}</p><p>{t('Domain and paid third-party services remain your responsibility.')}</p></div>
        </div>
      </Container>
    </section>
  )
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const id = `faq-answer-${index}`
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <h3><button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}><span>{question}</span><i><Icon name="plus" /></i></button></h3>
      <div className="faq-answer" id={id} hidden={!open}><p>{answer}</p></div>
    </div>
  )
}

export function FAQSection() {
  const { t } = useI18n()
  const reducedMotion = useReducedMotion()
  const { active, sectionRef, select: selectQuestion } = usePinnedSequence(faqs.length, Boolean(reducedMotion))

  return (
    <section ref={sectionRef} className={`section section--faq ${reducedMotion ? 'section--faq-static' : ''}`} id="faq" aria-labelledby="faq-title" style={{ '--faq-count': faqs.length } as React.CSSProperties}>
      <div className="faq-sticky">
        <Container className="faq-grid">
          <div className="faq-heading reveal"><SectionLabel>{t('FAQ')}</SectionLabel><h2 id="faq-title">{t('Before we build.')}</h2><p>{t('One clear answer at a time. Scroll to move through the questions clients usually ask first.')}</p><span className="faq-count">{String(active + 1).padStart(2, '0')} <i /> {String(faqs.length).padStart(2, '0')}</span></div>
          {reducedMotion ? (
            <div className="faq-list reveal">{faqs.map((faq, index) => <FAQItem key={faq.question} question={t(faq.question)} answer={t(faq.answer)} index={index} />)}</div>
          ) : (
            <div className="faq-sequence reveal">
              <div className="faq-card-stack">
                <article className="faq-sequence-card is-active" aria-live="polite">
                  <span>{t('Question')} {String(active + 1).padStart(2, '0')}</span>
                  <h3>{t(faqs[active].question)}</h3>
                  <p>{t(faqs[active].answer)}</p>
                </article>
              </div>
              <div className="faq-sequence-nav" aria-label={t('FAQ progress')}>
                {faqs.map((faq, index) => <button key={faq.question} type="button" className={active === index ? 'is-active' : ''} aria-label={`${t('Question')} ${index + 1}: ${t(faq.question)}`} aria-pressed={active === index} onClick={() => selectQuestion(index)}><span>{String(index + 1).padStart(2, '0')}</span></button>)}
              </div>
              <p className="faq-next">{active < faqs.length - 1 ? <>{t('Next')} · {t(faqs[active + 1].question)}</> : t('All questions covered · Keep scrolling')}</p>
            </div>
          )}
        </Container>
      </div>
    </section>
  )
}

export function FinalCTA() {
  const { t } = useI18n()
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <Container>
        <div className="final-cta__inner reveal">
          <LiquidBackdrop compact />
          <SignalGraphic className="final-cta__signal" compact />
          <p>{t('Your next customer will judge your business before contacting it.')}</p>
          <h2 id="final-cta-title">{t('Make the first')}<br />{t('impression')} <span>{t('count.')}</span></h2>
          <div><ButtonLink href="/contact">{t('Start your project')}</ButtonLink><span>{t('Custom websites from $500.')}</span></div>
        </div>
      </Container>
    </section>
  )
}

export function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
  return null
}
