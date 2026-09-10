import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { toastUnavailable } from '@/components/kurio/UnavailableAction'
import { Skeleton } from '@/components/ui/skeleton'
import type { AccountNav } from '@/shared/api/cms-contracts'
import { cn } from '@/shared/lib/cn'
type AccountSidebarProps = {
  active: 'profile' | 'wallets'
  nav?: AccountNav | null
  isLoading?: boolean
  onLogout?: () => void
  className?: string
}
function NavIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 18 18',
    fill: 'none' as const,
    'aria-hidden': true as const,
  }
  const stroke = { stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const }
  const icons: Record<string, ReactNode> = {
    user: (
      <svg {...common}>
        <circle cx="9" cy="6" r="2.5" {...stroke} />
        <path d="M3.5 15c1.2-2.5 3-3.5 5.5-3.5S13.3 12.5 14.5 15" {...stroke} />
      </svg>
    ),
    pin: (
      <svg {...common}>
        <path
          d="M9 15.5S4 11.2 4 7.5a5 5 0 1 1 10 0c0 3.7-5 8-5 8Z"
          {...stroke}
          strokeLinejoin="round"
        />
        <circle cx="9" cy="7.5" r="1.5" {...stroke} />
      </svg>
    ),
    cart: (
      <svg {...common}>
        <path
          d="M2.5 4h1.4l1.1 7.5a1 1 0 0 0 1 .8h6.5a1 1 0 0 0 1-.8L14.5 6H5"
          {...stroke}
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="15" r="1" fill="currentColor" />
        <circle cx="12.5" cy="15" r="1" fill="currentColor" />
      </svg>
    ),
    heart: (
      <svg {...common}>
        <path
          d="M9 14.2S4.2 11.2 2.8 8.6C1.7 6.5 2.6 4.3 4.8 4c1.2-.2 2.3.4 3.1 1.3.8-.9 1.9-1.5 3.1-1.3 2.2.3 3.1 2.5 2 4.6C12.8 11.2 9 14.2 9 14.2Z"
          {...stroke}
          strokeLinejoin="round"
        />
      </svg>
    ),
    chart: (
      <svg {...common}>
        <path d="M3 14V8M7.5 14V5M12 14v-4M15.5 14V7" {...stroke} />
      </svg>
    ),
    download: (
      <svg {...common}>
        <path d="M9 3.5v8M9 11.5 6 8.5M9 11.5l3-3" {...stroke} strokeLinejoin="round" />
        <path d="M3.5 13.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" {...stroke} />
      </svg>
    ),
    warning: (
      <svg {...common}>
        <path d="M9 3.5 15.5 14.5H2.5L9 3.5Z" {...stroke} strokeLinejoin="round" />
        <path d="M9 7.5v3.5M9 13h.01" {...stroke} />
      </svg>
    ),
    logout: (
      <svg {...common}>
        <path d="M7 4H4.5A1.5 1.5 0 0 0 3 5.5v7A1.5 1.5 0 0 0 4.5 14H7" {...stroke} />
        <path d="M7 9h8m0 0-2.5-2.5M15 9l-2.5 2.5" {...stroke} strokeLinejoin="round" />
      </svg>
    ),
  }
  return (
    <span className="flex size-[18px] shrink-0 items-center justify-center" data-icon={name}>
      {icons[name] ?? icons.user}
    </span>
  )
}
export function AccountSidebar({
  active,
  nav,
  isLoading,
  onLogout,
  className,
}: AccountSidebarProps) {
  if (isLoading || !nav) {
    return (
      <aside className={cn('w-full max-w-[310px]', className)} aria-label="Conta">
        <Skeleton className="h-64 w-full" />
      </aside>
    )
  }
  return (
    <aside
      className={cn('w-full max-w-[310px] rounded-md bg-surface-card/40 py-2', className)}
      aria-label="Conta"
    >
      <h2 className="mb-1 px-2.5 py-2.5 text-base font-bold text-foreground">{nav.title}</h2>
      <nav className="flex flex-col">
        {nav.items.map((item) => {
          const isActive = item.id === active
          const classNameItem = cn(
            'relative flex h-[45px] items-center gap-3 px-4 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            isActive ? 'font-medium text-primary' : 'text-text-secondary hover:text-foreground',
          )
          const content = (
            <>
              {isActive ? (
                <span
                  className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 bg-primary"
                  aria-hidden
                />
              ) : null}
              <NavIcon name={item.icon} />
              {item.label}
            </>
          )
          if (item.href) {
            return (
              <Link
                key={item.id}
                to={item.href as '/account/profile' | '/account/wallets'}
                className={classNameItem}
                aria-current={isActive ? 'page' : undefined}
              >
                {content}
              </Link>
            )
          }
          return (
            <button
              key={item.id}
              type="button"
              className={classNameItem}
              onClick={() => toastUnavailable()}
            >
              {content}
            </button>
          )
        })}
      </nav>
      <div className="mt-2 border-t border-border">
        <button
          type="button"
          className="flex h-10 w-full items-center gap-3 px-4 text-sm text-text-secondary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => onLogout?.()}
        >
          <NavIcon name="logout" />
          {nav.logoutLabel}
        </button>
      </div>
    </aside>
  )
}
