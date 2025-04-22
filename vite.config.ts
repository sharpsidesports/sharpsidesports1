import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // load only VITE_ vars from .env, .env.production, etc.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    // if you host under a sub‐path, set base here; otherwise '/' is fine:
    base: env.VITE_BASE_URL || '/',

    plugins: [
      react(),
    ],

    server: {
      port: Number(process.env.PORT) || 5173,
      proxy: {
        // your API server
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        // DataGolf passthrough
        '/api/datagolf': {
          target: env.VITE_DG_API_URL,
          changeOrigin: true,
          rewrite: (path) => {
            const clean = path.replace(/^\/api\/datagolf/, '')
            return clean + (clean.includes('?') ? '&' : '?') + `key=${env.VITE_DG_API_KEY}`
          },
        },
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // if you want smaller chunks, you can add manualChunks here:
      // rollupOptions: {
      //   output: {
      //     manualChunks: {
      //       vendor: ['react','react-dom', /* ... */],
      //     },
      //   },
      // },
    },

    // no replace/define blocks needed for HMR or BASE anymore!
    // Vite will correctly replace __HMR_CONFIG_NAME__, __BASE__, __MODE__, etc.
  }
})