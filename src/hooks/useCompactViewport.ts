import { useSyncExternalStore } from 'react'

const compactQuery = '(max-width: 767px)'

function subscribe(callback: () => void) {
  const media = window.matchMedia(compactQuery)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function useCompactViewport() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(compactQuery).matches,
    () => false,
  )
}
