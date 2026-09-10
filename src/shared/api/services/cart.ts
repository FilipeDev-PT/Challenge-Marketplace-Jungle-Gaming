import { api } from '@/shared/api/client'
import { cartSchema, type Cart } from '@/shared/api/contracts'
export const cartApi = {
  async get(signal?: AbortSignal): Promise<Cart> {
    const { data } = await api.get('/cart', { signal })
    return cartSchema.parse(data)
  },
  async addItem(body: { nftId: string; editionId: string; quantity: number }): Promise<Cart> {
    const { data } = await api.post('/cart/items', body)
    return cartSchema.parse(data)
  },
  async updateItem(id: string, quantity: number): Promise<Cart> {
    const { data } = await api.patch(`/cart/items/${id}`, { quantity })
    return cartSchema.parse(data)
  },
  async removeItem(id: string): Promise<Cart> {
    const { data } = await api.delete(`/cart/items/${id}`)
    return cartSchema.parse(data)
  },
}
