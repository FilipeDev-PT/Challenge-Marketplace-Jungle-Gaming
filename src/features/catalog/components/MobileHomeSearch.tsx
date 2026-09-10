import { useRef, useState, type ReactNode } from 'react'
import { FilterIcon, SearchIcon } from '@/components/kurio/icons'
import { FilterSidebar, type FilterSidebarValue } from '@/components/kurio/FilterSidebar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import type { Facets } from '@/shared/api/cms-contracts'
import { cn } from '@/shared/lib/cn'
type MobileHomeSearchProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  facets?: Facets
  facetsLoading?: boolean
  filterValue: FilterSidebarValue
  priceBounds: {
    min: number
    max: number
  }
  onPatchFilters: (value: FilterSidebarValue) => void
  className?: string
}
export function MobileHomeSearch({
  searchValue,
  onSearchChange,
  facets,
  facetsLoading,
  filterValue,
  priceBounds,
  onPatchFilters,
  className,
}: MobileHomeSearchProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
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
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label className="relative flex h-[45px] min-w-0 flex-1 items-center gap-2 rounded-2xl bg-[#241810] px-3">
        <SearchIcon className="size-[22px] shrink-0 text-text-secondary" />
        <span className="sr-only">Buscar coleções</span>
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Explorar coleções"
          className="h-full w-full bg-transparent text-sm text-foreground placeholder:text-text-secondary focus:outline-none"
        />
      </label>
      <button
        ref={triggerRef}
        type="button"
        className="flex size-[45px] shrink-0 items-center justify-center rounded-2xl bg-primary text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Abrir filtros"
        onClick={() => setOpen(true)}
      >
        <FilterIcon className="size-[22px]" />
      </button>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            queueMicrotask(() => triggerRef.current?.focus())
          }
        }}
      >
        {' '}
        <SheetContent side="left" className="w-[min(100%,360px)] overflow-y-auto bg-ink-deep">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {facetsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <FilterSidebar
                collections={collections}
                networks={networks}
                value={filterValue}
                onChange={onPatchFilters}
                onApply={(value) => {
                  onPatchFilters(value)
                  setOpen(false)
                }}
                priceBounds={priceBounds}
                className="max-w-none"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
export function MobileHomeSearchSlot({ children }: { children: ReactNode }) {
  return <div className="md:hidden">{children}</div>
}
