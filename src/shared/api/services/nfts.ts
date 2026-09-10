import { api } from '@/shared/api/client'
import { facetsSchema, type Facets } from '@/shared/api/cms-contracts'
import {
  nftListResponseSchema,
  nftSchema,
  type Nft,
  type NftListResponse,
} from '@/shared/api/contracts'
export type NftListParams = {
  q?: string
  collections?: string[]
  network?: string[]
  priceMin?: string
  priceMax?: string
  sort?: string
  tab?: string
  page?: number
  pageSize?: number
}
function paramsSerializer(params: Record<string, unknown>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','))
    } else {
      search.set(key, String(value))
    }
  }
  return search.toString()
}
export const nftsApi = {
  async list(params: NftListParams, signal?: AbortSignal): Promise<NftListResponse> {
    const { data } = await api.get('/nfts', {
      params,
      paramsSerializer: { serialize: paramsSerializer },
      signal,
    })
    return nftListResponseSchema.parse(data)
  },
  async byId(id: string, signal?: AbortSignal): Promise<Nft> {
    const { data } = await api.get(`/nfts/${id}`, { signal })
    return nftSchema.parse(data)
  },
  async facets(signal?: AbortSignal): Promise<Facets> {
    const { data } = await api.get('/nfts/facets', { signal })
    return facetsSchema.parse(data)
  },
}
