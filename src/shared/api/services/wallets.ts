import { api } from '@/shared/api/client'
import { walletSchema, type Wallet } from '@/shared/api/contracts'
import { z } from 'zod'
export const walletsApi = {
  async list(signal?: AbortSignal): Promise<Wallet[]> {
    const { data } = await api.get('/wallets', { signal })
    return z.array(walletSchema).parse(data)
  },
  async create(body: Omit<Wallet, 'id'>): Promise<Wallet> {
    const { data } = await api.post('/wallets', body)
    return walletSchema.parse(data)
  },
  async update(id: string, body: Partial<Omit<Wallet, 'id'>>): Promise<Wallet> {
    const { data } = await api.patch(`/wallets/${id}`, body)
    return walletSchema.parse(data)
  },
}
