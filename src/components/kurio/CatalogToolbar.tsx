import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/shared/lib/cn'
export type CatalogTab = 'all' | 'new' | 'trending'
export type CatalogSort = 'recent' | 'price-asc' | 'price-desc' | 'name-asc'
type CatalogToolbarProps = {
  tab: CatalogTab
  sort: CatalogSort
  onTabChange: (tab: CatalogTab) => void
  onSortChange: (sort: CatalogSort) => void
  tabs?: Array<{
    id: string
    label: string
  }>
  sortOptions?: Array<{
    id: string
    label: string
  }>
  className?: string
}
const DEFAULT_TABS: Array<{
  id: CatalogTab
  label: string
}> = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
]
const DEFAULT_SORT: Array<{
  id: CatalogSort
  label: string
}> = [
  { id: 'recent', label: 'Listados recentemente' },
  { id: 'price-asc', label: 'Preço: menor para maior' },
  { id: 'price-desc', label: 'Preço: maior para menor' },
  { id: 'name-asc', label: 'Nome A–Z' },
]
export function CatalogToolbar({
  tab,
  sort,
  onTabChange,
  onSortChange,
  tabs = DEFAULT_TABS,
  sortOptions = DEFAULT_SORT,
  className,
}: CatalogToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-transparent sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div
        role="tablist"
        aria-label="Filtros rápidos do catálogo"
        className="inline-flex items-center gap-3 overflow-x-auto md:gap-[20px] md:overflow-visible"
      >
        {tabs.map((item) => {
          const selected = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'relative pb-2 font-mono text-xs text-text-primary transition-colors md:font-sans md:text-base',
                selected &&
                  'font-bold text-text-accent after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:bg-primary',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              )}
              onClick={() => onTabChange(item.id as CatalogTab)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="hidden items-center gap-1 pb-1 text-base text-text-primary md:flex">
        <span id="catalog-sort-label" className="whitespace-nowrap text-text-secondary">
          Ordenar por:
        </span>
        <Select value={sort} onValueChange={(value) => onSortChange(value as CatalogSort)}>
          <SelectTrigger
            className="h-auto min-w-[190px] border-0 bg-transparent px-1 text-base text-text-primary shadow-none focus:ring-0"
            aria-labelledby="catalog-sort-label"
          >
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
