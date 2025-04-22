import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const isProd = mode === 'production'

  return {
    // <-- this is the key change
    define: {
      // replace your __DEFINES__ stub with {} (JSON.stringify({}) yields "{}")
      __DEFINES__: JSON.stringify({}),
      // never emit a real HMR config name in prod
      __HMR_CONFIG_NAME__: isProd ? 'undefined' : JSON.stringify('')
    },

    plugins: [
      react()
    ],

    server: {
      port: Number(process.env.PORT) || 5173,
      proxy: {
        '/api': { target: 'http://localhost:3000', changeOrigin: true },
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
      // no extra rollup‐replace plugin needed
    },
  }
})
