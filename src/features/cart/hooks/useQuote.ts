import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/app/providers/AuthProvider'
import { queryKeys } from '@/shared/api/query-keys'
import { quotesApi } from '@/shared/api/services'
import { getOwnerKey } from '@/shared/lib/session-storage'
export function useQuote(
  couponCode: string | null,
  options?: {
    enabled?: boolean
  },
) {
  const { user } = useAuth()
  const ownerKey = getOwnerKey(user?.id)
  return useQuery({
    queryKey: queryKeys.quote(ownerKey, couponCode),
    queryFn: ({ signal }) => quotesApi.create({ couponCode }, signal),
    enabled: options?.enabled ?? true,
  })
}
