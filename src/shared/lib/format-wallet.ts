import type { Wallet } from '@/shared/api/contracts'
export function formatWalletLabel(label: string): string {
  const lower = label.toLowerCase()
  if (lower.includes('metamask')) return 'MetaMask'
  if (lower.includes('coinbase')) return 'Coinbase Wallet'
  if (lower.includes('walletconnect')) return 'WalletConnect'
  if (lower.includes('phantom')) return 'Phantom'
  return label
}
export function networkDisplay(network: string): string {
  if (network === 'ethereum') return 'Ethereum'
  if (network === 'polygon') return 'Polygon'
  if (network === 'solana') return 'Solana'
  return network
}
export function networkLabel(network: Wallet['network']): string {
  if (network === 'polygon') return 'Rede Polygon'
  if (network === 'solana') return 'Rede Solana'
  return 'Rede principal Ethereum'
}
export function shortAddress(address: string): string {
  if (address.includes('.')) return address
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
