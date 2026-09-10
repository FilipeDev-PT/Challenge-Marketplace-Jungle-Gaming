import { http, HttpResponse } from 'msw'
import { db } from '@/mocks/db'
import { applyScenario, getScenario } from '@/mocks/scenarios'
import { jsonError } from '@/mocks/helpers'
export const favoritesHandlers = [
  http.get('/api/favorites', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    return HttpResponse.json({ ids: db.getFavorites(session.user.id) })
  }),
  http.post('/api/favorites', async ({ request }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    if (getScenario(request) === 'fail-favorites') {
      return jsonError('transient', 'Falha ao salvar favorito. Tente novamente.', 503)
    }
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const body = (await request.json()) as {
      nftId?: string
    }
    if (!body.nftId)
      return jsonError('validation', 'nftId obrigatório', 400, { nftId: 'Obrigatório' })
    if (!db.findNft(body.nftId)) return jsonError('not_found', 'NFT não encontrado', 404)
    const ids = db.addFavorite(session.user.id, body.nftId)
    return HttpResponse.json({ ids }, { status: 201 })
  }),
  http.delete('/api/favorites/:nftId', async ({ request, params }) => {
    const blocked = await applyScenario(request)
    if (blocked) return blocked
    if (getScenario(request) === 'fail-favorites') {
      return jsonError('transient', 'Falha ao remover favorito. Tente novamente.', 503)
    }
    const session = db.requireSession(request)
    if (!session) return jsonError('unauthorized', 'Autenticação necessária', 401)
    const nftId = String(params.nftId)
    const ids = db.removeFavorite(session.user.id, nftId)
    return HttpResponse.json({ ids })
  }),
]
