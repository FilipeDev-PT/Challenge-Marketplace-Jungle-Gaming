import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/query-keys'
import { ordersApi } from '@/shared/api/services'
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: queryKeys.order(orderId),
    queryFn: ({ signal }) => ordersApi.byId(orderId, signal),
    enabled: Boolean(orderId),
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 1500 : false),
  })
}
