import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and React-DOM into separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split Chart.js and charting libraries
          'charts-vendor': ['chart.js', 'react-chartjs-2'],
          // Split Leaflet map libraries
          'map-vendor': ['leaflet', 'react-leaflet'],
          // Split other utilities
          'utils-vendor': ['axios', 'date-fns', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false
  }
})
