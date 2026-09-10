import { AuthModalShell, AuthSocialBlock } from '@/components/kurio/AuthModal'
import {
  MobileAuthFooter,
  MobileAuthShell,
  MobileAuthSocial,
} from '@/components/kurio/MobileAuthShell'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useAuthRedirectSearch } from '@/features/auth/hooks/useAuthRedirectSearch'
import { useRedirectIfAuthenticated } from '@/features/auth/hooks/useRedirectIfAuthenticated'
import { useIsDesktop } from '@/shared/lib/breakpoints'
export function RegisterPage() {
  const isDesktop = useIsDesktop()
  const { redirectTo, closeTo } = useAuthRedirectSearch()
  useRedirectIfAuthenticated(redirectTo)
  if (isDesktop) {
    return (
      <AuthModalShell mode="register" redirectTo={redirectTo} closeTo={closeTo}>
        <RegisterForm variant="desktop" redirectTo={redirectTo} />
        <AuthSocialBlock />
      </AuthModalShell>
    )
  }
  return (
    <MobileAuthShell mode="register" redirectTo={redirectTo} closeTo={closeTo}>
      <RegisterForm variant="mobile" redirectTo={redirectTo} />
      <MobileAuthSocial />
      <MobileAuthFooter mode="register" redirectTo={redirectTo} closeTo={closeTo} />
    </MobileAuthShell>
  )
}
