import type { Nft } from '@/shared/api/contracts'
export function attributeLabels(nft: Nft) {
  return nft.tags.filter((tag) => tag !== 'featured' && tag !== 'catalog').slice(0, 3)
}
export function averageRating(nft: Nft): {
  avg: number
  count: number
} {
  const reviews = nft.reviews ?? []
  if (!reviews.length) return { avg: 0, count: 0 }
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return { avg: sum / reviews.length, count: reviews.length }
}
