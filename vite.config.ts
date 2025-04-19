import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // this tells Vite: "never import/parse .html files as JS"
    //assetsInclude: ['**/*.html'],
    server: {
      // 🚨 listen on Vercel’s $PORT (default 3000) when set:
      port: Number(process.env.PORT) || 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/api/datagolf': {
          target: env.VITE_DG_API_URL,
          changeOrigin: true,
          rewrite: p => {
            const clean = p.replace(/^\/api\/datagolf/, '')
            return `${clean}${clean.includes('?') ? '&' : '?'}key=${env.VITE_DG_API_KEY}`
          }
        }
      }
    },
    plugins: [react()],          // <- no fastRefresh flag, defaults are fine
    define: {
      __STRIPE_PUBLISHABLE_KEY__: JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
      __DG_API_KEY__:            JSON.stringify(env.VITE_DG_API_KEY),
      __DG_API_URL__:            JSON.stringify(env.VITE_DG_API_URL)
    }
  }
})
