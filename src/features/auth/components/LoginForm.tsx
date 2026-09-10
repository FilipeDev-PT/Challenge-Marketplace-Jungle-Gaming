import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthField } from '@/components/kurio/AuthModal'
import { mobileAuthFieldClass } from '@/components/kurio/MobileAuthShell'
import { toastUnavailable } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers/AuthProvider'
import { loginSchema, type LoginFormValues } from '@/features/auth/model/authSchemas'
import { isApiError } from '@/shared/api/errors'
import { navigateByHref } from '@/shared/lib/navigation'
type LoginFormProps = {
  variant: 'desktop' | 'mobile'
  redirectTo: string
}
export function LoginForm({ variant, redirectTo }: LoginFormProps) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password)
      toast.success('Bem-vindo de volta')
      await navigateByHref(navigate, redirectTo, { replace: true })
    } catch (error) {
      toast.error(isApiError(error) ? error.message : 'Falha no login')
      if (isApiError(error) && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          if (field === 'email' || field === 'password') {
            form.setError(field, { message })
          }
        }
      }
    }
  })
  if (variant === 'desktop') {
    return (
      <form className="flex flex-col gap-3 px-20 pt-6" onSubmit={onSubmit} noValidate>
        <AuthField
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="contato@email.com"
          aria-label="E-mail"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="***********"
          aria-label="Senha"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />
        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => toastUnavailable()}
          >
            Esqueceu a senha?
          </button>
        </div>
        <Button
          type="submit"
          className="mt-6 h-[45px] w-full rounded-md text-sm font-bold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    )
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
      <AuthField
        id="login-email"
        type="email"
        autoComplete="email"
        placeholder="contato@email.com"
        aria-label="E-mail"
        className={mobileAuthFieldClass}
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <AuthField
        id="login-password"
        type="password"
        autoComplete="current-password"
        placeholder="***********"
        aria-label="Senha"
        className={mobileAuthFieldClass}
        toggleClassName="text-text-secondary hover:text-foreground"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-text-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => toastUnavailable()}
        >
          Esqueceu a senha?
        </button>
      </div>
      <Button
        type="submit"
        className="mt-8 h-[60px] w-full rounded-xl font-mono text-base font-bold text-ink"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  )
}
