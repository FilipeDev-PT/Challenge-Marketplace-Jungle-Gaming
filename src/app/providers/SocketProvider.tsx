import { useEffect, useRef } from 'react'
import type { Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { whenMocksReady } from '@/shared/lib/mocks-ready'
import { queryKeys } from '@/shared/api/query-keys'
import type { Nft, Order } from '@/shared/api/contracts'
import { getOwnerKey } from '@/shared/lib/session-storage'
import { nftsApi, ordersApi, cartApi } from '@/shared/api/services'
function applyVersioned<
  T extends {
    version: number
  },
>(current: T | undefined, incoming: T): T {
  if (!current) return incoming
  if (incoming.version < current.version) return current
  return incoming
}
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { session, user, isAuthenticated } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const versionsRef = useRef<Map<string, number>>(new Map())
  useEffect(() => {
    let cancelled = false
    let socket: Socket | null = null
    void (async () => {
      await whenMocksReady()
      if (cancelled) return
      const [{ io }, contracts] = await Promise.all([
        import('socket.io-client'),
        import('@/shared/api/contracts'),
      ])
      if (cancelled) return
      const { socketEnvelopeSchema, nftSchema, orderSchema } = contracts
      const url = import.meta.env.VITE_WS_URL || '/'
      socket = io(url, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        auth: {
          token: session?.token ?? null,
          userId: user?.id ?? null,
        },
        autoConnect: true,
        reconnection: true,
      })
      socketRef.current = socket
      if (import.meta.env.VITE_ENABLE_MSW === 'true') {
        ;(
          window as Window & {
            __KURIO_SOCKET__?: Socket
          }
        ).__KURIO_SOCKET__ = socket
      }
      const onNftUpdated = (raw: unknown) => {
        const parsed = socketEnvelopeSchema.safeParse(raw)
        if (!parsed.success) return
        const envelope = parsed.data
        if (envelope.userId && user?.id && envelope.userId !== user.id) return
        const prev = versionsRef.current.get(`nft:${envelope.resourceId}`) ?? 0
        if (envelope.version < prev) return
        versionsRef.current.set(`nft:${envelope.resourceId}`, envelope.version)
        const nftParsed = nftSchema.safeParse({
          ...(queryClient.getQueryData<Nft>(queryKeys.nft(envelope.resourceId)) ?? {}),
          ...envelope.payload,
          id: envelope.resourceId,
          version: envelope.version,
        })
        if (nftParsed.success) {
          queryClient.setQueryData<Nft>(queryKeys.nft(envelope.resourceId), (old) =>
            applyVersioned(old, nftParsed.data),
          )
        }
        void queryClient.invalidateQueries({ queryKey: ['nfts'] })
        const ownerKey = getOwnerKey(user?.id)
        void queryClient.fetchQuery({
          queryKey: queryKeys.cart(ownerKey),
          queryFn: ({ signal }) => cartApi.get(signal),
        })
        toast.message('Catálogo atualizado', {
          description: 'Preço ou disponibilidade de um NFT mudou.',
        })
      }
      const onOrderUpdated = (raw: unknown) => {
        const parsed = socketEnvelopeSchema.safeParse(raw)
        if (!parsed.success) return
        const envelope = parsed.data
        if (envelope.userId && user?.id && envelope.userId !== user.id) return
        const prev = versionsRef.current.get(`order:${envelope.resourceId}`) ?? 0
        if (envelope.version < prev) return
        versionsRef.current.set(`order:${envelope.resourceId}`, envelope.version)
        const existing = queryClient.getQueryData<Order>(queryKeys.order(envelope.resourceId))
        const orderParsed = orderSchema.safeParse({
          ...(existing ?? {}),
          ...envelope.payload,
          id: envelope.resourceId,
          version: envelope.version,
        })
        if (orderParsed.success) {
          queryClient.setQueryData<Order>(queryKeys.order(envelope.resourceId), (old) =>
            applyVersioned(old, orderParsed.data),
          )
          if (orderParsed.data.status === 'confirmed') {
            toast.success('Pedido confirmado')
            void queryClient.invalidateQueries({ queryKey: ['cart'] })
          } else if (orderParsed.data.status === 'refused') {
            toast.error('Pagamento recusado')
          }
        }
      }
      socket.on('nft.updated', onNftUpdated)
      socket.on('order.updated', onOrderUpdated)
      socket.on('connect', () => {
        if (!isAuthenticated) return
        void queryClient.invalidateQueries({ queryKey: ['cart'] })
        void queryClient.invalidateQueries({ queryKey: ['order'] })
      })
    })()
    return () => {
      cancelled = true
      if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
      }
      socketRef.current = null
      if (import.meta.env.VITE_ENABLE_MSW === 'true') {
        delete (
          window as Window & {
            __KURIO_SOCKET__?: Socket
          }
        ).__KURIO_SOCKET__
      }
    }
  }, [queryClient, session?.token, user?.id, isAuthenticated])
  useEffect(() => {
    if (!isAuthenticated) return
    const pendingOrderId = sessionStorage.getItem('kurio:pending-order')
    if (!pendingOrderId) return
    void ordersApi.byId(pendingOrderId).then((order) => {
      queryClient.setQueryData(queryKeys.order(order.id), order)
      if (order.status !== 'pending') {
        sessionStorage.removeItem('kurio:pending-order')
      }
    })
  }, [isAuthenticated, queryClient])
  return children
}
export async function reconcileNft(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  const nft = await nftsApi.byId(id)
  queryClient.setQueryData(queryKeys.nft(id), nft)
  return nft
}
