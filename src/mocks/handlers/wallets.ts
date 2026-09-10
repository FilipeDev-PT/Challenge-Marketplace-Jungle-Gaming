import { http, HttpResponse } from 'msw'
import type { Wallet } from '@/shared/api/contracts'
import { db } from '@/mocks/db'
import { applyScenario } from '@/mocks/scenarios'
import { createId, jsonError } from '@/mocks/helpers'
const PROVIDERS = new Set(['metamask', 'coinbase', 'walletconnect', 'phantom'])
const NETWORKS = new Set(['ethereum', 'polygon', 'solana'])
export const walletsHandlers = [
  http.get('/api/wallets', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    return HttpResponse.json(db.getWallets(session.user.id))
  }),
  http.post('/api/wallets', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const body = (await request.json()) as Partial<Wallet>
    const fields: Record<string, string> = {}
    if (!body.label?.trim()) fields.label = 'Rótulo obrigatório'
    if (!body.address?.trim()) fields.address = 'Endereço obrigatório'
    if (!body.provider || !PROVIDERS.has(body.provider)) fields.provider = 'Provedor inválido'
    if (!body.network || !NETWORKS.has(body.network)) fields.network = 'Rede inválida'
    if (Object.keys(fields).length) {
      return jsonError('validation', 'Dados inválidos', 400, fields)
    }
    const wallet: Wallet = {
      id: createId('wallet'),
      label: body.label!.trim(),
      address: body.address!.trim(),
      provider: body.provider!,
      network: body.network!,
      isPrimary: Boolean(body.isPrimary) || db.getWallets(session.user.id).length === 0,
    }
    db.addWallet(session.user.id, wallet)
    return HttpResponse.json(wallet, { status: 201 })
  }),
  http.patch('/api/wallets/:id', async ({ request, params }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const id = String(params.id)
    const body = (await request.json()) as Partial<Wallet>
    if (body.provider && !PROVIDERS.has(body.provider)) {
      return jsonError('validation', 'Provedor inválido', 400, { provider: 'Inválido' })
    }
    if (body.network && !NETWORKS.has(body.network)) {
      return jsonError('validation', 'Rede inválida', 400, { network: 'Inválida' })
    }
    try {
      const items = db.patchWallet(session.user.id, id, {
        ...(body.label !== undefined ? { label: body.label.trim() } : {}),
        ...(body.address !== undefined ? { address: body.address.trim() } : {}),
        ...(body.provider !== undefined ? { provider: body.provider } : {}),
        ...(body.network !== undefined ? { network: body.network } : {}),
        ...(body.isPrimary !== undefined ? { isPrimary: body.isPrimary } : {}),
      })
      const updated = items.find((w) => w.id === id)
      if (!updated) return jsonError('not_found', 'Carteira não encontrada', 404)
      return HttpResponse.json(updated)
    } catch {
      return jsonError('not_found', 'Carteira não encontrada', 404)
    }
  }),
]
