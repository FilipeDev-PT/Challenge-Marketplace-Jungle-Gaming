import { MarketBreadcrumb } from '@/components/kurio'
import { CheckoutCollectorForm } from '@/features/checkout/components/CheckoutCollectorForm'
import { CheckoutAlerts } from '@/features/checkout/components/CheckoutAlerts'
import { CheckoutOrderSummary } from '@/features/checkout/components/CheckoutOrderSummary'
import { CheckoutWalletSection } from '@/features/checkout/components/CheckoutWalletSection'
import type {
  CollectorFormValues,
  WalletConnection,
} from '@/features/checkout/model/types'
import type { CartItem, Order, Quote, Wallet } from '@/shared/api/contracts'
import type { UseFormReturn } from 'react-hook-form'
type DesktopCheckoutProps = {
  items: CartItem[]
  refusedOrder: Order | null
  pendingOrderId: string | null
  orderPending: boolean
  onRetryRefused: () => void
  form: UseFormReturn<CollectorFormValues>
  onSubmit: (values: CollectorFormValues) => void
  quote: Quote | undefined
  quoteLoading: boolean
  quoteError: boolean
  needsRevalidate: boolean
  revalidatePending: boolean
  connection: WalletConnection
  effectiveWalletId: string
  wallets: Wallet[]
  walletsError: boolean
  onRetryWallets: () => void
  onRetryQuote: () => void
  onRevalidate: () => void
  selectedMode: 'bundle' | 'wallet'
  onSelectWallet: (id: string) => void
  onSelectProviderBundle: () => void
}
export function DesktopCheckout({
  items,
  refusedOrder,
  pendingOrderId,
  orderPending,
  onRetryRefused,
  form,
  onSubmit,
  quote,
  quoteLoading,
  quoteError,
  needsRevalidate,
  revalidatePending,
  connection,
  effectiveWalletId,
  wallets,
  walletsError,
  onRetryWallets,
  onRetryQuote,
  onRevalidate,
  selectedMode,
  onSelectWallet,
  onSelectProviderBundle,
}: DesktopCheckoutProps) {
  return (
    <div className="w-full pb-10 pt-8">
      <MarketBreadcrumb current="Pagamento" />

      <CheckoutAlerts
        refusedOrder={refusedOrder}
        pendingOrderId={pendingOrderId}
        orderPending={orderPending}
        onRetryRefused={onRetryRefused}
      />

      <div className="mt-7 flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-10">
        <CheckoutCollectorForm form={form} onSubmit={onSubmit} />

        <CheckoutOrderSummary
          items={items}
          quote={quote}
          quoteLoading={quoteLoading}
          quoteError={quoteError}
          needsRevalidate={needsRevalidate}
          revalidatePending={revalidatePending}
          orderPending={orderPending}
          connection={connection}
          effectiveWalletId={effectiveWalletId}
          hasWallets={Boolean(wallets.length)}
          onRetryQuote={onRetryQuote}
          onRevalidate={onRevalidate}
          walletSlot={
            <CheckoutWalletSection
              wallets={wallets}
              walletsError={walletsError}
              onRetryWallets={onRetryWallets}
              effectiveWalletId={effectiveWalletId}
              connection={connection}
              selectedMode={selectedMode}
              onSelectWallet={onSelectWallet}
              onSelectProviderBundle={onSelectProviderBundle}
            />
          }
        />
      </div>
    </div>
  )
}
