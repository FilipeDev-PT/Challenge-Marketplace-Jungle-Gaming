import { http, HttpResponse } from 'msw'
import type { SocketEnvelope } from '@/shared/api/contracts'
import { db } from '@/mocks/db'
import {
  emitMockEvent,
  getConnectedSocketClientCount,
  disconnectAllSocketClients,
} from '@/mocks/socket'
import { jsonError } from '@/mocks/helpers'
export const metaHandlers = [
  http.post('/api/__mocks/reset', async () => {
    db.reset()
    return HttpResponse.json({ ok: true, message: 'Mock DB reset to seed' })
  }),
  http.post('/api/__mocks/disconnect-sockets', async () => {
    const disconnected = disconnectAllSocketClients()
    return HttpResponse.json({ ok: true, disconnected })
  }),
  http.post('/api/__mocks/emit', async ({ request }) => {
    const body = (await request.json()) as {
      event?: string
      payload?: SocketEnvelope
    }
    if (!body.event || !body.payload) {
      return jsonError('validation', 'event e payload são obrigatórios', 400)
    }
    const payload: SocketEnvelope = {
      id: body.payload.id || db.nextEventId(),
      resourceId: body.payload.resourceId,
      version: body.payload.version,
      payload: body.payload.payload ?? {},
      userId: body.payload.userId ?? null,
    }
    if (body.event === 'nft.updated' && payload.resourceId) {
      const nft = db.findNft(payload.resourceId)
      if (nft) {
        const patch = body.payload.payload as {
          priceEth?: string
          editions?: typeof nft.editions
        }
        if (payload.version >= nft.version) {
          db.updateNft(
            nft.id,
            {
              ...(patch.priceEth !== undefined ? { priceEth: patch.priceEth } : {}),
              ...(patch.editions !== undefined ? { editions: patch.editions } : {}),
            },
            { emit: false, userId: payload.userId },
          )
          const updated = db.findNft(payload.resourceId)
          if (updated && payload.version > updated.version) {
            updated.version = payload.version
            db.save()
          }
        }
        emitMockEvent(body.event, payload)
        return HttpResponse.json({ ok: true, emitted: body.event })
      }
    }
    if (body.event === 'order.updated' && payload.resourceId) {
      const status = (
        body.payload.payload as {
          status?: 'pending' | 'confirmed' | 'refused'
        }
      ).status
      const order = db.findOrder(payload.resourceId)
      if (order && (status === 'confirmed' || status === 'refused') && order.status === 'pending') {
        if (status === 'confirmed') {
          db.decrementEditions(
            order.items.map((item) => ({
              nftId: item.nftId,
              editionId: item.editionId,
              quantity: item.quantity,
            })),
          )
          const owner =
            typeof payload.userId === 'string' && payload.userId ? `user:${payload.userId}` : null
          if (owner) {
            db.removePurchasedFromCart(
              owner,
              order.items.map((item) => ({
                nftId: item.nftId,
                editionId: item.editionId,
                quantity: item.quantity,
              })),
            )
          }
        }
        db.updateOrderStatus(payload.resourceId, status, undefined, payload.userId)
        return HttpResponse.json({ ok: true, emitted: body.event })
      }
    }
    emitMockEvent(body.event, payload)
    return HttpResponse.json({ ok: true, emitted: body.event })
  }),
  http.get('/api/__mocks/health', async () => {
    return HttpResponse.json({
      ok: true,
      storageKey: 'kurio:mock-db:v8',
      nfts: db.listNfts().length,
      users: db.getUsers().length,
      socketClients: getConnectedSocketClientCount(),
    })
  }),
]
