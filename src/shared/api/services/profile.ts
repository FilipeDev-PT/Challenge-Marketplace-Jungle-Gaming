import { api } from '@/shared/api/client'
import { userSchema, type User } from '@/shared/api/contracts'
export const profileApi = {
  async get(signal?: AbortSignal): Promise<User> {
    const { data } = await api.get('/profile', { signal })
    return userSchema.parse(data)
  },
  async update(
    body: Partial<
      Pick<User, 'name' | 'email' | 'phone' | 'walletNickname' | 'avatarUrl' | 'username' | 'ens'>
    >,
  ): Promise<User> {
    const { data } = await api.patch('/profile', body)
    return userSchema.parse(data)
  },
  async changePassword(body: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.post('/profile/password', body)
  },
}
