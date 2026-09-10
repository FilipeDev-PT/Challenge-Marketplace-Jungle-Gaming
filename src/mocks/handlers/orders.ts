import { http, HttpResponse } from 'msw'
import { eth } from '@/shared/lib/eth'
import type { Order } from '@/shared/api/contracts'
import { db } from '@/mocks/db'
import { applyScenario, applyTimeoutOrderDelay, getScenario } from '@/mocks/scenarios'
import { createId, hashBody, jsonError, nowIso } from '@/mocks/helpers'
function scheduleOrderSettlement(orderId: string, userId: string, refuse: boolean): void {
  const delayMs = 1200 + Math.random() * 800
  setTimeout(() => {
    const order = db.findOrder(orderId)
    if (!order || order.status !== 'pending') return
    if (refuse) {
      db.updateOrderStatus(orderId, 'refused', { transactionId: null, explorerUrl: null }, userId)
      return
    }
    db.decrementEditions(
      order.items.map((item) => ({
        nftId: item.nftId,
        editionId: item.editionId,
        quantity: item.quantity,
      })),
    )
    db.removePurchasedFromCart(
      `user:${userId}`,
      order.items.map((item) => ({
        nftId: item.nftId,
        editionId: item.editionId,
        quantity: item.quantity,
      })),
    )
    const tx = `0x${crypto.randomUUID().replace(/-/g, '')}`
    db.updateOrderStatus(
      orderId,
      'confirmed',
      {
        transactionId: tx,
        explorerUrl: `https://etherscan.io/tx/${tx}`,
      },
      userId,
    )
  }, delayMs)
}
export const ordersHandlers = [
  http.post('/api/orders', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim()
    if (!idempotencyKey) {
      return jsonError('validation', 'Idempotency-Key obrigatória', 400)
    }
    const body = (await request.json()) as {
      quoteId?: string
      walletId?: string
      collector?: {
        name?: string
        email?: string
        phone?: string
      }
      network?: string
    }
    const fields: Record<string, string> = {}
    if (!body.quoteId) fields.quoteId = 'Obrigatório'
    if (!body.walletId) fields.walletId = 'Obrigatório'
    if (!body.collector?.name?.trim()) fields['collector.name'] = 'Nome obrigatório'
    if (!body.collector?.email?.includes('@')) fields['collector.email'] = 'E-mail inválido'
    if (!body.network) fields.network = 'Rede obrigatória'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    const bodyHash = hashBody({
      quoteId: body.quoteId,
      walletId: body.walletId,
      collector: {
        name: body.collector!.name!.trim(),
        email: body.collector!.email!.trim().toLowerCase(),
        phone: body.collector!.phone?.trim() || null,
      },
      network: body.network,
    })
    const existing = db.getIdempotency(session.user.id, idempotencyKey)
    if (existing) {
      if (existing.bodyHash !== bodyHash) {
        return jsonError('conflict', 'Idempotency-Key reutilizada com payload diferente', 409)
      }
      const order = db.findOrder(existing.orderId)
      if (order) {
        await applyTimeoutOrderDelay(request)
        return HttpResponse.json(order)
      }
    }
    if (getScenario(request) === 'price-changed') {
      const quotePreview = db.getQuote(body.quoteId!)
      if (quotePreview) {
        for (const item of quotePreview.items) {
          const nft = db.findNft(item.nftId)
          if (nft) {
            db.updateNft(nft.id, { priceEth: eth(nft.priceEth).times(1.15).toFixed(3) })
          }
        }
      }
    }
    const quote = db.getQuote(body.quoteId!)
    if (!quote || quote.ownerKey !== `user:${session.user.id}`) {
      return jsonError('not_found', 'Cotação não encontrada', 404)
    }
    if (quote.stale) {
      return jsonError('conflict', 'Cotação desatualizada. Gere uma nova cotação.', 409)
    }
    for (const line of quote.items) {
      const nft = db.findNft(line.nftId)
      const edition = nft?.editions.find((e) => e.id === line.editionId)
      if (!nft || !edition) return jsonError('gone', 'Item indisponível', 410)
      if (eth(nft.priceEth).comparedTo(eth(line.unitPriceEth)) !== 0) {
        return jsonError('conflict', 'Preço alterado desde a cotação', 409)
      }
      if (edition.available < line.quantity) {
        return jsonError('conflict', 'Disponibilidade insuficiente', 409)
      }
    }
    const wallets = db.getWallets(session.user.id)
    const wallet = wallets.find((w) => w.id === body.walletId)
    if (!wallet) return jsonError('not_found', 'Carteira não encontrada', 404)
    const createdAt = nowIso()
    const order: Order = {
      id: createId('order'),
      status: 'pending',
      transactionId: null,
      createdAt,
      updatedAt: createdAt,
      version: 1,
      walletLabel: wallet.label,
      network: body.network!,
      explorerUrl: null,
      items: quote.items.map((line) => {
        const nft = db.findNft(line.nftId)!
        return {
          nftId: line.nftId,
          name: nft.name,
          tokenId: nft.tokenId,
          imageUrl: nft.imageUrl,
          editionId: line.editionId,
          quantity: line.quantity,
          unitPriceEth: line.unitPriceEth,
          lineTotalEth: line.lineTotalEth,
        }
      }),
      subtotalEth: quote.subtotalEth,
      discountEth: quote.discountEth,
      networkFeeEth: quote.networkFeeEth,
      totalEth: quote.totalEth,
      couponCode: quote.couponValid ? quote.couponCode : null,
      idempotencyKey,
    }
    db.addOrder(order)
    db.setIdempotency(session.user.id, idempotencyKey, {
      bodyHash,
      orderId: order.id,
    })
    const refuse = getScenario(request) === 'payment-refused'
    scheduleOrderSettlement(order.id, session.user.id, refuse)
    await applyTimeoutOrderDelay(request)
    return HttpResponse.json(order, { status: 201 })
  }),
  http.get('/api/orders/:id', async ({ request, params }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const order = db.findOrder(String(params.id))
    if (!order) return jsonError('not_found', 'Pedido não encontrado', 404)
    return HttpResponse.json(order)
  }),
]
