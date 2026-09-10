import { api } from '@/shared/api/client'
import { quoteSchema, type Quote } from '@/shared/api/contracts'
export const quotesApi = {
  async create(
    body: {
      couponCode?: string | null
    },
    signal?: AbortSignal,
  ): Promise<Quote> {
    const { data } = await api.post('/quotes', body, { signal })
    return quoteSchema.parse(data)
  },
}
