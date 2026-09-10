import { z } from 'zod'
export const collectorSchema = z.object({
  displayName: z.string().min(2, 'Informe o nome de exibição'),
  username: z.string().min(2, 'Informe o nome de usuário'),
  network: z.enum(['ethereum', 'polygon', 'solana'], { message: 'Selecione uma rede' }),
  profileName: z.string().min(2, 'Informe o nome do perfil'),
  walletAddress: z.string().min(6, 'Informe o endereço da carteira'),
  secondaryWallet: z.string().optional().default(''),
  walletType: z.enum(['metamask', 'coinbase', 'walletconnect', 'phantom'], {
    message: 'Selecione uma carteira',
  }),
  referralCode: z.string().min(1, 'Informe o código de indicação'),
  email: z.string().email('E-mail inválido'),
  ensName: z.string().min(1, 'Informe o nome ENS'),
  ensTld: z.string().default('.eth'),
  useOtherWallet: z.boolean().default(false),
  notes: z.string().optional().default(''),
})
export type CollectorSchemaValues = z.infer<typeof collectorSchema>
