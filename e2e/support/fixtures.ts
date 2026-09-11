import { test as base, expect, type Page } from '@playwright/test'
import {
  connectWallet as connectWalletHelper,
  countOrdersInMockDb,
  emitNftPrice,
  emitNftSoldOut,
  emitNftUpdated,
  fillCatalogSearch,
  filtersRoot,
  lastOrderIdInMockDb,
  MOCK_DB_KEY,
  openCatalogFilters,
  disconnectSocketClients,
  waitForSocketClients,
} from './helpers'
async function waitForMocksReady(page: Page) {
  await expect
    .poll(
      async () =>
        page.evaluate(async () => {
          try {
            const res = await fetch('/api/__mocks/health')
            if (!res.ok) return false
            const ct = res.headers.get('content-type') ?? ''
            if (!ct.includes('application/json')) return false
            const data = (await res.json()) as {
              ok?: boolean
              storageKey?: string
            }
            return data.ok === true && typeof data.storageKey === 'string'
          } catch {
            return false
          }
        }),
      { timeout: 45000, intervals: [250, 500, 1000] },
    )
    .toBe(true)
}
async function resetMocks(page: Page) {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible({
    timeout: 30000,
  })
  await waitForMocksReady(page)
  await expect
    .poll(
      async () =>
        page.evaluate(async () => {
          const res = await fetch('/api/__mocks/reset', { method: 'POST' })
          if (!res.ok) return false
          const ct = res.headers.get('content-type') ?? ''
          if (!ct.includes('application/json')) return false
          localStorage.removeItem('kurio:token')
          sessionStorage.clear()
          return true
        }),
      { timeout: 30000, intervals: [200, 400, 800] },
    )
    .toBe(true)
}
export const test = base.extend({
  page: async ({ page }, use) => {
    await resetMocks(page)
    await use(page)
  },
})
export { expect }
async function expectLoggedIn(page: Page, nameHint?: RegExp) {
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('kurio:token')), {
      timeout: 15000,
    })
    .toBeTruthy()
  const accountChip = page.getByRole('button', {
    name: nameHint ?? /kurio|alice|collector|conta|perfil/i,
  })
  const mobileProfile = page.getByRole('link', { name: /^perfil$/i })
  await expect(accountChip.or(mobileProfile).first()).toBeVisible({ timeout: 15000 })
}
export async function loginAsCollector(page: Page) {
  await page.goto('/login')
  await page.locator('#login-email').fill('collector@kurio.test')
  await page.locator('#login-password').fill('Kurio123!')
  await page.getByRole('button', { name: /^entrar$/i }).click()
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })
  await expectLoggedIn(page, /kurio|collector/i)
}
export async function loginAs(page: Page, email: string, password: string, expectName?: RegExp) {
  await page.goto('/login')
  await page.locator('#login-email').fill(email)
  await page.locator('#login-password').fill(password)
  await page.getByRole('button', { name: /^entrar$/i }).click()
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })
  await expectLoggedIn(page, expectName)
}
export async function setScenario(page: Page, scenario: string) {
  await page.evaluate((value) => sessionStorage.setItem('kurio:scenario', value), scenario)
}
export async function clearScenario(page: Page) {
  await page.evaluate(() => sessionStorage.removeItem('kurio:scenario'))
}
export async function dismissToasts(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('[data-sonner-toast]').forEach((node) => node.remove())
  })
  await expect
    .poll(async () => page.locator('[data-sonner-toast]').count(), { timeout: 3000 })
    .toBe(0)
    .catch(() => undefined)
}

export async function logout(page: Page) {
  const sidebarLogout = page.getByRole('button', { name: /^sair$/i })
  if (await sidebarLogout.isVisible().catch(() => false)) {
    await sidebarLogout.click({ noWaitAfter: true })
  } else {
    const accountChip = page.getByRole('button', {
      name: /kurio|alice|collector|conta|perfil/i,
    })
    if (!(await accountChip.first().isVisible().catch(() => false))) {
      await page.getByRole('link', { name: /^perfil$/i }).click()
      await expect(page).toHaveURL(/\/account/, { timeout: 10000 })
      if (await sidebarLogout.isVisible().catch(() => false)) {
        await sidebarLogout.click({ noWaitAfter: true })
      } else {
        await page
          .getByRole('button', { name: /kurio|alice|collector|conta|perfil/i })
          .first()
          .click()
        await page.getByRole('menuitem', { name: /^sair$/i }).click({ noWaitAfter: true })
      }
    } else {
      await accountChip.first().click()
      await page.getByRole('menuitem', { name: /^sair$/i }).click({ noWaitAfter: true })
    }
  }

  await expect(page.getByText(/sessão encerrada/i)).toBeVisible({ timeout: 10000 })
  await expect
    .poll(async () => page.evaluate(() => localStorage.getItem('kurio:token')), {
      timeout: 10000,
    })
    .toBeNull()

  if (/\/account|\/checkout|\/orders/.test(page.url())) {
    await page.goto('/')
  }

  await expect(
    page
      .getByRole('link', { name: /entrar/i })
      .or(page.getByRole('button', { name: /^entrar$/i }))
      .first(),
  ).toBeVisible({ timeout: 15000 })
}
export async function addNftToCart(page: Page, nftId = 'nft-02') {
  await page.goto(`/nfts/${nftId}`)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
  await page.getByRole('button', { name: /^comprar/i }).click()
  await expect(page).toHaveURL(/\/cart/, { timeout: 10000 })
}
export async function connectWallet(page: Page) {
  await connectWalletHelper(page)
}
export async function goToCheckoutReady(page: Page, nftId = 'nft-02') {
  await loginAsCollector(page)
  await addNftToCart(page, nftId)
  await page.goto('/checkout')
  await expect(
    page.getByRole('heading', { name: /perfil do colecionador|pagamento com carteira/i }),
  ).toBeVisible({
    timeout: 15000,
  })
  await connectWallet(page)
}
export {
  countOrdersInMockDb,
  emitNftPrice,
  emitNftSoldOut,
  emitNftUpdated,
  fillCatalogSearch,
  filtersRoot,
  lastOrderIdInMockDb,
  MOCK_DB_KEY,
  openCatalogFilters,
  disconnectSocketClients,
  waitForSocketClients,
}
