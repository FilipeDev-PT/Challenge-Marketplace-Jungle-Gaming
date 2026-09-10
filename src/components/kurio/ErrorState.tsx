import { Button } from '@/components/ui/button'
import { cn } from '@/shared/lib/cn'
type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}
export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não foi possível carregar os dados. Tente novamente.',
  onRetry,
  retryLabel = 'Tentar novamente',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-3 rounded-md border border-error/40 bg-surface-card p-8',
        className,
      )}
    >
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-text-secondary">{description}</p>
      {onRetry ? (
        <Button type="button" className="mt-2" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
