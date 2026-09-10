import { MinusIcon, PlusIcon, DeleteIcon } from '@/components/kurio/icons'
import { cn } from '@/shared/lib/cn'
type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  id?: string
  className?: string
  disabled?: boolean
  label?: string
  variant?: 'detail' | 'compact' | 'outline'
  onRemove?: () => void
}
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  id,
  className,
  disabled = false,
  label = 'Quantidade',
  variant = 'detail',
  onRemove,
}: QuantityStepperProps) {
  const atMin = value <= min
  const atMax = value >= max
  const compact = variant === 'compact'
  const outline = variant === 'outline'
  const showRemoveAsMinus = outline && Boolean(onRemove) && value <= min
  const btnBase = outline
    ? 'flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/80 text-primary disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
    : cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary text-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        compact ? 'h-[30px] w-5' : 'h-[50px] w-[26px]',
      )
  return (
    <div
      className={cn(
        'inline-flex items-center justify-between',
        outline ? 'h-7 w-[88px]' : compact ? 'h-[30px] w-[75px]' : 'h-[50px] w-[103px]',
        className,
      )}
      role="group"
      aria-label={label}
    >
      {showRemoveAsMinus ? (
        <button
          type="button"
          className={btnBase}
          aria-label="Remover item"
          disabled={disabled}
          onClick={onRemove}
        >
          <DeleteIcon className="size-3.5" />
        </button>
      ) : (
        <button
          type="button"
          className={btnBase}
          aria-label={`Diminuir ${label.toLowerCase()}`}
          disabled={disabled || atMin}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <MinusIcon className={outline || compact ? 'size-3' : 'size-3.5'} />
        </button>
      )}
      <output
        id={id}
        className={cn(
          'min-w-[11px] text-center font-medium text-foreground tabular-nums',
          outline ? 'text-sm leading-5' : compact ? 'text-base leading-6' : 'text-[18px] leading-7',
        )}
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        className={btnBase}
        aria-label={`Aumentar ${label.toLowerCase()}`}
        disabled={disabled || atMax}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon className={outline || compact ? 'size-3' : 'size-3.5'} />
      </button>
    </div>
  )
}
