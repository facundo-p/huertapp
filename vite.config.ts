/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { serviceWorker } from './scripts/plugins-build.mjs'

// base './' → funciona en cualquier hosting estático (con hash router)
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  test: {
    // e2e/ es de Playwright, no de vitest
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
