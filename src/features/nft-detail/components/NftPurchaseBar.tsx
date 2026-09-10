import {
  HeartFilledIcon,
  HeartIcon,
  LinkedInIcon,
  MailIcon,
  QuantityStepper,
  TwitterXIcon,
  toastUnavailable,
} from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { attributeLabels } from '@/features/nft-detail/lib/nft-view'
import type { Nft } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
type NftPurchaseBarProps = {
  nft: Nft
  quantity: number
  maxQty: number
  editionUnavailable: boolean
  isFavorite: boolean
  addPending: boolean
  favoritePending: boolean
  onQuantityChange: (value: number) => void
  onBuy: () => void
  onToggleFavorite: () => void
}
export function NftPurchaseBar({
  nft,
  quantity,
  maxQty,
  editionUnavailable,
  isFavorite,
  addPending,
  favoritePending,
  onQuantityChange,
  onBuy,
  onToggleFavorite,
}: NftPurchaseBarProps) {
  const attributes = attributeLabels(nft)
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          min={1}
          max={maxQty}
          disabled={editionUnavailable}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="h-10 w-[130px] shrink-0 rounded-md text-sm font-bold"
            disabled={editionUnavailable || addPending}
            onClick={onBuy}
          >
            {addPending ? '…' : 'COMPRAR'}
          </Button>
          <button
            type="button"
            className={cn(
              'flex h-10 w-[130px] shrink-0 items-center justify-center gap-2 rounded-md border border-primary text-sm text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isFavorite && 'bg-primary/10',
            )}
            disabled={favoritePending}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onToggleFavorite()
            }}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFavorite ? (
              <HeartFilledIcon className="size-5 shrink-0" />
            ) : (
              <HeartIcon className="size-5 shrink-0" />
            )}
            <span>Favoritar</span>
          </button>
        </div>
      </div>

      <div className="text-sm leading-5 text-text-secondary">
        <p>ID do token: #{nft.tokenId}</p>
        <p className="mt-3">Coleção: {nft.collectionLabel ?? nft.collection}</p>
        {attributes.length ? <p className="mt-3">Atributos: {attributes.join(', ')}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-foreground">Compartilhar este NFT:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Compartilhar no LinkedIn"
              className="text-foreground hover:text-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => toastUnavailable()}
            >
              <LinkedInIcon className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Compartilhar por e-mail"
              className="text-foreground hover:text-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => toastUnavailable()}
            >
              <MailIcon className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Compartilhar no Twitter"
              className="text-foreground hover:text-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => toastUnavailable()}
            >
              <TwitterXIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
