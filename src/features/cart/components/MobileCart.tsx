import { Link } from '@tanstack/react-router'
import {
  CartSummarySkeleton,
  ErrorState,
  MobileScreenHeader,
  QuantityStepper,
} from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { CouponField } from '@/features/cart/components/CouponField'
import { QuoteTotals } from '@/features/cart/components/QuoteTotals'
import type { CartItem, Quote } from '@/shared/api/contracts'
import { formatEth } from '@/shared/lib/eth'
type MobileCartProps = {
  items: CartItem[]
  couponInput: string
  couponCode: string | null
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  applyPending: boolean
  updatePending: boolean
  removePending: boolean
  onCouponChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  onRetryQuote: () => void
  onCheckout: () => void
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}
export function MobileCart({
  items,
  couponInput,
  couponCode,
  quote,
  quoteLoading,
  quoteError,
  applyPending,
  updatePending,
  removePending,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  onRetryQuote,
  onCheckout,
  onQuantityChange,
  onRemove,
}: MobileCartProps) {
  return (
    <div className="relative -mx-4 flex min-h-[100dvh] flex-col bg-ink-deep pb-[340px] font-mono text-text-primary">
      <div className="px-5 pt-3">
        <MobileScreenHeader title="Carrinho de NFTs" />
      </div>

      <ul className="mt-6 flex flex-col gap-3 px-5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-2xl bg-surface-card px-3 py-3"
          >
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.nftId }}
              className="size-[72px] shrink-0 overflow-hidden rounded-xl bg-ink-soft"
            >
              <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to="/nfts/$nftId"
                params={{ nftId: item.nftId }}
                className="block truncate text-sm font-bold leading-4 text-foreground"
              >
                {item.name}
              </Link>
              <p className="mt-1.5 text-xs leading-4 text-text-secondary">
                Edição: {item.editionLabel ?? '—'}
              </p>
              <p className="mt-2 text-sm font-bold leading-4 text-text-accent">
                {formatEth(item.unitPriceEth, 2)}
              </p>
              {item.available < item.quantity ? (
                <p className="mt-1 text-xs text-error">Disponibilidade reduzida</p>
              ) : null}
            </div>
            <QuantityStepper
              variant="outline"
              value={item.quantity}
              min={1}
              max={Math.max(1, item.available)}
              disabled={updatePending || removePending}
              onChange={(quantity) => onQuantityChange(item.id, quantity)}
              onRemove={() => onRemove(item.id)}
            />
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-surface-card px-5 pb-7 pt-5">
        <CouponField
          variant="mobile"
          couponInput={couponInput}
          couponCode={couponCode}
          applyPending={applyPending}
          onCouponChange={onCouponChange}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
        />

        {quoteLoading ? (
          <CartSummarySkeleton className="mt-5 border-0 p-0" />
        ) : quoteError ? (
          <ErrorState
            title="Cotação indisponível"
            onRetry={onRetryQuote}
            className="mt-5 border-0 p-0"
          />
        ) : quote ? (
          <>
            <QuoteTotals quote={quote} variant="cart-mobile" />
            <Button
              type="button"
              className="mt-5 h-12 w-full rounded-full text-sm font-bold text-ink"
              onClick={onCheckout}
            >
              Conectar e finalizar
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
