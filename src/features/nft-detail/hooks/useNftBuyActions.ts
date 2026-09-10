import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useCartMutations } from '@/features/cart/hooks/useCartMutations'
type BuyPayload = {
  nftId: string
  editionId: string
  quantity: number
}
export function useNftBuyActions(buyPayload: BuyPayload, hasEdition: boolean) {
  const navigate = useNavigate()
  const { addItem } = useCartMutations()
  const handleBuy = () => {
    if (!hasEdition) return
    addItem.mutate(buyPayload, {
      onSuccess: () => {
        void navigate({ to: '/cart' })
      },
    })
  }
  const handleAddToCart = () => {
    if (!hasEdition) return
    addItem.mutate(buyPayload, {
      onSuccess: () => {
        toast.success('Adicionado ao carrinho')
      },
    })
  }
  return {
    addItem,
    handleBuy,
    handleAddToCart,
  }
}
