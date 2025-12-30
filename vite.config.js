import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['scoreflo.png', 'favicon.ico'],
            workbox: {
                // Cache all static assets
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                // Runtime caching for dynamic content
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'gstatic-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },
                ],
                // Skip waiting means new SW activates immediately
                skipWaiting: true,
                clientsClaim: true,
            },
            manifest: {
                name: 'ScoreFlo - Smart SGPA Planner',
                short_name: 'ScoreFlo',
                description: 'AI-powered SGPA Calculator & Exam Study Planner for Engineering Students',
                theme_color: '#8400ff',
                background_color: '#060010',
                display: 'standalone',
                orientation: 'portrait',
                scope: '/',
                start_url: '/',
                categories: ['education', 'utilities'],
                icons: [
                    {
                        src: 'scoreflo.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'scoreflo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    build: {
        // Optimize for production
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    three: ['three'],
                },
            },
        },
    },
});
