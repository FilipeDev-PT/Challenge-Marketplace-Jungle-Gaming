import {
  clearScenario,
  dismissToasts,
  expect,
  loginAsCollector,
  setScenario,
  test,
} from './support/fixtures'

test.describe('Favoritos', () => {
  test('adiciona favorito com sucesso', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/nfts/nft-02')
    await expect(page.getByRole('heading', { name: /sage nomad/i })).toBeVisible({
      timeout: 15000,
    })
    const addFavorite = page.getByRole('button', {
      name: /adicionar aos favoritos|favoritar/i,
    })
    await addFavorite.click()
    await expect(page.getByText(/salvo nos favoritos/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /remover dos favoritos/i })).toBeVisible()
  })

  test('fail-favorites faz rollback e permite recuperar depois', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/nfts/nft-04')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
    await setScenario(page, 'fail-favorites')
    await page.getByRole('button', { name: /adicionar aos favoritos|favoritar/i }).click()
    await expect(page.getByText(/falha ao (salvar|atualizar|remover) favorito/i)).toBeVisible({
      timeout: 10000,
    })
    await expect(
      page.getByRole('button', { name: /adicionar aos favoritos|favoritar/i }),
    ).toBeVisible({
      timeout: 10000,
    })
    await clearScenario(page)
    await dismissToasts(page)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: /adicionar aos favoritos|favoritar/i }).click()
    await expect(page.getByText(/salvo nos favoritos/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /remover dos favoritos/i })).toBeVisible()
  })
})
