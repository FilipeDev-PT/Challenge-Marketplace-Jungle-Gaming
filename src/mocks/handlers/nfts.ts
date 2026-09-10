import { http, HttpResponse } from 'msw'
import { eth } from '@/shared/lib/eth'
import type { Nft } from '@/shared/api/contracts'
import { db } from '@/mocks/db'
import { applyScenario, getScenario } from '@/mocks/scenarios'
import { jsonError, parseListParam } from '@/mocks/helpers'
function sortNfts(items: Nft[], sort: string | null): Nft[] {
  const copy = [...items]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => eth(a.priceEth).comparedTo(eth(b.priceEth)))
    case 'price-desc':
      return copy.sort((a, b) => eth(b.priceEth).comparedTo(eth(a.priceEth)))
    case 'name':
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
    case 'recent':
    default:
      return copy.sort((a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt))
  }
}
export const nftsHandlers = [
  http.get('/api/nfts', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    if (getScenario(request) === 'empty') {
      return HttpResponse.json({ items: [], page: 1, pageSize: 12, total: 0, totalPages: 0 })
    }
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
    const collections = parseListParam(url.searchParams.get('collections'))
    const networks = parseListParam(url.searchParams.get('network')).filter((n) => n !== 'all')
    const priceMin = url.searchParams.get('priceMin')
    const priceMax = url.searchParams.get('priceMax')
    const sort = url.searchParams.get('sort')
    const tab = url.searchParams.get('tab')
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1') || 1)
    const pageSize = Math.min(
      48,
      Math.max(1, Number(url.searchParams.get('pageSize') ?? '12') || 12),
    )
    let items = db.listNfts()
    if (tab === 'featured') items = items.filter((n) => n.featured)
    if (tab === 'new') items = items.filter((n) => n.isNew)
    if (tab === 'trending') items = items.filter((n) => n.trending)
    if (q) {
      items = items.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.collection.toLowerCase().includes(q) ||
          n.creator.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    if (collections.length) {
      const set = new Set(collections.map((c) => c.toLowerCase()))
      items = items.filter((n) => set.has(n.collection.toLowerCase()))
    }
    if (networks.length) {
      const set = new Set(networks.map((n) => n.toLowerCase()))
      items = items.filter((n) => set.has(n.network.toLowerCase()))
    }
    if (priceMin) {
      items = items.filter((n) => eth(n.priceEth).greaterThanOrEqualTo(eth(priceMin)))
    }
    if (priceMax) {
      items = items.filter((n) => eth(n.priceEth).lessThanOrEqualTo(eth(priceMax)))
    }
    items = sortNfts(items, sort)
    const total = items.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const pageItems = items.slice(start, start + pageSize)
    return HttpResponse.json({
      items: pageItems,
      page,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    })
  }),
  http.get('/api/nfts/:id', async ({ request, params }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const id = String(params.id)
    const nft = db.findNft(id)
    if (!nft) return jsonError('not_found', 'NFT não encontrado', 404)
    return HttpResponse.json(nft)
  }),
]
