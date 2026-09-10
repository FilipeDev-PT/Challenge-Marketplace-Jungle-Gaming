import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/db'
import { applyScenario } from '@/mocks/scenarios'
import { hashPassword, jsonError, verifyPassword } from '@/mocks/helpers'
export const profileHandlers = [
  http.get('/api/profile', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    return HttpResponse.json(session.user)
  }),
  http.patch('/api/profile', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const body = (await request.json()) as {
      name?: string
      email?: string
      phone?: string | null
      walletNickname?: string | null
      avatarUrl?: string | null
      username?: string | null
      ens?: string | null
    }
    const fields: Record<string, string> = {}
    if (body.name !== undefined && !body.name.trim()) fields.name = 'Nome inválido'
    if (body.email !== undefined && !body.email.includes('@')) fields.email = 'E-mail inválido'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    const user = db.updateUser(session.user.id, {
      ...(body.name !== undefined ? { name: body.name.trim() } : {}),
      ...(body.email !== undefined ? { email: body.email.trim().toLowerCase() } : {}),
      ...(body.phone !== undefined ? { phone: body.phone?.trim() || undefined } : {}),
      ...(body.walletNickname !== undefined
        ? { walletNickname: body.walletNickname?.trim() || undefined }
        : {}),
      ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
      ...(body.username !== undefined ? { username: body.username?.trim() || undefined } : {}),
      ...(body.ens !== undefined ? { ens: body.ens?.trim() || undefined } : {}),
    })
    return HttpResponse.json(user)
  }),
  http.post('/api/profile/password', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const body = (await request.json()) as {
      currentPassword?: string
      newPassword?: string
    }
    const fields: Record<string, string> = {}
    if (!body.currentPassword) fields.currentPassword = 'Obrigatório'
    if (!body.newPassword || body.newPassword.length < 8) {
      fields.newPassword = 'Nova senha deve ter ao menos 8 caracteres'
    }
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    const stored = db.findUserById(session.user.id)
    if (!stored || !verifyPassword(body.currentPassword!, stored.passwordHash)) {
      return jsonError('forbidden', 'Senha atual incorreta', 403, {
        currentPassword: 'Senha atual incorreta',
      })
    }
    db.updateUser(session.user.id, { passwordHash: hashPassword(body.newPassword!) })
    return HttpResponse.json({ ok: true })
  }),
]
