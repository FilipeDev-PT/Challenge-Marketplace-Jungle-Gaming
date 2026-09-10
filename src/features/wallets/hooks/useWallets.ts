import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/app/providers/AuthProvider'
import { queryKeys } from '@/shared/api/query-keys'
import { walletsApi } from '@/shared/api/services'
export function useWallets(options?: { enabled?: boolean }) {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.wallets(user?.id ?? ''),
    queryFn: ({ signal }) => walletsApi.list(signal),
    enabled: options?.enabled ?? Boolean(user?.id),
  })
}
