import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // grab only VITE_ vars
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  // only inject __DEFINES__ in production builds
  const defineBlock =
    mode === 'production'
      ? { __DEFINES__: JSON.stringify(env) }
      : {}

  return {
    define: defineBlock,   // <-- empty in dev, populated in prod
    plugins: [react()],
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
      // …any other build settings…
    },
  }
})