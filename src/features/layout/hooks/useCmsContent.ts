import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/api/query-keys'
import { cmsApi } from '@/shared/api/services'
import { useDeferredEnabled } from '@/shared/lib/useDeferredEnabled'

export function useFooterContent() {
  const enabled = useDeferredEnabled(1200)

  return useQuery({
    queryKey: queryKeys.footer,
    queryFn: ({ signal }) => cmsApi.footer(signal),
    staleTime: 60000,
    enabled,
  })
}

export function useAccountNav() {
  return useQuery({
    queryKey: queryKeys.accountNav,
    queryFn: ({ signal }) => cmsApi.accountNav(signal),
    staleTime: 60000,
  })
}
