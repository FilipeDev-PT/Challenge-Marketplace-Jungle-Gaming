import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/kurio'
import type { Wallet } from '@/shared/api/contracts'
type PrimaryWalletCardProps = {
  wallet: Wallet | undefined
  onEdit: () => void
  onCreate: () => void
}
export function PrimaryWalletCard({ wallet, onEdit, onCreate }: PrimaryWalletCardProps) {
  return (
    <section className="mb-10 max-w-[862px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold leading-4 text-foreground">Carteira principal</h2>
          <p className="mt-2 text-sm leading-[15px] text-text-secondary">
            Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-sm font-bold leading-4 text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={wallet ? onEdit : onCreate}
        >
          {wallet ? 'Editar' : 'Adicionar'}
        </button>
      </div>

      {wallet ? (
        <div className="grid gap-6 border border-border bg-ink-soft/40 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-text-secondary">Apelido</p>
            <p className="mt-1 font-bold text-foreground">{wallet.label}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Provedor</p>
            <p className="mt-1 capitalize text-foreground">{wallet.provider}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-text-secondary">Endereço</p>
            <p className="mt-1 break-all font-mono text-sm text-foreground">{wallet.address}</p>
          </div>
          <div>
            <p className="text-sm text-text-secondary">Rede</p>
            <p className="mt-1 capitalize text-foreground">{wallet.network}</p>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-md text-sm"
              onClick={onEdit}
            >
              Editar carteira
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Nenhuma carteira principal"
          description="Cadastre uma carteira principal para o checkout."
        />
      )}
    </section>
  )
}
