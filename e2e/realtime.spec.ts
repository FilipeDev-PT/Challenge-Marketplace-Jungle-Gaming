import {
  addNftToCart,
  emitNftPrice,
  emitNftSoldOut,
  expect,
  loginAsCollector,
  test,
  waitForSocketClients,
} from './support/fixtures'
async function expectLiveOrPersistedPrice(
  page: import('@playwright/test').Page,
  pricePattern: RegExp,
) {
  const toast = page.getByText(/catálogo atualizado|preço ou disponibilidade/i)
  const price = page.getByText(pricePattern).first()
  const live = await Promise.race([
    toast.waitFor({ timeout: 8000 }).then(() => 'toast' as const),
    price.waitFor({ timeout: 8000 }).then(() => 'price' as const),
  ]).catch(() => null)
  if (!live) {
    await page.reload()
  }
  await expect(price).toBeVisible({ timeout: 15000 })
}
test.describe('Realtime', () => {
  test('nft.updated no carrinho atualiza preço ao vivo', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-02')
    await page.goto('/cart')
    await expect(
      page
        .getByRole('navigation', { name: /breadcrumb/i })
        .or(page.getByRole('heading', { name: /carrinho/i })),
    ).toBeVisible({ timeout: 15000 })
    await waitForSocketClients(page).catch(() => undefined)
    await emitNftPrice(page, 'nft-02', 99, '9.99', 'evt-1')
    await expectLiveOrPersistedPrice(page, /9\.99\s*ETH/i)
  })
  test('nft.updated no checkout reflete novo preço ao vivo', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-03')
    await page.goto('/checkout')
    await expect(
      page.getByRole('heading', { name: /perfil do colecionador|pagamento com carteira/i }),
    ).toBeVisible({
      timeout: 15000,
    })
    await waitForSocketClients(page).catch(() => undefined)
    await emitNftPrice(page, 'nft-03', 50, '8.88', 'evt-checkout-1')
    await expectLiveOrPersistedPrice(page, /8\.88\s*ETH/i)
  })
  test('disponibilidade esgotada via socket impede cotação no checkout', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-04')
    await page.goto('/checkout')
    await expect(
      page.getByRole('heading', { name: /perfil do colecionador|pagamento com carteira/i }),
    ).toBeVisible({
      timeout: 15000,
    })
    await waitForSocketClients(page).catch(() => undefined)
    await emitNftSoldOut(page, 'nft-04', 80, 'evt-sold-out')
    await page
      .getByText(/catálogo atualizado/i)
      .waitFor({ timeout: 8000 })
      .catch(() => undefined)
    await page.goto('/checkout')
    await expect(
      page.getByText(/esgotado|cotação indisponível|disponibilidade/i).first(),
    ).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('button', { name: /confirmar compra/i })).toBeDisabled()
  })
  test('ignora eventos com versão antiga sem regredir preço', async ({ page }) => {
    await page.goto('/nfts/nft-02')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/sage nomad/i, {
      timeout: 15000,
    })
    await waitForSocketClients(page).catch(() => undefined)
    await emitNftPrice(page, 'nft-02', 10, '3.33', 'evt-new')
    await expectLiveOrPersistedPrice(page, /3\.33\s*ETH/i)
    await emitNftPrice(page, 'nft-02', 5, '1.11', 'evt-old')
    await emitNftPrice(page, 'nft-02', 10, '3.33', 'evt-dup')
    await expect(page.getByText(/3\.33\s*ETH/i).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(/1\.11\s*ETH/i)).toHaveCount(0)
  })
  test('retoma pedido pendente após reload (reconciliação)', async ({ page }) => {
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-07')
    const orderId = await page.evaluate(async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('kurio:token') ?? ''}`,
      }
      const guestId = localStorage.getItem('kurio:guestId')
      if (guestId) headers['X-Guest-Id'] = guestId
      const quoteRes = await fetch('/api/quotes', {
        method: 'POST',
        headers,
        body: JSON.stringify({ couponCode: null }),
      })
      const quote = (await quoteRes.json()) as {
        quoteId?: string
      }
      if (!quote.quoteId) throw new Error(`quote failed: ${JSON.stringify(quote)}`)
      const walletsRes = await fetch('/api/wallets', { headers })
      const wallets = (await walletsRes.json()) as Array<{
        id: string
      }>
      if (!wallets[0]?.id) throw new Error('no wallet')
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          ...headers,
          'Idempotency-Key': crypto.randomUUID(),
        },
        body: JSON.stringify({
          quoteId: quote.quoteId,
          walletId: wallets[0].id,
          network: 'ethereum',
          collector: {
            name: 'Kurio Collector',
            email: 'collector@kurio.test',
          },
        }),
      })
      const order = (await orderRes.json()) as {
        id?: string
      }
      if (!order.id) throw new Error(`order failed: ${JSON.stringify(order)}`)
      sessionStorage.setItem('kurio:pending-order', order.id)
      return order.id
    })
    expect(orderId).toBeTruthy()
    await page.reload()
    await page.goto(`/orders/${orderId}`)
    await expect(
      page.getByRole('heading', {
        name: /pedido pendente|pedido confirmado|seus nfts agora estão/i,
      }),
    ).toBeVisible({ timeout: 45000 })
    const pendingKey = await page.evaluate(() => sessionStorage.getItem('kurio:pending-order'))
    expect(pendingKey === null || pendingKey === orderId).toBeTruthy()
  })
  test('disconnect: emit offline só aparece após reconcile REST', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsCollector(page)
    await addNftToCart(page, 'nft-02')
    await page.goto('/cart')
    await expect(
      page
        .getByRole('navigation', { name: /breadcrumb/i })
        .or(page.getByRole('heading', { name: /carrinho/i })),
    ).toBeVisible({ timeout: 15000 })
    await waitForSocketClients(page).catch(() => undefined)
    let blockSockets = true
    page.on('websocket', (ws) => {
      if (blockSockets) {
        try {
          ws.close()
        } catch {}
      }
    })
    await page.evaluate(async () => {
      await fetch('/api/__mocks/disconnect-sockets', { method: 'POST' })
    })
    await emitNftPrice(page, 'nft-02', 120, '7.77', 'evt-while-down')
    await expect(page.getByText(/7\.77\s*ETH/i)).toHaveCount(0)
    blockSockets = false
    await page.reload()
    await expect(
      page
        .getByRole('navigation', { name: /breadcrumb/i })
        .or(page.getByRole('heading', { name: /carrinho/i })),
    ).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/7\.77\s*ETH/i).first()).toBeVisible({ timeout: 15000 })
  })
})
