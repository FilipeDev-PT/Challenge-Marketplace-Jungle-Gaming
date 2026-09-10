import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { cartApi } from '@/shared/api/services'
import { getOwnerKey } from '@/shared/lib/session-storage'
export function useCartMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const ownerKey = getOwnerKey(user?.id)
  const updateItem = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      cartApi.updateItem(id, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(ownerKey), cart)
      void queryClient.invalidateQueries({ queryKey: ['quote', ownerKey] })
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao atualizar quantidade')
    },
  })
  const removeItem = useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(ownerKey), cart)
      void queryClient.invalidateQueries({ queryKey: ['quote', ownerKey] })
      toast.message('Item removido')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao remover item')
    },
  })
  const addItem = useMutation({
    mutationFn: (body: { nftId: string; editionId: string; quantity: number }) =>
      cartApi.addItem(body),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart(ownerKey), cart)
      void queryClient.invalidateQueries({ queryKey: ['quote', ownerKey] })
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart(ownerKey) })
      toast.success('Adicionado ao carrinho')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Não foi possível adicionar ao carrinho')
    },
  })
  return { updateItem, removeItem, addItem, ownerKey }
}
