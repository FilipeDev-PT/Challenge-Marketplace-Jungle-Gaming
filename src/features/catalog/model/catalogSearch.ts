export type CatalogSort = 'recent' | 'price-asc' | 'price-desc' | 'name-asc'
export type CatalogTab = 'all' | 'new' | 'trending'

export type CatalogSearch = {
  q?: string
  collections?: string[]
  network?: string[]
  priceMin?: string
  priceMax?: string
  sort?: CatalogSort
  tab?: CatalogTab
  page?: number
}

export const catalogSearchDefaults: Required<
  Pick<CatalogSearch, 'collections' | 'network' | 'sort' | 'tab' | 'page'>
> = {
  collections: [],
  network: [],
  sort: 'recent',
  tab: 'all',
  page: 1,
}

export function resolveCatalogSearch(search: CatalogSearch) {
  return {
    q: search.q,
    collections: search.collections ?? [],
    network: search.network ?? [],
    priceMin: search.priceMin,
    priceMax: search.priceMax,
    sort: search.sort ?? 'recent',
    tab: search.tab ?? 'all',
    page: search.page ?? 1,
  }
}
