const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export function formatOrderDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${date.getDate()} ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`
}
export function shortTx(tx: string): string {
  if (tx.length <= 12) return tx
  return `${tx.slice(0, 6)}…${tx.slice(-4)}`
}
export function orderExplorerHref(order: {
  explorerUrl?: string | null
  transactionId?: string | null
}): string | null {
  return (
    order.explorerUrl ??
    (order.transactionId ? `https://etherscan.io/tx/${order.transactionId}` : null)
  )
}
