import { http, HttpResponse } from 'msw'
import Decimal from 'decimal.js'
import { eth, mulEth } from '@/shared/lib/eth'
import type { Quote } from '@/shared/api/contracts'
import { db } from '@/mocks/db'
import { applyScenario, getScenario } from '@/mocks/scenarios'
import { createId, jsonError, nowIso } from '@/mocks/helpers'
import type { StoredQuote } from '@/mocks/fixtures/seed'
const NETWORK_FEES: Record<string, string> = {
  ethereum: '0.003',
  polygon: '0.001',
  solana: '0.0005',
}
function bumpCartPricesForScenario(ownerKey: string): void {
  const cart = db.getCart(ownerKey)
  for (const item of cart.items) {
    const nft = db.findNft(item.nftId)
    if (!nft) continue
    nft.priceEth = eth(nft.priceEth).times(1.12).toFixed(3)
    nft.version += 1
  }
  db.save()
}
export const quotesHandlers = [
  http.post('/api/quotes', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const ownerKey = db.getOwnerKey(request)
    const body = (await request.json().catch(() => ({}))) as {
      couponCode?: string | null
      network?: 'ethereum' | 'polygon' | 'solana'
    }
    if (getScenario(request) === 'price-changed') {
      bumpCartPricesForScenario(ownerKey)
    }
    const cart = db.getCart(ownerKey)
    if (!cart.items.length) {
      return jsonError('validation', 'Carrinho vazio', 400)
    }
    const couponCode =
      body.couponCode === undefined ? cart.couponCode : body.couponCode?.trim() || null
    if (body.couponCode !== undefined) {
      db.setCartCoupon(ownerKey, couponCode)
    }
    const warnings: string[] = []
    let couponValid = false
    let discountEth = '0'
    let stale = false
    const quoteItems: StoredQuote['items'] = []
    for (const item of cart.items) {
      const nft = db.findNft(item.nftId)
      if (!nft) {
        return jsonError('gone', `NFT ${item.nftId} não está mais disponível`, 410)
      }
      const edition = nft.editions.find((e) => e.id === item.editionId)
      if (!edition) {
        return jsonError('gone', 'Edição não encontrada', 410)
      }
      const priceChanged = eth(item.unitPriceEth).comparedTo(eth(nft.priceEth)) !== 0
      const availabilityChanged =
        item.available !== edition.available || item.quantity > edition.available
      if (priceChanged) {
        stale = true
        warnings.push(`Preço de ${nft.name} foi atualizado.`)
      }
      if (availabilityChanged) {
        stale = true
        warnings.push(`Disponibilidade de ${nft.name} mudou.`)
      }
      if (edition.available <= 0) {
        return jsonError('conflict', `${nft.name} esgotado`, 409)
      }
      if (item.quantity > edition.available) {
        return jsonError('conflict', `Quantidade indisponível para ${nft.name}`, 409)
      }
      const unitPriceEth = nft.priceEth
      const lineTotalEth = mulEth(unitPriceEth, item.quantity)
      quoteItems.push({
        cartItemId: item.id,
        nftId: item.nftId,
        editionId: item.editionId,
        quantity: item.quantity,
        unitPriceEth,
        lineTotalEth,
        available: edition.available,
        priceChanged,
        availabilityChanged,
      })
    }
    const subtotal = quoteItems.reduce(
      (acc, line) => acc.plus(eth(line.lineTotalEth)),
      new Decimal(0),
    )
    const subtotalEth = subtotal.toFixed()
    if (couponCode) {
      const coupon = db.getCoupon(couponCode)
      if (!coupon || coupon.disabled) {
        warnings.push('Cupom inválido.')
        couponValid = false
      } else if (coupon.expiresAt && Date.parse(coupon.expiresAt) < Date.now()) {
        warnings.push('Cupom expirado.')
        couponValid = false
      } else {
        couponValid = true
        discountEth = subtotal.times(coupon.percentOff).dividedBy(100).toFixed()
      }
    }
    const network = body.network ?? 'ethereum'
    const networkFeeEth = NETWORK_FEES[network] ?? NETWORK_FEES.ethereum!
    const totalEth = eth(subtotalEth).minus(eth(discountEth)).plus(eth(networkFeeEth)).toFixed()
    const stored: StoredQuote = {
      quoteId: createId('quote'),
      ownerKey,
      couponCode,
      subtotalEth,
      discountEth,
      networkFeeEth,
      totalEth,
      couponValid,
      stale,
      warnings,
      items: quoteItems,
      quotedAt: nowIso(),
      network,
    }
    db.saveQuote(stored)
    const response: Quote = {
      quoteId: stored.quoteId,
      subtotalEth: stored.subtotalEth,
      discountEth: stored.discountEth,
      networkFeeEth: stored.networkFeeEth,
      totalEth: stored.totalEth,
      couponCode: stored.couponCode,
      couponValid: stored.couponValid,
      stale: stored.stale,
      warnings: stored.warnings,
      items: stored.items,
      quotedAt: stored.quotedAt,
    }
    return HttpResponse.json(response)
  }),
]
