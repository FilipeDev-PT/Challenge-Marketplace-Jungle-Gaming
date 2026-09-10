import { http, HttpResponse } from 'msw'
import { eth } from '@/shared/lib/eth'
import { db } from '@/mocks/db'
import { accountNavSeed, footerContentSeed, homeContentSeed } from '@/mocks/fixtures/cms'
import { applyScenario } from '@/mocks/scenarios'
import { COLLECTIONS, NETWORKS } from '@/mocks/fixtures/seed-meta'
export const cmsHandlers = [
  http.get('/api/home', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    return HttpResponse.json(homeContentSeed)
  }),
  http.get('/api/footer', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    return HttpResponse.json(footerContentSeed)
  }),
  http.get('/api/account/nav', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    return HttpResponse.json(accountNavSeed)
  }),
  http.get('/api/nfts/facets', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const nfts = db.listNfts()
    const collectionCounts = new Map<string, number>()
    const networkCounts = new Map<string, number>()
    let min = Number.POSITIVE_INFINITY
    let max = 0
    for (const nft of nfts) {
      collectionCounts.set(nft.collection, (collectionCounts.get(nft.collection) ?? 0) + 1)
      networkCounts.set(nft.network, (networkCounts.get(nft.network) ?? 0) + 1)
      const price = Number(nft.priceEth)
      if (Number.isFinite(price)) {
        min = Math.min(min, price)
        max = Math.max(max, price)
      }
    }
    const collections = COLLECTIONS.map((label) => ({
      id: label,
      label,
      count: collectionCounts.get(label) ?? 0,
    }))
    const networks = NETWORKS.map((id) => ({
      id,
      label: id === 'ethereum' ? 'Ethereum' : id === 'polygon' ? 'Polygon' : 'Solana',
      count: networkCounts.get(id) ?? 0,
    }))
    if (!Number.isFinite(min)) min = 0
    if (!Number.isFinite(max) || max < min) max = min
    return HttpResponse.json({
      collections,
      networks,
      priceBounds: {
        min: Number(eth(min).toFixed(2)),
        max: Number(eth(max).toFixed(2)),
      },
    })
  }),
]
