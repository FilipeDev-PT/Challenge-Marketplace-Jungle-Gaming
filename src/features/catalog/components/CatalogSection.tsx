import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { CatalogGridSkeleton } from '@/components/kurio/ShimmerSkeleton'
import {
  CatalogToolbar,
  type CatalogSort,
  type CatalogTab,
} from '@/components/kurio/CatalogToolbar'
import { EmptyState } from '@/components/kurio/EmptyState'
import { ErrorState } from '@/components/kurio/ErrorState'
import { FilterSidebar, type FilterSidebarValue } from '@/components/kurio/FilterSidebar'
import { NftCard } from '@/components/kurio/NftCard'
import { ChevronRightIcon } from '@/components/kurio/icons'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { CatalogSearch } from '@/features/catalog/model/catalogSearch'
import { FeaturedBanner } from '@/features/catalog/components/FeaturedBanner'
import { pageNumbers } from '@/features/catalog/lib/catalog-view'
import type { Facets, HomeContent } from '@/shared/api/cms-contracts'
import type { Nft } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
import { CATALOG_SECTION_ID, isCatalogHash, scrollToCatalogSection } from '@/shared/lib/navigation'
type CatalogSectionProps = {
  search: CatalogSearch
  resolvedPage: number
  home: HomeContent
  facets: Facets | undefined
  facetsLoading: boolean
  priceBounds: {
    min: number
    max: number
  }
  filterValue: FilterSidebarValue
  featured: Nft | undefined
  catalogItems: Nft[] | undefined
  catalogLoading: boolean
  catalogError: boolean
  fetchingCatalog: boolean
  totalPages: number
  onSearchChange: (next: Partial<CatalogSearch>) => void
  onPatchFilters: (value: FilterSidebarValue) => void
  onClearFilters: () => void
  onRetryCatalog: () => void
}
function rareBadge(nft: Nft): string | null {
  return nft.tags.some((t) => /raro/i.test(t)) ? 'RARO' : null
}
export function CatalogSection({
  search,
  resolvedPage,
  home,
  facets,
  facetsLoading,
  priceBounds,
  filterValue,
  featured,
  catalogItems,
  catalogLoading,
  catalogError,
  fetchingCatalog,
  totalPages,
  onSearchChange,
  onPatchFilters,
  onClearFilters,
  onRetryCatalog,
}: CatalogSectionProps) {
  const hash = useRouterState({ select: (s) => s.location.hash })
  useEffect(() => {
    if (!isCatalogHash(hash)) return
    const id = window.requestAnimationFrame(() => scrollToCatalogSection())
    return () => window.cancelAnimationFrame(id)
  }, [hash])
  const pages = pageNumbers(resolvedPage, totalPages)
  const collections = facets?.collections ?? []
  const networks = (facets?.networks ?? []).filter(
    (
      n,
    ): n is {
      id: 'ethereum' | 'polygon' | 'solana'
      label: string
      count: number
    } => n.id === 'ethereum' || n.id === 'polygon' || n.id === 'solana',
  )
  const filterSidebar = (
    <FilterSidebar
      collections={collections}
      networks={networks}
      value={filterValue}
      onChange={onPatchFilters}
      onApply={onPatchFilters}
      priceBounds={priceBounds}
    />
  )
  const leftCol = catalogItems?.filter((_, i) => i % 2 === 0) ?? []
  const rightCol = catalogItems?.filter((_, i) => i % 2 === 1) ?? []
  return (
    <section id={CATALOG_SECTION_ID} className="mx-auto mt-4 w-full max-w-[1200px] scroll-mt-8 md:mt-20">
      <h2 className="sr-only">Mercado de NFTs</h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-[48px] md:gap-12">
        <div className="hidden w-[310px] shrink-0 flex-col gap-6 lg:flex">
          {facetsLoading ? <Skeleton className="h-80 w-full" /> : filterSidebar}
          {featured ? <FeaturedBanner featured={featured} banner={home.featuredBanner} /> : null}
        </div>

        <div className="min-w-0 flex-1">
          <CatalogToolbar
            tab={(search.tab ?? 'all') as CatalogTab}
            sort={(search.sort ?? 'recent') as CatalogSort}
            tabs={home.catalog.tabs}
            sortOptions={home.catalog.sortOptions}
            onTabChange={(tab) => onSearchChange({ tab, page: 1 })}
            onSortChange={(sort) => onSearchChange({ sort, page: 1 })}
            className="mb-4 md:mb-12"
          />

          {fetchingCatalog && !catalogLoading ? (
            <p className="mb-2 text-xs text-text-secondary md:hidden" aria-live="polite">
              Atualizando…
            </p>
          ) : null}

          {catalogLoading ? (
            <CatalogGridSkeleton count={9} />
          ) : catalogError ? (
            <ErrorState
              title="Falha ao carregar o catálogo"
              description="Não foi possível buscar os NFTs. Verifique a conexão e tente de novo."
              onRetry={onRetryCatalog}
            />
          ) : !catalogItems?.length ? (
            <EmptyState
              title="Nenhum NFT encontrado"
              description="Ajuste busca, coleções, rede ou faixa de preço."
              action={
                <Button type="button" variant="outline" onClick={onClearFilters}>
                  Limpar filtros
                </Button>
              }
            />
          ) : (
            <>
              <div
                className={cn(
                  'grid grid-cols-2 gap-x-4 gap-y-6 md:hidden',
                  fetchingCatalog && !catalogLoading ? 'opacity-80' : '',
                )}
              >
                <div className="flex flex-col gap-6">
                  {leftCol.map((nft, index) => (
                    <NftCard
                      key={nft.id}
                      variant="mobile"
                      id={nft.id}
                      name={nft.name}
                      imageUrl={nft.imageUrl}
                      priceEth={nft.priceEth}
                      compareAtEth={nft.compareAtEth}
                      badge={rareBadge(nft)}
                      showFavorite={index === 0}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-6 pt-8">
                  {rightCol.map((nft) => (
                    <NftCard
                      key={nft.id}
                      variant="mobile"
                      id={nft.id}
                      name={nft.name}
                      imageUrl={nft.imageUrl}
                      priceEth={nft.priceEth}
                      compareAtEth={nft.compareAtEth}
                      badge={rareBadge(nft)}
                      showFavorite
                    />
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  'hidden gap-x-[34px] gap-y-[72px] md:grid md:grid-cols-2 xl:grid-cols-3',
                  fetchingCatalog && !catalogLoading ? 'opacity-80' : '',
                )}
              >
                {catalogItems.map((nft) => (
                  <NftCard
                    key={nft.id}
                    id={nft.id}
                    name={nft.name}
                    imageUrl={nft.imageUrl}
                    priceEth={nft.priceEth}
                    compareAtEth={nft.compareAtEth}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav
                  className="mt-10 flex justify-center gap-2 pb-4 md:mt-14 md:justify-end"
                  aria-label="Paginação do catálogo"
                >
                  {pages.map((page) => (
                    <button
                      key={page}
                      type="button"
                      aria-current={page === resolvedPage ? 'page' : undefined}
                      className={cn(
                        'flex size-[35px] items-center justify-center rounded-[4px] text-[18px] leading-4 transition-colors',
                        page === resolvedPage
                          ? 'bg-primary font-bold text-ink'
                          : 'border border-primary bg-transparent font-normal text-primary hover:bg-primary/10',
                      )}
                      onClick={() => onSearchChange({ page })}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="flex size-[35px] items-center justify-center rounded-[4px] border border-primary bg-transparent text-primary hover:bg-primary/10 disabled:opacity-40"
                    disabled={resolvedPage >= totalPages}
                    aria-label="Próxima página"
                    onClick={() => onSearchChange({ page: Math.min(totalPages, resolvedPage + 1) })}
                  >
                    <ChevronRightIcon className="size-[18px]" />
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
