import { Suspense, useEffect, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Link,
  redirect,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'

import { AuthProvider, useAuth } from '@/app/providers/AuthProvider'
import { SocketProvider } from '@/app/providers/SocketProvider'
import {
  CartPage,
  CheckoutPage,
  HomePage,
  LoginPage,
  NftDetailPage,
  OrderConfirmationPage,
  ProfilePage,
  RegisterPage,
  WalletsPage,
} from '@/app/lazy-pages'
import { queryClient } from '@/app/query-client'
import { Button } from '@/components/ui/button'
import { parseAuthSearch } from '@/features/auth/model/parseAuthSearch'
import { parseCatalogSearch } from '@/features/catalog/model/parseCatalogSearch'
import { AppShell } from '@/features/layout/AppShell'
import { authFromForPath } from '@/shared/lib/navigation'
import { getStoredToken } from '@/shared/lib/session-storage'

function PageSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-text-secondary">
          Carregando…
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export type RouterContext = {
  queryClient: typeof queryClient
  auth?: {
    isAuthenticated: boolean
  }
}

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <AppShell />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function requireAuthBeforeLoad({
  location,
}: {
  location: {
    pathname: string
    searchStr: string
  }
}) {
  if (!getStoredToken()) {
    const redirectPath = location.pathname + location.searchStr
    throw redirect({
      to: '/login',
      search: {
        redirect: redirectPath,
        from: authFromForPath(location.pathname),
      },
    })
  }
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const redirectTo = useRouterState({
    select: (s) => s.location.pathname + s.location.searchStr,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({
        to: '/login',
        search: {
          redirect: redirectTo,
          from: authFromForPath(redirectTo),
        },
        replace: true,
      })
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-text-secondary">
        Carregando sessão…
      </div>
    )
  }

  return children
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold text-text-primary">Página não encontrada</h1>
      <p className="text-text-secondary">A rota solicitada não existe neste marketplace.</p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search) => parseCatalogSearch(search as Record<string, unknown>),
  component: function IndexRoute() {
    const search = indexRoute.useSearch()
    const navigate = indexRoute.useNavigate()
    return (
      <PageSuspense>
        <HomePage
          search={search}
          onSearchChange={(next) => {
            void navigate({
              search: (prev) => ({ ...prev, ...next }),
              resetScroll: false,
            })
          }}
        />
      </PageSuspense>
    )
  },
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nfts/$nftId',
  component: function NftRoute() {
    return (
      <PageSuspense>
        <NftDetailPage />
      </PageSuspense>
    )
  },
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: function CartRoute() {
    return (
      <PageSuspense>
        <CartPage />
      </PageSuspense>
    )
  },
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  beforeLoad: requireAuthBeforeLoad,
  component: function CheckoutRoute() {
    return (
      <RequireAuth>
        <PageSuspense>
          <CheckoutPage />
        </PageSuspense>
      </RequireAuth>
    )
  },
})

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  beforeLoad: requireAuthBeforeLoad,
  component: function OrderRoute() {
    return (
      <RequireAuth>
        <PageSuspense>
          <OrderConfirmationPage />
        </PageSuspense>
      </RequireAuth>
    )
  },
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search) => parseAuthSearch(search as Record<string, unknown>),
  component: function LoginRoute() {
    return (
      <PageSuspense>
        <LoginPage />
      </PageSuspense>
    )
  },
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  validateSearch: (search) => parseAuthSearch(search as Record<string, unknown>),
  component: function RegisterRoute() {
    return (
      <PageSuspense>
        <RegisterPage />
      </PageSuspense>
    )
  },
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/profile',
  beforeLoad: requireAuthBeforeLoad,
  component: function ProfileRoute() {
    return (
      <RequireAuth>
        <PageSuspense>
          <ProfilePage />
        </PageSuspense>
      </RequireAuth>
    )
  },
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/wallets',
  beforeLoad: requireAuthBeforeLoad,
  component: function WalletsRoute() {
    return (
      <RequireAuth>
        <PageSuspense>
          <WalletsPage />
        </PageSuspense>
      </RequireAuth>
    )
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
])

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
