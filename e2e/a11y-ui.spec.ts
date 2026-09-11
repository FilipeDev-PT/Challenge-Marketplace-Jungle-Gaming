import { expect, test } from './support/fixtures'
test.describe('Acessibilidade UI', () => {
  test('teclado alcança campos do formulário de login', async ({ page }) => {
    await page.goto('/login')
    await expect(
      page
        .getByRole('dialog', { name: /entrar/i })
        .or(page.getByRole('heading', { name: /^entrar$/i })),
    ).toBeVisible({ timeout: 15000 })
    await page.locator('#login-email').focus()
    await expect(page.locator('#login-email')).toBeFocused()
    await page.keyboard.type('collector@kurio.test')
    await page.keyboard.press('Tab')
    await expect(page.locator('#login-password')).toBeFocused()
    await page.keyboard.type('Kurio123!')
    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press('Tab')
      const name = await page.evaluate(() => {
        const el = document.activeElement
        return el?.getAttribute('type') === 'submit' || el?.tagName === 'BUTTON'
          ? (el.textContent ?? '').trim()
          : ''
      })
      if (/^entrar$/i.test(name)) break
    }
    await expect(page.getByRole('button', { name: /^entrar$/i })).toBeFocused()
  })
  test('mensagens de validação no login', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /^entrar$/i }).click()
    await expect(page.getByText(/e-mail inválido|informe a senha/i).first()).toBeVisible()
    await page.getByLabel(/e-mail/i).fill('not-an-email')
    await page.getByLabel(/^senha$/i).fill('')
    await page.getByRole('button', { name: /^entrar$/i }).click()
    await expect(page.getByText(/e-mail inválido/i)).toBeVisible()
    await expect(page.getByText(/informe a senha/i)).toBeVisible()
  })
  test('validação no cadastro', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: /criar conta|criar perfil/i }).click()
    await expect(page.getByText(/informe seu nome/i)).toBeVisible()
    await expect(page.getByText(/e-mail inválido/i)).toBeVisible()
  })
  test('foco permanece no dialog de filtros e Escape restaura', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Sheet de filtros é o dialog mobile')
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /seja dono/i })).toBeVisible()
    const trigger = page.getByRole('button', { name: /filtros/i })
    await expect(trigger).toBeVisible()
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const focusedInside = await page.evaluate(() => {
      const root = document.querySelector('[role="dialog"]')
      return Boolean(root && root.contains(document.activeElement))
    })
    expect(focusedInside).toBeTruthy()
    await page.keyboard.press('Tab')
    const stillInside = await page.evaluate(() => {
      const root = document.querySelector('[role="dialog"]')
      return Boolean(root && root.contains(document.activeElement))
    })
    expect(stillInside).toBeTruthy()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused({ timeout: 5000 })
  })
})
