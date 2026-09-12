import { MarketBreadcrumb } from '@/components/kurio/MarketBreadcrumb'
import { MobileScreenHeader } from '@/components/kurio/MobileScreenHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsDesktop } from '@/shared/lib/breakpoints'
import { cn } from '@/shared/lib/cn'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'

type ShimmerSkeletonProps = {
  className?: string
}

const CART_ROW_GRID =
  'md:grid md:grid-cols-[250px_77px_75px_87px_24px] md:items-center md:gap-x-[61px]'

const HERO_LCP_SRC = '/assets/hero/featured.webp'
const DETAIL_LCP_SRC = '/assets/nfts/emerald-ape.webp'

function NftCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="aspect-square w-full rounded-[20px]" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    )
  }
  return (
    <div className="flex w-full max-w-[258px] flex-col gap-3">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  )
}

export function CatalogGridSkeleton({
  count = 6,
  className,
  labelled = true,
}: ShimmerSkeletonProps & {
  count?: number
  labelled?: boolean
}) {
  const isDesktop = useIsDesktop()
  const statusProps = labelled
    ? ({
        'aria-busy': true,
        'aria-label': 'Carregando catálogo',
        role: 'status',
      } as const)
    : ({ 'aria-hidden': true } as const)

  if (!isDesktop) {
    const leftCount = Math.ceil(count / 2)
    const rightCount = count - leftCount
    return (
      <div className={cn('grid grid-cols-2 gap-x-4 gap-y-6', className)} {...statusProps}>
        <div className="flex flex-col gap-6">
          {Array.from({ length: leftCount }).map((_, index) => (
            <NftCardSkeleton key={`l-${index}`} compact />
          ))}
        </div>
        <div className="flex flex-col gap-6 pt-8">
          {Array.from({ length: rightCount }).map((_, index) => (
            <NftCardSkeleton key={`r-${index}`} compact />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('grid gap-x-[34px] gap-y-[72px] md:grid-cols-2 xl:grid-cols-3', className)}
      {...statusProps}
    >
      {Array.from({ length: count }).map((_, index) => (
        <NftCardSkeleton key={index} />
      ))}
    </div>
  )
}

function HomeHeroSkeleton({ isDesktop }: { isDesktop: boolean }) {
  if (isDesktop) {
    return (
      <section className="mx-auto w-full max-w-[1200px] pt-5">
        <div className="relative flex min-h-[450px] flex-col items-stretch overflow-hidden md:flex-row md:items-center md:pl-10">
          <div className="relative z-10 flex w-full max-w-[600px] flex-col gap-8 py-10 md:py-12">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-full max-w-[520px] md:h-[70px]" />
              <Skeleton className="h-12 w-4/5 max-w-[420px] md:h-[70px]" />
              <Skeleton className="mt-1 h-16 w-full max-w-[557px]" />
            </div>
            <Skeleton className="h-10 w-[140px] rounded-md" />
            <div className="flex justify-center gap-3">
              <Skeleton className="size-2 rounded-[2px]" />
              <Skeleton className="size-2 rounded-[2px]" />
              <Skeleton className="size-2 rounded-[2px]" />
            </div>
          </div>
          <div className="relative z-10 mx-auto size-full max-w-[450px] shrink-0 md:ml-auto md:size-[450px]">
            <img
              src={HERO_LCP_SRC}
              alt=""
              className="size-full rounded-[24px] object-cover"
              width={450}
              height={450}
              fetchPriority="high"
              decoding="async"
              onLoad={() => clearLcpBoot()}
            />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="md:hidden">
      <div className="relative overflow-hidden rounded-[24px] bg-[#2a1c14]">
        <div className="relative z-10 flex gap-2 px-4 pb-5 pt-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="mt-1 h-4 w-24" />
          </div>
          <div className="relative h-[210px] w-[200px] shrink-0">
            <img
              src={HERO_LCP_SRC}
              alt=""
              className="absolute left-0 top-[5px] size-[200px] rounded-[20px] object-cover"
              width={200}
              height={200}
              fetchPriority="high"
              decoding="async"
              onLoad={() => clearLcpBoot()}
            />
          </div>
        </div>
        <div className="flex justify-center gap-2 pb-3">
          <Skeleton className="size-[7px] rounded-full" />
          <Skeleton className="size-[7px] rounded-full" />
          <Skeleton className="size-[7px] rounded-full" />
        </div>
      </div>
    </section>
  )
}

export function HomePageSkeleton({ className }: ShimmerSkeletonProps) {
  const isDesktop = useIsDesktop()
  return (
    <div
      className={cn('bg-ink-deep text-text-primary', className)}
      aria-busy="true"
      aria-label="Carregando catálogo"
      role="status"
    >
      <div className="flex flex-col gap-4 pt-2 md:gap-0 md:pt-0">
        <div className="flex items-center gap-2 md:hidden">
          <Skeleton className="h-[45px] min-w-0 flex-1 rounded-2xl" />
          <Skeleton className="size-[45px] rounded-2xl" />
        </div>
        <HomeHeroSkeleton isDesktop={isDesktop} />
      </div>

      <section className="mx-auto mt-4 w-full max-w-[1200px] md:mt-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-[48px] md:gap-12">
          <div className="hidden w-[310px] shrink-0 flex-col gap-6 lg:flex">
            <Skeleton className="h-6 w-28" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-full rounded-full" />
            <Skeleton className="h-[220px] w-full rounded-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-12">
              <div className="flex items-center gap-3 md:gap-5">
                <Skeleton className="h-5 w-24 md:h-6 md:w-28" />
                <Skeleton className="h-5 w-32 md:h-6 md:w-36" />
                <Skeleton className="h-5 w-16 md:h-6 md:w-20" />
              </div>
              <Skeleton className="hidden h-6 w-52 md:block" />
            </div>
            <CatalogGridSkeleton count={9} labelled={false} />
          </div>
        </div>
      </section>
    </div>
  )
}

type DetailSkeletonProps = ShimmerSkeletonProps & {
  lcpImageUrl?: string
  lcpImageAlt?: string
}

export function DetailSkeleton({
  className,
  lcpImageUrl = DETAIL_LCP_SRC,
  lcpImageAlt = '',
}: DetailSkeletonProps) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <div
        className={cn('w-full pb-10 pt-8 text-text-primary', className)}
        aria-busy="true"
        aria-label="Carregando detalhes do NFT"
        role="status"
      >
        <MarketBreadcrumb />

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-7">
            <div className="flex gap-3 sm:w-[100px] sm:shrink-0 sm:flex-col sm:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-[100px] rounded-[8px]" />
              ))}
            </div>
            <div className="relative mx-auto w-full max-w-[444px] shrink-0 sm:mx-0">
              <div className="relative aspect-square overflow-hidden rounded-[22px] bg-surface-card p-5">
                {lcpImageUrl ? (
                  <img
                    src={lcpImageUrl}
                    alt={lcpImageAlt}
                    className="size-full rounded-[18px] object-cover"
                    width={404}
                    height={404}
                    fetchPriority="high"
                    decoding="async"
                    onLoad={() => clearLcpBoot()}
                  />
                ) : (
                  <Skeleton className="size-full rounded-[18px]" />
                )}
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[13px] lg:max-w-[595px]">
            <div className="border-b border-border pb-3">
              <Skeleton className="h-9 w-4/5 md:h-[37px]" />
              <div className="mt-3 flex flex-wrap items-center gap-x-16 gap-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-52" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div>
              <Skeleton className="mb-3 h-4 w-16" />
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-7 w-16 rounded-full" />
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-10 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-[130px] rounded-md" />
                <Skeleton className="size-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 border-b border-border pb-8">
          <div className="mb-7 flex gap-8 border-b border-border pb-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-8 border-b border-primary pb-3">
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <NftCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div
      className={cn('relative -mx-4 min-h-[100dvh] bg-ink-deep pb-[200px]', className)}
      aria-busy="true"
      aria-label="Carregando detalhes do NFT"
      role="status"
    >
      <div className="px-7 pt-2">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="size-[35px] rounded-full" />
          <Skeleton className="size-[35px] rounded-full" />
        </div>
        {lcpImageUrl ? (
          <img
            src={lcpImageUrl}
            alt={lcpImageAlt}
            className="aspect-[361/356] w-full rounded-[20px] object-cover"
            width={361}
            height={356}
            fetchPriority="high"
            decoding="async"
            onLoad={() => clearLcpBoot()}
          />
        ) : (
          <Skeleton className="aspect-[361/356] w-full rounded-[20px]" />
        )}
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-[27px] w-16 rounded-full" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-5">
          <Skeleton className="mb-3 h-4 w-16" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-7 w-16 rounded-full" />
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 bg-ink-deep px-6 pb-7 pt-4">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-[56px] flex-1 rounded-full" />
          <Skeleton className="size-[56px] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function CartSummarySkeleton({ className }: ShimmerSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-md border border-border bg-surface-card p-5',
        className,
      )}
      aria-busy="true"
      aria-label="Carregando resumo do carrinho"
    >
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-12 w-full" />
    </div>
  )
}

function CartLineSkeleton() {
  return (
    <li
      className={cn(
        'flex flex-col gap-3 rounded-lg bg-surface-card/80 p-3 md:h-[70px] md:rounded-none md:p-0',
        CART_ROW_GRID,
      )}
    >
      <div className="flex min-w-0 items-center gap-4 md:w-[250px]">
        <Skeleton className="size-[70px] shrink-0 rounded-md" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-[6px] h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-16 md:w-[77px]" />
      <Skeleton className="h-8 w-[75px]" />
      <Skeleton className="h-4 w-16 md:w-[87px]" />
      <Skeleton className="size-6" />
    </li>
  )
}

export function CartPageSkeleton({ className }: ShimmerSkeletonProps) {
  const isDesktop = useIsDesktop()

  if (!isDesktop) {
    return (
      <div
        className={cn(
          'relative -mx-4 flex min-h-[100dvh] flex-col bg-ink-deep pb-[340px] font-mono text-text-primary',
          className,
        )}
        aria-busy="true"
        aria-label="Carregando carrinho"
        role="status"
      >
        <div className="px-5 pt-3">
          <MobileScreenHeader title="Carrinho de NFTs" />
        </div>
        <ul className="mt-6 flex flex-col gap-3 px-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-2xl bg-surface-card px-3 py-3"
            >
              <Skeleton className="size-[72px] shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
                <Skeleton className="mt-2 h-4 w-16" />
              </div>
              <Skeleton className="h-16 w-10" />
            </li>
          ))}
        </ul>
        <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-[28px] bg-surface-card px-5 pb-7 pt-5">
          <Skeleton className="h-12 w-full rounded-full" />
          <CartSummarySkeleton className="mt-5 border-0 p-0" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn('w-full pb-10 pt-8', className)}
      aria-busy="true"
      aria-label="Carregando carrinho"
      role="status"
    >
      <MarketBreadcrumb current="Carrinho" />

      <div className="mt-7 flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-[86px]">
        <div className="min-w-0 w-full lg:max-w-[782px] lg:flex-1">
          <div className={`mb-3 hidden text-sm leading-4 text-text-secondary ${CART_ROW_GRID}`}>
            <span>NFTs</span>
            <span>Preço</span>
            <span>Edições</span>
            <span>Total</span>
            <span className="sr-only">Remover</span>
          </div>
          <div className="mb-3 hidden h-px bg-border md:block" />
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <CartLineSkeleton key={index} />
            ))}
          </ul>
        </div>
        <aside className="w-full shrink-0 lg:w-[332px]">
          <h2 className="border-b border-border pb-3 text-base font-bold leading-4 text-foreground">
            Resumo da carteira
          </h2>
          <CartSummarySkeleton className="mt-8 border-0 p-0" />
        </aside>
      </div>

      <section className="mt-16">
        <div className="mb-8 border-b border-border pb-3">
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <NftCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  )
}

export function ShimmerSkeleton({
  variant = 'catalog',
  className,
}: ShimmerSkeletonProps & {
  variant?: 'catalog' | 'detail' | 'cart' | 'home'
}) {
  if (variant === 'detail') return <DetailSkeleton className={className} />
  if (variant === 'cart') return <CartPageSkeleton className={className} />
  if (variant === 'home') return <HomePageSkeleton className={className} />
  return <CatalogGridSkeleton className={className} />
}
