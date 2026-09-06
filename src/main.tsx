import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './site.css'
import './black-green.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
