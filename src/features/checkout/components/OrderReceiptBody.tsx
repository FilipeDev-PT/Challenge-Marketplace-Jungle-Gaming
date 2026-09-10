import { Link } from '@tanstack/react-router'
import { ThankYouIcon } from '@/components/kurio/icons'
import { Button } from '@/components/ui/button'
import type { Order } from '@/shared/api/contracts'
import { formatEth } from '@/shared/lib/eth'
import { formatOrderDate, orderExplorerHref, shortTx } from '@/shared/lib/format-order'
import { formatWalletLabel, networkDisplay } from '@/shared/lib/format-wallet'
type OrderReceiptBodyProps = {
  order: Order
  variant: 'desktop' | 'mobile'
}
export function OrderReceiptBody({ order, variant }: OrderReceiptBodyProps) {
  const txLabel = order.transactionId ? shortTx(order.transactionId) : '—'
  const etherscanHref = orderExplorerHref(order)
  if (variant === 'mobile') {
    const meta = [
      { label: 'ID da transação', value: txLabel },
      { label: 'Data', value: formatOrderDate(order.createdAt) },
      { label: 'Total', value: formatEth(order.totalEth, 3) },
      { label: 'Carteira', value: formatWalletLabel(order.walletLabel) },
    ]
    return (
      <>
        <header className="flex flex-col items-center px-6 pb-5 pt-8">
          <ThankYouIcon className="size-[72px]" />
          <h2
            id="receipt-title-mobile"
            className="mt-4 max-w-[260px] text-center text-sm font-bold leading-5 text-text-secondary"
          >
            Seus NFTs agora estão na sua carteira
          </h2>
        </header>

        <div className="border-y border-primary px-5 py-4">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="text-xs leading-4 text-text-secondary">{item.label}</dt>
                <dd className="mt-1 truncate text-sm leading-5 text-text-secondary/80">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
          <h3 className="text-sm font-bold leading-4 text-text-secondary">Detalhes da transação</h3>

          <ul className="mt-4 flex flex-col gap-3">
            {order.items.map((item) => (
              <li
                key={`${item.nftId}-${item.editionId}`}
                className="flex items-center gap-3 rounded-2xl bg-surface-card/80 px-3 py-3"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover"
                  width={56}
                  height={56}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-4 text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs leading-4 text-text-secondary">
                    ID do token: #{item.tokenId}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">(x {item.quantity})</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">
                  {formatEth(item.lineTotalEth, 2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Taxa de rede</span>
              <span className="text-foreground">{formatEth(order.networkFeeEth, 3)}</span>
            </div>
            <div className="flex justify-between gap-4 font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatEth(order.totalEth, 3)}</span>
            </div>
          </div>

          <div className="mt-5 h-px bg-border" />

          <p className="mt-5 text-center text-sm leading-[22px] text-text-secondary">
            Transação confirmada na {networkDisplay(order.network)}. A propriedade foi transferida
            para sua carteira conectada e registrada na rede.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {etherscanHref ? (
              <Button asChild className="h-12 w-full rounded-full text-sm font-bold text-ink">
                <a href={etherscanHref} target="_blank" rel="noreferrer">
                  Ver no Etherscan
                </a>
              </Button>
            ) : null}
            <Button
              asChild
              variant={etherscanHref ? 'outline' : 'default'}
              className={
                etherscanHref
                  ? 'h-12 w-full rounded-full border-primary/60 text-sm font-bold text-primary'
                  : 'h-12 w-full rounded-full text-sm font-bold text-ink'
              }
            >
              <Link to="/">Voltar ao mercado</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <header className="flex flex-col items-center px-8 pb-5 pt-6">
        <ThankYouIcon className="size-20" />
        <h1
          id="receipt-title"
          className="mt-4 text-center text-sm font-bold leading-4 text-text-secondary"
        >
          Seus NFTs agora estão na sua carteira
        </h1>
      </header>

      <div className="border-y-1 border-primary px-9 py-4">
        <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 sm:divide-x sm:divide-border">
          <div className="sm:pr-3">
            <p className="text-xs leading-4 text-text-secondary">ID da transação</p>
            <p className="mt-1 truncate text-sm leading-5 text-text-secondary/80">{txLabel}</p>
          </div>
          <div className="sm:px-3">
            <p className="text-xs leading-4 text-text-secondary">Data</p>
            <p className="mt-1 text-sm leading-5 text-text-secondary/80">
              {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="sm:px-3">
            <p className="text-xs leading-4 text-text-secondary">Total</p>
            <p className="mt-1 text-sm leading-5 text-text-secondary/80">
              {formatEth(order.totalEth, 3)}
            </p>
          </div>
          <div className="sm:pl-3">
            <p className="text-xs leading-4 text-text-secondary">Carteira</p>
            <p className="mt-1 text-sm leading-5 text-text-secondary/80">
              {formatWalletLabel(order.walletLabel)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-11 pb-0 pt-5">
        <h2 className="text-sm font-bold leading-4 text-text-secondary">Detalhes da transação</h2>

        <div className="mt-4 flex items-center justify-between text-sm text-text-secondary">
          <span className="w-[297px] max-w-[55%]">NFTs</span>
          <div className="flex w-[193px] max-w-[45%] justify-between gap-4">
            <span>Edições</span>
            <span>Subtotal</span>
          </div>
        </div>
        <div className="mt-3 h-px bg-border" />

        <ul className="mt-3 flex flex-col gap-3">
          {order.items.map((item) => (
            <li
              key={`${item.nftId}-${item.editionId}`}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="size-[70px] shrink-0 rounded-md object-cover"
                  width={70}
                  height={70}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-4 text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-[6px] text-sm leading-4 text-text-secondary">
                    ID do token: #{item.tokenId}
                  </p>
                </div>
              </div>
              <div className="flex w-[194px] shrink-0 items-center justify-between gap-2">
                <span className="text-sm text-text-secondary">(x {item.quantity})</span>
                <span className="text-sm font-bold text-primary">
                  {formatEth(item.lineTotalEth, 2)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-[321px] space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span>Taxa de rede</span>
              <span className="text-foreground">{formatEth(order.networkFeeEth, 3)}</span>
            </div>
            <div className="flex justify-between gap-4 font-bold">
              <span>Total</span>
              <span className="text-primary">{formatEth(order.totalEth, 3)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 h-px bg-border" />

        <p className="mx-auto mt-6 max-w-[490px] text-center text-sm leading-[22px] text-text-secondary">
          Transação confirmada na {networkDisplay(order.network)}. A propriedade foi transferida
          para sua carteira conectada e registrada na rede.
        </p>

        <div className="mt-6 flex justify-center pb-8">
          {etherscanHref ? (
            <Button asChild className="h-12 min-w-[186px] rounded-md px-4 text-sm font-bold">
              <a href={etherscanHref} target="_blank" rel="noreferrer">
                Ver no Etherscan
              </a>
            </Button>
          ) : (
            <Button asChild className="h-12 min-w-[186px] rounded-md px-4 text-sm font-bold">
              <Link to="/">Voltar ao mercado</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
