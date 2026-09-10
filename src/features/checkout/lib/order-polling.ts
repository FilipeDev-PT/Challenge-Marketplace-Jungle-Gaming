import type { Order } from '@/shared/api/contracts'
import { ordersApi } from '@/shared/api/services'
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
export async function waitForOrderTerminal(
  orderId: string,
  onUpdate: (order: Order) => void,
): Promise<Order> {
  const started = Date.now()
  while (Date.now() - started < 20000) {
    const order = await ordersApi.byId(orderId)
    onUpdate(order)
    if (order.status !== 'pending') return order
    await sleep(800)
  }
  return ordersApi.byId(orderId)
}
