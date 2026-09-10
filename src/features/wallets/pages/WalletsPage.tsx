import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/AuthProvider'
import { ErrorState } from '@/components/kurio'
import { Skeleton } from '@/components/ui/skeleton'
import { useLogoutToHome } from '@/features/auth/hooks/useLogoutToHome'
import { AccountLayout } from '@/features/layout/AccountLayout'
import { PrimaryWalletCard } from '@/features/wallets/components/PrimaryWalletCard'
import { SecondaryWallets } from '@/features/wallets/components/SecondaryWallets'
import { WalletForm, type WalletFormValues } from '@/features/wallets/components/WalletForm'
import { useWalletMutations } from '@/features/wallets/hooks/useWalletMutations'
import { useWallets } from '@/features/wallets/hooks/useWallets'
import { toWalletApiPayload, walletFormSchema } from '@/features/wallets/model/walletSchema'
import type { Wallet } from '@/shared/api/contracts'
import { splitEns } from '@/shared/lib/ens'
type UserBits = {
  name?: string
  username?: string
  email?: string
  ens?: string
  walletNickname?: string
} | null
const emptyForm = (user?: UserBits): WalletFormValues => {
  const ensParts = splitEns(user?.ens)
  return {
    displayName: user?.name ?? '',
    walletNickname: user?.walletNickname ?? '',
    network: '',
    profileName: user?.username ?? '',
    walletAddress: '',
    secondaryWallet: '',
    walletType: '',
    referralCode: 'KURIO',
    email: user?.email ?? '',
    ensName: ensParts.name,
    ensTld: ensParts.tld,
    isPrimary: true,
    sameAsPrimary: false,
  }
}
function formFromWallet(wallet: Wallet, user?: UserBits): WalletFormValues {
  const ensParts = splitEns(user?.ens)
  return {
    displayName: user?.name ?? wallet.label,
    walletNickname: wallet.label || user?.walletNickname || '',
    network: wallet.network,
    profileName: user?.username ?? '',
    walletAddress: wallet.address,
    secondaryWallet: '',
    walletType: wallet.provider,
    referralCode: 'KURIO',
    email: user?.email ?? '',
    ensName: ensParts.name,
    ensTld: ensParts.tld,
    isPrimary: wallet.isPrimary,
    sameAsPrimary: false,
  }
}
export function WalletsPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const logoutToHome = useLogoutToHome()
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const walletsQuery = useWallets()
  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletFormSchema) as Resolver<WalletFormValues>,
    defaultValues: emptyForm(user),
  })
  const backToList = () => {
    setMode('list')
    setEditingId(null)
    form.reset(emptyForm(user))
  }
  const { createWallet, updateWallet, busy } = useWalletMutations(() => {
    backToList()
  })
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({
        to: '/login',
        search: { redirect: '/account/wallets', from: '/' },
      })
    }
  }, [authLoading, isAuthenticated, navigate])
  const wallets = walletsQuery.data ?? []
  const primary = wallets.find((w) => w.isPrimary) ?? wallets[0]
  const secondary = wallets.filter((w) => w.id !== primary?.id)
  const startCreatePrimary = () => {
    setEditingId(null)
    form.reset({ ...emptyForm(user), isPrimary: true })
    setMode('form')
  }
  const startEditPrimary = () => {
    if (!primary) {
      startCreatePrimary()
      return
    }
    setEditingId(primary.id)
    form.reset(formFromWallet(primary, user))
    setMode('form')
  }
  const startEditSecondary = (wallet: Wallet) => {
    setEditingId(wallet.id)
    form.reset({ ...formFromWallet(wallet, user), isPrimary: false })
    setMode('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const addSecondary = () => {
    const sameAsPrimary = form.getValues('sameAsPrimary')
    if (sameAsPrimary && primary) {
      createWallet.mutate({
        label: `${primary.label} (secundária)`,
        address: primary.address,
        provider: primary.provider,
        network: primary.network,
        isPrimary: false,
      })
      return
    }
    setEditingId(null)
    form.reset({ ...emptyForm(user), isPrimary: false })
    setMode('form')
    toast.message('Preencha os dados da carteira secundária e salve.')
  }
  const onSubmit = form.handleSubmit((values) => {
    const payload = toWalletApiPayload(values as Parameters<typeof toWalletApiPayload>[0])
    if (editingId) {
      updateWallet.mutate({ id: editingId, values: payload })
      return
    }
    createWallet.mutate(payload)
  })
  if (authLoading || !isAuthenticated) {
    return (
      <div className="py-10">
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }
  if (walletsQuery.isLoading) {
    return (
      <div className="space-y-4 py-10">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }
  if (walletsQuery.isError) {
    return (
      <div className="py-10">
        <ErrorState
          title="Não foi possível carregar as carteiras"
          onRetry={() => void walletsQuery.refetch()}
        />
      </div>
    )
  }
  return (
    <AccountLayout
      active="wallets"
      onLogout={() => {
        void logoutToHome()
      }}
    >
      <h1 className="sr-only">Carteiras</h1>

      {mode === 'form' ? (
        <>
          <WalletForm
            form={form}
            busy={busy}
            onSubmit={onSubmit}
            onAddPrimary={startCreatePrimary}
          />
          <div className="mt-4 max-w-[862px]">
            <button
              type="button"
              className="text-sm text-text-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={backToList}
            >
              Cancelar e voltar à listagem
            </button>
          </div>
        </>
      ) : (
        <>
          <PrimaryWalletCard
            wallet={primary}
            onEdit={startEditPrimary}
            onCreate={startCreatePrimary}
          />
          <SecondaryWallets
            wallets={secondary}
            sameAsPrimary={form.watch('sameAsPrimary')}
            onToggleSameAsPrimary={() =>
              form.setValue('sameAsPrimary', !form.getValues('sameAsPrimary'), {
                shouldDirty: true,
              })
            }
            onAdd={addSecondary}
            onEdit={startEditSecondary}
          />
        </>
      )}
    </AccountLayout>
  )
}
