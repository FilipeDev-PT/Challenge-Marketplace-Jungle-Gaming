import type { CatalogSearch } from '@/features/catalog/model/catalogSearch'
import type { FilterSidebarValue } from '@/components/kurio'
export function toFilterValue(
  search: CatalogSearch,
  bounds: {
    min: number
    max: number
  },
): FilterSidebarValue {
  const priceMin = Number(search.priceMin ?? bounds.min)
  const priceMax = Number(search.priceMax ?? bounds.max)
  return {
    collections: search.collections ?? [],
    networks: (search.network ?? []).filter(
      (n): n is 'ethereum' | 'polygon' | 'solana' =>
        n === 'ethereum' || n === 'polygon' || n === 'solana',
    ),
    priceMin: Number.isFinite(priceMin) ? priceMin : bounds.min,
    priceMax: Number.isFinite(priceMax) ? priceMax : bounds.max,
  }
}
export function pageNumbers(_current: number, total: number): number[] {
  const max = Math.min(total, 4)
  return Array.from({ length: max }, (_, i) => i + 1)
}
