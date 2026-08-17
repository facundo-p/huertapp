/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { serviceWorker } from './scripts/plugins-build.mjs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf8')) as { version: string }

/**
 * El commit exacto que se compiló. La versión semántica dice *qué* trae; el
 * commit dice *qué bytes* tiene la persona que escribe para reportar algo, que
 * es lo que hace falta para reproducir un problema.
 */
function commit(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    // sin git (un tarball, por ejemplo) la app tiene que compilar igual
    return 'sin-git'
  }
}

// base './' → funciona en cualquier hosting estático (con hash router)
export default defineConfig({
  base: './',
  plugins: [react(), serviceWorker()],
  define: {
    __VERSION_APP__: JSON.stringify(version),
    __COMMIT_APP__: JSON.stringify(commit()),
  },
  // vitest hereda el `define` de arriba, así que los tests también ven la
  // versión sin tener que repetirla acá
  test: {
    // e2e/ es de Playwright, no de vitest
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
