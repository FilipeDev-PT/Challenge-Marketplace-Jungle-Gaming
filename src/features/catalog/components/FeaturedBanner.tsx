import { Link } from '@tanstack/react-router'
import type { Nft } from '@/shared/api/contracts'
import type { HomeContent } from '@/shared/api/cms-contracts'
type FeaturedBannerProps = {
  featured: Nft
  banner: HomeContent['featuredBanner']
}
export function FeaturedBanner({ featured, banner }: FeaturedBannerProps) {
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: featured.id }}
      className="group relative flex h-[470px] w-full flex-col gap-4 overflow-hidden bg-gradient-to-b from-primary/10 to-primary/[0.03] pb-1 pt-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex flex-col items-center gap-4 px-5">
        <p className="w-full text-center text-2xl font-bold leading-8 text-text-accent">
          {banner.title}
        </p>
        <p className="w-full text-center text-[22px] font-bold leading-4 text-foreground">
          {banner.badge}
        </p>
      </div>
      <img
        src={
          featured.imageUrl.endsWith('.svg') ? '/assets/nfts/emerald-ape.webp' : featured.imageUrl
        }
        alt={featured.name}
        className="aspect-[310/368] w-full rounded-[22px] object-cover"
        width={310}
        height={368}
        loading="lazy"
        decoding="async"
      />
    </Link>
  )
}
