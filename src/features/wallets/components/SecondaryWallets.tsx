import { cn } from '@/shared/lib/cn'
import type { Wallet } from '@/shared/api/contracts'
type SecondaryWalletsProps = {
  wallets: Wallet[]
  sameAsPrimary: boolean
  onToggleSameAsPrimary: () => void
  onAdd: () => void
  onEdit: (wallet: Wallet) => void
}
export function SecondaryWallets({
  wallets,
  sameAsPrimary,
  onToggleSameAsPrimary,
  onAdd,
  onEdit,
}: SecondaryWalletsProps) {
  return (
    <section className="mt-8 max-w-[862px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold leading-4 text-foreground">Carteira secundária</h2>
        <div className="flex items-center gap-6">
          <button
            type="button"
            role="radio"
            aria-checked={sameAsPrimary}
            className="inline-flex items-center gap-2 text-sm leading-4 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onToggleSameAsPrimary}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border',
                sameAsPrimary ? 'border-primary' : 'border-text-secondary',
              )}
              aria-hidden
            >
              {sameAsPrimary ? <span className="size-2 rounded-full bg-primary" /> : null}
            </span>
            Igual à carteira principal
          </button>
          <button
            type="button"
            className="text-sm font-bold leading-4 text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onAdd}
          >
            Adicionar
          </button>
        </div>
      </div>

      {wallets.length ? (
        <ul className="mt-4 flex flex-col gap-3">
          {wallets.map((wallet) => (
            <li
              key={wallet.id}
              className="flex flex-col gap-3 border border-border bg-ink-soft/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-bold text-foreground">{wallet.label}</p>
                <p className="mt-1 break-all font-mono text-xs text-text-secondary">
                  {wallet.address}
                </p>
                <p className="mt-1 text-sm capitalize text-text-secondary">
                  {wallet.provider} · {wallet.network}
                </p>
              </div>
              <button
                type="button"
                className="shrink-0 text-sm font-bold text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => onEdit(wallet)}
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm leading-[15px] text-text-secondary">
          Você ainda não adicionou uma carteira secundária.
        </p>
      )}
    </section>
  )
}
