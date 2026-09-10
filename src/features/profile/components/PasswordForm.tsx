import type { UseFormReturn } from 'react-hook-form'
import { PasswordInput } from '@/features/profile/components/PasswordInput'
export type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
type PasswordFormProps = {
  form: UseFormReturn<PasswordFormValues>
}
export function PasswordForm({ form }: PasswordFormProps) {
  return (
    <section className="mt-14">
      <h2 className="mb-6 text-base font-bold leading-4 text-foreground">Alterar senha</h2>
      <div className="flex flex-col gap-6">
        <PasswordInput
          id="current-password"
          label="Senha atual"
          autoComplete="current-password"
          error={form.formState.errors.currentPassword?.message}
          {...form.register('currentPassword')}
        />
        <PasswordInput
          id="new-password"
          label="Nova senha"
          autoComplete="new-password"
          error={form.formState.errors.newPassword?.message}
          {...form.register('newPassword')}
        />
        <PasswordInput
          id="confirm-password"
          label="Confirmar nova senha"
          autoComplete="new-password"
          error={form.formState.errors.confirmPassword?.message}
          {...form.register('confirmPassword')}
        />
      </div>
    </section>
  )
}
