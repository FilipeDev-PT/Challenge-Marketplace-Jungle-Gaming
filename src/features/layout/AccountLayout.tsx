import type { ReactNode } from 'react'
import { AccountSidebar } from '@/components/kurio/AccountSidebar'
import { useAccountNav } from '@/features/layout/hooks/useCmsContent'
type AccountLayoutProps = {
  active: 'profile' | 'wallets'
  onLogout: () => void
  children: ReactNode
}
export function AccountLayout({ active, onLogout, children }: AccountLayoutProps) {
  const navQuery = useAccountNav()
  return (
    <div className="flex flex-col gap-10 py-8 lg:flex-row lg:gap-7">
      <AccountSidebar
        active={active}
        className="hidden shrink-0 lg:block"
        nav={navQuery.data}
        isLoading={navQuery.isLoading}
        onLogout={onLogout}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
