import {
  addNftToCart,
  clearScenario,
  connectWallet,
  countOrdersInMockDb,
  expect,
  goToCheckoutReady,
  lastOrderIdInMockDb,
  loginAsCollector,
  setScenario,
  test,
} from './support/fixtures'
test.describe('Checkout', () => {
  test('compra completa até confirmação', async ({ page }) => {
    await goToCheckoutReady(page, 'nft-02')
    await page.getByRole('button', { name: /confirmar compra/i }).click()
    await expect(
      page.getByRole('heading', { name: /pedido confirmado|seus nfts agora estão/i }).first(),
    ).toBeVisible({
      timeout: 45000,
    })
    await expect(page.getByText(/confirmado|carteira/i).first()).toBeVisible()
  })
  test('pagamento recusado preserva carrinho', async ({ page }) => {
    await goToCheckoutReady(page, 'nft-03')
    await setScenario(page, 'payment-refused')
    await page.getByRole('button', { name: /confirmar compra/i }).click()
    await expect(page.getByRole('heading', { name: /pagamento recusado/i })).toBeVisible({
      timeout: 45000,
    })
    await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeVisible()
    await clearScenario(page)
    await page.goto('/cart')
    await expect(page.getByRole('link', { name: /neon vessel/i }).first()).toBeVisible({
      timeout: 15000,
    })
  })
  test('duplo clique não cria pedidos duplicados', async ({ page }) => {
    await goToCheckoutReady(page, 'nft-05')
    const confirm = page.getByRole('button', { name: /confirmar compra/i })
    await confirm.dblclick()
    await expect(
      page.getByRole('heading', { name: /pedido confirmado|seus nfts agora estão/i }).first(),
    ).toBeVisible({
      timeout: 45000,
    })
    await expect(page.getByRole('button', { name: /processando/i })).toHaveCount(0)
    await expect.poll(async () => countOrdersInMockDb(page), { timeout: 15000 }).toBe(1)
  })
  test('price-changed na cotação exige revalidação', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-06')
    await setScenario(page, 'price-changed')
    const quoteProbe = await page.evaluate(async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('kurio:token') ?? ''}`,
        'X-Mock-Scenario': 'price-changed',
      }
      const guestId = localStorage.getItem('kurio:guestId')
      if (guestId) headers['X-Guest-Id'] = guestId
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers,
        body: JSON.stringify({ couponCode: null }),
      })
      return res.json()
    })
    expect(quoteProbe.stale === true || (quoteProbe.warnings?.length ?? 0) > 0).toBeTruthy()
    await page.goto('/checkout')
    await page.reload()
    await expect(
      page.getByRole('heading', { name: /perfil do colecionador|pagamento com carteira/i }),
    ).toBeVisible({
      timeout: 15000,
    })
    await expect(page.getByRole('button', { name: /revalidar cotação/i })).toBeVisible({
      timeout: 25000,
    })
    await expect(page.getByText(/preço .* atualizado/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /confirmar compra/i })).toBeDisabled()
    await clearScenario(page)
  })
  test('timeout-order recupera pedido criado no mock DB', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsCollector(page)
    await page.goto('/nfts/nft-08')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: /^comprar/i }).click()
    await expect(page).toHaveURL(/\/cart/, { timeout: 10000 })
    await page.goto('/checkout')
    await expect(
      page.getByRole('heading', { name: /perfil do colecionador|pagamento com carteira/i }),
    ).toBeVisible({
      timeout: 15000,
    })
    await connectWallet(page)
    await setScenario(page, 'timeout-order')
    expect(await page.evaluate(() => sessionStorage.getItem('kurio:scenario'))).toBe(
      'timeout-order',
    )
    await page.getByRole('button', { name: /confirmar compra/i }).click()
    await expect.poll(async () => countOrdersInMockDb(page), { timeout: 45000 }).toBeGreaterThan(0)
    await clearScenario(page)
    const orderId = await lastOrderIdInMockDb(page)
    expect(orderId).toBeTruthy()
    await page.goto(`/orders/${orderId}`)
    await expect(
      page.getByRole('heading', { name: /pedido confirmado|pedido pendente/i }),
    ).toBeVisible({ timeout: 45000 })
  })
})
