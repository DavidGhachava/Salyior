/* oxlint-disable react/only-export-components */
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Language = 'en' | 'ka' | 'ru'

export const languages: { code: Language; short: string; label: string }[] = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ka', short: 'KA', label: 'ქართული' },
  { code: 'ru', short: 'RU', label: 'Русский' },
]

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (source: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)
type LoadedDictionary = { language: Language; values: Record<string, string> }

const localeLoaders = {
  ka: () => import('./locales/ka').then((module) => module.default),
  ru: () => import('./locales/ru').then((module) => module.default),
}

function detectLanguage(): Language {
  try {
    const saved = window.localStorage.getItem('salyior-language')
    if (saved === 'en' || saved === 'ka' || saved === 'ru') return saved
  } catch {
    // Storage can be unavailable in privacy-focused browser modes.
  }

  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
  if (preferred.some((locale) => locale.toLowerCase().startsWith('ka'))) return 'ka'
  if (preferred.some((locale) => locale.toLowerCase().startsWith('ru'))) return 'ru'
  return 'en'
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setCurrentLanguage] = useState<Language>(detectLanguage)
  const [dictionary, setDictionary] = useState<LoadedDictionary>({ language: 'en', values: {} })

  useEffect(() => {
    document.documentElement.lang = language
    if (language === 'en') {
      setDictionary({ language: 'en', values: {} })
      return
    }

    let active = true
    localeLoaders[language]().then((values) => {
      if (active) setDictionary({ language, values })
    })
    return () => {
      active = false
    }
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setCurrentLanguage(next)
    try {
      window.localStorage.setItem('salyior-language', next)
    } catch {
      // The selection still applies for the current visit.
    }
  }, [])

  const t = useCallback((source: string) => {
    if (dictionary.language === language) return dictionary.values[source] || source
    return source
  }, [dictionary, language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside I18nProvider')
  return context
}
