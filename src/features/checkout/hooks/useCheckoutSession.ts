import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
export function useCheckoutSession() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({ to: '/login', search: { redirect: '/checkout', from: '/cart' } })
    }
  }, [authLoading, isAuthenticated, navigate])
  return { user, isAuthenticated, authLoading }
}
export function useWalletConnection() {
  const [walletId, setWalletId] = useState('')
  const [network, setNetwork] = useState<'ethereum' | 'polygon' | 'solana'>('ethereum')
  const [connection, setConnection] = useState<'disconnected' | 'connected' | 'refused'>(
    'disconnected',
  )
  return {
    walletId,
    setWalletId,
    network,
    setNetwork,
    connection,
    setConnection,
  }
}
