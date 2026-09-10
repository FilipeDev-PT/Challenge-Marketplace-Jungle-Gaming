import { useNavigate } from '@tanstack/react-router'
import { MobileScreenHeader } from '@/components/kurio'
import { OrderReceiptBody } from '@/features/checkout/components/OrderReceiptBody'
import type { Order } from '@/shared/api/contracts'
type MobileOrderConfirmationProps = {
  order: Order
}
export function MobileOrderConfirmation({ order }: MobileOrderConfirmationProps) {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink-deep font-mono text-text-primary">
      <div className="px-5 pt-3">
        <MobileScreenHeader title="Pedido confirmado" onBack={() => void navigate({ to: '/' })} />
      </div>

      <div className="mx-5 mt-4 flex flex-1 flex-col overflow-hidden rounded-[24px] bg-[#1a1310]">
        <OrderReceiptBody order={order} variant="mobile" />
        <div className="h-2.5 shrink-0 bg-primary" aria-hidden />
      </div>
    </div>
  )
}
