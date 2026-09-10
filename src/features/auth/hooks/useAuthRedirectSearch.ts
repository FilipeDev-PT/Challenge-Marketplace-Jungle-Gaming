import { useSearch } from '@tanstack/react-router'
import { resolveAuthCloseHref, resolveSafeRedirect } from '@/shared/lib/navigation'
export function useAuthRedirectSearch() {
  const search = useSearch({ strict: false }) as {
    redirect?: string
    from?: string
  }
  const redirectTo = resolveSafeRedirect(search.redirect)
  const closeTo = resolveAuthCloseHref(search.from, search.redirect)
  return { redirectTo, closeTo }
}
