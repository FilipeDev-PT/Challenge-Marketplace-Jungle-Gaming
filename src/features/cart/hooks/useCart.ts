import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@/app/providers/AuthProvider'
import { queryKeys } from '@/shared/api/query-keys'
import { cartApi } from '@/shared/api/services'
import { useDeferredEnabled } from '@/shared/lib/useDeferredEnabled'
import { getOwnerKey } from '@/shared/lib/session-storage'

export function useCart(options?: { enabled?: boolean }) {
  const { user } = useAuth()
  const ownerKey = getOwnerKey(user?.id)

  const query = useQuery({
    queryKey: queryKeys.cart(ownerKey),
    queryFn: ({ signal }) => cartApi.get(signal),
    enabled: options?.enabled ?? true,
  })

  return { ...query, ownerKey }
}

export function useCartBadge() {
  const enabled = useDeferredEnabled(600)
  const cartQuery = useCart({ enabled })
  const cartCount = cartQuery.data?.items.length ?? 0

  return { cartCount, ...cartQuery }
}
