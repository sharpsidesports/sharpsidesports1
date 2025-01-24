import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api/datagolf': {
          target: 'https://feeds.datagolf.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/datagolf\//, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Proxying request to DataGolf:', req.url);
            });
          }
        }
      }
    },
    assetsInclude: ['**/*.csv'],
    define: {
      // Expose env variables to the client
      'process.env': {},
      __SUPABASE_URL__: JSON.stringify(env.VITE_SUPABASE_URL),
      __SUPABASE_ANON_KEY__: JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  };
});