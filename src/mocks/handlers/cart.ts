import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/db'
import { applyScenario } from '@/mocks/scenarios'
import { jsonError } from '@/mocks/helpers'
export const cartHandlers = [
  http.get('/api/cart', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const ownerKey = db.getOwnerKey(request)
    return HttpResponse.json(db.getCart(ownerKey))
  }),
  http.post('/api/cart/items', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const body = (await request.json()) as {
      nftId?: string
      editionId?: string
      quantity?: number
    }
    const fields: Record<string, string> = {}
    if (!body.nftId) fields.nftId = 'Obrigatório'
    if (!body.editionId) fields.editionId = 'Obrigatório'
    if (!body.quantity || body.quantity < 1) fields.quantity = 'Quantidade inválida'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    try {
      const cart = db.addCartItem(db.getOwnerKey(request), {
        nftId: body.nftId!,
        editionId: body.editionId!,
        quantity: body.quantity!,
      })
      return HttpResponse.json(cart, { status: 201 })
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN'
      if (code === 'NFT_NOT_FOUND' || code === 'EDITION_NOT_FOUND') {
        return jsonError('not_found', 'Item não encontrado', 404)
      }
      if (code === 'UNAVAILABLE') {
        return jsonError('conflict', 'Edição indisponível', 409)
      }
      if (code === 'QUANTITY_EXCEEDED') {
        return jsonError('conflict', 'Quantidade excede disponibilidade', 409)
      }
      return jsonError('transient', 'Falha ao adicionar ao carrinho', 500)
    }
  }),
  http.patch('/api/cart/items/:id', async ({ request, params }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const body = (await request.json()) as {
      quantity?: number
    }
    if (!body.quantity || body.quantity < 1) {
      return jsonError('validation', 'Quantidade inválida', 400, { quantity: 'Mínimo 1' })
    }
    try {
      const cart = db.patchCartItem(db.getOwnerKey(request), String(params.id), body.quantity)
      return HttpResponse.json(cart)
    } catch (error) {
      const code = error instanceof Error ? error.message : 'UNKNOWN'
      if (code === 'ITEM_NOT_FOUND' || code === 'EDITION_NOT_FOUND') {
        return jsonError('not_found', 'Item não encontrado', 404)
      }
      if (code === 'QUANTITY_EXCEEDED') {
        return jsonError('conflict', 'Quantidade excede disponibilidade', 409)
      }
      return jsonError('transient', 'Falha ao atualizar item', 500)
    }
  }),
  http.delete('/api/cart/items/:id', async ({ request, params }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const cart = db.removeCartItem(db.getOwnerKey(request), String(params.id))
    return HttpResponse.json(cart)
  }),
]
