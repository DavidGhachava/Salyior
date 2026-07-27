import {
  useSyncExternalStore,
} from 'react'

export const navigationEvent = 'salyior:navigate'

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener)
  window.addEventListener('hashchange', listener)
  window.addEventListener(navigationEvent, listener)

  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener('hashchange', listener)
    window.removeEventListener(navigationEvent, listener)
  }
}

export function currentUrl() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function useLocation() {
  const url = useSyncExternalStore(subscribe, currentUrl, () => '/')
  const parsed = new URL(url, 'https://salyior.com')

  return {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
  }
}

export function useParams() {
  const { pathname } = useLocation()
  const projectMatch = pathname.match(/^\/work\/([^/]+)\/?$/)

  return {
    slug: projectMatch ? decodeURIComponent(projectMatch[1]) : undefined,
  }
}
