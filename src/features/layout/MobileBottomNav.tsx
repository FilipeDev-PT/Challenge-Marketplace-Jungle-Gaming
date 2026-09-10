import { Link, useRouterState } from '@tanstack/react-router'
import { CartIcon, HeartIcon, HomeIcon, ScanIcon, UserIcon } from '@/components/kurio/icons'
import { toastUnavailable } from '@/components/kurio/UnavailableAction'
import { cn } from '@/shared/lib/cn'
import { authFromForPath } from '@/shared/lib/navigation'
type MobileBottomNavProps = {
  cartCount?: number
  isAuthenticated?: boolean
  className?: string
}
export function MobileBottomNav({
  cartCount = 0,
  isAuthenticated,
  className,
}: MobileBottomNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const authFrom = authFromForPath(pathname)
  const loginSearch = authFrom !== '/' ? { redirect: authFrom, from: authFrom } : undefined
  const active =
    pathname === '/'
      ? 'home'
      : pathname.startsWith('/cart')
        ? 'cart'
        : pathname.startsWith('/account')
          ? 'profile'
          : 'home'
  return (
    <nav
      className={cn('pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden', className)}
      aria-label="Navegação principal"
    >
      <div className="relative mx-auto h-[126px] w-full max-w-[414px]">
        <svg
          className="absolute inset-x-0 bottom-0 h-[95px] w-full drop-shadow-[0_-4px_24px_rgba(0,0,0,0.45)]"
          viewBox="0 0 414 95"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="#1a1210"
            d="M0 32 H148 C162 32 170 8 207 8 C244 8 252 32 266 32 H414 V95 H0 Z"
          />
        </svg>

        <button
          type="button"
          className="pointer-events-auto absolute left-1/2 top-0 flex size-[65px] -translate-x-1/2 items-center justify-center rounded-full bg-primary text-ink shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Escanear"
          onClick={() => toastUnavailable()}
        >
          <ScanIcon className="size-6" />
        </button>

        <div className="pointer-events-auto absolute inset-x-0 bottom-7 flex items-center justify-between px-9">
          <Link
            to="/"
            className={cn(
              'flex size-10 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              active === 'home' ? 'text-primary' : 'text-text-secondary',
            )}
            aria-label="Início"
            aria-current={active === 'home' ? 'page' : undefined}
          >
            <HomeIcon className="size-5" />
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Favoritos"
            onClick={() => toastUnavailable()}
          >
            <HeartIcon className="size-5" />
          </button>
          <div className="w-16" aria-hidden />
          <Link
            to="/cart"
            className={cn(
              'relative flex size-10 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              active === 'cart' ? 'text-primary' : 'text-text-secondary',
            )}
            aria-label={cartCount ? `Carrinho, ${cartCount} itens` : 'Carrinho'}
            aria-current={active === 'cart' ? 'page' : undefined}
          >
            <CartIcon className="size-5" />
            {cartCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-ink">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            ) : null}
          </Link>
          <Link
            to={isAuthenticated ? '/account/profile' : '/login'}
            search={isAuthenticated ? undefined : loginSearch}
            className={cn(
              'flex size-10 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              active === 'profile' ? 'text-primary' : 'text-text-secondary',
            )}
            aria-label={isAuthenticated ? 'Perfil' : 'Entrar'}
            aria-current={active === 'profile' ? 'page' : undefined}
          >
            <UserIcon className="size-5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}
