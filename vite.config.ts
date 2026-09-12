import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  if (env.VITE_ENABLE_MSW !== 'false') {
    process.env.VITE_ENABLE_MSW = env.VITE_ENABLE_MSW || 'true'
  }

  return {
    base: '/',
    appType: 'spa',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
    },
    preview: {
      port: 4173,
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      modulePreload: {
        resolveDependencies: (_filename, deps) =>
          deps.filter((dep) => {
            if (dep.includes('msw') || dep.includes('mocks') || dep.includes('socket')) {
              return false
            }
            if (dep.includes('zod')) return false
            if (dep.includes('navigation-')) return false
            if (dep.includes('kurio-')) return false
            return true
          }),
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            if (id.includes('msw') || id.includes('@mswjs')) return 'msw'
            if (id.includes('socket.io')) return 'socket'
            if (id.includes('@tanstack')) return 'tanstack'
            if (id.includes('zod')) return 'zod'
            if (
              id.includes('react-dom') ||
              id.includes('/react/') ||
              id.includes('\\react\\') ||
              id.includes('/scheduler/')
            ) {
              return 'react'
            }
          },
        },
      },
    },
  }
})
