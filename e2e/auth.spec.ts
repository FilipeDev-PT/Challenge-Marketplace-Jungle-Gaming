import {
  expect,
  loginAs,
  loginAsCollector,
  logout,
  setScenario,
  clearScenario,
  test,
} from './support/fixtures'
test.describe('Autenticação', () => {
  test('cadastro com e-mail único', async ({ page }) => {
    const email = `e2e-${Date.now()}@kurio.test`
    await page.goto('/register')
    await expect(
      page
        .getByRole('dialog', { name: /criar conta/i })
        .or(page.getByRole('heading', { name: /criar perfil/i })),
    ).toBeVisible({
      timeout: 15000,
    })
    await page.locator('#register-name').fill('E2E Collector')
    await page.locator('#register-email').fill(email)
    await page.locator('#register-password').fill('Secret123!')
    await page.locator('#register-confirm').fill('Secret123!')
    await page.getByRole('button', { name: /criar conta|criar perfil/i }).click()
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('kurio:token')), {
        timeout: 15000,
      })
      .toBeTruthy()
    await expect(
      page
        .getByRole('button', { name: /e2e/i })
        .or(page.getByRole('link', { name: /^perfil$/i }))
        .first(),
    ).toBeVisible({ timeout: 15000 })
  })
  test('login, sessão em localStorage e logout', async ({ page }) => {
    await loginAsCollector(page)
    const token = await page.evaluate(() => localStorage.getItem('kurio:token'))
    expect(token).toBeTruthy()
    await page.reload()
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('kurio:token')), {
        timeout: 15000,
      })
      .toBeTruthy()
    await expect(
      page
        .getByRole('button', { name: /kurio/i })
        .or(page.getByRole('link', { name: /^perfil$/i }))
        .first(),
    ).toBeVisible({ timeout: 15000 })
    await logout(page)
    const after = await page.evaluate(() => localStorage.getItem('kurio:token'))
    expect(after).toBeNull()
  })
  test('troca de usuário', async ({ page }) => {
    await loginAsCollector(page)
    await logout(page)
    await loginAs(page, 'alice@kurio.test', 'Alice123!', /alice/i)
    await expect(
      page
        .getByRole('button', { name: /alice/i })
        .or(page.getByRole('link', { name: /^perfil$/i }))
        .first(),
    ).toBeVisible()
    const email = await page.evaluate(async () => {
      const res = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${localStorage.getItem('kurio:token')}` },
      })
      const data = (await res.json()) as {
        user?: {
          email?: string
        }
      }
      return data.user?.email ?? null
    })
    expect(email).toBe('alice@kurio.test')
  })
  test('sessão expirada redireciona para login', async ({ page }) => {
    await loginAsCollector(page)
    await setScenario(page, 'session-expired')
    await page.reload()
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('kurio:token')), {
        timeout: 15000,
      })
      .toBeNull()
    await expect(
      page
        .getByRole('link', { name: /entrar/i })
        .or(page.getByRole('button', { name: /^entrar$/i })),
    ).toBeVisible({ timeout: 15000 })
    await clearScenario(page)
    await page.goto('/account/profile')
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
  })
})
