import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { walletsApi } from '@/shared/api/services'
import type { Wallet } from '@/shared/api/contracts'
type WalletPayload = Omit<Wallet, 'id'>
export function useWalletMutations(onSettledSuccess?: (wallet: Wallet) => void) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const walletsKey = queryKeys.wallets(user?.id ?? '')
  const createWallet = useMutation({
    mutationFn: (values: WalletPayload) => walletsApi.create(values),
    onSuccess: async (wallet) => {
      await queryClient.invalidateQueries({ queryKey: walletsKey })
      onSettledSuccess?.(wallet)
      toast.success('Carteira adicionada')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao adicionar carteira')
    },
  })
  const updateWallet = useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<WalletPayload> }) =>
      walletsApi.update(id, values),
    onSuccess: async (wallet) => {
      await queryClient.invalidateQueries({ queryKey: walletsKey })
      onSettledSuccess?.(wallet)
      toast.success('Carteira atualizada')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao atualizar carteira')
    },
  })
  return {
    createWallet,
    updateWallet,
    busy: createWallet.isPending || updateWallet.isPending,
  }
}
