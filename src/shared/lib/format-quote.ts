import { eth, formatEth } from '@/shared/lib/eth'
export function formatDiscountEth(value: string): string {
  if (eth(value).isZero()) return '(-) 00.00'
  return `(-) ${formatEth(value, 2).replace(/ ETH$/, '')}`
}
