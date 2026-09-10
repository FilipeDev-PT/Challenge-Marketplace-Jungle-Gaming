import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { quotesApi } from '@/shared/api/services'
import { getOwnerKey } from '@/shared/lib/session-storage'
export function useApplyCoupon(couponCode: string | null) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const ownerKey = getOwnerKey(user?.id)
  const [couponDraft, setCouponDraft] = useState<string | null>(null)
  const couponInput = couponDraft ?? couponCode ?? ''
  const applyCoupon = useMutation({
    mutationFn: (code: string | null) => quotesApi.create({ couponCode: code }),
    onSuccess: (quote) => {
      queryClient.setQueryData(queryKeys.quote(ownerKey, quote.couponCode), quote)
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart(ownerKey) })
      if (quote.couponCode && !quote.couponValid) {
        toast.error(quote.warnings[0] ?? 'Cupom inválido')
      } else if (quote.couponCode) {
        toast.success('Cupom aplicado')
      } else {
        toast.message('Cupom removido')
      }
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao aplicar cupom')
    },
  })
  return {
    couponInput,
    setCouponDraft,
    applyCoupon,
  }
}
