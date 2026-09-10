import type { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'
function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        'rounded-md bg-[linear-gradient(90deg,var(--color-surface-raised)_0%,var(--color-surface-dark)_45%,var(--color-surface-raised)_100%)] bg-[length:200%_100%]',
        'motion-safe:animate-shimmer motion-reduce:animate-none motion-reduce:bg-surface-raised',
        className,
      )}
      {...props}
    />
  )
}
export { Skeleton }
