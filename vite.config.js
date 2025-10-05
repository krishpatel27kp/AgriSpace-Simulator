import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nasa-api': {
        target: 'https://power.larc.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nasa-api/, ''),
        secure: false,
      }
    }
  }
})
