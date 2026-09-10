import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { EmptyState, ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import type { NetworkOption, WalletConnection } from '@/features/checkout/model/types'
import type { Wallet } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'

export type { NetworkOption, WalletConnection }

type CheckoutWalletSectionProps = {
  wallets: Wallet[]
  walletsError: boolean
  onRetryWallets: () => void
  effectiveWalletId: string
  connection: WalletConnection
  onSelectWallet: (walletId: string) => void
  onSelectProviderBundle: () => void
  selectedMode: 'bundle' | 'wallet'
}
function ProviderPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-surface-raised px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-foreground">
      {children}
    </span>
  )
}
export function CheckoutWalletSection({
  wallets,
  walletsError,
  onRetryWallets,
  effectiveWalletId,
  connection,
  onSelectWallet,
  onSelectProviderBundle,
  selectedMode,
}: CheckoutWalletSectionProps) {
  const metamask = wallets.find((wallet) => wallet.provider === 'metamask')
  const coinbase = wallets.find((wallet) => wallet.provider === 'coinbase')
  const fallbackWallets = wallets.filter(
    (wallet) => wallet.provider !== 'metamask' && wallet.provider !== 'coinbase',
  )
  if (walletsError) {
    return (
      <section className="mt-6">
        <h3 className="mb-3 text-center text-sm font-bold text-foreground">Carteira e rede</h3>
        <ErrorState
          title="Falha ao carregar carteiras"
          onRetry={onRetryWallets}
          className="border-0 p-0"
        />
      </section>
    )
  }
  if (!wallets.length) {
    return (
      <section className="mt-6">
        <h3 className="mb-3 text-center text-sm font-bold text-foreground">Carteira e rede</h3>
        <EmptyState
          title="Nenhuma carteira cadastrada"
          description="Cadastre uma carteira no perfil antes de pagar."
          action={
            <Button asChild variant="outline">
              <Link to="/account/wallets">Gerenciar carteiras</Link>
            </Button>
          }
          className="border-0 p-4"
        />
      </section>
    )
  }
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-center text-sm font-bold text-foreground">Carteira e rede</h3>

      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Carteira e rede">
        <button
          type="button"
          role="radio"
          aria-checked={selectedMode === 'bundle'}
          className={cn(
            'flex h-11 w-full items-center gap-3 rounded-md border px-3 text-left transition-colors',
            selectedMode === 'bundle'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-transparent hover:border-primary/40',
          )}
          onClick={onSelectProviderBundle}
        >
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full border',
              selectedMode === 'bundle' ? 'border-primary' : 'border-text-secondary',
            )}
            aria-hidden
          >
            {selectedMode === 'bundle' ? <span className="size-2 rounded-full bg-primary" /> : null}
          </span>
          <span className="flex flex-wrap items-center gap-1.5">
            <ProviderPill>METAMASK</ProviderPill>
            <ProviderPill>WALLETCONNECT</ProviderPill>
            <ProviderPill>COINBASE</ProviderPill>
          </span>
        </button>

        {metamask ? (
          <WalletRadio
            selected={selectedMode === 'wallet' && effectiveWalletId === metamask.id}
            label="MetaMask"
            onSelect={() => onSelectWallet(metamask.id)}
          />
        ) : null}

        {coinbase ? (
          <WalletRadio
            selected={selectedMode === 'wallet' && effectiveWalletId === coinbase.id}
            label="Coinbase Wallet"
            onSelect={() => onSelectWallet(coinbase.id)}
          />
        ) : null}

        {fallbackWallets.map((wallet) => (
          <WalletRadio
            key={wallet.id}
            selected={selectedMode === 'wallet' && effectiveWalletId === wallet.id}
            label={wallet.label}
            onSelect={() => onSelectWallet(wallet.id)}
          />
        ))}
      </div>

      {connection === 'refused' ? (
        <p className="mt-2 text-center text-xs text-error">Conexão recusada pela carteira</p>
      ) : null}
    </section>
  )
}
function WalletRadio({
  selected,
  label,
  onSelect,
}: {
  selected: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        'flex h-11 w-full items-center gap-3 rounded-md border px-3 text-left text-sm transition-colors',
        selected
          ? 'border-primary bg-primary/5 text-foreground'
          : 'border-border bg-transparent text-foreground hover:border-primary/40',
      )}
      onClick={onSelect}
    >
      <span
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-primary' : 'border-text-secondary',
        )}
        aria-hidden
      >
        {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
      </span>
      {label}
    </button>
  )
}
