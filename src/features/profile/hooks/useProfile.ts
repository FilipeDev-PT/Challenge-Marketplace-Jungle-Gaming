import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UseFormReturn } from 'react-hook-form'
import { useAuth } from '@/app/providers/AuthProvider'
import type { PasswordFormValues } from '@/features/profile/components/PasswordForm'
import type { ProfileFormValues } from '@/features/profile/components/ProfileForm'
import { isApiError } from '@/shared/api/errors'
import { queryKeys } from '@/shared/api/query-keys'
import { profileApi } from '@/shared/api/services'
export function useProfile() {
  const { user } = useAuth()
  return useQuery({
    queryKey: queryKeys.profile(user?.id ?? ''),
    queryFn: ({ signal }) => profileApi.get(signal),
    enabled: Boolean(user?.id),
  })
}
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ProfileFormValues) =>
      profileApi.update({
        name: values.name,
        username: values.username,
        ens: values.ens ? `${values.ens}${values.ensTld}` : undefined,
        email: values.email,
        walletNickname: values.walletNickname || undefined,
        avatarUrl: values.avatarUrl ?? null,
      }),
    onSuccess: async (updated) => {
      queryClient.setQueryData(queryKeys.profile(updated.id), updated)
      await queryClient.invalidateQueries({ queryKey: queryKeys.session })
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile(updated.id) })
      toast.success('Perfil atualizado')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao salvar perfil')
    },
  })
}
export function useChangePassword(form: UseFormReturn<PasswordFormValues>) {
  return useMutation({
    mutationFn: (values: PasswordFormValues) =>
      profileApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      form.reset()
      toast.success('Senha alterada')
    },
    onError: (error) => {
      toast.error(isApiError(error) ? error.message : 'Falha ao alterar senha')
      if (isApiError(error) && error.fields?.currentPassword) {
        form.setError('currentPassword', {
          message: error.fields.currentPassword,
        })
      }
    },
  })
}
