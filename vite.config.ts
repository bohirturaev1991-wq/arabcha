import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(process.env.GITHUB_RUN_NUMBER || '0') },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Arabcha — arab tilini oʻrganamiz',
        short_name: 'Arabcha',
        description: 'Arab alifbosi, talaffuz, soʻzlar va iboralar — ovoz va transkripsiya bilan',
        lang: 'uz',
        theme_color: '#0f7a5c',
        background_color: '#f6f7fb',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // чтение чтецов: один раз прослушанный аят доступен без интернета
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === 'everyayah.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'recitations',
              rangeRequests: true,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 600 },
            },
          },
        ],
      },
    }),
  ],
});
