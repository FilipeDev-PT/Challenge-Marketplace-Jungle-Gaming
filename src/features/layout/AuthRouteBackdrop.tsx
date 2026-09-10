import { Suspense } from 'react'

import { CartPage, HomePage, NftDetailPage } from '@/app/lazy-pages'
import { catalogSearchDefaults } from '@/features/catalog/model/catalogSearch'
import { AuthBackdrop } from '@/features/layout/AuthBackdrop'
import { resolveAuthCloseHref } from '@/shared/lib/navigation'

type AuthRouteBackdropProps = {
  from?: string
  redirect?: string
}

export function AuthRouteBackdrop({ from, redirect }: AuthRouteBackdropProps) {
  const path = resolveAuthCloseHref(from, redirect)
  const nftMatch = path.match(/^\/nfts\/([^/?#]+)/)
  const nftId = nftMatch?.[1]

  return (
    <div className="pointer-events-none select-none" aria-hidden>
      <Suspense fallback={<div className="py-20 text-center text-text-secondary/50">Carregando…</div>}>
        {nftId ? (
          <NftDetailPage nftId={nftId} />
        ) : path === '/cart' ? (
          <CartPage />
        ) : path === '/' ? (
          <HomePage search={catalogSearchDefaults} onSearchChange={() => undefined} />
        ) : (
          <AuthBackdrop />
        )}
      </Suspense>
    </div>
  )
}
