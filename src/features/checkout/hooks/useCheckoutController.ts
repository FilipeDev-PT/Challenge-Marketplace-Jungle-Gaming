import { useCallback, useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useCart } from '@/features/cart/hooks/useCart'
import { useQuote } from '@/features/cart/hooks/useQuote'
import {
  useCheckoutSession,
  useWalletConnection,
} from '@/features/checkout/hooks/useCheckoutSession'
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder'
import { collectorSchema } from '@/features/checkout/model/collectorSchema'
import type { CollectorFormValues, ProviderId } from '@/features/checkout/model/types'
import { useWallets } from '@/features/wallets/hooks/useWallets'
import type { Wallet } from '@/shared/api/contracts'

export type { ProviderId } from '@/features/checkout/model/types'

export function useCheckoutController() {
  const { user, isAuthenticated, authLoading } = useCheckoutSession()
  const cartQuery = useCart({ enabled: isAuthenticated })
  const walletsQuery = useWallets({ enabled: Boolean(user?.id) })
  const { walletId, setWalletId, network, setNetwork, connection, setConnection } =
    useWalletConnection()
  const [walletMode, setWalletMode] = useState<'bundle' | 'wallet'>('wallet')
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | null>(null)

  const collectorForm = useForm<CollectorFormValues>({
    resolver: zodResolver(collectorSchema) as Resolver<CollectorFormValues>,
    defaultValues: {
      displayName: user?.name ?? '',
      username: user?.username ?? '',
      network: '',
      profileName: user?.name ?? '',
      walletAddress: '',
      secondaryWallet: '',
      walletType: '',
      referralCode: 'KURIO',
      email: user?.email ?? '',
      ensName: user?.ens?.replace(/\.(eth|xyz)$/, '') || 'collector',
      ensTld: '.eth',
      useOtherWallet: false,
      notes: '',
    },
  })

  useEffect(() => {
    if (!user) return
    collectorForm.reset({
      displayName: user.name,
      username: user.username ?? 'kuriocollector',
      network: collectorForm.getValues('network') || '',
      profileName: user.name,
      walletAddress: collectorForm.getValues('walletAddress') || '',
      secondaryWallet: collectorForm.getValues('secondaryWallet') || '',
      walletType: collectorForm.getValues('walletType') || '',
      referralCode: collectorForm.getValues('referralCode') || 'KURIO',
      email: user.email,
      ensName: user.ens?.replace(/\.(eth|xyz)$/, '') || 'collector',
      ensTld: user.ens?.endsWith('.xyz') ? '.xyz' : '.eth',
      useOtherWallet: false,
      notes: '',
    })
  }, [user, collectorForm])

  const couponCode = cartQuery.data?.couponCode ?? null
  const quoteQuery = useQuote(couponCode, {
    enabled: Boolean(isAuthenticated && cartQuery.data?.items.length),
  })

  const quote = quoteQuery.data
  const needsRevalidate = Boolean(
    quote &&
      (quote.stale ||
        quote.warnings.some((warning) => /preço|disponibilidade|atualiz/i.test(warning))),
  )

  const wallets = walletsQuery.data ?? []
  const selectedWallet =
    wallets.find((wallet) => wallet.id === walletId) ??
    wallets.find((wallet) => wallet.isPrimary) ??
    wallets[0]
  const effectiveWalletId = selectedWallet?.id ?? ''

  const applyWallet = useCallback(
    (
      wallet: Wallet,
      options?: { mode?: 'bundle' | 'wallet'; provider?: ProviderId | null },
    ) => {
      setWalletMode(options?.mode ?? 'wallet')
      setWalletId(wallet.id)
      setNetwork(wallet.network)
      setConnection('connected')
      collectorForm.setValue('walletAddress', wallet.address)
      collectorForm.setValue('walletType', options?.provider ?? wallet.provider)
      collectorForm.setValue('network', wallet.network)

      const provider = options?.provider ?? wallet.provider
      if (provider === 'metamask' || provider === 'coinbase' || provider === 'walletconnect') {
        setSelectedProvider(provider)
      }
    },
    [collectorForm, setConnection, setNetwork, setWalletId],
  )

  useEffect(() => {
    if (selectedWallet && !walletId) {
      applyWallet(selectedWallet)
    }
  }, [applyWallet, selectedWallet, walletId])

  const { refusedOrder, pendingOrderId, revalidate, orderMutation, resetRefused } = usePlaceOrder({
    quote,
    effectiveWalletId,
    network,
    connection,
  })

  const selectWallet = (id: string) => {
    const wallet = wallets.find((item) => item.id === id)
    if (!wallet) return
    applyWallet(wallet)
  }

  const selectBundle = () => {
    const primary = wallets.find((wallet) => wallet.isPrimary) ?? wallets[0]
    if (!primary) return
    applyWallet(primary, { mode: 'bundle' })
  }

  const selectProvider = (provider: ProviderId) => {
    setSelectedProvider(provider)
    const match = wallets.find((wallet) => wallet.provider === provider)
    if (match) {
      applyWallet(match)
      return
    }
    const fallback = wallets.find((wallet) => wallet.isPrimary) ?? wallets[0]
    if (!fallback) return
    applyWallet(fallback, { provider })
  }

  return {
    authLoading,
    isAuthenticated,
    cartQuery,
    walletsQuery,
    wallets,
    collectorForm,
    quote,
    quoteQuery,
    needsRevalidate,
    effectiveWalletId,
    connection,
    walletMode,
    selectedProvider,
    refusedOrder,
    pendingOrderId,
    revalidate,
    orderMutation,
    resetRefused,
    selectWallet,
    selectBundle,
    selectProvider,
  }
}
