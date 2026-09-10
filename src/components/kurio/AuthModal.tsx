import { Link, useNavigate } from '@tanstack/react-router'
import type { ComponentProps, ReactNode } from 'react'
import { useState } from 'react'
import { AuthSocialButtons } from '@/components/kurio/AuthSocialButtons'
import { EyeIcon, EyeOffIcon } from '@/components/kurio/icons'
import { Input } from '@/components/ui/input'
import { cn } from '@/shared/lib/cn'
import { navigateByHref, resolveSafeRedirect } from '@/shared/lib/navigation'
type AuthModalShellProps = {
  mode: 'login' | 'register'
  redirectTo?: string
  closeTo?: string
  children: ReactNode
  onClose?: () => void
  className?: string
}
export function AuthModalShell({
  mode,
  redirectTo,
  closeTo,
  children,
  onClose,
  className,
}: AuthModalShellProps) {
  const navigate = useNavigate()
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
  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }
    void navigateByHref(navigate, safeClose)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <button
        type="button"
        className="absolute inset-0 bg-ink/80 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className={cn(
          'relative z-10 w-full max-w-[500px] overflow-hidden rounded-md bg-[#1a1210] shadow-2xl',
          className,
        )}
      >
        <div className="relative px-12 pb-0 pt-12">
          <button
            type="button"
            className="absolute right-[13px] top-[13px] flex size-[18px] items-center justify-center text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={
              safeClose !== '/' ? 'Fechar e voltar à página anterior' : 'Fechar e voltar ao início'
            }
            onClick={handleClose}
          >
            <span className="text-lg leading-none" aria-hidden>
              ×
            </span>
          </button>

          <div className="flex items-center justify-center gap-[8px] text-base leading-4">
            <Link
              to="/login"
              search={redirectSearch}
              id={mode === 'login' ? 'auth-modal-title' : undefined}
              className={cn(
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                mode === 'login' ? 'font-bold text-primary' : 'font-normal text-foreground/90',
              )}
            >
              Entrar
            </Link>
            <span className="h-5 w-px bg-border-soft" aria-hidden />
            <Link
              to="/register"
              search={redirectSearch}
              id={mode === 'register' ? 'auth-modal-title' : undefined}
              className={cn(
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                mode === 'register' ? 'font-bold text-primary' : 'font-normal text-foreground/90',
              )}
            >
              Criar conta
            </Link>
          </div>
          <p className="mx-auto mt-[28px] max-w-[404px] text-center text-sm leading-4 text-text-secondary">
            {mode === 'login'
              ? 'Entre para gerenciar sua carteira, coleção e perfil de criador.'
              : 'Crie seu perfil de colecionador e conecte uma carteira quando quiser.'}
          </p>
        </div>

        {children}

        <div className="h-2.5 bg-primary" aria-hidden />
      </div>
    </div>
  )
}
type AuthSocialBlockProps = {
  className?: string
}
export function AuthSocialBlock({ className }: AuthSocialBlockProps) {
  return (
    <div className={cn('pb-10 pt-6', className)}>
      <div className="flex items-center gap-3 px-0">
        <div className="h-px flex-1 bg-border" />
        <span className="shrink-0 text-xs text-text-secondary">Ou continue com</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-4 flex flex-col gap-3 px-20">
        <AuthSocialButtons buttonClassName="h-10 w-full gap-3 rounded-md border-border bg-transparent text-sm font-normal text-foreground hover:bg-surface-raised" />
      </div>
    </div>
  )
}
type AuthFieldProps = ComponentProps<typeof Input> & {
  error?: string
  showVisibilityToggle?: boolean
  toggleClassName?: string
}
export function AuthField({
  id,
  type = 'text',
  placeholder,
  error,
  showVisibilityToggle,
  toggleClassName,
  'aria-label': ariaLabel,
  className,
  ...props
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const canToggle = isPassword && (showVisibilityToggle ?? true)
  const resolvedType = canToggle ? (visible ? 'text' : 'password') : type
  return (
    <div>
      <div className="relative">
        <Input
          id={id}
          type={resolvedType}
          placeholder={placeholder}
          className={cn(
            'h-10 rounded-md border-border bg-[#140d0a] px-4 text-sm text-foreground placeholder:text-secondary',
            'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
            canToggle ? 'pr-11' : '',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-label={ariaLabel ?? placeholder}
          {...props}
        />
        {canToggle ? (
          <button
            type="button"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              toggleClassName ?? 'text-primary hover:text-primary-light',
            )}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  )
}
