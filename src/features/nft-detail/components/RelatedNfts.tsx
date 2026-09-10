import { NftCard } from '@/components/kurio'
import type { Nft } from '@/shared/api/contracts'
type RelatedNftsProps = {
  items: Nft[]
}
export function RelatedNfts({ items }: RelatedNftsProps) {
  return (
    <section className="mt-14" aria-labelledby="related-heading">
      <div className="mb-8 border-b border-primary pb-3">
        <h2 id="related-heading" className="text-base font-bold text-text-accent">
          Mais desta coleção
        </h2>
      </div>
      {items.length ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <NftCard
              key={item.id}
              id={item.id}
              name={item.name}
              imageUrl={item.imageUrl}
              priceEth={item.priceEth}
              compareAtEth={item.compareAtEth}
              className="max-w-none"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">Nenhum item relacionado no momento.</p>
      )}
    </section>
  )
}
