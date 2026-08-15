import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fuentes.css'
import './theme.css'
import App from './App'
import { registrarSW } from './lib/pwa'
import { escucharInstalacion } from './lib/instalar'

// Antes de montar: el navegador puede disparar `beforeinstallprompt` enseguida
// y ese evento, si no se agarra al vuelo, se pierde.
escucharInstalacion()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// En dev no hay sw.js (lo genera el build) y un service worker viejo cacheando
// el dev server es una tarde perdida buscando por qué no se ven los cambios.
if (import.meta.env.PROD) registrarSW()
