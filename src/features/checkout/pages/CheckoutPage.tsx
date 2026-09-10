import { Link } from '@tanstack/react-router'
import { CartSummarySkeleton, EmptyState, ErrorState } from '@/components/kurio'
import { Button } from '@/components/ui/button'
import { CheckoutAlerts } from '@/features/checkout/components/CheckoutAlerts'
import { DesktopCheckout } from '@/features/checkout/components/DesktopCheckout'
import { MobileCheckout } from '@/features/checkout/components/MobileCheckout'
import { useCheckoutController } from '@/features/checkout/hooks/useCheckoutController'
import { useIsDesktop } from '@/shared/lib/breakpoints'
export function CheckoutPage() {
  const isDesktop = useIsDesktop()
  const {
    authLoading,
    isAuthenticated,
    cartQuery,
    walletsQuery,
    wallets,
    collectorForm,
    quote,
    quoteQuery,
    needsRevalidate,
    effectiveWalletId,
    connection,
    walletMode,
    selectedProvider,
    refusedOrder,
    pendingOrderId,
    revalidate,
    orderMutation,
    resetRefused,
    selectWallet,
    selectBundle,
    selectProvider,
  } = useCheckoutController()
  if (authLoading || !isAuthenticated) {
    return (
      <div className="py-10">
        <CartSummarySkeleton />
      </div>
    )
  }
  if (cartQuery.isLoading || walletsQuery.isLoading) {
    return (
      <div className="py-10">
        <CartSummarySkeleton />
      </div>
    )
  }
  if (cartQuery.isError) {
    return (
      <div className="py-10">
        <ErrorState title="Carrinho indisponível" onRetry={() => void cartQuery.refetch()} />
      </div>
    )
  }
  if (!cartQuery.data?.items.length) {
    return (
      <div className="py-10">
        <EmptyState
          title="Nada para pagar"
          description="Adicione itens ao carrinho antes do checkout."
          action={
            <Button asChild>
              <Link to="/cart">Voltar ao carrinho</Link>
            </Button>
          }
        />
      </div>
    )
  }
  const items = cartQuery.data.items
  if (!isDesktop) {
    return (
      <>
        <CheckoutAlerts
          refusedOrder={refusedOrder}
          pendingOrderId={pendingOrderId}
          orderPending={orderMutation.isPending}
          onRetryRefused={resetRefused}
        />
        <MobileCheckout
          wallets={wallets}
          walletsError={walletsQuery.isError}
          onRetryWallets={() => void walletsQuery.refetch()}
          effectiveWalletId={effectiveWalletId}
          selectedProvider={selectedProvider}
          connection={connection}
          quote={quote}
          quoteLoading={quoteQuery.isLoading}
          quoteError={quoteQuery.isError}
          orderPending={orderMutation.isPending}
          needsRevalidate={needsRevalidate}
          revalidatePending={revalidate.isPending}
          form={collectorForm}
          onSelectWallet={selectWallet}
          onSelectProvider={selectProvider}
          onConfirm={(values) => orderMutation.mutate(values)}
          onRevalidate={() => revalidate.mutate()}
          onRetryQuote={() => void quoteQuery.refetch()}
        />
      </>
    )
  }
  return (
    <DesktopCheckout
      items={items}
      refusedOrder={refusedOrder}
      pendingOrderId={pendingOrderId}
      orderPending={orderMutation.isPending}
      onRetryRefused={resetRefused}
      form={collectorForm}
      onSubmit={(values) => orderMutation.mutate(values)}
      quote={quote}
      quoteLoading={quoteQuery.isLoading}
      quoteError={quoteQuery.isError}
      needsRevalidate={needsRevalidate}
      revalidatePending={revalidate.isPending}
      connection={connection}
      effectiveWalletId={effectiveWalletId}
      wallets={wallets}
      walletsError={walletsQuery.isError}
      onRetryWallets={() => void walletsQuery.refetch()}
      onRetryQuote={() => void quoteQuery.refetch()}
      onRevalidate={() => revalidate.mutate()}
      selectedMode={walletMode}
      onSelectWallet={selectWallet}
      onSelectProviderBundle={selectBundle}
    />
  )
}
