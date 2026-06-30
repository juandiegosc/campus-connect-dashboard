import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-day-picker/style.css'
import './shared/styles/tokens.css'
import { App } from './app/providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
