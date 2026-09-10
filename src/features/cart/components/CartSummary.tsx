import { Link } from '@tanstack/react-router'
import { CartSummarySkeleton, ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { CouponField } from '@/features/cart/components/CouponField'
import { QuoteTotals } from '@/features/cart/components/QuoteTotals'
import type { Quote } from '@/shared/api/contracts'
type CartSummaryProps = {
  couponInput: string
  couponCode: string | null
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  applyPending: boolean
  onCouponChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  onRetryQuote: () => void
  onCheckout: () => void
}
export function CartSummary({
  couponInput,
  couponCode,
  quote,
  quoteLoading,
  quoteError,
  applyPending,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
  onRetryQuote,
  onCheckout,
}: CartSummaryProps) {
  return (
    <aside className="w-full shrink-0 lg:w-[332px]">
      <h2 className="border-b border-border pb-3 text-base font-bold leading-4 text-foreground">
        Resumo da carteira
      </h2>

      <CouponField
        variant="desktop"
        couponInput={couponInput}
        couponCode={couponCode}
        applyPending={applyPending}
        onCouponChange={onCouponChange}
        onApplyCoupon={onApplyCoupon}
        onRemoveCoupon={onRemoveCoupon}
      />

      {quoteLoading ? (
        <CartSummarySkeleton className="mt-8 border-0 p-0" />
      ) : quoteError ? (
        <ErrorState
          title="Cotação indisponível"
          description="Não foi possível calcular o total."
          onRetry={onRetryQuote}
          className="mt-8 border-0 p-0"
        />
      ) : quote ? (
        <>
          <QuoteTotals quote={quote} variant="cart-desktop" />
          <Button
            type="button"
            className="mt-6 h-10 w-full rounded-md text-sm font-bold"
            onClick={onCheckout}
          >
            Conectar e finalizar
          </Button>
          <Link
            to="/"
            className="mt-3 text-center text-sm leading-5 text-primary hover:text-primary-light"
          >
            Continuar explorando
          </Link>
        </>
      ) : null}
    </aside>
  )
}
