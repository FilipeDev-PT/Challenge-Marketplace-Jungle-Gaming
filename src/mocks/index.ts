import { markMocksReady } from '@/shared/lib/mocks-ready'

function mockServiceWorkerUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}mockServiceWorker.js`
}

export async function enableMocking(): Promise<void> {
  try {
    if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
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
