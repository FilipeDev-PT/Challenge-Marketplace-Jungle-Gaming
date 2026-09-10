import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
type CouponFieldProps = {
  variant: 'desktop' | 'mobile'
  couponInput: string
  couponCode: string | null
  applyPending: boolean
  onCouponChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
}
export function CouponField({
  variant,
  couponInput,
  couponCode,
  applyPending,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponFieldProps) {
  if (variant === 'mobile') {
    return (
      <>
        <div className="relative flex h-12 items-center rounded-full border border-primary/45 bg-ink-soft">
          <Input
            id="coupon-mobile"
            value={couponInput}
            onChange={(event) => onCouponChange(event.target.value)}
            placeholder="Digite o código promocional..."
            className="h-full w-full rounded-full border-0 bg-primary/10 py-0 pl-4 pr-[108px] text-xs text-primary placeholder:text-primary/60 focus-visible:outline-none focus-visible:ring-0"
            disabled={applyPending}
            aria-label="Código promocional"
          />
          <Button
            type="button"
            className="absolute right-1 top-1/2 h-10 -translate-y-1/2 rounded-full bg-gradient-to-b from-primary-light to-primary-dark px-5 text-sm font-bold text-white hover:from-primary-light hover:to-primary disabled:opacity-50"
            disabled={applyPending || !couponInput.trim()}
            onClick={onApplyCoupon}
          >
            Aplicar
          </Button>
        </div>
        {couponCode ? (
          <button
            type="button"
            className="mt-2 text-xs text-primary hover:underline"
            disabled={applyPending}
            onClick={onRemoveCoupon}
          >
            Remover cupom ({couponCode})
          </button>
        ) : null}
      </>
    )
  }
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm leading-4 text-foreground">Código promocional</p>
      <div
        className={
          couponInput.trim() && !applyPending
            ? 'flex h-10 overflow-hidden rounded-md border border-primary/40'
            : 'flex h-10 overflow-hidden rounded-md border border-border-soft'
        }
      >
        <Input
          id="coupon"
          value={couponInput}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder="Digite o código promocional..."
          className="h-10 flex-1 rounded-none border-0 bg-transparent px-2 text-xs shadow-none outline-none placeholder:text-secondary focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
          disabled={applyPending}
          aria-label="Código promocional"
        />
        <Button
          type="button"
          className="h-10 w-[102px] shrink-0 rounded-none border-0 text-sm font-bold disabled:bg-primary/35 disabled:text-ink/70 disabled:opacity-100"
          disabled={applyPending || !couponInput.trim()}
          onClick={onApplyCoupon}
        >
          Aplicar
        </Button>
      </div>
      {couponCode ? (
        <button
          type="button"
          className="mt-2 text-xs text-primary hover:underline"
          disabled={applyPending}
          onClick={onRemoveCoupon}
        >
          Remover cupom
        </button>
      ) : null}
    </div>
  )
}
