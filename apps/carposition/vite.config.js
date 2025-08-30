import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // <-- 1. IMPORTA EL PLUGIN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. AÑADE Y CONFIGURA EL PLUGIN AQUÍ
    VitePWA({ 
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
      },
      manifest: {
        name: 'Car Position',
        short_name: 'CarPos',
        description: 'Una aplicación para rastrear la posición de vehículos.',
        theme_color: '#1a1a1a', // Puedes cambiar el color
        icons: [
          {
            src: 'pwa-192x192.png', // Debes crear este icono
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // y este también
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3002,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
          maps: ['mapbox-gl', '@react-google-maps/api', 'leaflet', 'react-leaflet'],
          charts: ['recharts'],
          utils: ['dayjs', 'moment', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})