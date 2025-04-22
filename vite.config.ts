import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
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
      rollupOptions: {
        plugins: [
          (replace as any)({
            preventAssignment: true,
            values: {
              // swap Vite's placeholder for an empty object
              __DEFINES__: '({})',
            },
          }),
        ],
      },
      // …any other build settings…
    },
  }
})