import { Breadcrumb } from '@/components/kurio/Breadcrumb'
type MarketBreadcrumbProps = {
  current?: string
  className?: string
}
export function MarketBreadcrumb({ current, className }: MarketBreadcrumbProps) {
  return (
    <Breadcrumb
      className={className}
      items={[
        { label: 'Início', to: '/' },
        { label: 'Mercado', href: '/#catalog' },
        ...(current ? [{ label: current, current: true as const }] : []),
      ]}
    />
  )
}
