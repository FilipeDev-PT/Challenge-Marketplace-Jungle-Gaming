import { expect, type Page } from '@playwright/test'
export const MOCK_DB_KEY = 'kurio:mock-db:v8'
export async function openCatalogFilters(page: Page) {
  const trigger = page.getByRole('button', { name: /filtros/i })
  if (await trigger.isVisible()) {
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()
  }
}
export async function filtersRoot(page: Page) {
  const dialog = page.getByRole('dialog')
  if (await dialog.isVisible().catch(() => false)) return dialog
  return page.getByRole('complementary', { name: /filtros do catálogo/i })
}
export async function fillCatalogSearch(page: Page, query: string) {
  const mobileSearch = page.getByRole('searchbox', { name: /buscar coleções/i })
  if (await mobileSearch.isVisible().catch(() => false)) {
    await mobileSearch.fill(query)
    return
  }
  const headerSearch = page.getByLabel(/buscar nfts/i)
  if (!(await headerSearch.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /abrir busca/i }).click()
  }
  await page.getByLabel(/buscar nfts/i).fill(query)
}
export async function connectWallet(page: Page) {
  const coinbase = page.getByRole('radio', { name: /coinbase wallet/i })
  const metamask = page.getByRole('radio', { name: /^metamask$/i })
  if (await coinbase.isVisible().catch(() => false)) {
    await coinbase.click()
  } else if (await metamask.isVisible().catch(() => false)) {
    await metamask.click()
  }
  await expect(page.getByRole('button', { name: /confirmar compra/i })).toBeEnabled({
    timeout: 10000,
  })
}
type NftEmitPatch = {
  priceEth?: string
  editions?: Array<{
    id: string
    label: string
    available: number
    maxPerOrder: number
  }>
}
export async function emitNftUpdated(
  page: Page,
  opts: {
    resourceId: string
    version: number
    id: string
    patch: NftEmitPatch
    userId?: string | null
  },
) {
  const res = await page.evaluate(async ({ resourceId, version, id, patch, userId }) => {
    const response = await fetch('/api/__mocks/emit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'nft.updated',
        payload: {
          id,
          resourceId,
          version,
          payload: patch,
          userId: userId ?? null,
        },
      }),
    })
    return { ok: response.ok, status: response.status, body: await response.json() }
  }, opts)
  expect(res.ok).toBeTruthy()
}
export async function emitNftPrice(
  page: Page,
  resourceId: string,
  version: number,
  priceEth: string,
  id: string,
) {
  await emitNftUpdated(page, {
    resourceId,
    version,
    id,
    patch: { priceEth },
  })
}
export async function emitNftSoldOut(page: Page, resourceId: string, version: number, id: string) {
  const editions = await page.evaluate(async (nftId) => {
    const res = await fetch(`/api/nfts/${nftId}`)
    if (!res.ok) throw new Error(`nft ${nftId} not found`)
    const nft = (await res.json()) as {
      editions: Array<{
        id: string
        label: string
        available: number
        maxPerOrder: number
      }>
    }
    return nft.editions.map((edition) => ({
      ...edition,
      available: 0,
    }))
  }, resourceId)
  await emitNftUpdated(page, {
    resourceId,
    version,
    id,
    patch: { editions },
  })
}
export async function countOrdersInMockDb(page: Page): Promise<number> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return 0
    return (
      (
        JSON.parse(raw) as {
          orders?: unknown[]
        }
      ).orders?.length ?? 0
    )
  }, MOCK_DB_KEY)
}
export async function lastOrderIdInMockDb(page: Page): Promise<string | null> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const data = JSON.parse(raw) as {
      orders?: Array<{
        id: string
      }>
    }
    return data.orders?.at(-1)?.id ?? null
  }, MOCK_DB_KEY)
}
export async function waitForSocketClients(page: Page, min = 1) {
  await expect
    .poll(
      async () =>
        page.evaluate(async () => {
          const res = await fetch('/api/__mocks/health')
          const data = (await res.json()) as {
            socketClients?: number
          }
          return data.socketClients ?? 0
        }),
      { timeout: 20000 },
    )
    .toBeGreaterThanOrEqual(min)
}
export async function disconnectSocketClients(page: Page) {
  const res = await page.evaluate(async () => {
    const response = await fetch('/api/__mocks/disconnect-sockets', { method: 'POST' })
    return { ok: response.ok, body: await response.json() }
  })
  expect(res.ok).toBeTruthy()
}
