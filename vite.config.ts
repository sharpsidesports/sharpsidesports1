import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // load any VITE_ env‑vars
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const isProd = mode === 'production'

  // your deployed “base” URL (if you’re hosting to the root, this is just “/”)
  const base = '/'

  return {
    // set your base URL here too
    base,

    // these three replacements will be baked into your final JS:
    define: {
      // our empty‐object stub for __DEFINES__
      __DEFINES__: JSON.stringify({}),

      // prevent any HMR name from leaking into prod
      __HMR_CONFIG_NAME__: isProd ? 'undefined' : JSON.stringify(''),

      // Vite’s own import.meta.env.BASE_URL replacement
      __BASE__: JSON.stringify(base),

      __SERVER_HOST__:  JSON.stringify(env.VITE_SERVER_HOST || ''),

      __HMR_PROTOCOL__:  JSON.stringify(env.VITE_HMR_PROTOCOL || '')
    },

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
            return clean +
              (clean.includes('?') ? '&' : '?') +
              `key=${env.VITE_DG_API_KEY}`
          },
        },
      },
    },

    build: {
      outDir: 'dist',
      // no extra rollup plugins needed now 🎉
    },
  }
})