import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, loginAsCollector, test } from './support/fixtures'
const avatarPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'support', 'avatar.png')
test.describe('Conta', () => {
  test('edita perfil', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/profile')
    await expect(page.getByRole('heading', { name: /perfil do colecionador/i })).toBeVisible({
      timeout: 15000,
    })
    const name = `Collector ${String(Date.now()).slice(-6)}`
    await page.getByLabel(/nome de exibição/i).fill(name)
    await page.getByRole('button', { name: /^salvar$/i }).click()
    await expect(page.getByText(/perfil atualizado/i)).toBeVisible({ timeout: 10000 })
    await page.reload()
    await expect(page.getByLabel(/nome de exibição/i)).toHaveValue(name, { timeout: 15000 })
  })
  test('atualiza avatar e persiste após refresh', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/profile')
    await expect(page.getByRole('heading', { name: /perfil do colecionador/i })).toBeVisible({
      timeout: 15000,
    })
    await page.locator('input[type="file"][accept="image/*"]').setInputFiles(avatarPath)
    await page.getByRole('button', { name: /^salvar$/i }).click()
    await expect(page.getByText(/perfil atualizado/i)).toBeVisible({ timeout: 10000 })
    await expect(page.locator('img[src^="data:image"]').first()).toBeVisible({ timeout: 10000 })
    await page.reload()
    await expect(page.locator('img[src^="data:image"]').first()).toBeVisible({ timeout: 15000 })
  })
  test('altera senha com sucesso', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/profile')
    await expect(page.getByRole('heading', { name: /alterar senha/i })).toBeVisible({
      timeout: 15000,
    })
    await page.getByLabel(/^senha atual$/i).fill('Kurio123!')
    await page.getByLabel(/^nova senha$/i).fill('Kurio456!')
    await page.getByLabel(/confirmar nova senha/i).fill('Kurio456!')
    await page.getByRole('button', { name: /^salvar$/i }).click()
    await expect(page.getByText(/senha alterada/i).first()).toBeVisible({ timeout: 10000 })
    await page.getByLabel(/^senha atual$/i).fill('Kurio456!')
    await page.getByLabel(/^nova senha$/i).fill('Kurio123!')
    await page.getByLabel(/confirmar nova senha/i).fill('Kurio123!')
    await page.getByRole('button', { name: /^salvar$/i }).click()
    await expect(page.getByText(/senha alterada/i).first()).toBeVisible({ timeout: 10000 })
  })
  test('erro de validação ao alterar senha', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/profile')
    await expect(page.getByRole('heading', { name: /alterar senha/i })).toBeVisible({
      timeout: 15000,
    })
    await page.getByLabel(/^senha atual$/i).fill('WrongPassword!')
    await page.getByLabel(/^nova senha$/i).fill('NewSecret1!')
    await page.getByLabel(/confirmar nova senha/i).fill('NewSecret1!')
    await page.getByRole('button', { name: /^salvar$/i }).click()
    await expect(page.getByText(/senha atual incorreta/i).first()).toBeVisible({ timeout: 10000 })
  })
  test('adiciona e edita carteira', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/wallets')
    await expect(page.getByRole('heading', { name: /carteira principal/i })).toBeVisible({
      timeout: 15000,
    })
    await page
      .getByRole('button', { name: /^adicionar$/i })
      .first()
      .click()
    await expect(page.getByRole('button', { name: /salvar carteira/i })).toBeVisible()
    const nickname = `E2E Wallet ${Date.now()}`
    await page.getByLabel(/nome de exibição/i).fill('Collector E2E')
    await page.getByLabel(/apelido da carteira/i).fill(nickname)
    await page.getByLabel(/^rede/i).click()
    await page.getByRole('option', { name: /ethereum/i }).click()
    await page.getByLabel(/nome do perfil/i).fill('collector')
    await page.getByLabel(/endereço da carteira/i).fill('0xE2Eabcdef012345678901234567890abcdef99')
    await page.getByLabel(/tipo de carteira/i).click()
    await page.getByRole('option', { name: /metamask/i }).click()
    await page.getByLabel(/código de indicação/i).fill('KURIO')
    await page.locator('#wallet-email').fill('collector@kurio.test')
    await page.getByLabel(/nome ens/i).fill('collector')
    await page.getByRole('button', { name: /salvar carteira/i }).click()
    await expect(page.getByText(/carteira adicionada/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(nickname)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /editar carteira/i })).toBeVisible()
    await page.getByRole('button', { name: /editar carteira/i }).click()
    await page.getByLabel(/apelido da carteira/i).fill(`${nickname} edit`)
    await page.getByRole('button', { name: /salvar carteira/i }).click()
    await expect(page.getByText(/carteira atualizada/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(`${nickname} edit`)).toBeVisible()
  })
  test('validação ao salvar carteira incompleta', async ({ page }) => {
    await loginAsCollector(page)
    await page.goto('/account/wallets')
    await expect(page.getByRole('heading', { name: /carteira principal/i })).toBeVisible({
      timeout: 15000,
    })
    await page
      .getByRole('button', { name: /^adicionar$/i })
      .first()
      .click()
    await page.getByRole('button', { name: /salvar carteira/i }).click()
    await expect(page.getByText(/informe|selecione|obrigat|inválid/i).first()).toBeVisible({
      timeout: 10000,
    })
  })
})
