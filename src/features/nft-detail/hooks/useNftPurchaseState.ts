import { useEffect, useMemo, useState } from 'react'
import type { Nft } from '@/shared/api/contracts'
export function useNftPurchaseState(nft: Nft | undefined) {
  const [activeImage, setActiveImage] = useState(0)
  const [editionId, setEditionId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [detailTab, setDetailTab] = useState<'details' | 'reviews'>('details')
  const selectedEdition = useMemo(
    () => nft?.editions.find((edition) => edition.id === editionId) ?? nft?.editions[0],
    [editionId, nft],
  )
  useEffect(() => {
    if (!nft) return
    setActiveImage(0)
    const preferred =
      nft.editions.find((edition) => edition.label === '1/50' && edition.available > 0) ??
      nft.editions.find((edition) => edition.available > 0) ??
      nft.editions[0]
    setEditionId(preferred?.id ?? '')
    setQuantity(1)
  }, [nft])
  useEffect(() => {
    if (!selectedEdition) return
    const max = Math.min(selectedEdition.maxPerOrder, selectedEdition.available || 1)
    setQuantity((current) => Math.min(Math.max(1, current), max))
  }, [selectedEdition])
  const editionUnavailable = Boolean(selectedEdition && selectedEdition.available === 0)
  const maxQty = selectedEdition
    ? Math.max(1, Math.min(selectedEdition.maxPerOrder, selectedEdition.available || 1))
    : 1
  return {
    activeImage,
    setActiveImage,
    editionId,
    setEditionId,
    quantity,
    setQuantity,
    detailTab,
    setDetailTab,
    selectedEdition,
    editionUnavailable,
    maxQty,
  }
}
