import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
type EmptyStateProps = {
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}
export function EmptyState({
  title = 'Nenhum resultado',
  description = 'Tente ajustar os filtros ou a busca para encontrar NFTs.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-start gap-3 rounded-md border border-border bg-surface-card p-8',
        className,
      )}
    >
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-text-secondary">{description}</p>
      {action ? <div className="mt-2 mx-auto block text-center">{action}</div> : null}
    </div>
  )
}
