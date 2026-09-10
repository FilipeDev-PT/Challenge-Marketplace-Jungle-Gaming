import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib/cn'
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-ink',
        secondary: 'border-border-soft bg-surface-dark text-text-accent',
        outline: 'border-border text-text-secondary',
        destructive: 'border-transparent bg-error text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>
function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
