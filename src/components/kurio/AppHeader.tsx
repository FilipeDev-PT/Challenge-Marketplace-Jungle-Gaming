import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useId, useState } from 'react'
import { CartIcon, LoginIcon, SearchIcon } from '@/components/kurio/icons'
import { toastUnavailable } from '@/components/kurio/UnavailableAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { User } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
import { authFromForPath } from '@/shared/lib/navigation'
type AppHeaderProps = {
  cartCount?: number
  user?: Pick<User, 'id' | 'name' | 'email' | 'avatarUrl'> | null
  activeNav?: 'inicio' | 'mercado'
  searchValue?: string
  onSearchChange?: (value: string) => void
  onLogout?: () => void
  className?: string
  showDivider?: boolean
}
export function AppHeader({
  cartCount = 0,
  user = null,
  activeNav = 'inicio',
  searchValue,
  onSearchChange,
  onLogout,
  className,
  showDivider = true,
}: AppHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const authFrom = authFromForPath(pathname)
  const loginSearch = authFrom !== '/' ? { redirect: authFrom, from: authFrom } : undefined
  const [searchOpen, setSearchOpen] = useState(Boolean(searchValue))
  const searchId = useId()
  const menuId = useId()
  const [accountOpen, setAccountOpen] = useState(false)
  useEffect(() => {
    if (searchValue) setSearchOpen(true)
  }, [searchValue])
  return (
    <header className={cn('w-full', className)}>
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4">
        <Link
          to="/"
          className="shrink-0 text-sm font-bold tracking-[0.1em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Kurio — início"
        >
          KURIO
        </Link>

        <nav aria-label="Principal" className="hidden items-start gap-10 md:flex">
          <Link
            to="/"
            className={cn(
              'relative text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              activeNav === 'inicio'
                ? 'pb-6 font-bold text-text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-primary'
                : 'font-normal text-foreground',
            )}
          >
            Início
          </Link>
          <a
            href="/#catalog"
            className={cn(
              'relative text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              activeNav === 'mercado'
                ? 'pb-6 font-bold text-text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-primary'
                : 'font-normal text-foreground',
            )}
          >
            Mercado
          </a>
          <button
            type="button"
            className="text-base font-normal text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => toastUnavailable()}
          >
            Criadores
          </button>
          <button
            type="button"
            className="text-base font-normal text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => toastUnavailable()}
          >
            Aprenda
          </button>
        </nav>

        <div className="flex items-center gap-5 sm:gap-7">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-5 items-center justify-center text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
              aria-expanded={searchOpen}
              aria-controls={searchId}
              onClick={() => setSearchOpen((open) => !open)}
            >
              <SearchIcon className="size-5" />
            </button>
            {searchOpen ? (
              <Input
                id={searchId}
                type="search"
                value={searchValue ?? ''}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder="Buscar NFTs..."
                className="h-8 w-36 border-border bg-transparent sm:w-48"
                aria-label="Buscar NFTs"
              />
            ) : null}
          </div>

          <Link
            to="/cart"
            className="relative inline-flex size-6 items-start justify-center text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={cartCount > 0 ? `Carrinho, ${cartCount} itens` : 'Carrinho'}
          >
            <CartIcon className="size-6" />
            {cartCount > 0 ? (
              <span
                className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-ink"
                aria-hidden
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            ) : null}
          </Link>

          {user ? (
            <div className="relative">
              <Button
                type="button"
                variant="default"
                className="h-[35px] min-w-[100px] gap-1 rounded-md px-3"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-controls={menuId}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <span className="max-w-24 truncate">{user.name.split(' ')[0]}</span>
              </Button>
              {accountOpen ? (
                <div
                  id={menuId}
                  role="menu"
                  className="absolute right-0 z-40 mt-2 min-w-44 rounded-md border border-border bg-surface-card p-1 shadow-lg"
                >
                  <Link
                    to="/account/profile"
                    role="menuitem"
                    className="block rounded-sm px-3 py-2 text-sm text-text-primary hover:bg-surface-raised"
                    onClick={() => setAccountOpen(false)}
                  >
                    Meu perfil
                  </Link>
                  <Link
                    to="/account/wallets"
                    role="menuitem"
                    className="block rounded-sm px-3 py-2 text-sm text-text-primary hover:bg-surface-raised"
                    onClick={() => setAccountOpen(false)}
                  >
                    Carteiras
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full rounded-sm px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised"
                    onClick={() => {
                      onLogout?.()
                      setAccountOpen(false)
                    }}
                  >
                    Sair
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button asChild className="h-[35px] w-[100px] gap-1 rounded-md px-2">
              <Link to="/login" search={loginSearch}>
                <LoginIcon className="size-5 text-ink" />
                Entrar
              </Link>
            </Button>
          )}
        </div>
      </div>
      {showDivider ? <div className="mx-auto mt-0 h-px w-full max-w-[1200px] bg-border" /> : null}
    </header>
  )
}
