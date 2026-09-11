import { expect, test } from './support/fixtures'
test.describe('Detalhe do NFT', () => {
  test('acesso direto carrega nome, preço e ações', async ({ page }) => {
    await page.goto('/nfts/nft-02')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/sage nomad|#009/i)
    await expect(page.getByText(/\d+(\.\d+)?\s*ETH/i).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /^comprar/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /favoritos|favoritar/i })).toBeVisible()
  })
  test('id desconhecido mostra 404', async ({ page }) => {
    await page.goto('/nfts/nft-does-not-exist')
    await expect(
      page.getByRole('heading', { name: /nft não encontrado|nft indisponível/i }),
    ).toBeVisible({
      timeout: 30000,
    })
  })
})
