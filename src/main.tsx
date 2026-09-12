import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { enableMocking } from '@/mocks'
import {
  clearChunkReloadFlag,
  installChunkLoadRecovery,
  reloadOnceForChunkError,
} from '@/shared/lib/chunk-load'
import { ensureGuestId } from '@/shared/lib/guest'

installChunkLoadRecovery()
ensureGuestId()

function prefetchRoutePage(): Promise<unknown> {
  const path = location.pathname.replace(/\/$/, '') || '/'
  if (path === '/') return import('@/features/catalog/pages/HomePage')
  if (path.startsWith('/nfts/')) return import('@/features/nft-detail/pages/NftDetailPage')
  if (path === '/cart') return import('@/features/cart/pages/CartPage')
  if (path === '/checkout') return import('@/features/checkout/pages/CheckoutPage')
  if (path.startsWith('/orders/')) {
    return import('@/features/checkout/pages/OrderConfirmationPage')
  }
  if (path === '/login') return import('@/features/auth/pages/LoginPage')
  if (path === '/register') return import('@/features/auth/pages/RegisterPage')
  if (path === '/account/profile') return import('@/features/profile/pages/ProfilePage')
  if (path === '/account/wallets') return import('@/features/wallets/pages/WalletsPage')
  return Promise.resolve()
}

async function boot() {
  try {
    await prefetchRoutePage()
  } catch (error) {
    if (reloadOnceForChunkError()) return
    console.error('[kurio] Failed to prefetch the route page.', error)
  }

  await enableMocking()

  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  clearChunkReloadFlag()
}

void boot()
