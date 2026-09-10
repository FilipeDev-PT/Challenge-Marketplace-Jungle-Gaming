import { api } from '@/shared/api/client'
import { favoriteIdsSchema } from '@/shared/api/contracts'
export const favoritesApi = {
  async list(signal?: AbortSignal): Promise<string[]> {
    const { data } = await api.get('/favorites', { signal })
    return favoriteIdsSchema.parse(data).ids
  },
  async add(nftId: string): Promise<string[]> {
    const { data } = await api.post('/favorites', { nftId })
    return favoriteIdsSchema.parse(data).ids
  },
  async remove(nftId: string): Promise<string[]> {
    const { data } = await api.delete(`/favorites/${nftId}`)
    return favoriteIdsSchema.parse(data).ids
  },
}
