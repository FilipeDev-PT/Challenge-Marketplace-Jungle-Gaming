import { useEffect, useState } from 'react'
import { ErrorState } from '@/components/kurio/ErrorState'
import type { FilterSidebarValue } from '@/components/kurio/FilterSidebar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  catalogSearchDefaults,
  type CatalogSearch,
} from '@/features/catalog/model/catalogSearch'
import { BlogSection } from '@/features/catalog/components/BlogSection'
import { CatalogSection } from '@/features/catalog/components/CatalogSection'
import { HomeHero } from '@/features/catalog/components/HomeHero'
import { MobileHomeSearch } from '@/features/catalog/components/MobileHomeSearch'
import { PromoBanners } from '@/features/catalog/components/PromoBanners'
import { useHomeCatalog } from '@/features/catalog/hooks/useHomeCatalog'
import { homeHeroDefault } from '@/shared/content/home-defaults'
type HomePageProps = {
  search: CatalogSearch
  onSearchChange: (next: Partial<CatalogSearch>) => void
}
export function HomePage({ search, onSearchChange }: HomePageProps) {
  const {
    homeQuery,
    facetsQuery,
    catalogQuery,
    resolved,
    fetchingCatalog,
    priceBounds,
    filterValue,
    featured,
    home,
  } = useHomeCatalog(search)
  const [searchDraft, setSearchDraft] = useState(search.q ?? '')
  useEffect(() => {
    setSearchDraft(search.q ?? '')
  }, [search.q])
  useEffect(() => {
    if (searchDraft === (search.q ?? '')) return
    const id = window.setTimeout(() => {
      onSearchChange({ q: searchDraft || undefined, page: 1 })
    }, 300)
    return () => window.clearTimeout(id)
  }, [searchDraft, onSearchChange, search.q])
  const patchFilters = (value: FilterSidebarValue) => {
    onSearchChange({
      collections: value.collections,
      network: value.networks,
      priceMin: String(value.priceMin),
      priceMax: String(value.priceMax),
      page: 1,
    })
  }
  const clearFilters = () => {
    onSearchChange({
      ...catalogSearchDefaults,
      q: search.q,
    })
  }
  const hero = home?.hero ?? homeHeroDefault
  if (homeQuery.isError && !home) {
    return (
      <div className="py-10">
        <ErrorState
          title="Falha ao carregar a home"
          description="Não foi possível buscar o conteúdo do marketplace."
          onRetry={() => void homeQuery.refetch()}
        />
      </div>
    )
  }
  return (
    <div className="bg-ink-deep text-text-primary">
      <div className="flex flex-col gap-4 pt-2 md:gap-0 md:pt-0">
        <MobileHomeSearch
          className="md:hidden"
          searchValue={searchDraft}
          onSearchChange={setSearchDraft}
          facets={facetsQuery.data}
          facetsLoading={facetsQuery.isLoading}
          filterValue={filterValue}
          priceBounds={priceBounds}
          onPatchFilters={patchFilters}
        />
        <HomeHero hero={hero} />
      </div>
      {home ? (
        <>
          <CatalogSection
            search={search}
            resolvedPage={resolved.page}
            home={home}
            facets={facetsQuery.data}
            facetsLoading={facetsQuery.isLoading}
            priceBounds={priceBounds}
            filterValue={filterValue}
            featured={featured}
            catalogItems={catalogQuery.data?.items}
            catalogLoading={catalogQuery.isLoading}
            catalogError={catalogQuery.isError}
            fetchingCatalog={fetchingCatalog}
            totalPages={catalogQuery.data?.totalPages ?? 1}
            onSearchChange={onSearchChange}
            onPatchFilters={patchFilters}
            onClearFilters={clearFilters}
            onRetryCatalog={() => void catalogQuery.refetch()}
          />
          <div className="hidden md:block">
            <PromoBanners promos={home.promos} />
            <BlogSection blog={home.blog} />
          </div>
        </>
      ) : (
        <div className="space-y-6 px-4 py-8 md:px-0" aria-busy="true" role="status">
          <span className="sr-only">Carregando catálogo</span>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}
    </div>
  )
}
