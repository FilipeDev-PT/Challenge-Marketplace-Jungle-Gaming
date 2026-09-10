import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/db'
import { applyScenario } from '@/mocks/scenarios'
import { createId, hashPassword, jsonError, nowIso, verifyPassword } from '@/mocks/helpers'
export const authHandlers = [
  http.post('/api/auth/register', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const body = (await request.json()) as {
      email?: string
      password?: string
      name?: string
      phone?: string
    }
    const fields: Record<string, string> = {}
    if (!body.email?.includes('@')) fields.email = 'E-mail inválido'
    if (!body.password || body.password.length < 8)
      fields.password = 'Senha deve ter ao menos 8 caracteres'
    if (!body.name?.trim()) fields.name = 'Nome é obrigatório'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    if (db.findUserByEmail(body.email!)) {
      return jsonError('conflict', 'E-mail já cadastrado', 409, { email: 'E-mail já em uso' })
    }
    const user = db.addUser({
      id: createId('user'),
      email: body.email!.trim().toLowerCase(),
      name: body.name!.trim(),
      phone: body.phone?.trim() || undefined,
      avatarUrl: null,
      createdAt: nowIso(),
      passwordHash: hashPassword(body.password!),
    })
    const guestId = request.headers.get('X-Guest-Id')
    db.mergeCartsOnLogin(guestId, user.id)
    const session = db.createSession(user.id)
    return HttpResponse.json(session, { status: 201 })
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const body = (await request.json()) as {
      email?: string
      password?: string
    }
    const fields: Record<string, string> = {}
    if (!body.email) fields.email = 'E-mail obrigatório'
    if (!body.password) fields.password = 'Senha obrigatória'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    const user = db.findUserByEmail(body.email!)
    if (!user || !verifyPassword(body.password!, user.passwordHash)) {
      return jsonError('unauthorized', 'Credenciais inválidas', 401)
    }
    const guestId = request.headers.get('X-Guest-Id')
    db.mergeCartsOnLogin(guestId, user.id)
    const session = db.createSession(user.id)
    return HttpResponse.json(session)
  }),
  http.get('/api/auth/session', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.getSession(request)
    if (!session) return jsonError('unauthorized', 'Sessão inválida', 401)
    return HttpResponse.json(session)
  }),
  http.post('/api/auth/logout', async ({ request }) => {
    const blocked = await applyScenario(request, { skipSessionExpired: true })
    if (blocked) return blocked
    const session = db.getSession(request)
    if (session) db.revokeSession(session.token)
    return HttpResponse.json({ ok: true })
  }),
]
