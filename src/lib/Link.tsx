import type {
  AnchorHTMLAttributes,
  MouseEvent,
  PropsWithChildren,
} from 'react'
import { currentUrl, navigationEvent } from './router'

type LinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }
>

export function Link({ to, onClick, target, children, ...props }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank' ||
      props.download
    ) return

    const destination = new URL(to, window.location.href)
    if (destination.origin !== window.location.origin) return

    event.preventDefault()
    const nextUrl = `${destination.pathname}${destination.search}${destination.hash}`
    if (nextUrl !== currentUrl()) {
      window.history.pushState(null, '', nextUrl)
      window.dispatchEvent(new Event(navigationEvent))
    }
  }

  return <a href={to} target={target} onClick={handleClick} {...props}>{children}</a>
}
