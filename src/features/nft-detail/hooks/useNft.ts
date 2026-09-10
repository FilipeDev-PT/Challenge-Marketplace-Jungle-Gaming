import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api/query-keys'
import { nftsApi } from '@/shared/api/services'
export function useNft(nftId: string) {
  return useQuery({
    queryKey: queryKeys.nft(nftId),
    queryFn: ({ signal }) => nftsApi.byId(nftId, signal),
    enabled: Boolean(nftId),
  })
}
export function useRelatedNfts(collection: string | undefined, excludeId?: string) {
  const query = useQuery({
    queryKey: queryKeys.nfts({
      collections: collection ? [collection] : [],
      pageSize: 5,
    }),
    queryFn: ({ signal }) =>
      nftsApi.list(
        {
          collections: collection ? [collection] : undefined,
          pageSize: 5,
        },
        signal,
      ),
    enabled: Boolean(collection),
  })
  const items = (query.data?.items ?? []).filter((item) => item.id !== excludeId).slice(0, 5)
  return { ...query, items }
}
