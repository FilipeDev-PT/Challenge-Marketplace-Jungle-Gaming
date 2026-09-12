import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

import { DetailSkeleton } from '@/components/kurio/ShimmerSkeleton'
import { EmptyState } from '@/components/kurio/EmptyState'
import { ErrorState } from '@/components/kurio/ErrorState'
import { MarketBreadcrumb } from '@/components/kurio/MarketBreadcrumb'
import { PriceEth } from '@/components/kurio/PriceEth'
import { EditionPicker } from '@/features/nft-detail/components/EditionPicker'
import { MobileNftDetail } from '@/features/nft-detail/components/MobileNftDetail'
import { NftDetailTabs } from '@/features/nft-detail/components/NftDetailTabs'
import { NftGallery } from '@/features/nft-detail/components/NftGallery'
import { NftPurchaseBar } from '@/features/nft-detail/components/NftPurchaseBar'
import { RelatedNfts } from '@/features/nft-detail/components/RelatedNfts'
import { useFavorites } from '@/features/nft-detail/hooks/useFavorites'
import { useNft, useRelatedNfts } from '@/features/nft-detail/hooks/useNft'
import { useNftBuyActions } from '@/features/nft-detail/hooks/useNftBuyActions'
import { useNftPurchaseState } from '@/features/nft-detail/hooks/useNftPurchaseState'
import { isApiError } from '@/shared/api/errors'
import { useIsDesktop } from '@/shared/lib/breakpoints'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'

export function NftDetailPage({
  nftId: nftIdProp,
}: {
  nftId?: string
} = {}) {
  const params = useParams({ strict: false }) as {
    nftId?: string
    id?: string
  }
  const nftId = nftIdProp ?? params.nftId ?? params.id ?? ''
  const isDesktop = useIsDesktop()
  const nftQuery = useNft(nftId)
  const nft = nftQuery.data
  const related = useRelatedNfts(nft?.collection, nft?.id)
  const purchase = useNftPurchaseState(nft)
  const { isFavorite, toggleFavorite } = useFavorites(nft?.id)
  const { addItem, handleBuy, handleAddToCart } = useNftBuyActions(
    {
      nftId: nft?.id ?? '',
      editionId: purchase.selectedEdition?.id ?? '',
      quantity: purchase.quantity,
    },
    Boolean(purchase.selectedEdition),
  )
  const reviewCount = nft?.reviews?.length ?? 0

  useEffect(() => {
    if (nftQuery.isError || (!nftQuery.isLoading && !nft)) {
      clearLcpBoot()
    }
  }, [nft, nftQuery.isError, nftQuery.isLoading])

  if (!nftId) {
    return (
      <div className="py-10">
        <ErrorState title="NFT inválido" description="Identificador ausente na URL." />
      </div>
    )
  }
  if (nftQuery.isLoading) {
    return <DetailSkeleton />
  }
  if (nftQuery.isError) {
    const notFound = isApiError(nftQuery.error) && nftQuery.error.code === 'not_found'
    return (
      <div className="py-10">
        <ErrorState
          title={notFound ? 'NFT não encontrado' : 'Falha ao carregar'}
          description={
            notFound
              ? 'Este item não existe ou foi removido do catálogo.'
              : 'Não foi possível carregar os detalhes. Tente novamente.'
          }
          onRetry={notFound ? undefined : () => void nftQuery.refetch()}
        />
      </div>
    )
  }
  if (!nft) {
    return (
      <div className="py-10">
        <EmptyState title="NFT indisponível" />
      </div>
    )
  }
  const gallerySource = nft.imageUrl
  const gallery =
    nft.gallery?.length >= 4
      ? nft.gallery.slice(0, 4)
      : [gallerySource, gallerySource, gallerySource, gallerySource]
  if (!isDesktop) {
    return (
      <MobileNftDetail
        nft={nft}
        quantity={purchase.quantity}
        maxQty={purchase.maxQty}
        editionUnavailable={purchase.editionUnavailable}
        selectedEditionId={purchase.selectedEdition?.id}
        isFavorite={isFavorite}
        addPending={addItem.isPending}
        favoritePending={toggleFavorite.isPending}
        onSelectEdition={purchase.setEditionId}
        onQuantityChange={purchase.setQuantity}
        onBuy={handleBuy}
        onAddToCart={handleAddToCart}
        onToggleFavorite={() => toggleFavorite.mutate()}
      />
    )
  }
  return (
    <div className="w-full pb-10 pt-8 text-text-primary">
      <MarketBreadcrumb />

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
        <NftGallery
          name={nft.name}
          images={gallery}
          activeIndex={purchase.activeImage}
          onSelect={purchase.setActiveImage}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-[13px] lg:max-w-[595px]">
          <div className="border-b border-border pb-3">
            <h1 className="text-[28px] font-bold leading-[37px] text-foreground md:text-[32px]">
              {nft.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-[114px] gap-y-2">
              <PriceEth
                value={nft.priceEth}
                compareAt={nft.compareAtEth}
                className="text-sm font-bold leading-4"
              />
              <p className="flex items-center gap-1 text-sm leading-5 text-text-secondary">
                <span className="mr-1 inline-flex gap-[4px] text-primary" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[15px] leading-none">
                      ★
                    </span>
                  ))}
                </span>
                {reviewCount} avaliações de colecionadores
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold leading-4 text-foreground">Sobre este NFT:</h2>
            <p className="mt-3 text-sm leading-[22px] text-text-secondary">
              {nft.summary ?? nft.description}
            </p>
          </div>

          <EditionPicker
            editions={nft.editions}
            selectedId={purchase.selectedEdition?.id}
            unavailable={purchase.editionUnavailable}
            onSelect={purchase.setEditionId}
          />

          <NftPurchaseBar
            nft={nft}
            quantity={purchase.quantity}
            maxQty={purchase.maxQty}
            editionUnavailable={purchase.editionUnavailable}
            isFavorite={isFavorite}
            addPending={addItem.isPending}
            favoritePending={toggleFavorite.isPending}
            onQuantityChange={purchase.setQuantity}
            onBuy={handleBuy}
            onToggleFavorite={() => toggleFavorite.mutate()}
          />
        </div>
      </div>

      <NftDetailTabs nft={nft} activeTab={purchase.detailTab} onTabChange={purchase.setDetailTab} />
      <RelatedNfts items={related.items} />
    </div>
  )
}
