import { api } from '@/shared/api/client'
import {
  accountNavSchema,
  footerContentSchema,
  homeContentSchema,
  type AccountNav,
  type FooterContent,
  type HomeContent,
} from '@/shared/api/cms-contracts'
export const cmsApi = {
  async home(signal?: AbortSignal): Promise<HomeContent> {
    const { data } = await api.get('/home', { signal })
    return homeContentSchema.parse(data)
  },
  async footer(signal?: AbortSignal): Promise<FooterContent> {
    const { data } = await api.get('/footer', { signal })
    return footerContentSchema.parse(data)
  },
  async accountNav(signal?: AbortSignal): Promise<AccountNav> {
    const { data } = await api.get('/account/nav', { signal })
    return accountNavSchema.parse(data)
  },
}
