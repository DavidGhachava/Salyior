import { Link } from '../lib/Link'
import { useParams } from '../lib/router'
import { Process, RevealObserver } from '../components/HomeSections'
import { ProjectApplication } from '../components/ProjectApplication'
import { ProjectVisual } from '../components/ProjectVisual'
import { ButtonLink, Container, Icon, SectionLabel } from '../components/Primitives'
import { projects } from '../data/site'

function PageHero({ label, title, copy }: { label: string; title: string; copy: string }) {
  return <section className="page-hero"><Container><SectionLabel>{label}</SectionLabel><h1>{title}</h1><p>{copy}</p></Container></section>
}

const projectEvidence: Record<string, { label: string; value: string }[]> = {
  'arqi-georgia': [
    { label: 'Experience', value: 'Multi-page property platform' },
    { label: 'Customer path', value: 'Collection → private search → enquiry' },
    { label: 'Built around', value: 'Rare, high-consideration property' },
  ],
  'arrive-city-guides': [
    { label: 'Initial reach', value: 'Ljubljana · Vienna · Zagreb' },
    { label: 'Product model', value: 'Searchable and saveable city guides' },
    { label: 'Foundation', value: 'Structured to grow into a PWA' },
  ],
  'kristina-languages': [
    { label: 'Audience', value: 'Russian-speaking local learners' },
    { label: 'Foundation', value: 'Local SEO · Installable PWA' },
    { label: 'Action paths', value: 'WhatsApp · Qualified application' },
  ],
}

export function WorkPage() {
  return <main><RevealObserver /><PageHero label="Selected work" title="Proof should be visible." copy="A growing collection of real and exploratory work, presented honestly and explained through the decisions behind it." /><section className="work-index"><Container>{projects.map((project) => <article className="work-index__item reveal" key={project.slug}><Link to={`/work/${project.slug}`}><div><ProjectVisual type={project.visual} /></div><header><span>{project.number} · {project.type}</span><h2>{project.title}</h2><p>{project.summary}</p><i>View project <Icon name="arrow-up-right" /></i></header></Link></article>)}</Container></section></main>
}

export function ProjectPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <NotFoundPage />
  const projectIndex = projects.findIndex((item) => item.slug === project.slug)
  const nextProject = projects[(projectIndex + 1) % projects.length]
  return (
    <main>
      <section className={`project-page project-page--${project.visual}`}>
        <Container>
          <Link className="back-link" to="/work">← All work</Link>
          <div className="project-page__heading">
            <div><SectionLabel>{project.type}</SectionLabel><h1>{project.title}</h1></div>
            <div><p>{project.industry}</p><p>{project.commercialGoal}</p></div>
          </div>
          <div className="project-page__visual"><ProjectVisual type={project.visual} hero /></div>

          <div className="project-evidence" aria-label="Project facts">
            {projectEvidence[project.slug].map((fact, index) => <div key={fact.label}><span>0{index + 1} · {fact.label}</span><strong>{fact.value}</strong></div>)}
          </div>

          <section className="project-story" aria-labelledby="project-story-title">
            <header>
              <SectionLabel>From friction to action</SectionLabel>
              <h2 id="project-story-title">The thinking behind the interface.</h2>
              <p>Every visual decision is tied to what the customer needs to understand, trust or do next.</p>
            </header>
            <div className="project-story__steps">
              <article><span>01 · The friction</span><h3>What stood in the way.</h3><p>{project.problem}</p></article>
              <article><span>02 · The decision</span><h3>How the experience responds.</h3><p>{project.solution}</p></article>
              <article><span>03 · The outcome</span><h3>What now exists.</h3><p>{project.result}</p></article>
            </div>
          </section>

          <div className="project-delivery">
            <div><span>Commercial objective</span><h2>{project.commercialGoal}</h2></div>
            <div><span>Delivered through</span><ul>{project.services.map((service) => <li key={service}>{service}</li>)}</ul><ButtonLink href={project.url} variant="secondary" target="_blank" rel="noreferrer">Experience the live website</ButtonLink></div>
          </div>

          <div className="next-project">
            <div><span>Next project</span><Link to={`/work/${nextProject.slug}`}>{nextProject.title} <Icon name="arrow-up-right" /></Link></div>
            <ButtonLink href="/contact">Build your advantage</ButtonLink>
          </div>
        </Container>
      </section>
    </main>
  )
}

export function ServicesPage() {
  const services = [
    ['01', 'Conversion direction', 'Clarify the audience, offer, content hierarchy and most valuable next action before deciding how the site should look.'],
    ['02', 'Web design', 'Create a custom responsive interface with an editorial visual system suited to the business and its customers.'],
    ['03', 'Frontend development', 'Build a fast, accessible and maintainable website that behaves properly across devices and input methods.'],
    ['04', 'Technical SEO', 'Establish semantic structure, metadata, crawlability, performance and measurement without making ranking guarantees.'],
    ['05', 'Business integrations', 'Connect practical systems such as analytics, forms, booking, filtering, payments or content management where needed.'],
    ['06', 'Advanced website capabilities', 'Larger builds can include an installable app experience, offline access and opt-in notifications when repeat customer use makes them commercially useful.'],
  ]
  return <main><RevealObserver /><PageHero label="Capabilities" title="The complete path from discovery to action." copy="SALYIOR combines commercial direction, interface design and technical execution in one focused engagement." /><section className="services-page"><Container><div className="services-page__list">{services.map(([number, title, copy]) => <article className="reveal" key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}</div><div className="services-cta reveal"><h2>The scope should fit the objective.</h2><p>Projects begin at $500. You’ll receive a recommendation based on what the business actually needs—not a longer feature list.</p><ButtonLink href="/contact">Start a conversation</ButtonLink></div></Container></section></main>
}

export function ProcessPage() {
  return <main><RevealObserver /><PageHero label="How projects move" title="Clarity at every approval point." copy="The process is designed to keep decisions visible, feedback useful and progress easy to understand." /><Process /><section className="simple-cta"><Container><h2>Ready to define the first step?</h2><ButtonLink href="/contact">Tell us about the project</ButtonLink></Container></section></main>
}

export function ContactPage() {
  return <main className="contact-page"><RevealObserver /><ProjectApplication compact /></main>
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy'
  return <main><section className="legal-page"><Container><SectionLabel>Legal</SectionLabel><h1>{privacy ? 'Privacy notice' : 'Terms of service'}</h1><p className="legal-updated">Draft for review · July 2026</p>{privacy ? <PrivacyContent /> : <TermsContent />}</Container></section></main>
}

function PrivacyContent() {
  return <div className="legal-content"><h2>Information collected</h2><p>When you submit a project inquiry, SALYIOR receives the information you enter, such as your name, email address, business details, project requirements and preferred contact method.</p><h2>How information is used</h2><p>Inquiry information is used to review your request, respond to you, prepare a proposal and maintain necessary business records. It is not sold or added to an unrelated mailing list.</p><h2>Service providers</h2><p>Hosting, email delivery, analytics or other service providers may process limited information where required to operate the website. The final list will be documented when production providers are connected.</p><h2>Retention and your rights</h2><p>Information is kept only as long as reasonably needed for the inquiry, an active engagement or legal obligations. You may request access, correction or deletion by emailing salyiorbusiness@gmail.com.</p><h2>Cookies</h2><p>No non-essential analytics or advertising cookies will be activated without an appropriate consent mechanism.</p><h2>Contact</h2><p>Privacy questions can be sent to <a href="mailto:salyiorbusiness@gmail.com">salyiorbusiness@gmail.com</a>.</p></div>
}

function TermsContent() {
  return <div className="legal-content"><h2>Website information</h2><p>This website provides general information about SALYIOR’s services. A project begins only after both parties agree to a written scope, price, schedule and payment terms.</p><h2>Project scopes</h2><p>Deliverables, revision rounds, client responsibilities, third-party costs and ownership terms are defined in the project proposal or agreement.</p><h2>Starting prices</h2><p>“From $500” is a starting point, not a fixed quote for every project. Final pricing depends on scope, content, integrations and functionality.</p><h2>Intellectual property</h2><p>Project-specific ownership and licenses are transferred or granted as described in the applicable agreement after required payments are complete.</p><h2>Availability and liability</h2><p>SALYIOR aims to keep this website accurate and available but does not warrant uninterrupted operation. Final production terms should be reviewed for the studio’s legal jurisdiction before launch.</p><h2>Contact</h2><p>Questions can be sent to <a href="mailto:salyiorbusiness@gmail.com">salyiorbusiness@gmail.com</a>.</p></div>
}

export function NotFoundPage() {
  return <main className="not-found"><Container><span>404</span><h1>This page took a wrong turn.</h1><p>The route doesn’t exist, but the next useful step does.</p><ButtonLink href="/">Return home</ButtonLink></Container></main>
}
