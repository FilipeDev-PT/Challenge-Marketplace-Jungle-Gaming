import type {
  CatalogSearch,
  CatalogSort,
  CatalogTab,
} from '@/features/catalog/model/catalogSearch'

function asStringList(value: unknown): string[] {
  if (value == null || value === '') return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
  }
  return []
}

const SORTS = new Set(['recent', 'price-asc', 'price-desc', 'name-asc'])
const TABS = new Set(['all', 'new', 'trending'])

export function parseCatalogSearch(search: Record<string, unknown>): CatalogSearch {
  const sort = typeof search.sort === 'string' && SORTS.has(search.sort) ? search.sort : undefined
  const tab = typeof search.tab === 'string' && TABS.has(search.tab) ? search.tab : undefined
  const pageRaw = search.page
  const page =
    typeof pageRaw === 'number'
      ? pageRaw
      : typeof pageRaw === 'string' && pageRaw
        ? Number(pageRaw)
        : undefined

  return {
    q: typeof search.q === 'string' ? search.q : undefined,
    collections: asStringList(search.collections),
    network: asStringList(search.network),
    priceMin: typeof search.priceMin === 'string' ? search.priceMin : undefined,
    priceMax: typeof search.priceMax === 'string' ? search.priceMax : undefined,
    sort: sort as CatalogSort | undefined,
    tab: tab as CatalogTab | undefined,
    page: Number.isFinite(page) && (page as number) > 0 ? (page as number) : undefined,
  }
}
