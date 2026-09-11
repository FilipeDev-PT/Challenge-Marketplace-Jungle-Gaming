import { expect, loginAsCollector, test } from './support/fixtures'
test.describe('Regressão visual', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Baselines visuais só no projeto desktop')
  })
  test('home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible({
      timeout: 15000,
    })
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: false,
      animations: 'disabled',
    })
  })
  test('detalhe do primeiro NFT', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible({
      timeout: 15000,
    })
    const firstCard = page.locator('#catalog a').first()
    await expect(firstCard).toBeVisible()
    await firstCard.click()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
    await expect(page).toHaveScreenshot('nft-detail.png', {
      fullPage: false,
      animations: 'disabled',
    })
  })
  test('carrinho', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/nfts/nft-02')
    await page.getByRole('button', { name: /^comprar/i }).click()
    await expect(page).toHaveURL(/\/cart/, { timeout: 10000 })
    await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toContainText(/carrinho/i)
    await expect(page).toHaveScreenshot('cart.png', {
      fullPage: false,
      animations: 'disabled',
    })
  })
  test('checkout (autenticado)', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/nfts/nft-02')
    await page.getByRole('button', { name: /^comprar/i }).click()
    await expect(page).toHaveURL(/\/cart/, { timeout: 10000 })
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: /perfil do colecionador/i })).toBeVisible({
      timeout: 15000,
    })
    await expect(page).toHaveScreenshot('checkout.png', {
      fullPage: false,
      animations: 'disabled',
    })
  })
})
