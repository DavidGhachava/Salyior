import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { domAnimation, LazyMotion } from 'framer-motion'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(<StrictMode><I18nProvider><LazyMotion features={domAnimation} strict><App /></LazyMotion></I18nProvider></StrictMode>)
