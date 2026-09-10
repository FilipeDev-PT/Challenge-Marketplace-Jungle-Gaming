import { Link } from '@tanstack/react-router'
import { HeartIcon } from '@/components/kurio/icons'
import { PriceEth } from '@/components/kurio/PriceEth'
import { cn } from '@/shared/lib/cn'
type NftCardProps = {
  id: string
  name: string
  imageUrl: string
  priceEth: string
  compareAtEth?: string | null
  className?: string
  variant?: 'desktop' | 'mobile'
  badge?: string | null
  showFavorite?: boolean
  onToggleFavorite?: () => void
  isFavorite?: boolean
}
export function NftCard({
  id,
  name,
  imageUrl,
  priceEth,
  compareAtEth,
  className,
  variant = 'desktop',
  badge,
  showFavorite,
  onToggleFavorite,
  isFavorite,
}: NftCardProps) {
  if (variant === 'mobile') {
    return (
      <div className={cn('relative w-full', className)}>
        <Link
          to="/nfts/$nftId"
          params={{ nftId: id }}
          className="group flex flex-col gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-surface-card">
            <img
              src={imageUrl}
              alt={name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              width={168}
              height={168}
            />
            {badge ? (
              <span className="absolute left-0 top-4 rounded-r-md bg-primary px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                {badge}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col gap-0.5 px-2">
            <h3 className="truncate font-mono text-sm leading-5 text-foreground">{name}</h3>
            <PriceEth
              value={priceEth}
              compareAt={compareAtEth}
              className="font-mono text-sm font-bold leading-4"
            />
          </div>
        </Link>
        {showFavorite ? (
          <button
            type="button"
            className={cn(
              'absolute right-2 top-5 flex size-7 items-center justify-center rounded-full bg-ink/40 text-foreground backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isFavorite && 'text-primary',
            )}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite?.()
            }}
          >
            <HeartIcon className="size-4" />
          </button>
        ) : null}
      </div>
    )
  }
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: id }}
      className={cn(
        'group flex w-full max-w-[258px] flex-col gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        className,
      )}
    >
      <div className="flex h-[300px] w-full items-center justify-center bg-surface-card px-1 py-6">
        <div className="relative size-[250px] overflow-hidden rounded-[15px]">
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            width={250}
            height={250}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[6px]">
        <h3 className="truncate text-base font-normal leading-4 text-foreground">{name}</h3>
        <PriceEth
          value={priceEth}
          compareAt={compareAtEth}
          className="text-[18px] font-bold leading-4"
        />
      </div>
    </Link>
  )
}
