import Decimal from 'decimal.js'
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })
export function eth(value: string | number | Decimal): Decimal {
  return new Decimal(value)
}
export function addEth(...values: Array<string | number | Decimal>): string {
  return values.reduce<Decimal>((acc, value) => acc.plus(eth(value)), eth(0)).toFixed()
}
export function mulEth(a: string | number | Decimal, b: string | number | Decimal): string {
  return eth(a).times(eth(b)).toFixed()
}
export function subEth(a: string | number | Decimal, b: string | number | Decimal): string {
  return eth(a).minus(eth(b)).toFixed()
}
export function formatEth(value: string | number | Decimal, digits = 3): string {
  const d = eth(value)
  const fixed = d.toFixed(digits)
  return `${fixed.replace(/\.?0+$/, '') || '0'} ETH`
}
export function compareEth(a: string, b: string): number {
  return eth(a).comparedTo(eth(b))
}
