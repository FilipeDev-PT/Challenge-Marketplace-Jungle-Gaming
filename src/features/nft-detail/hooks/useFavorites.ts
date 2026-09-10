import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { favoritesApi } from '@/shared/api/services'
export function useFavorites(nftId?: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const favoritesKey = queryKeys.favorites(user?.id ?? null)
  const listQuery = useQuery({
    queryKey: favoritesKey,
    queryFn: ({ signal }) => favoritesApi.list(signal),
    enabled: isAuthenticated,
  })
  const isFavorite = Boolean(nftId && listQuery.data?.includes(nftId))
  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!nftId) throw new Error('NFT inválido')
      if (!isAuthenticated) {
        await navigate({
          to: '/login',
          search: { redirect: `/nfts/${nftId}`, from: `/nfts/${nftId}` },
        })
        throw new Error('auth_required')
      }
      return isFavorite ? favoritesApi.remove(nftId) : favoritesApi.add(nftId)
    },
    onMutate: async () => {
      if (!nftId || !isAuthenticated) return { previous: undefined as string[] | undefined }
      await queryClient.cancelQueries({ queryKey: favoritesKey })
      const previous = queryClient.getQueryData<string[]>(favoritesKey)
      const next = isFavorite
        ? (previous ?? []).filter((id) => id !== nftId)
        : [...(previous ?? []), nftId]
      queryClient.setQueryData(favoritesKey, next)
      return { previous }
    },
    onError: (error, _vars, context) => {
      if (error instanceof Error && error.message === 'auth_required') return
      if (context?.previous) {
        queryClient.setQueryData(favoritesKey, context.previous)
      }
      toast.error(isApiError(error) ? error.message : 'Falha ao atualizar favorito')
    },
    onSuccess: (ids) => {
      if (!nftId) return
      queryClient.setQueryData(favoritesKey, ids)
      toast.success(ids.includes(nftId) ? 'Salvo nos favoritos' : 'Removido dos favoritos')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: favoritesKey })
    },
  })
  return { listQuery, isFavorite, toggleFavorite }
}
