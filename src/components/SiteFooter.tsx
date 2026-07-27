import { Link } from '../lib/Link'
import { useI18n } from '../i18n/I18nProvider'
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
  const { t } = useI18n()
  return (
    <footer className="site-footer" id="footer">
      <Container>
        <div className="footer-lead">
          <div className="footer-status"><i />{t('Taking on select projects')}</div>
          <div className="footer-lead__action">
            <p>{t('Have a serious project in mind?')}</p>
            <a href="mailto:salyiorbusiness@gmail.com">{t('Let’s talk')} <span><Icon name="arrow-up-right" /></span></a>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand"><Brand /><p>{t('Websites built to earn trust and drive action.')}</p></div>
          <div className="footer-columns">
            <div><p>{t('Explore')}</p>{footerNavigation.map((item) => <Link key={item.label} to={item.href}>{t(item.label)}</Link>)}</div>
            <div><p>{t('Contact')}</p><a href="mailto:salyiorbusiness@gmail.com">salyiorbusiness@gmail.com <Icon name="arrow-up-right" /></a><Link to="/contact">{t('Project application')} <Icon name="arrow-right" /></Link></div>
            <div><p>{t('Studio')}</p><span>{t('Remote by design')}</span><span>{t('Working worldwide')}</span></div>
          </div>
        </div>

        <div className="footer-signal" aria-hidden="true"><span>{t('Attention')}</span><SignalGraphic compact /><span>{t('Action')}</span></div>
        <div className="footer-wordmark-shell" aria-hidden="true"><div className="footer-wordmark">SALYIOR</div><i /></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} SALYIOR</p><p>{t('Founder-led web studio')}</p><p>{t('Strategy · Design · Development')}</p><div><Link to="/privacy">{t('Privacy')}</Link><Link to="/terms">{t('Terms')}</Link><Link to="/cookies">{t('Cookies')}</Link></div></div>
      </Container>
    </footer>
  )
}
