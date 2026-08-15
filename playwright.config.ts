import { defineConfig } from '@playwright/test'

// Verificación visual en viewport móvil (BRIEF §7): 390×844 @3x contra vite preview.
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  // De a uno. Los tests comparten un solo `vite preview` sobre un solo dist/, y
  // el de actualización reescribe dist/sw.js para simular un deploy nuevo: en
  // paralelo, otro test se encuentra el service worker cambiado abajo de los
  // pies y falla por algo que no tiene que ver con lo que estaba probando.
  workers: 1,
  use: {
    baseURL: 'http://localhost:4173',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
