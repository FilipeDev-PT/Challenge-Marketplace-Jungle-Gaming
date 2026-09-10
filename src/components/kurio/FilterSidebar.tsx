import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/shared/lib/cn'
export type FilterCollection = {
  id: string
  label: string
  count?: number
}
export type FilterNetwork = {
  id: 'ethereum' | 'polygon' | 'solana'
  label: string
  count?: number
}
export type FilterSidebarValue = {
  collections: string[]
  networks: Array<'ethereum' | 'polygon' | 'solana'>
  priceMin: number
  priceMax: number
}
type FilterSidebarProps = {
  collections: FilterCollection[]
  networks: FilterNetwork[]
  value: FilterSidebarValue
  onChange: (value: FilterSidebarValue) => void
  onApply?: (value: FilterSidebarValue) => void
  priceBounds?: {
    min: number
    max: number
  }
  className?: string
}
function formatPriceLabel(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
function toggleValue<T extends string>(list: T[], id: T): T[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}
export function FilterSidebar({
  collections,
  networks,
  value,
  onChange,
  onApply,
  priceBounds = { min: 0, max: 20 },
  className,
}: FilterSidebarProps) {
  const priceId = useId()
  const [draftPrice, setDraftPrice] = useState<[number, number]>([value.priceMin, value.priceMax])
  const [syncedFrom, setSyncedFrom] = useState({
    min: value.priceMin,
    max: value.priceMax,
  })
  if (syncedFrom.min !== value.priceMin || syncedFrom.max !== value.priceMax) {
    setSyncedFrom({ min: value.priceMin, max: value.priceMax })
    setDraftPrice([value.priceMin, value.priceMax])
  }
  return (
    <aside
      className={cn(
        'w-full max-w-[310px] overflow-hidden bg-surface-card p-5 text-foreground',
        className,
      )}
      aria-label="Filtros do catálogo"
    >
      <div className="flex flex-col gap-10">
        <section aria-labelledby={`${priceId}-collections`}>
          <h2
            id={`${priceId}-collections`}
            className="mb-3 text-lg font-bold leading-4 text-foreground"
          >
            Coleções
          </h2>
          <ul className="flex flex-col pl-3">
            {collections.map((collection) => {
              const checked = value.collections.includes(collection.id)
              return (
                <li key={collection.id}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-3 text-left text-[15px] leading-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      checked ? 'font-normal text-text-accent' : 'font-normal text-text-secondary',
                    )}
                    aria-pressed={checked}
                    onClick={() =>
                      onChange({
                        ...value,
                        collections: toggleValue(value.collections, collection.id),
                      })
                    }
                  >
                    <span>{collection.label}</span>
                    {collection.count != null ? (
                      <span className="font-bold">({collection.count})</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby={`${priceId}-price`}>
          <h2 id={`${priceId}-price`} className="mb-3 text-lg font-bold leading-4 text-foreground">
            Faixa de preço
          </h2>
          <div className="flex flex-col gap-3 pl-3">
            <Slider
              min={priceBounds.min}
              max={priceBounds.max}
              step={0.01}
              value={draftPrice}
              onValueChange={(next) => {
                const [min, max] = next as [number, number]
                setDraftPrice([min, max])
              }}
              aria-label="Faixa de preço em ETH"
            />
            <p className="text-[15px] text-foreground" aria-live="polite">
              Preço: {formatPriceLabel(draftPrice[0])} - {formatPriceLabel(draftPrice[1])} ETH
            </p>
            <Button
              type="button"
              className="h-auto w-fit rounded-[6px] px-3 py-2 text-base font-bold text-ink"
              onClick={() => {
                const next = {
                  ...value,
                  priceMin: draftPrice[0],
                  priceMax: draftPrice[1],
                }
                onChange(next)
                onApply?.(next)
              }}
            >
              Aplicar
            </Button>
          </div>
        </section>

        <section aria-labelledby={`${priceId}-networks`}>
          <h2
            id={`${priceId}-networks`}
            className="mb-3 text-lg font-bold leading-4 text-foreground"
          >
            Rede
          </h2>
          <ul className="flex flex-col pl-3">
            {networks.map((network) => {
              const checked = value.networks.includes(network.id)
              return (
                <li key={network.id}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-3 text-left text-[15px] leading-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                      checked ? 'font-normal text-text-accent' : 'font-normal text-text-secondary',
                    )}
                    aria-pressed={checked}
                    onClick={() =>
                      onChange({
                        ...value,
                        networks: toggleValue(value.networks, network.id),
                      })
                    }
                  >
                    <span>{network.label}</span>
                    {network.count != null ? (
                      <span className="font-bold">({network.count})</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </aside>
  )
}
