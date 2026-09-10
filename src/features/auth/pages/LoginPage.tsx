import { AuthModalShell, AuthSocialBlock } from '@/components/kurio/AuthModal'
import {
  MobileAuthFooter,
  MobileAuthShell,
  MobileAuthSocial,
} from '@/components/kurio/MobileAuthShell'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuthRedirectSearch } from '@/features/auth/hooks/useAuthRedirectSearch'
import { useRedirectIfAuthenticated } from '@/features/auth/hooks/useRedirectIfAuthenticated'
import { useIsDesktop } from '@/shared/lib/breakpoints'
export function LoginPage() {
  const isDesktop = useIsDesktop()
  const { redirectTo, closeTo } = useAuthRedirectSearch()
  useRedirectIfAuthenticated(redirectTo)
  if (isDesktop) {
    return (
      <AuthModalShell mode="login" redirectTo={redirectTo} closeTo={closeTo}>
        <LoginForm variant="desktop" redirectTo={redirectTo} />
        <AuthSocialBlock />
      </AuthModalShell>
    )
  }
  return (
    <MobileAuthShell mode="login" redirectTo={redirectTo} closeTo={closeTo}>
      <LoginForm variant="mobile" redirectTo={redirectTo} />
      <MobileAuthSocial />
      <MobileAuthFooter mode="login" redirectTo={redirectTo} closeTo={closeTo} />
    </MobileAuthShell>
  )
}
