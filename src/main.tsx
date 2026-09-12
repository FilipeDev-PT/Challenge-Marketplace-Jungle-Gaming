import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { enableMocking } from '@/mocks'
import { ensureGuestId } from '@/shared/lib/guest'
ensureGuestId()
const path = location.pathname.replace(/\/$/, '') || '/'
if (path === '/') {
  void import('@/features/catalog/pages/HomePage')
} else if (path.startsWith('/nfts/')) {
  void import('@/features/nft-detail/pages/NftDetailPage')
}
void enableMocking()
const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
