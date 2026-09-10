import { z } from 'zod'
export const walletFormSchema = z.object({
  displayName: z.string().min(2, 'Informe o nome de exibição'),
  walletNickname: z.string().min(2, 'Informe o apelido da carteira'),
  network: z.enum(['ethereum', 'polygon', 'solana'], {
    message: 'Selecione uma rede',
  }),
  profileName: z.string().min(2, 'Informe o nome do perfil'),
  walletAddress: z.string().min(8, 'Endereço inválido'),
  secondaryWallet: z.string().optional().default(''),
  walletType: z.enum(['metamask', 'coinbase', 'walletconnect', 'phantom'], {
    message: 'Selecione uma carteira',
  }),
  referralCode: z.string().min(1, 'Informe o código de indicação'),
  email: z.string().email('E-mail inválido'),
  ensName: z.string().min(1, 'Informe o nome ENS'),
  ensTld: z.string().default('.eth'),
  isPrimary: z.boolean().default(true),
  sameAsPrimary: z.boolean().default(false),
})
export type WalletFormSchema = z.infer<typeof walletFormSchema>
export function toWalletApiPayload(values: WalletFormSchema) {
  return {
    label: values.walletNickname.trim(),
    address: values.walletAddress.trim(),
    provider: values.walletType,
    network: values.network,
    isPrimary: values.isPrimary,
  }
}
