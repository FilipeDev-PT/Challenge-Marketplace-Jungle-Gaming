import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { useAuth } from '@/app/providers/AuthProvider'
import { AppFooter } from '@/components/kurio/AppFooter'
import { AppHeader } from '@/components/kurio/AppHeader'
import { useCartBadge } from '@/features/cart/hooks/useCart'
import { AuthRouteBackdrop } from '@/features/layout/AuthRouteBackdrop'
import { MobileBottomNav } from '@/features/layout/MobileBottomNav'
import { useFooterContent } from '@/features/layout/hooks/useCmsContent'
import { cn } from '@/shared/lib/cn'
import { resolveAuthCloseHref } from '@/shared/lib/navigation'

const toaster = (
  <Toaster
    theme="dark"
    position="bottom-center"
    closeButton
    duration={3500}
    toastOptions={{
      classNames: {
        toast: 'bg-surface-card border-border text-text-primary',
      },
    }}
  />
)

export function AppShell() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const searchStr = useRouterState({ select: (s) => s.location.searchStr })
  const authFrom = useRouterState({
    select: (s) => {
      const search = s.location.search as {
        from?: string
        redirect?: string
      }
      return typeof search === 'object' && search ? search.from : undefined
    },
  })
  const authRedirect = useRouterState({
    select: (s) => {
      const search = s.location.search as {
        from?: string
        redirect?: string
      }
      return typeof search === 'object' && search ? search.redirect : undefined
    },
  })
  const { cartCount } = useCartBadge()
  const footerQuery = useFooterContent()
  const isAuthRoute = pathname === '/login' || pathname === '/register'
  const authBackdropPath = isAuthRoute ? resolveAuthCloseHref(authFrom, authRedirect) : '/'
  const hideChrome = pathname.startsWith('/orders/')
  const isNftDetail = pathname.startsWith('/nfts/')
  const isCartOrCheckout = pathname === '/cart' || pathname === '/checkout'
  const hideFooter = pathname.startsWith('/account/') || isAuthRoute
  const isMobileHome = pathname === '/'
  const showMobileNav = !isAuthRoute && !hideChrome && !isNftDetail && !isCartOrCheckout
  const hideMobileHeader = isMobileHome || isAuthRoute || isNftDetail || isCartOrCheckout
  const activeNavForAuth =
    authBackdropPath.startsWith('/nfts') || authBackdropPath === '/cart' ? 'mercado' : 'inicio'

  const urlQ = (() => {
    if (pathname !== '/') return ''
    try {
      const raw = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr
      return new URLSearchParams(raw).get('q') ?? ''
    } catch {
      return ''
    }
  })()

  const [searchDraft, setSearchDraft] = useState(urlQ)

  useEffect(() => {
    setSearchDraft(urlQ)
  }, [urlQ])

  useEffect(() => {
    if (pathname !== '/') return
    if (searchDraft === urlQ) return
    const id = window.setTimeout(() => {
      void navigate({
        to: '/',
        search: (prev) => ({
          ...(typeof prev === 'object' && prev ? prev : {}),
          q: searchDraft || undefined,
          page: 1,
        }),
        resetScroll: false,
      })
    }, 300)
    return () => window.clearTimeout(id)
  }, [searchDraft, navigate, pathname, urlQ])

  const activeNav =
    pathname === '/' || (isAuthRoute && activeNavForAuth === 'inicio')
      ? 'inicio'
      : pathname.startsWith('/nfts') ||
          pathname === '/cart' ||
          pathname === '/checkout' ||
          (isAuthRoute && activeNavForAuth === 'mercado')
        ? 'mercado'
        : 'inicio'

  if (hideChrome) {
    return (
      <>
        <Outlet />
        {toaster}
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-deep text-text-primary">
      <div
        className={cn(
          'mx-auto w-full max-w-[1440px] px-4 pt-6 md:px-[120px] md:pt-6',
          hideMobileHeader && 'hidden md:block',
        )}
      >
        <AppHeader
          cartCount={cartCount}
          user={isAuthenticated ? user : null}
          activeNav={activeNav}
          searchValue={pathname === '/' || isAuthRoute ? searchDraft : undefined}
          onSearchChange={pathname === '/' ? setSearchDraft : undefined}
          onLogout={() => {
            void (async () => {
              await logout()
              await navigate({ to: '/' })
            })()
          }}
        />
      </div>
      <main
        className={cn(
          'relative mx-auto w-full max-w-[1440px] flex-1 px-4 md:px-[120px]',
          isMobileHome && 'px-6 pt-6',
          pathname === '/' && 'min-h-[1100px] md:min-h-[1600px]',
          isNftDetail && 'min-h-[900px] md:min-h-[1100px]',
          isAuthRoute && 'px-0 md:px-[120px]',
          (isNftDetail || isCartOrCheckout) && 'px-4 md:px-[120px]',
          showMobileNav && 'pb-28 md:pb-0',
        )}
      >
        {isAuthRoute ? (
          <div className="hidden md:block">
            <AuthRouteBackdrop from={authFrom} redirect={authRedirect} />
          </div>
        ) : null}
        <Outlet />
      </main>
      {hideFooter ? null : (
        <div
          className={cn(
            'mx-auto mt-16 w-full max-w-[1440px] px-4 pb-6 md:px-[120px]',
            'min-h-[720px]',
            (isMobileHome || isNftDetail || isCartOrCheckout) && 'hidden md:block',
          )}
        >
          <AppFooter content={footerQuery.data} isLoading={footerQuery.isLoading} />
        </div>
      )}
      {showMobileNav ? (
        <MobileBottomNav cartCount={cartCount} isAuthenticated={isAuthenticated} />
      ) : null}
      {toaster}
    </div>
  )
}
