export type ProviderId = 'walletconnect' | 'metamask' | 'coinbase'

export type WalletConnection = 'disconnected' | 'connected' | 'refused'

export type NetworkOption = 'ethereum' | 'polygon' | 'solana'

export type CollectorFormValues = {
  displayName: string
  username: string
  network: NetworkOption | ''
  profileName: string
  walletAddress: string
  secondaryWallet: string
  walletType: 'metamask' | 'coinbase' | 'walletconnect' | 'phantom' | ''
  referralCode: string
  email: string
  ensName: string
  ensTld: string
  useOtherWallet: boolean
  notes: string
}
