import { Button } from '@/components/ui/button'
import type { Order } from '@/shared/api/contracts'
type CheckoutAlertsProps = {
  refusedOrder: Order | null
  pendingOrderId: string | null
  orderPending: boolean
  onRetryRefused: () => void
}
export function CheckoutAlerts({
  refusedOrder,
  pendingOrderId,
  orderPending,
  onRetryRefused,
}: CheckoutAlertsProps) {
  return (
    <>
      {refusedOrder ? (
        <div className="mb-8 rounded-md border border-error/50 bg-surface-card p-6" role="alert">
          <h2 className="text-lg font-bold text-error">Pagamento recusado</h2>
          <p className="mt-2 text-sm text-text-secondary">
            O pedido {refusedOrder.id} foi recusado. Seu carrinho foi preservado para tentar
            novamente.
          </p>
          <Button type="button" className="mt-4" onClick={onRetryRefused}>
            Tentar novamente
          </Button>
        </div>
      ) : null}

      {pendingOrderId && orderPending ? (
        <div className="mb-8 rounded-md border border-border bg-surface-card p-6" role="status">
          <p className="font-bold">Aguardando confirmação on-chain…</p>
          <p className="mt-1 text-sm text-text-secondary">Pedido {pendingOrderId}</p>
        </div>
      ) : null}
    </>
  )
}
