import { clearScenario, expect, setScenario, test } from './support/fixtures'
test.describe('Loading e erros', () => {
  test('cenário latency completa o catálogo após atraso', async ({ page }) => {
    await setScenario(page, 'latency')
    await page.reload({ waitUntil: 'domcontentloaded' })
    const skeleton = page.locator('[aria-label="Carregando catálogo"]')
    await skeleton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => undefined)
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible({
      timeout: 30000,
    })
    await expect(page.locator('#catalog a').locator('visible=true').first()).toBeVisible({
      timeout: 30000,
    })
    await clearScenario(page)
  })
  test('erro offline permite recuperação com retry', async ({ page }) => {
    await setScenario(page, 'offline')
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /falha ao carregar/i })).toBeVisible({
      timeout: 20000,
    })
    await clearScenario(page)
    await page.getByRole('button', { name: /tentar novamente/i }).click()
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible({
      timeout: 20000,
    })
  })
})
