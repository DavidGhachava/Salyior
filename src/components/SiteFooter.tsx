import { Link } from 'react-router-dom'
import { Brand, Container, Icon } from './Primitives'
import { SignalGraphic } from './MotionEffects'

const footerNavigation = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Studio', href: '/#studio' },
  { label: 'Process', href: '/#process' },
  { label: 'FAQ', href: '/#faq' },
]

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <Container>
        <div className="footer-lead">
          <div className="footer-status"><i />Taking on select projects</div>
          <div className="footer-lead__action">
            <p>Have a serious project in mind?</p>
            <a href="mailto:hello@salyior.com">Let’s talk <span><Icon name="arrow-up-right" /></span></a>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand"><Brand /><p>Websites built to earn trust and drive action.</p></div>
          <div className="footer-columns">
            <div><p>Explore</p>{footerNavigation.map((item) => <Link key={item.label} to={item.href}>{item.label}</Link>)}</div>
            <div><p>Contact</p><a href="mailto:hello@salyior.com">hello@salyior.com <Icon name="arrow-up-right" /></a><Link to="/contact">Project application <Icon name="arrow-right" /></Link></div>
            <div><p>Studio</p><span>Remote by design</span><span>Working worldwide</span></div>
          </div>
        </div>

        <div className="footer-signal" aria-hidden="true"><span>Attention</span><SignalGraphic compact /><span>Action</span></div>
        <div className="footer-wordmark-shell" aria-hidden="true"><div className="footer-wordmark">SALYIOR</div><i /></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} SALYIOR</p><p>Founder-led web studio</p><p>Strategy · Design · Development</p><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
      </Container>
    </footer>
  )
}
