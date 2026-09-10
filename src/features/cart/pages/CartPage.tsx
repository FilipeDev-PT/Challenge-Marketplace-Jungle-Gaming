import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
import { useApplyCoupon } from '@/features/cart/hooks/useApplyCoupon'
import { useCart } from '@/features/cart/hooks/useCart'
import { useCartMutations } from '@/features/cart/hooks/useCartMutations'
import { useCartRelated } from '@/features/cart/hooks/useCartRelated'
import { useQuote } from '@/features/cart/hooks/useQuote'
import { CartSummarySkeleton, EmptyState, ErrorState, MarketBreadcrumb } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CART_ROW_GRID, CartLineItem } from '@/features/cart/components/CartLineItem'
import { CartRelatedStrip } from '@/features/cart/components/CartRelatedStrip'
import { CartSummary } from '@/features/cart/components/CartSummary'
import { MobileCart } from '@/features/cart/components/MobileCart'
import { useIsDesktop } from '@/shared/lib/breakpoints'
export function CartPage() {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const { isAuthenticated } = useAuth()
  const cartQuery = useCart()
  const relatedQuery = useCartRelated()
  const { updateItem, removeItem } = useCartMutations()
  const couponCode = cartQuery.data?.couponCode ?? null
  const { couponInput, setCouponDraft, applyCoupon } = useApplyCoupon(couponCode)
  const quoteQuery = useQuote(couponCode, {
    enabled: Boolean(cartQuery.data?.items.length),
  })
  const goCheckout = () => {
    if (!isAuthenticated) {
      void navigate({ to: '/login', search: { redirect: '/checkout', from: '/cart' } })
      return
    }
    void navigate({ to: '/checkout' })
  }
  if (cartQuery.isLoading) {
    return (
      <div className="grid gap-8 py-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
        <CartSummarySkeleton />
      </div>
    )
  }
  if (cartQuery.isError) {
    return (
      <div className="py-10">
        <ErrorState
          title="Não foi possível carregar o carrinho"
          onRetry={() => void cartQuery.refetch()}
        />
      </div>
    )
  }
  const items = cartQuery.data?.items ?? []
  if (!items.length) {
    return (
      <div className="py-10">
        <EmptyState
          title="Seu carrinho está vazio"
          description="Explore o mercado e adicione NFTs para continuar."
          action={
            <Button asChild>
              <Link to="/">Ir ao catálogo</Link>
            </Button>
          }
        />
      </div>
    )
  }
  if (!isDesktop) {
    return (
      <MobileCart
        items={items}
        couponInput={couponInput}
        couponCode={couponCode}
        quote={quoteQuery.data}
        quoteLoading={quoteQuery.isLoading || quoteQuery.isFetching}
        quoteError={quoteQuery.isError}
        applyPending={applyCoupon.isPending}
        updatePending={updateItem.isPending}
        removePending={removeItem.isPending}
        onCouponChange={setCouponDraft}
        onApplyCoupon={() => applyCoupon.mutate(couponInput.trim())}
        onRemoveCoupon={() => {
          setCouponDraft('')
          applyCoupon.mutate(null)
        }}
        onRetryQuote={() => void quoteQuery.refetch()}
        onCheckout={goCheckout}
        onQuantityChange={(id, quantity) => updateItem.mutate({ id, quantity })}
        onRemove={(id) => removeItem.mutate(id)}
      />
    )
  }
  return (
    <div className="w-full pb-10 pt-8">
      <MarketBreadcrumb current="Carrinho" />

      <div className="mt-7 flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-[86px]">
        <div className="min-w-0 w-full lg:max-w-[782px] lg:flex-1">
          <div className={`mb-3 hidden text-sm leading-4 text-text-secondary ${CART_ROW_GRID}`}>
            <span>NFTs</span>
            <span>Preço</span>
            <span>Edições</span>
            <span>Total</span>
            <span className="sr-only">Remover</span>
          </div>
          <div className="mb-3 hidden h-px bg-border md:block" />

          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                updatePending={updateItem.isPending}
                removePending={removeItem.isPending}
                onQuantityChange={(quantity) => updateItem.mutate({ id: item.id, quantity })}
                onRemove={() => removeItem.mutate(item.id)}
              />
            ))}
          </ul>
        </div>

        <CartSummary
          couponInput={couponInput}
          couponCode={couponCode}
          quote={quoteQuery.data}
          quoteLoading={quoteQuery.isLoading || quoteQuery.isFetching}
          quoteError={quoteQuery.isError}
          applyPending={applyCoupon.isPending}
          onCouponChange={setCouponDraft}
          onApplyCoupon={() => applyCoupon.mutate(couponInput.trim())}
          onRemoveCoupon={() => {
            setCouponDraft('')
            applyCoupon.mutate(null)
          }}
          onRetryQuote={() => void quoteQuery.refetch()}
          onCheckout={goCheckout}
        />
      </div>

      <CartRelatedStrip items={relatedQuery.data?.items ?? []} />
    </div>
  )
}
