import type { Nft } from '@/shared/api/contracts'
import { cn } from '@/shared/lib/cn'
type DetailTab = 'details' | 'reviews'
type NftDetailTabsProps = {
  nft: Nft
  activeTab: DetailTab
  onTabChange: (tab: DetailTab) => void
}
export function NftDetailTabs({ nft, activeTab, onTabChange }: NftDetailTabsProps) {
  return (
    <section className="mt-16 border-b border-border pb-8" aria-labelledby="detail-tabs">
      <div className="mb-7 flex flex-wrap gap-8 border-b border-border" id="detail-tabs">
        <button
          type="button"
          className={cn(
            'pb-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            activeTab === 'details'
              ? 'border-b-2 border-primary font-bold text-primary'
              : 'text-text-secondary',
          )}
          onClick={() => onTabChange('details')}
        >
          Detalhes do NFT
        </button>
        <button
          type="button"
          className={cn(
            'pb-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            activeTab === 'reviews'
              ? 'border-b-2 border-primary font-bold text-primary'
              : 'text-text-secondary',
          )}
          onClick={() => onTabChange('reviews')}
        >
          Avaliações de colecionadores (19)
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="space-y-4 text-sm leading-6 text-text-secondary">
          <p>{nft.description}</p>
          <div className="space-y-1">
            <p className="font-bold text-foreground">Rede</p>
            <p>
              Cunhado na <span className="capitalize">{nft.network}</span> com procedência imutável
              e metadados armazenados no IPFS.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-foreground">Contrato</p>
            <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-foreground">Direitos autorais</p>
            <p>
              {nft.creator} recebe 5% de royalties nas vendas secundárias, pagos automaticamente por
              marketplaces compatíveis.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-secondary">
          Avaliações simuladas: colecionadores destacam a qualidade da arte e a transparência da
          procedência on-chain.
        </p>
      )}
    </section>
  )
}
