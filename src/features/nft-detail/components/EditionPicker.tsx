import type { Nft } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
type EditionPickerProps = {
  editions: Nft['editions']
  selectedId: string | undefined
  unavailable: boolean
  onSelect: (editionId: string) => void
}
export function EditionPicker({ editions, selectedId, unavailable, onSelect }: EditionPickerProps) {
  return (
    <div>
      <p className="mb-3 text-base font-bold leading-4 text-foreground">Edição:</p>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Edição">
        {editions.map((edition) => {
          const selected = selectedId === edition.id
          const soldOut = edition.available === 0
          return (
            <button
              key={edition.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={soldOut}
              className={cn(
                'flex h-7 items-center justify-center rounded-full border bg-transparent px-2.5 text-sm leading-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                selected
                  ? 'border-primary font-medium text-primary'
                  : 'border-border-soft font-normal text-text-secondary hover:border-primary/50 hover:text-text-primary',
                soldOut && 'cursor-not-allowed opacity-40',
              )}
              onClick={() => onSelect(edition.id)}
            >
              {edition.label}
            </button>
          )
        })}
      </div>
      {unavailable ? (
        <p className="mt-2 text-sm text-error" role="status">
          Edição indisponível
        </p>
      ) : null}
    </div>
  )
}
