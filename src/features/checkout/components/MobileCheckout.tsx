import { Link } from '@tanstack/react-router'
import type { UseFormReturn } from 'react-hook-form'
import { EmptyState, ErrorState, MobileScreenHeader, toastUnavailable } from '@/components/kurio'
import { MoreVerticalIcon, WalletGlyphIcon } from '@/components/kurio/icons'
import { Button } from '@/components/ui/button'
import type {
  CollectorFormValues,
  ProviderId,
  WalletConnection,
} from '@/features/checkout/model/types'
import type { Quote, Wallet } from '@/shared/api/contracts'
import { formatEth } from '@/shared/lib/eth'
import { networkLabel, shortAddress } from '@/shared/lib/format-wallet'
import { cn } from '@/shared/lib/cn'

export type { ProviderId }
type MobileCheckoutProps = {
  wallets: Wallet[]
  walletsError: boolean
  onRetryWallets: () => void
  effectiveWalletId: string
  selectedProvider: ProviderId | null
  connection: WalletConnection
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  orderPending: boolean
  needsRevalidate: boolean
  revalidatePending: boolean
  form: UseFormReturn<CollectorFormValues>
  onSelectWallet: (walletId: string) => void
  onSelectProvider: (provider: ProviderId) => void
  onConfirm: (values: CollectorFormValues) => void
  onRevalidate: () => void
  onRetryQuote: () => void
}
const PROVIDERS: Array<{
  id: ProviderId
  label: string
  glyph: 'W' | 'M' | 'wallet'
}> = [
  { id: 'walletconnect', label: 'WalletConnect', glyph: 'W' },
  { id: 'metamask', label: 'MetaMask', glyph: 'M' },
  { id: 'coinbase', label: 'Coinbase Wallet', glyph: 'wallet' },
]
export function MobileCheckout({
  wallets,
  walletsError,
  onRetryWallets,
  effectiveWalletId,
  selectedProvider,
  connection,
  quote,
  quoteLoading,
  quoteError,
  orderPending,
  needsRevalidate,
  revalidatePending,
  form,
  onSelectWallet,
  onSelectProvider,
  onConfirm,
  onRevalidate,
  onRetryQuote,
}: MobileCheckoutProps) {
  const canSubmit =
    !orderPending &&
    !needsRevalidate &&
    !quoteLoading &&
    Boolean(quote) &&
    connection === 'connected' &&
    Boolean(effectiveWalletId) &&
    wallets.length > 0
  return (
    <div className="relative -mx-4 flex min-h-[100dvh] flex-col bg-ink-deep pb-36 font-mono text-text-primary">
      <div className="px-5 pt-3">
        <MobileScreenHeader title="Pagamento com carteira" />
      </div>

      <div className="mt-8 px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold leading-4 text-foreground">Carteira conectada</h2>
          <Link
            to="/account/wallets"
            className="text-sm font-medium text-primary hover:text-primary-light"
          >
            Trocar carteira
          </Link>
        </div>

        {walletsError ? (
          <ErrorState
            title="Falha ao carregar carteiras"
            onRetry={onRetryWallets}
            className="mt-4 border-0 p-0"
          />
        ) : !wallets.length ? (
          <EmptyState
            title="Nenhuma carteira cadastrada"
            description="Cadastre uma carteira no perfil antes de pagar."
            action={
              <Button asChild variant="outline">
                <Link to="/account/wallets">Gerenciar carteiras</Link>
              </Button>
            }
            className="mt-4 border-0 p-4"
          />
        ) : (
          <div
            className="mt-4 flex flex-col gap-3"
            role="radiogroup"
            aria-label="Carteira conectada"
          >
            {wallets.map((wallet) => {
              const selected = wallet.id === effectiveWalletId
              return (
                <div
                  key={wallet.id}
                  className="flex w-full items-center gap-3 rounded-2xl bg-surface-card px-4 py-4"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    onClick={() => onSelectWallet(wallet.id)}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border',
                        selected ? 'border-primary' : 'border-text-secondary/60',
                      )}
                      aria-hidden
                    >
                      {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-4 text-foreground">
                        {wallet.label}
                      </span>
                      <span className="mt-1 block text-xs leading-4 text-text-secondary">
                        {shortAddress(wallet.address)}
                      </span>
                      <span className="mt-0.5 block text-xs leading-4 text-text-secondary">
                        {networkLabel(wallet.network)}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex size-8 shrink-0 items-center justify-center text-text-secondary hover:text-primary"
                    aria-label={`Opções de ${wallet.label}`}
                    onClick={() => toastUnavailable()}
                  >
                    <MoreVerticalIcon className="size-5" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-8 px-5">
        <h2 className="text-sm font-bold leading-4 text-foreground">Carteira e rede</h2>
        <div className="mt-4 flex flex-col gap-3" role="radiogroup" aria-label="Carteira e rede">
          {PROVIDERS.map((provider) => {
            const selected = selectedProvider === provider.id
            return (
              <button
                key={provider.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className="flex h-[56px] w-full items-center gap-3 rounded-2xl bg-surface-card px-4 text-left"
                onClick={() => onSelectProvider(provider.id)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-sm font-bold text-foreground">
                  {provider.glyph === 'wallet' ? (
                    <WalletGlyphIcon className="size-5" />
                  ) : (
                    provider.glyph
                  )}
                </span>
                <span className="flex-1 text-sm font-medium text-foreground">{provider.label}</span>
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border',
                    selected ? 'border-primary' : 'border-text-secondary/60',
                  )}
                  aria-hidden
                >
                  {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                </span>
              </button>
            )
          })}
        </div>
        {connection === 'refused' ? (
          <p className="mt-2 text-center text-xs text-error">Conexão recusada pela carteira</p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-ink-deep px-5 pb-7 pt-3">
        {quoteError ? (
          <ErrorState
            title="Cotação indisponível"
            onRetry={onRetryQuote}
            className="mb-4 border-0 p-0"
          />
        ) : null}
        {quote?.warnings?.length ? (
          <ul
            className="mb-3 list-disc space-y-1 rounded-md border border-amber/40 bg-ink-soft p-3 pl-7 text-xs text-text-secondary"
            aria-live="polite"
          >
            {quote.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}
        {needsRevalidate ? (
          <Button
            type="button"
            variant="outline"
            className="mb-3 h-11 w-full rounded-full text-sm font-bold"
            disabled={revalidatePending}
            onClick={onRevalidate}
          >
            {revalidatePending ? 'Revalidando…' : 'Revalidar cotação'}
          </Button>
        ) : null}
        <div className="mb-4 flex items-baseline justify-end gap-2">
          <span className="text-sm text-foreground">Total:</span>
          <span className="text-lg font-bold text-text-accent">
            {quote ? formatEth(quote.totalEth, 3) : '—'}
          </span>
        </div>
        {quote?.items?.length ? (
          <ul className="mb-3 space-y-1 text-xs text-text-secondary" aria-label="Itens da cotação">
            {quote.items.map((line) => (
              <li key={line.cartItemId}>
                {line.nftId}: {formatEth(line.unitPriceEth, 2)}
              </li>
            ))}
          </ul>
        ) : null}
        <Button
          type="button"
          className="h-12 w-full rounded-full text-sm font-bold text-ink"
          disabled={!canSubmit}
          onClick={() => {
            void form.handleSubmit(onConfirm)()
          }}
        >
          {orderPending ? 'Processando…' : 'Confirmar compra'}
        </Button>
      </div>
    </div>
  )
}
