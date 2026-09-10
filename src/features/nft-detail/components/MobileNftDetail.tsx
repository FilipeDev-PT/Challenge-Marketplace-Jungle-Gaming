import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CartIcon,
  HeartFilledIcon,
  HeartIcon,
  StarIcon,
} from '@/components/kurio/icons'
import { PriceEth } from '@/components/kurio/PriceEth'
import { QuantityStepper } from '@/components/kurio/QuantityStepper'
import { EditionPicker } from '@/features/nft-detail/components/EditionPicker'
import { Button } from '@/components/ui/button'
import { attributeLabels, averageRating } from '@/features/nft-detail/lib/nft-view'
import type { Nft } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'
type MobileNftDetailProps = {
  nft: Nft
  quantity: number
  maxQty: number
  editionUnavailable: boolean
  selectedEditionId: string | undefined
  isFavorite: boolean
  addPending: boolean
  favoritePending: boolean
  onSelectEdition: (editionId: string) => void
  onQuantityChange: (value: number) => void
  onBuy: () => void
  onAddToCart: () => void
  onToggleFavorite: () => void
}
export function MobileNftDetail({
  nft,
  quantity,
  maxQty,
  editionUnavailable,
  selectedEditionId,
  isFavorite,
  addPending,
  favoritePending,
  onSelectEdition,
  onQuantityChange,
  onBuy,
  onAddToCart,
  onToggleFavorite,
}: MobileNftDetailProps) {
  const navigate = useNavigate()
  const attributes = attributeLabels(nft)
  const { avg, count } = averageRating(nft)
  return (
    <div className="relative -mx-4 min-h-[100dvh] bg-ink-deep pb-[200px] font-mono text-text-primary">
      <div className="px-7 pt-2">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="flex size-[35px] items-center justify-center rounded-full border border-primary/80 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Voltar"
            onClick={() => {
              if (window.history.length > 1) window.history.back()
              else void navigate({ to: '/' })
            }}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
          <button
            type="button"
            className={cn(
              'flex size-[35px] items-center justify-center rounded-full border border-primary/80 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isFavorite && 'bg-primary/20',
            )}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            aria-pressed={isFavorite}
            disabled={favoritePending}
            onClick={onToggleFavorite}
          >
            {isFavorite ? <HeartFilledIcon className="size-4" /> : <HeartIcon className="size-4" />}
          </button>
        </div>
        <div className="overflow-hidden rounded-[20px]">
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="aspect-[361/356] w-full object-cover"
            width={361}
            height={356}
            fetchPriority="high"
            onLoad={() => clearLcpBoot()}
          />
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-base font-bold leading-5 text-foreground">
            {nft.name}
          </h1>
          {count > 0 ? (
            <div className="flex h-[27px] shrink-0 items-center gap-1 rounded-full border border-primary/70 px-2.5 text-foreground">
              <StarIcon className="size-3.5 shrink-0 text-primary" />
              <span className="text-xs font-medium leading-4">
                {avg.toFixed(1)} <span className="opacity-90 text-text-secondary">({count})</span>
              </span>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-sm leading-[22px] text-text-secondary">
          {nft.summary ?? nft.description}
        </p>

        <div className="mt-5 [&_p]:font-mono [&_p]:text-base [&_p]:font-bold [&_p]:text-foreground">
          <EditionPicker
            editions={nft.editions}
            selectedId={selectedEditionId}
            unavailable={editionUnavailable}
            onSelect={onSelectEdition}
          />
        </div>

        <div className="mt-6 space-y-3 text-sm leading-5 text-text-secondary">
          <p>ID do token: #{nft.tokenId}</p>
          <p>Coleção: {nft.collectionLabel ?? nft.collection}</p>
          {attributes.length ? <p>Atributos: {attributes.join(', ')}</p> : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-ink-deep px-6 pb-7 pt-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Qtd.</span>
            <QuantityStepper
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={maxQty}
              disabled={editionUnavailable}
              variant="compact"
              label="Quantidade"
            />
          </div>
          <PriceEth value={nft.priceEth} className="text-base font-bold leading-4" />
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-[56px] flex-1 rounded-full font-mono text-sm font-bold uppercase tracking-wide text-ink"
            disabled={editionUnavailable || addPending}
            onClick={onBuy}
          >
            {addPending ? '…' : 'Comprar NFT'}
          </Button>
          <button
            type="button"
            className="flex size-[56px] shrink-0 items-center justify-center rounded-full border border-primary/70 text-text-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40"
            aria-label="Adicionar ao carrinho"
            disabled={editionUnavailable || addPending}
            onClick={onAddToCart}
          >
            <CartIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
