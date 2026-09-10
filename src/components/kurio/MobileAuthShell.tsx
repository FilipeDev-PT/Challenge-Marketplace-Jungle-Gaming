import { Link, useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AuthSocialButtons } from '@/components/kurio/AuthSocialButtons'
import { ArrowLeftIcon } from '@/components/kurio/icons'
import { cn } from '@/shared/lib/cn'
import { navigateByHref, resolveSafeRedirect } from '@/shared/lib/navigation'
type MobileAuthShellProps = {
  mode: 'login' | 'register'
  redirectTo?: string
  closeTo?: string
  children: ReactNode
  className?: string
}
export function MobileAuthShell({
  mode,
  redirectTo,
  closeTo,
  children,
  className,
}: MobileAuthShellProps) {
  const navigate = useNavigate()
  const safeClose = resolveSafeRedirect(closeTo ?? redirectTo)
  return (
    <div
      className={cn(
        'relative z-10 flex min-h-[100dvh] w-full flex-col bg-[#0f0907] px-7 pb-8 pt-6 font-mono',
        className,
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-surface-raised text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Voltar"
          onClick={() => void navigateByHref(navigate, safeClose)}
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <button
          type="button"
          className="text-[28px] font-bold leading-none tracking-[0.08em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Kurio — início"
          onClick={() => void navigate({ to: '/' })}
        >
          KURIO
        </button>
        <span className="size-9" aria-hidden />
      </div>

      <div className="flex flex-col items-center">
        <h1
          id="auth-mobile-title"
          className="mt-6 text-center text-base font-bold leading-4 text-foreground"
        >
          {mode === 'login' ? 'Entrar' : 'Criar perfil de colecionador'}
        </h1>
      </div>

      <div className="mt-10 flex flex-1 flex-col">{children}</div>
    </div>
  )
}
type MobileAuthSocialProps = {
  className?: string
}
export function MobileAuthSocial({ className }: MobileAuthSocialProps) {
  return (
    <div className={cn('mt-10', className)}>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="shrink-0 text-xs">Ou continue com</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <AuthSocialButtons buttonClassName="h-[50px] w-full gap-3 rounded-xl border-border bg-transparent font-mono text-sm font-normal text-text-secondary hover:bg-surface-raised hover:text-foreground" />
      </div>
    </div>
  )
}
type MobileAuthFooterProps = {
  mode: 'login' | 'register'
  redirectTo?: string
}
export function MobileAuthFooter({
  mode,
  redirectTo,
  closeTo,
}: MobileAuthFooterProps & {
  closeTo?: string
}) {
  const safeRedirect = resolveSafeRedirect(redirectTo)
  const safeClose = resolveSafeRedirect(closeTo ?? redirectTo)
  const redirectSearch =
    safeRedirect !== '/'
      ? {
          redirect: safeRedirect,
          ...(safeClose !== '/' ? { from: safeClose } : {}),
        }
      : safeClose !== '/'
        ? { from: safeClose }
        : undefined
  if (mode === 'login') {
    return (
      <p className="mt-auto pt-10 text-center text-sm leading-5 text-text-secondary">
        Novo na Kurio?{' '}
        <Link
          to="/register"
          search={redirectSearch}
          className="font-medium text-text-secondary underline-offset-2 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Crie uma conta
        </Link>
      </p>
    )
  }
  return (
    <p className="mt-auto pt-8 text-center text-sm leading-5 text-text-secondary">
      Já tem uma conta?{' '}
      <Link
        to="/login"
        search={redirectSearch}
        className="font-medium text-text-secondary underline-offset-2 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Entre
      </Link>
    </p>
  )
}
export const mobileAuthFieldClass =
  'h-[50px] rounded-xl border-border bg-transparent px-4 font-mono text-sm text-foreground placeholder:text-text-secondary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary'
