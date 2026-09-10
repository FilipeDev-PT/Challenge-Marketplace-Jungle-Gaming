import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ArrowLeftIcon } from '@/components/kurio/icons'
import { cn } from '@/shared/lib/cn'
type MobileScreenHeaderProps = {
  title: string
  onBack?: () => void
  className?: string
  trailing?: ReactNode
}
export function MobileScreenHeader({
  title,
  onBack,
  className,
  trailing,
}: MobileScreenHeaderProps) {
  const navigate = useNavigate()
  return (
    <header className={cn('relative flex h-12 items-center justify-center', className)}>
      <button
        type="button"
        className="absolute left-0 flex size-9 items-center justify-center rounded-full bg-surface-raised text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Voltar"
        onClick={() => {
          if (onBack) {
            onBack()
            return
          }
          if (window.history.length > 1) window.history.back()
          else void navigate({ to: '/' })
        }}
      >
        <ArrowLeftIcon className="size-5" />
      </button>
      <h1 className="px-12 text-center font-mono text-sm font-bold leading-4 text-foreground">
        {title}
      </h1>
      {trailing ? <div className="absolute right-0">{trailing}</div> : null}
    </header>
  )
}
