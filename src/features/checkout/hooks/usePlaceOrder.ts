import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import type {
  CollectorFormValues,
  NetworkOption,
  WalletConnection,
} from '@/features/checkout/model/types'
import { waitForOrderTerminal } from '@/features/checkout/lib/order-polling'
import type { Order, Quote } from '@/shared/api/contracts'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { ordersApi, quotesApi } from '@/shared/api/services'
import { getOwnerKey } from '@/shared/lib/session-storage'
type UsePlaceOrderArgs = {
  quote: Quote | undefined
  effectiveWalletId: string
  network: NetworkOption
  connection: WalletConnection
}
export function usePlaceOrder({
  quote,
  effectiveWalletId,
  network,
  connection,
}: UsePlaceOrderArgs) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const ownerKey = getOwnerKey(user?.id)
  const idempotencyKeyRef = useRef<string | null>(null)
  const submittingRef = useRef(false)
  const [refusedOrder, setRefusedOrder] = useState<Order | null>(null)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
  const revalidate = useMutation({
    mutationFn: () => quotesApi.create({ couponCode: quote?.couponCode ?? null }),
    onSuccess: (nextQuote) => {
      queryClient.setQueryData(queryKeys.quote(ownerKey, nextQuote.couponCode), nextQuote)
      const stillBlocked =
        Boolean(nextQuote.stale) ||
        nextQuote.warnings.some((warning) => /preço|disponibilidade|atualiz/i.test(warning))
      toast.success(stillBlocked ? 'Cotação atualizada — revise os valores' : 'Cotação revalidada')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao revalidar cotação')
    },
  })
  const orderMutation = useMutation({
    mutationFn: async (collector: CollectorFormValues) => {
      if (submittingRef.current) throw new Error('already_submitting')
      submittingRef.current = true
      try {
        if (!quote) throw new Error('Sem cotação')
        if (!effectiveWalletId) throw new Error('Selecione uma carteira')
        if (connection !== 'connected') throw new Error('Conecte a carteira antes de pagar')
        if (
          quote.stale ||
          quote.warnings.some((warning) => /preço|disponibilidade|atualiz/i.test(warning))
        ) {
          throw new Error('Revalide a cotação antes de continuar')
        }
        if (!idempotencyKeyRef.current) {
          idempotencyKeyRef.current = crypto.randomUUID()
        }
        const order = await ordersApi.create(
          {
            quoteId: quote.quoteId,
            walletId: effectiveWalletId,
            network,
            collector: {
              name: collector.displayName,
              email: collector.email,
              phone: undefined,
            },
          },
          idempotencyKeyRef.current,
        )
        queryClient.setQueryData(queryKeys.order(order.id), order)
        sessionStorage.setItem('kurio:pending-order', order.id)
        setPendingOrderId(order.id)
        if (order.status === 'pending') {
          return waitForOrderTerminal(order.id, (next) => {
            queryClient.setQueryData(queryKeys.order(next.id), next)
          })
        }
        return order
      } finally {
        submittingRef.current = false
      }
    },
    onSuccess: async (order) => {
      if (order.status === 'confirmed') {
        sessionStorage.removeItem('kurio:pending-order')
        idempotencyKeyRef.current = null
        await queryClient.invalidateQueries({ queryKey: ['cart'] })
        await queryClient.invalidateQueries({ queryKey: ['quote'] })
        void navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
        return
      }
      if (order.status === 'refused') {
        sessionStorage.removeItem('kurio:pending-order')
        setRefusedOrder(order)
        setPendingOrderId(null)
        toast.error('Pagamento recusado')
        return
      }
      toast.message('Pedido ainda pendente — acompanhe a confirmação')
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'already_submitting') return
      toast.error(
        isApiError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Falha no pedido',
      )
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart(ownerKey) })
      void queryClient.invalidateQueries({ queryKey: ['quote', ownerKey] })
    },
  })
  const resetRefused = () => {
    setRefusedOrder(null)
    idempotencyKeyRef.current = crypto.randomUUID()
  }
  return {
    refusedOrder,
    pendingOrderId,
    revalidate,
    orderMutation,
    resetRefused,
  }
}
