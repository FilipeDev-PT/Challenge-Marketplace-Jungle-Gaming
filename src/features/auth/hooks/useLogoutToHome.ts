import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/app/providers/AuthProvider'
export function useLogoutToHome() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return async () => {
    await logout()
    await navigate({ to: '/' })
  }
}
