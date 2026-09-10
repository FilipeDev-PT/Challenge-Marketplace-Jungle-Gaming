import { useMemo } from 'react'
import { useIsFetching, useQuery } from '@tanstack/react-query'

import { toFilterValue } from '@/features/catalog/lib/catalog-view'
import {
  resolveCatalogSearch,
  type CatalogSearch,
} from '@/features/catalog/model/catalogSearch'
import { queryKeys } from '@/shared/api/query-keys'
import { cmsApi, nftsApi } from '@/shared/api/services'
import { useDeferredEnabled } from '@/shared/lib/useDeferredEnabled'

export function useHomeContent() {
  const paintReady = useDeferredEnabled(0)

  return useQuery({
    queryKey: queryKeys.home,
    queryFn: ({ signal }) => cmsApi.home(signal),
    staleTime: 60000,
    enabled: paintReady,
  })
}

export function useCatalogFacets() {
  const paintReady = useDeferredEnabled(0)

  return useQuery({
    queryKey: queryKeys.facets,
    queryFn: ({ signal }) => nftsApi.facets(signal),
    staleTime: 60000,
    enabled: paintReady,
  })
}

export function useCatalogList(search: CatalogSearch) {
  const paintReady = useDeferredEnabled(0)
  const resolved = useMemo(() => resolveCatalogSearch(search), [search])
  const listParams = useMemo(
    () => ({
      q: resolved.q || undefined,
      collections: resolved.collections.length ? resolved.collections : undefined,
      network: resolved.network.length ? resolved.network : undefined,
      priceMin: resolved.priceMin || undefined,
      priceMax: resolved.priceMax || undefined,
      sort: resolved.sort,
      tab: resolved.tab === 'all' ? undefined : resolved.tab,
      page: resolved.page,
      pageSize: 9,
    }),
    [resolved],
  )

  const catalogQuery = useQuery({
    queryKey: queryKeys.nfts(listParams),
    queryFn: ({ signal }) => nftsApi.list(listParams, signal),
    placeholderData: (previous) => previous,
    enabled: paintReady,
  })

  const fetchingCatalog = useIsFetching({ queryKey: ['nfts'] }) > 0

  return { resolved, catalogQuery, fetchingCatalog }
}

export function useFeaturedNft() {
  const paintReady = useDeferredEnabled(0)

  return useQuery({
    queryKey: queryKeys.nfts({ tab: 'featured', pageSize: 1 }),
    queryFn: ({ signal }) => nftsApi.list({ tab: 'featured', pageSize: 1 }, signal),
    staleTime: 60000,
    enabled: paintReady,
  })
}

export function useHomeCatalog(search: CatalogSearch) {
  const homeQuery = useHomeContent()
  const facetsQuery = useCatalogFacets()
  const { resolved, catalogQuery, fetchingCatalog } = useCatalogList(search)
  const featuredQuery = useFeaturedNft()
  const priceBounds = facetsQuery.data?.priceBounds ?? { min: 0.02, max: 12.38 }
  const filterValue = toFilterValue(resolved, priceBounds)

  return {
    homeQuery,
    facetsQuery,
    catalogQuery,
    featuredQuery,
    resolved,
    fetchingCatalog,
    priceBounds,
    filterValue,
    featured: featuredQuery.data?.items[0],
    home: homeQuery.data,
  }
}
