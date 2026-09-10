import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/query-keys'
import { nftsApi } from '@/shared/api/services'
export function useCartRelated() {
  return useQuery({
    queryKey: queryKeys.nfts({ tab: 'trending', pageSize: 5 }),
    queryFn: ({ signal }) => nftsApi.list({ tab: 'trending', pageSize: 5 }, signal),
    staleTime: 60000,
  })
}
