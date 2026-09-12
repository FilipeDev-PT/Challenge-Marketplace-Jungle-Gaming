import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
export type BreadcrumbItem = {
  label: string
  to?: string
  hash?: string
  href?: string
  current?: boolean
}
type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('mb-7 text-sm text-text-secondary', className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        let node: ReactNode
        if (item.to) {
          node = (
            <Link to={item.to} hash={item.hash} resetScroll={false} className="hover:text-text-accent">
              {item.label}
            </Link>
          )
        } else if (item.href) {
          node = (
            <a href={item.href} className="hover:text-text-accent">
              {item.label}
            </a>
          )
        } else {
          node = (
            <span className={item.current || isLast ? 'text-foreground' : undefined}>
              {item.label}
            </span>
          )
        }
        return (
          <span key={`${item.label}-${index}`}>
            {index > 0 ? <span className="mx-1">/</span> : null}
            {node}
          </span>
        )
      })}
    </nav>
  )
}
