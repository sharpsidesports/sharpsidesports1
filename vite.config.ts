import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // only used here for your proxy and any server‐side logic,
  // not for client code—import.meta.env.VITE_* is automatically
  // available in your React app.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react()],
    server: {
      port: Number(process.env.PORT) || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
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
      // production by default: HMR code is stripped out,
      // import.meta.env.* is statically inlined for VITE_* keys.
    },
  }
})
