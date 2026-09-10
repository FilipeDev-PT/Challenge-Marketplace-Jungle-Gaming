import * as React from 'react'
import { cn } from '@/shared/lib/cn'
export type InputProps = React.ComponentProps<'input'>
function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-surface-dark px-3 py-2 text-sm text-text-primary placeholder:text-secondary',
        'transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
export { Input }
