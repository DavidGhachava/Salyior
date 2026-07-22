import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'check'
  | 'chevron-down'
  | 'close'
  | 'menu'
  | 'plus'

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    'arrow-up-right': <><path d="M5 13 13 5" /><path d="M6 5h7v7" /></>,
    'arrow-right': <><path d="M4 9h10" /><path d="m10 5 4 4-4 4" /></>,
    check: <path d="m4 9 3 3 7-7" />,
    'chevron-down': <path d="m5 7 4 4 4-4" />,
    close: <><path d="m5 5 8 8" /><path d="m13 5-8 8" /></>,
    menu: <><path d="M3 6h12" /><path d="M3 12h12" /></>,
    plus: <><path d="M9 3v12" /><path d="M3 9h12" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </g>
    </svg>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="SALYIOR">
      <img className="brand__mark" src="/brand/salyior-mark.webp" width="56" height="52" alt="" decoding="async" />
      {!compact && <span className="brand__word">SALYIOR</span>}
    </span>
  )
}

type ButtonLinkProps = PropsWithChildren<{
  href: string
  variant?: 'primary' | 'secondary' | 'text'
  className?: string
  icon?: 'arrow-up-right' | 'arrow-right'
}> & AnchorHTMLAttributes<HTMLAnchorElement>

export function ButtonLink({
  href,
  variant = 'primary',
  className = '',
  icon = 'arrow-up-right',
  children,
  ...props
}: ButtonLinkProps) {
  const classes = `button button--${variant} ${className}`.trim()
  const content = <>{children}<Icon name={icon} /></>

  if (href.startsWith('/')) {
    return <Link to={href} className={classes} {...props}>{content}</Link>
  }

  const safeRel = props.target === '_blank'
    ? Array.from(new Set(`${props.rel || ''} noopener noreferrer`.trim().split(/\s+/))).join(' ')
    : props.rel
  return <a href={href} className={classes} {...props} rel={safeRel}>{content}</a>
}

export function Button({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button button--primary ${className}`.trim()} {...props}>{children}</button>
}

export function Container({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`container ${className}`.trim()}>{children}</div>
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <p className="section-label"><span aria-hidden="true" />{children}</p>
}

export function SectionIntro({
  label,
  title,
  copy,
}: {
  label: string
  title: ReactNode
  copy?: string
}) {
  return (
    <header className="section-intro reveal">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2>{title}</h2>
      </div>
      {copy && <p className="section-intro__copy">{copy}</p>}
    </header>
  )
}
