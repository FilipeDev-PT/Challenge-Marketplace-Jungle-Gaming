import { addNftToCart, expect, loginAsCollector, test } from './support/fixtures'
async function expectCartReady(page: import('@playwright/test').Page) {
  await expect(
    page
      .getByRole('navigation', { name: /breadcrumb/i })
      .or(page.getByRole('heading', { name: /carrinho/i })),
  ).toBeVisible({
    timeout: 15000,
  })
}
test.describe('Carrinho', () => {
  test('adiciona do detalhe, altera qty, remove e aplica cupom', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-02')
    await page.goto('/cart')
    await expectCartReady(page)
    await expect(page.getByRole('link', { name: /sage nomad/i }).first()).toBeVisible()
    await page.getByRole('button', { name: /aumentar quantidade/i }).click()
    await expect(page.getByRole('group', { name: /quantidade/i }).locator('output')).toHaveText(
      '2',
      { timeout: 10000 },
    )
    await page.getByLabel(/código promocional/i).fill('WELCOME10')
    await page.getByRole('button', { name: /^aplicar$/i }).click()
    await expect(page.getByText(/cupom aplicado|desconto/i).first()).toBeVisible({
      timeout: 10000,
    })
    const namedRemove = page.getByRole('button', { name: /remover sage nomad/i })
    if (await namedRemove.isVisible().catch(() => false)) {
      await namedRemove.click()
    } else {
      await page.getByRole('button', { name: /diminuir quantidade/i }).click()
      await page.getByRole('button', { name: /remover item/i }).click()
    }
    await expect(page.getByRole('heading', { name: /seu carrinho está vazio/i })).toBeVisible({
      timeout: 10000,
    })
  })
  test('persiste após reload', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-03')
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: /neon vessel/i }).first()).toBeVisible({
      timeout: 15000,
    })
    await page.reload()
    await expectCartReady(page)
    await expect(page.getByRole('link', { name: /neon vessel/i }).first()).toBeVisible()
  })
  test('convidado adiciona e mantém itens após login', async ({ page }) => {
    await addNftToCart(page, 'nft-06')
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: /ivory baron/i }).first()).toBeVisible({
      timeout: 15000,
    })
    await loginAsCollector(page)
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: /ivory baron/i }).first()).toBeVisible({
      timeout: 15000,
    })
  })
})
