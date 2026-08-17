/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { serviceWorker } from './scripts/plugins-build.mjs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string }

// base './' → funciona en cualquier hosting estático (con hash router)
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  define: {
    __VERSION_APP__: JSON.stringify(version),
  },
  // vitest hereda el `define` de arriba, así que los tests también ven la
  // versión sin tener que repetirla acá
  test: {
    // e2e/ es de Playwright, no de vitest
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
