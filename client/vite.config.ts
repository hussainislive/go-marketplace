import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Isolate the framework libraries that every route shares into one
        // long-term-cacheable chunk: shipping app changes then no longer forces
        // users to re-download React/Router/Redux/Query, and it downloads in
        // parallel with the app entry. Everything else is left to Vite's
        // automatic per-route splitting (recharts already rides the lazy admin
        // chunk and never hits the home critical path).
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router') ||
            id.includes('/react-redux/') ||
            id.includes('/@reduxjs/') ||
            id.includes('/@tanstack/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
