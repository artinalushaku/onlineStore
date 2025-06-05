import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3002,
    host: '127.0.0.1', // Explicitly listen on IPv4 localhost
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Explicitly use IPv4 localhost
        changeOrigin: true,
      }
    }
  }
})
