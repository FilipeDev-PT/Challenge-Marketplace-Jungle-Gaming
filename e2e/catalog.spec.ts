import {
  expect,
  fillCatalogSearch,
  filtersRoot,
  openCatalogFilters,
  clearScenario,
  setScenario,
  test,
} from './support/fixtures'
test.describe('Catálogo', () => {
  test('busca sincroniza com URL e filtra resultados', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible()
    await fillCatalogSearch(page, 'Neon')
    await expect(page).toHaveURL(/q=Neon/, { timeout: 10000 })
    await expect(page.getByRole('link', { name: /neon/i }).first()).toBeVisible({ timeout: 10000 })
  })
  test('filtros combinados, ordenação, paginação e histórico', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible()
    await openCatalogFilters(page)
    const filters = await filtersRoot(page)
    await filters.getByRole('button', { name: /arte digital/i }).click()
    await filters.getByRole('button', { name: /^ethereum/i }).click()
    await expect(page).toHaveURL(/collections=/, { timeout: 10000 })
    await expect(page).toHaveURL(/network=/, { timeout: 10000 })
    const closeSheet = page.getByRole('button', { name: /^fechar$/i })
    if (await closeSheet.isVisible().catch(() => false)) {
      await closeSheet.click()
      await expect(page.getByRole('dialog')).toHaveCount(0)
    }
    const sortTrigger = page.getByLabel(/ordenar por/i)
    if (await sortTrigger.isVisible().catch(() => false)) {
      await sortTrigger.click()
      await page.getByRole('option', { name: /preço: menor para maior/i }).click()
      await expect(page).toHaveURL(/sort=price-asc/, { timeout: 10000 })
    } else {
      const url = new URL(page.url())
      url.searchParams.set('sort', 'price-asc')
      url.searchParams.set('page', '1')
      await page.goto(`${url.pathname}?${url.searchParams.toString()}`)
      await expect(page).toHaveURL(/sort=price-asc/, { timeout: 10000 })
    }
    await page.goto('/?sort=price-asc&page=1')
    await expect(page.getByRole('navigation', { name: /paginação/i })).toBeVisible({
      timeout: 15000,
    })
    await page.getByRole('button', { name: /próxima página/i }).click()
    await expect(page).toHaveURL(/page=2/, { timeout: 10000 })
    await page.goBack()
    await expect(page).toHaveURL(/page=1/, { timeout: 10000 })
  })
  test('deep link de busca e sort respeita query params', async ({ page }) => {
    await page.goto('/?q=Mask&sort=name-asc&tab=all')
    await expect(page).toHaveURL(/q=Mask/, { timeout: 10000 })
    await expect(page.getByRole('link', { name: /mask/i }).first()).toBeVisible({
      timeout: 15000,
    })
  })
  test('cenário empty exibe estado vazio', async ({ page }) => {
    await page.goto('/')
    await setScenario(page, 'empty')
    await page.reload()
    await expect(page.getByRole('heading', { name: /nenhum nft encontrado/i })).toBeVisible({
      timeout: 15000,
    })
    await clearScenario(page)
  })
  test('out-of-order: última busca vence na URL e na UI', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible()
    await setScenario(page, 'out-of-order')
    await fillCatalogSearch(page, 'Neon')
    await fillCatalogSearch(page, 'zzzz-no-match-xyz')
    await expect(page).toHaveURL(/q=zzzz-no-match-xyz/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /nenhum nft encontrado/i })).toBeVisible({
      timeout: 20000,
    })
    await clearScenario(page)
  })
})
