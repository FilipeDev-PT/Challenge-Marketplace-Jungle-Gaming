import type { Quote } from '@/shared/api/contracts'
import { formatEth } from '@/shared/lib/eth'
import { formatDiscountEth } from '@/shared/lib/format-quote'
import { cn } from '@/shared/lib/cn'
type QuoteTotalsProps = {
  quote: Quote
  variant: 'cart-desktop' | 'cart-mobile' | 'checkout'
  className?: string
}
export function QuoteTotals({ quote, variant, className }: QuoteTotalsProps) {
  if (variant === 'cart-mobile') {
    return (
      <div className={cn('mt-5 flex flex-col text-sm leading-5 text-foreground', className)}>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatEth(quote.subtotalEth, 2)}</span>
        </div>
        <div className="mt-3 flex justify-between">
          <span>Desconto do lançamento</span>
          <span>{formatDiscountEth(quote.discountEth)}</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between">
            <span>Taxa de rede</span>
            <span>{formatEth(quote.networkFeeEth, 3)}</span>
          </div>
          <p className="mt-1 text-right text-xs leading-4 text-primary">Taxa estimada</p>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <span className="text-base font-bold leading-4">Total</span>
          <span className="text-lg font-bold leading-5 text-text-accent">
            {formatEth(quote.totalEth, 3)}
          </span>
        </div>
      </div>
    )
  }
  if (variant === 'checkout') {
    return (
      <>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatEth(quote.subtotalEth, 2)}</span>
        </div>
        <div className="mt-3 flex justify-between">
          <span>Desconto do lançamento</span>
          <span>{formatDiscountEth(quote.discountEth)}</span>
        </div>
        <div className="mt-3">
          <div className="flex justify-between">
            <span>Taxa de rede</span>
            <span>{formatEth(quote.networkFeeEth, 3)}</span>
          </div>
          <p className="mt-3 block text-center text-xs text-primary">Taxa estimada</p>
        </div>

        <div className="mt-3 border-t border-border pt-4">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatEth(quote.totalEth, 3)}</span>
          </div>
        </div>
      </>
    )
  }
  const warnings = quote.warnings ?? []
  return (
    <div className={cn('mt-6 flex flex-col text-sm leading-5 text-foreground', className)}>
      {warnings.length ? (
        <ul
          className="mb-4 rounded-sm border border-amber/40 bg-ink-soft p-3 text-text-secondary"
          role="status"
        >
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatEth(quote.subtotalEth, 2)}</span>
      </div>
      <div className="mt-3 flex justify-between">
        <span>Desconto do lançamento</span>
        <span>{formatDiscountEth(quote.discountEth)}</span>
      </div>
      <div className="mt-3">
        <div className="flex justify-between">
          <span>Taxa de rede</span>
          <span>{formatEth(quote.networkFeeEth, 3)}</span>
        </div>
        <p className="mt-3 text-right text-xs leading-4 text-primary">Taxa estimada</p>
      </div>

      <div className="mt-8 flex justify-between text-base font-bold leading-4">
        <span className="text-foreground">Total</span>
        <span className="text-primary">{formatEth(quote.totalEth, 3)}</span>
      </div>
    </div>
  )
}
