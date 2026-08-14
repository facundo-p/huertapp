/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → funciona en cualquier hosting estático (con hash router)
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    // e2e/ es de Playwright, no de vitest
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
