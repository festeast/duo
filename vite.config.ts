import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: { chunkSizeWarningLimit: 1200 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'Дуо — түрік тілін бірге үйрен',
        short_name: 'Дуо',
        lang: 'kk',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fff8ef',
        theme_color: '#fff8ef',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,woff2}'],
        globIgnores: ['push-sw.js'],
        // Хабарландыру өңдеушісі (public/push-sw.js)
        importScripts: ['push-sw.js'],
        // Аудиофайлдар бірінші рет ойнатылғанда сақталып, кейін интернетсіз де ойнайды
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/audio/'),
            handler: 'CacheFirst',
            options: { cacheName: 'duo-audio', expiration: { maxEntries: 2000 } },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/sprites/'),
            handler: 'CacheFirst',
            options: { cacheName: 'duo-sprites-v2', expiration: { maxEntries: 120 } },
          },
        ],
      },
    }),
  ],
})
