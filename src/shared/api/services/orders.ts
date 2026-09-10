import { api } from '@/shared/api/client'
import { orderSchema, type Order } from '@/shared/api/contracts'
export const ordersApi = {
  async create(
    body: {
      quoteId: string
      walletId: string
      network: string
      collector: {
        name: string
        email: string
        phone?: string
      }
    },
    idempotencyKey: string,
  ): Promise<Order> {
    const { data } = await api.post('/orders', body, {
      headers: { 'Idempotency-Key': idempotencyKey },
      timeout: 20000,
    })
    return orderSchema.parse(data)
  },
  async byId(id: string, signal?: AbortSignal): Promise<Order> {
    const { data } = await api.get(`/orders/${id}`, { signal })
    return orderSchema.parse(data)
  },
}
