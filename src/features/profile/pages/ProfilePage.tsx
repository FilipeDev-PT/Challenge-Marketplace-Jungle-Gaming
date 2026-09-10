import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
import { ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogoutToHome } from '@/features/auth/hooks/useLogoutToHome'
import { AccountLayout } from '@/features/layout/AccountLayout'
import { PasswordForm, type PasswordFormValues } from '@/features/profile/components/PasswordForm'
import { ProfileForm, type ProfileFormValues } from '@/features/profile/components/ProfileForm'
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
} from '@/features/profile/hooks/useProfile'
import { passwordSchema, profileSchema } from '@/features/profile/model/profileSchemas'
import { splitEns } from '@/shared/lib/ens'
export function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const logoutToHome = useLogoutToHome()
  const profileQuery = useProfile()
  const updateMutation = useUpdateProfile()
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    defaultValues: {
      name: '',
      username: '',
      ens: '',
      ensTld: '.eth',
      email: '',
      walletNickname: '',
      avatarUrl: null,
    },
  })
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema) as Resolver<PasswordFormValues>,
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const passwordMutation = useChangePassword(passwordForm)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({
        to: '/login',
        search: { redirect: '/account/profile', from: '/' },
      })
    }
  }, [authLoading, isAuthenticated, navigate])
  useEffect(() => {
    const profile = profileQuery.data
    if (!profile) return
    const ensParts = splitEns(profile.ens)
    profileForm.reset({
      name: profile.name,
      username: profile.username ?? '',
      ens: ensParts.name,
      ensTld: ensParts.tld,
      email: profile.email,
      walletNickname: profile.walletNickname ?? '',
      avatarUrl: profile.avatarUrl,
    })
  }, [profileQuery.data, profileForm])
  const pending = updateMutation.isPending || passwordMutation.isPending
  const onSave = async () => {
    const profileOk = await profileForm.trigger()
    const passwordValues = passwordForm.getValues()
    const wantsPassword =
      Boolean(passwordValues.currentPassword) ||
      Boolean(passwordValues.newPassword) ||
      Boolean(passwordValues.confirmPassword)
    const passwordOk = wantsPassword ? await passwordForm.trigger() : true
    if (!profileOk || !passwordOk) return
    const profileValues = profileForm.getValues()
    updateMutation.mutate(profileValues)
    if (wantsPassword) {
      passwordMutation.mutate(passwordForm.getValues())
    }
  }
  if (authLoading || !isAuthenticated) {
    return (
      <div className="py-10">
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (profileQuery.isLoading) {
    return (
      <div className="space-y-4 py-10">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (profileQuery.isError) {
    return (
      <div className="py-10">
        <ErrorState title="Perfil indisponível" onRetry={() => void profileQuery.refetch()} />
      </div>
    )
  }
  return (
    <AccountLayout
      active="profile"
      onLogout={() => {
        void logoutToHome()
      }}
    >
      <div className="max-w-[862px]">
        <h1 className="mb-8 text-base font-bold leading-4 text-foreground">
          Perfil do colecionador
        </h1>
        <ProfileForm form={profileForm} />
        <PasswordForm form={passwordForm} />
        <Button
          type="button"
          className="mt-8 h-10 w-[131px] rounded-md text-sm font-bold"
          disabled={pending}
          onClick={() => void onSave()}
        >
          {pending ? 'Salvando…' : 'Salvar'}
        </Button>
      </div>
    </AccountLayout>
  )
}
