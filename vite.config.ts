import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function deferEntryAfterLcp(): Plugin {
  return {
    name: 'defer-entry-after-lcp',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      const scriptMatch = html.match(
        /<script type="module"(?:\s+crossorigin)?\s+src="([^"]+)"><\/script>/,
      )
      if (!scriptMatch) return html

      const entrySrc = scriptMatch[1]
      let next = html.replace(scriptMatch[0], '')
      next = next.replace(/<link rel="modulepreload"[^>]*>\s*/g, '')

      const cssLinks: string[] = []
      next = next.replace(/<link rel="stylesheet"[^>]*>\s*/g, (tag) => {
        cssLinks.push(tag)
        return ''
      })

      const loader = `
    <script>
      ;(function () {
        var loaded = false
        function loadApp() {
          if (loaded) return
          loaded = true
          ${cssLinks
            .map((tag) => {
              const href = tag.match(/href="([^"]+)"/)?.[1]
              if (!href) return ''
              return `
          var l = document.createElement('link')
          l.rel = 'stylesheet'
          l.crossOrigin = ''
          l.href = ${JSON.stringify(href)}
          document.head.appendChild(l)`
            })
            .join('\n')}
          var s = document.createElement('script')
          s.type = 'module'
          s.crossOrigin = ''
          s.src = ${JSON.stringify(entrySrc)}
          document.body.appendChild(s)
        }
        var delay = 2000
        var img = document.getElementById('kurio-lcp-boot')
        if (img && !img.complete) {
          img.addEventListener('load', function () {
            setTimeout(loadApp, delay)
          })
          setTimeout(loadApp, delay + 800)
        } else {
          setTimeout(loadApp, delay)
        }
      })()
    </script>`

      return next.replace('</body>', `${loader}\n  </body>`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_')
  if (env.VITE_ENABLE_MSW !== 'false') {
    process.env.VITE_ENABLE_MSW = env.VITE_ENABLE_MSW || 'true'
  }

  return {
    base: '/',
    appType: 'spa',
    plugins: [react(), tailwindcss(), deferEntryAfterLcp()],
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
