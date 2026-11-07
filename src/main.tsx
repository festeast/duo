import { applyTheme } from './lib/theme'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/800.css'
import '@fontsource/nunito/900.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

applyTheme()
window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applyTheme())
