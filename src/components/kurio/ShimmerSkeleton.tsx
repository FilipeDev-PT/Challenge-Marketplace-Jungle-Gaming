import { Skeleton } from '@/components/ui/skeleton'
import { useIsDesktop } from '@/shared/lib/breakpoints'
import { cn } from '@/shared/lib/cn'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'
type ShimmerSkeletonProps = {
  className?: string
}
export function CatalogGridSkeleton({
  count = 6,
  className,
}: ShimmerSkeletonProps & {
  count?: number
}) {
  return (
    <div
      className={cn('grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3', className)}
      aria-busy="true"
      aria-label="Carregando catálogo"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex max-w-[258px] flex-col gap-3">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  )
}
type DetailSkeletonProps = ShimmerSkeletonProps & {
  lcpImageUrl?: string
  lcpImageAlt?: string
}
export function DetailSkeleton({ className, lcpImageUrl, lcpImageAlt = '' }: DetailSkeletonProps) {
  const isDesktop = useIsDesktop()
  if (isDesktop) {
    return (
      <div className={cn(className)} aria-busy="true" aria-label="Carregando detalhes do NFT">
        <div className="grid gap-8 lg:grid-cols-2">
          {lcpImageUrl ? (
            <img
              src={lcpImageUrl}
              alt={lcpImageAlt}
              className="aspect-square w-full max-w-[444px] rounded-[22px] object-cover"
              width={444}
              height={444}
              fetchPriority="high"
              decoding="async"
              onLoad={() => clearLcpBoot()}
            />
          ) : (
            <Skeleton className="aspect-square w-full" />
          )}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-12 w-full max-w-xs" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={cn(className)} aria-busy="true" aria-label="Carregando detalhes do NFT">
      <div className="space-y-4">
        <div className="flex justify-between px-1">
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
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
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
export function ShimmerSkeleton({
  variant = 'catalog',
  className,
}: ShimmerSkeletonProps & {
  variant?: 'catalog' | 'detail' | 'cart'
}) {
  if (variant === 'detail') return <DetailSkeleton className={className} />
  if (variant === 'cart') return <CartSummarySkeleton className={className} />
  return <CatalogGridSkeleton className={className} />
}
