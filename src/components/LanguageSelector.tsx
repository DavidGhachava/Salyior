import { useEffect, useRef, useState } from 'react'
import { languages, useI18n } from '../i18n/I18nProvider'
import { Icon } from './Primitives'

export function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
  const { language, setLanguage, t } = useI18n()
  const [open, setOpen] = useState(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const current = languages.find((item) => item.code === language) || languages[0]

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className={`language-selector ${mobile ? 'language-selector--mobile' : ''} ${open ? 'language-selector--open' : ''}`} ref={shellRef}>
      <button
        className="language-selector__trigger"
        type="button"
        aria-label={`${t('Language')}: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{current.short}</span>
        <Icon name="chevron-down" size={14} />
      </button>
      <div className="language-selector__menu" role="listbox" aria-label={t('Choose language')} hidden={!open}>
        <div className="language-selector__eyebrow">{t('Choose language')}</div>
        {languages.map((item) => (
          <button
            key={item.code}
            type="button"
            role="option"
            aria-selected={language === item.code}
            className={language === item.code ? 'is-active' : ''}
            onClick={() => {
              setLanguage(item.code)
              setOpen(false)
            }}
          >
            <span>{item.short}</span>
            <strong lang={item.code}>{item.label}</strong>
            <i>{language === item.code && <span />}</i>
          </button>
        ))}
      </div>
    </div>
  )
}
