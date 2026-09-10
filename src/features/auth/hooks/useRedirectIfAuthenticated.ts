import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
import { navigateByHref } from '@/shared/lib/navigation'
export function useRedirectIfAuthenticated(redirectTo: string) {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void navigateByHref(navigate, redirectTo, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])
}
