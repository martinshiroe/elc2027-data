import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        id: '/',
        name: 'ELC 2027 — East League of Cameroon',
        short_name: 'ELC 2027',
        description: 'Compétition esport Honor of Kings, Mobile Legends, PUBG Mobile et Free Fire — saison 2027 de la Ligue Esport Est Cameroun.',
        theme_color: '#0e0e0e',
        background_color: '#0e0e0e',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/img/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/img/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  }
});
