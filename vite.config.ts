import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/investeringstilbud-app/',
  plugins: [react()],
  server: {
    fs: {
      allow: ['..']
    }
  }
})
