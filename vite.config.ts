import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' → funciona en cualquier hosting estático (con hash router)
export default defineConfig({
  base: './',
  plugins: [react()],
})
