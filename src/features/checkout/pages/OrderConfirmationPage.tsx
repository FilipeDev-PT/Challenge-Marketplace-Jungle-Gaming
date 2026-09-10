import { Link, useParams } from '@tanstack/react-router'
import { MobileOrderConfirmation } from '@/features/checkout/components/MobileOrderConfirmation'
import { OrderConfirmationStates } from '@/features/checkout/components/OrderConfirmationStates'
import { OrderReceiptBody } from '@/features/checkout/components/OrderReceiptBody'
import { useOrder } from '@/features/checkout/hooks/useOrder'
import { useIsDesktop } from '@/shared/lib/breakpoints'
export function OrderConfirmationPage() {
  const params = useParams({ strict: false }) as {
    orderId?: string
  }
  const orderId = params.orderId ?? ''
  const orderQuery = useOrder(orderId)
  const isDesktop = useIsDesktop()
  const state = (
    <OrderConfirmationStates
      orderId={orderId}
      isLoading={orderQuery.isLoading}
      isError={orderQuery.isError}
      error={orderQuery.error}
      order={orderQuery.data}
      onRetry={() => void orderQuery.refetch()}
    />
  )
  if (!orderId || orderQuery.isLoading || orderQuery.isError || !orderQuery.data) {
    return state
  }
  const order = orderQuery.data
  if (order.status === 'pending' || order.status === 'refused') {
    return state
  }
  if (!isDesktop) {
    return <MobileOrderConfirmation order={order} />
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink/85 px-4 py-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        className="relative w-full max-w-[35%] overflow-hidden rounded-md bg-[#1a1310] shadow-2xl"
      >
        <Link
          to="/"
          className="absolute right-3 top-4 z-10 flex size-[18px] items-center justify-center text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Fechar e voltar ao início"
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </Link>

        <OrderReceiptBody order={order} variant="desktop" />

        <div className="h-2.5 bg-primary" aria-hidden />
      </div>
    </div>
  )
}
