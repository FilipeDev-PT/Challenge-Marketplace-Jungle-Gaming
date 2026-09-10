import { api } from '@/shared/api/client'
import { sessionSchema, type Session } from '@/shared/api/contracts'
import { isApiError } from '@/shared/api/errors'

export const authApi = {
  async login(body: { email: string; password: string }): Promise<Session> {
    const { data } = await api.post('/auth/login', body)
    return sessionSchema.parse(data)
  },
  async register(body: { name: string; email: string; password: string }): Promise<Session> {
    const { data } = await api.post('/auth/register', body)
    return sessionSchema.parse(data)
  },
  async session(signal?: AbortSignal): Promise<Session | null> {
    try {
      const { data } = await api.get('/auth/session', { signal })
      return sessionSchema.parse(data)
    } catch (error) {
      if (isApiError(error) && error.status === 401) return null
      throw error
    }
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
