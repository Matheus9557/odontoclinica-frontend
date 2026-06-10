import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),      // plugin React oficial
    tailwindcss(), // plugin Tailwind via Vite
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['tooth-add-svgrepo-com.svg'],
      manifest: {
        name: 'Odonto Clínica',
        short_name: 'OdontoApp',
        description: 'Aplicação da Odonto Clínica — gestão de pacientes, avaliações e escalas de dor.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fafafa',
        theme_color: '#1e3a8a',
        icons: [
          {
            src: '/tooth-add-svgrepo-com.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src' // permite usar @/components/ui se quiser
    }
  }
})
