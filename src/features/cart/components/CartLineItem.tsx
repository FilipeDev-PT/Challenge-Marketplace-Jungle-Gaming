import { Link } from '@tanstack/react-router'
import { QuantityStepper } from '@/components/kurio'
import { DeleteIcon } from '@/components/kurio/icons'
import type { CartItem } from '@/shared/api/contracts'
import { formatEth, mulEth } from '@/shared/lib/eth'
import { cn } from '@/shared/lib/cn'
export const CART_ROW_GRID =
  'md:grid md:grid-cols-[250px_77px_75px_87px_24px] md:items-center md:gap-x-[61px]'
type CartLineItemProps = {
  item: CartItem
  updatePending: boolean
  removePending: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}
export function CartLineItem({
  item,
  updatePending,
  removePending,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  const lineTotal = mulEth(item.unitPriceEth, item.quantity)
  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-lg bg-surface-card/80 p-3 md:h-[70px] md:rounded-none md:p-0',
        CART_ROW_GRID,
      )}
    >
      <div className="flex min-w-0 items-center gap-4 md:w-[250px] md:gap-4">
        <Link
          to="/nfts/$nftId"
          params={{ nftId: item.nftId }}
          className="size-[70px] shrink-0 overflow-hidden rounded-md bg-ink-soft"
        >
          <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
        </Link>
        <div className="min-w-0">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: item.nftId }}
            className="block truncate text-sm font-bold leading-4 text-foreground hover:text-text-accent"
          >
            {item.name}
          </Link>
          <p className="mt-[6px] text-sm leading-4 text-text-secondary">
            ID do token: #{item.tokenId ?? item.nftId.replace(/\D/g, '')}
          </p>
          {item.available < item.quantity ? (
            <p className="mt-1 text-xs text-error">Disponibilidade reduzida</p>
          ) : null}
        </div>
      </div>

      <span className="text-sm leading-4 text-foreground md:w-[77px]">
        {formatEth(item.unitPriceEth, 2)}
      </span>

      <div className="md:flex md:w-[75px] md:justify-start">
        <QuantityStepper
          variant="compact"
          value={item.quantity}
          min={1}
          max={Math.max(1, item.available)}
          disabled={updatePending}
          onChange={onQuantityChange}
        />
      </div>

      <span className="text-sm leading-4 text-primary md:w-[87px]">{formatEth(lineTotal, 2)}</span>

      <button
        type="button"
        className="size-6 shrink-0 text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:justify-self-end"
        aria-label={`Remover ${item.name}`}
        disabled={removePending}
        onClick={onRemove}
      >
        <DeleteIcon className="size-6" />
      </button>
    </li>
  )
}
