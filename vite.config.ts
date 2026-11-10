import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // GitHub Pages serves the site from /docs at the repo root.
    outDir: 'docs',
  },
  server: {
    // In development, forward /api calls to the backend so no CORS or cookie setup is needed.
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:5001',
    },
  },
})
