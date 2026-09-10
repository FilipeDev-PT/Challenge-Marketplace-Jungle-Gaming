import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthField } from '@/components/kurio/AuthModal'
import { mobileAuthFieldClass } from '@/components/kurio/MobileAuthShell'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/providers/AuthProvider'
import { registerSchema, type RegisterFormValues } from '@/features/auth/model/authSchemas'
import { isApiError } from '@/shared/api/errors'
import { navigateByHref } from '@/shared/lib/navigation'
type RegisterFormProps = {
  variant: 'desktop' | 'mobile'
  redirectTo: string
}
export function RegisterForm({ variant, redirectTo }: RegisterFormProps) {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      toast.success('Conta criada')
      await navigateByHref(navigate, redirectTo, { replace: true })
    } catch (error) {
      toast.error(isApiError(error) ? error.message : 'Falha no cadastro')
      if (isApiError(error) && error.fields) {
        for (const [field, message] of Object.entries(error.fields)) {
          if (field === 'name' || field === 'email' || field === 'password') {
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
          id="register-name"
          autoComplete="username"
          placeholder="Nome de usuário"
          aria-label="Nome de usuário"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        <AuthField
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="Digite seu e-mail"
          aria-label="E-mail"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        <AuthField
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Senha"
          aria-label="Senha"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />
        <AuthField
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Confirmar senha"
          aria-label="Confirmar senha"
          showVisibilityToggle={false}
          error={form.formState.errors.confirmPassword?.message}
          {...form.register('confirmPassword')}
        />
        <Button
          type="submit"
          className="mt-6 h-[45px] w-full rounded-md text-sm font-bold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Criando…' : 'Criar conta'}
        </Button>
      </form>
    )
  }
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
      <AuthField
        id="register-name"
        autoComplete="username"
        placeholder="Nome de usuário"
        aria-label="Nome de usuário"
        className={mobileAuthFieldClass}
        error={form.formState.errors.name?.message}
        {...form.register('name')}
      />
      <AuthField
        id="register-email"
        type="email"
        autoComplete="email"
        placeholder="Digite seu e-mail"
        aria-label="E-mail"
        className={mobileAuthFieldClass}
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <AuthField
        id="register-password"
        type="password"
        autoComplete="new-password"
        placeholder="Senha"
        aria-label="Senha"
        className={mobileAuthFieldClass}
        toggleClassName="text-text-secondary hover:text-foreground"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <AuthField
        id="register-confirm"
        type="password"
        autoComplete="new-password"
        placeholder="Confirmar senha"
        aria-label="Confirmar senha"
        showVisibilityToggle
        className={mobileAuthFieldClass}
        toggleClassName="text-text-secondary hover:text-foreground"
        error={form.formState.errors.confirmPassword?.message}
        {...form.register('confirmPassword')}
      />
      <Button
        type="submit"
        className="mt-8 h-[60px] w-full rounded-xl font-mono text-base font-bold text-ink"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? 'Criando…' : 'Criar perfil'}
      </Button>
    </form>
  )
}
