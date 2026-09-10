import { Link } from '@tanstack/react-router'
import { ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Order } from '@/shared/api/contracts'
import { isApiError } from '@/shared/api/errors'
type OrderConfirmationStatesProps = {
  orderId: string
  isLoading: boolean
  isError: boolean
  error: unknown
  order: Order | undefined
  onRetry: () => void
}
export function OrderConfirmationStates({
  orderId,
  isLoading,
  isError,
  error,
  order,
  onRetry,
}: OrderConfirmationStatesProps) {
  if (!orderId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState title="Pedido inválido" description="Identificador ausente." />
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink/80 px-4 py-10">
        <div className="w-full max-w-[578px] space-y-4 rounded-md bg-[#1a1310] p-8 md:rounded-md">
          <Skeleton className="mx-auto size-20 rounded-full" />
          <Skeleton className="mx-auto h-4 w-2/3" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }
  if (isError || !order) {
    const notFound = isApiError(error) && error.code === 'not_found'
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title={notFound ? 'Pedido não encontrado' : 'Falha ao carregar pedido'}
          onRetry={notFound ? undefined : onRetry}
        />
      </div>
    )
  }
  if (order.status === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink/80 px-4 py-10">
        <div
          role="status"
          className="w-full max-w-[578px] rounded-2xl bg-[#1a1310] px-8 py-12 text-center md:rounded-md"
        >
          <h1 className="text-xl font-bold text-foreground">Pedido pendente</h1>
          <p className="mt-3 text-sm text-text-secondary">
            Aguardando confirmação da transação. Esta página atualiza automaticamente.
          </p>
          <p className="mt-4 text-xs text-text-secondary">{order.id}</p>
        </div>
      </div>
    )
  }
  if (order.status === 'refused') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink/80 px-4 py-10">
        <div className="w-full max-w-[578px] rounded-2xl border border-error/40 bg-[#1a1310] px-8 py-12 text-center md:rounded-md">
          <h1 className="text-xl font-bold text-error">Pagamento recusado</h1>
          <p className="mt-3 text-sm text-text-secondary">
            O pagamento não foi concluído. Seu carrinho permanece disponível.
          </p>
          <Button asChild className="mt-6">
            <Link to="/cart">Voltar ao carrinho</Link>
          </Button>
        </div>
      </div>
    )
  }
  return null
}
