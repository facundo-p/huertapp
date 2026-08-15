import type { Plugin } from 'vite'

// Los scripts del repo son .mjs (se corren con node a secas). Este además lo
// importa vite.config.ts, que sí pasa por TypeScript: de ahí este tipo suelto.
export function serviceWorker(): Plugin
