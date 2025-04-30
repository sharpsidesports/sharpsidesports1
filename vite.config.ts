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
        // DataGolf passthrough (MORE SPECIFIC - should come FIRST)
        '/api/datagolf': {
          target: env.VITE_DG_API_URL,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/datagolf/, '');
            const separator = newPath.includes('?') ? '&' : '?';
            return `${newPath}${separator}key=${env.VITE_DG_API_KEY}`;
          },
          // Add configure block for debugging (optional but recommended)
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('[Proxy Req] DataGolf Target URL:', proxyReq.method, proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('[Proxy Res] DataGolf Status:', proxyRes.statusCode, req.url);
            });
            proxy.on('error', (err, req, res) => {
              console.error('[Proxy Err] DataGolf Error:', err);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
              }
              res.end('Proxy error: ' + err.message);
            });
          }
        },
        // your generic API server (LESS SPECIFIC - should come AFTER)
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
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