import { cn } from '@/shared/lib/cn'
import { formatEth } from '@/shared/lib/eth'
import type { ComponentProps } from 'react'
type PriceEthProps = ComponentProps<'span'> & {
  value: string | number
  compareAt?: string | number | null
  digits?: number
}
export function PriceEth({ value, compareAt, digits = 2, className, ...props }: PriceEthProps) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)} {...props}>
      <span className="font-[inherit] text-text-accent">{formatEth(value, digits)}</span>
      {compareAt != null && compareAt !== '' ? (
        <span className="font-normal text-secondary line-through decoration-secondary">
          {formatEth(compareAt, digits)}
        </span>
      ) : null}
    </span>
  )
}
