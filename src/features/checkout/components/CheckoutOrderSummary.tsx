import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CartSummarySkeleton, ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { QuoteTotals } from '@/features/cart/components/QuoteTotals'
import type { WalletConnection } from '@/features/checkout/model/types'
import type { CartItem, Quote } from '@/shared/api/contracts'
import { formatEth, mulEth } from '@/shared/lib/eth'
type CheckoutOrderSummaryProps = {
  items: CartItem[]
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  needsRevalidate: boolean
  revalidatePending: boolean
  orderPending: boolean
  connection: WalletConnection
  effectiveWalletId: string
  hasWallets: boolean
  onRetryQuote: () => void
  onRevalidate: () => void
  walletSlot?: ReactNode
}
export function CheckoutOrderSummary({
  items,
  quote,
  quoteLoading,
  quoteError,
  needsRevalidate,
  revalidatePending,
  orderPending,
  connection,
  effectiveWalletId,
  hasWallets,
  onRetryQuote,
  onRevalidate,
  walletSlot,
}: CheckoutOrderSummaryProps) {
  return (
    <aside className="w-full shrink-0 lg:w-[390px]">
      <h2 className="text-base font-bold leading-4 text-foreground">Seus NFTs</h2>

      <div className="mt-4 flex justify-between border-b border-border pb-2 text-sm">
        <span>NFTs</span>
        <span>Subtotal</span>
      </div>

      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => {
          const lineTotal = mulEth(item.unitPriceEth, item.quantity)
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-md border border-border bg-surface-card/60 p-2"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="size-14 shrink-0 rounded-md object-cover"
                width={56}
                height={56}
              />
              <div className="min-w-0 flex-1 flex items-center">
                <div>
                  <p className="truncate text-sm font-bold leading-4 text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs leading-4 text-text-secondary">
                    ID do token: #{item.tokenId ?? item.nftId.replace(/\D/g, '')}
                  </p>
                </div>
                <p className="mt-0.5 ml-3 text-xs text-text-secondary">(x {item.quantity})</p>
              </div>
              <span className="shrink-0 text-sm text-primary">{formatEth(lineTotal, 2)}</span>
            </li>
          )
        })}
      </ul>

      <Link
        to="/cart"
        className="mt-4 mx-auto text-xs text-foreground hover:text-primary block text-center"
      >
        Tem um código promocional? Aplique aqui
      </Link>

      {quoteLoading ? (
        <CartSummarySkeleton className="mt-6 border-0 p-0" />
      ) : quoteError || !quote ? (
        <ErrorState
          title="Cotação indisponível"
          onRetry={onRetryQuote}
          className="mt-6 border-0 p-0"
        />
      ) : (
        <div className="mt-6 flex flex-col text-sm text-foreground">
          {quote.warnings.length ? (
            <ul
              className="mb-4 rounded-md border border-amber/40 bg-ink-soft p-3 text-text-secondary"
              role="status"
            >
              {quote.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}

          {needsRevalidate ? (
            <Button
              type="button"
              variant="outline"
              className="mb-4"
              disabled={revalidatePending}
              onClick={onRevalidate}
            >
              {revalidatePending ? 'Revalidando…' : 'Revalidar cotação'}
            </Button>
          ) : null}

          <QuoteTotals quote={quote} variant="checkout" />
        </div>
      )}

      {walletSlot}

      <Button
        type="submit"
        form="checkout-form"
        className="mt-6 h-11 w-full rounded-md text-sm font-bold"
        disabled={
          orderPending ||
          needsRevalidate ||
          !quote ||
          quoteLoading ||
          connection !== 'connected' ||
          !effectiveWalletId ||
          !hasWallets
        }
      >
        {orderPending ? 'Processando…' : 'Confirmar compra'}
      </Button>
    </aside>
  )
}
