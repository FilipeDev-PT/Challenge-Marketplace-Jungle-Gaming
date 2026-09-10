import { NftCard } from '@/components/kurio'
import type { Nft } from '@/shared/api/contracts'
type CartRelatedStripProps = {
  items: Nft[]
}
export function CartRelatedStrip({ items }: CartRelatedStripProps) {
  return (
    <section className="mt-16" aria-labelledby="also-seen">
      <div className="mb-8 border-b border-border pb-3">
        <h2 id="also-seen" className="text-primary font-bold">
          Colecionadores também viram
        </h2>
      </div>
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
    </section>
  )
}
