import { markMocksReady } from '@/shared/lib/mocks-ready'
import { MSW_ENABLED } from '@/shared/lib/msw-enabled'

function mockServiceWorkerUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}mockServiceWorker.js`
}

export async function enableMocking(): Promise<void> {
  try {
    if (!MSW_ENABLED) {
      return
    }
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
      serviceWorker: {
        url: mockServiceWorkerUrl(),
        options: {
          scope: '/',
          updateViaCache: 'none',
        },
      },
    })
  } catch (error) {
    console.error('[kurio] MSW failed to start; API/socket mocks will not run.', error)
  } finally {
    markMocksReady()
  }
}
export { whenMocksReady, mocksReady } from '@/shared/lib/mocks-ready'
