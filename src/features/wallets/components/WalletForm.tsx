import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/shared/lib/cn'
import { RequiredLabel, formFieldClass } from '@/shared/ui/form-field'
export type WalletFormValues = {
  displayName: string
  walletNickname: string
  network: 'ethereum' | 'polygon' | 'solana' | ''
  profileName: string
  walletAddress: string
  secondaryWallet: string
  walletType: 'metamask' | 'coinbase' | 'walletconnect' | 'phantom' | ''
  referralCode: string
  email: string
  ensName: string
  ensTld: string
  isPrimary: boolean
  sameAsPrimary: boolean
}
type WalletFormProps = {
  form: UseFormReturn<WalletFormValues>
  busy: boolean
  onSubmit: () => void
  onAddPrimary: () => void
}
export function WalletForm({ form, busy, onSubmit, onAddPrimary }: WalletFormProps) {
  const { errors } = form.formState
  return (
    <section className="max-w-[862px]">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold leading-4 text-foreground">Carteira principal</h2>
          <p className="mt-2 text-sm leading-[15px] text-text-secondary">
            Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 text-sm font-bold leading-4 text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onAddPrimary}
        >
          Adicionar
        </button>
      </div>

      <form className="flex flex-col" onSubmit={onSubmit} noValidate>
        <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
          <div>
            <RequiredLabel htmlFor="wallet-display-name">Nome de exibição</RequiredLabel>
            <Input
              id="wallet-display-name"
              className={formFieldClass}
              {...form.register('displayName')}
            />
            {errors.displayName ? (
              <p className="mt-1 text-xs text-error">{errors.displayName.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-nickname">Apelido da carteira</RequiredLabel>
            <Input
              id="wallet-nickname"
              className={formFieldClass}
              {...form.register('walletNickname')}
            />
            {errors.walletNickname ? (
              <p className="mt-1 text-xs text-error">{errors.walletNickname.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-network">Rede </RequiredLabel>
            <Select
              value={form.watch('network') || undefined}
              onValueChange={(value) =>
                form.setValue('network', value as WalletFormValues['network'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="wallet-network" className={cn(formFieldClass, 'h-10')}>
                <SelectValue placeholder="Selecione uma rede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
              </SelectContent>
            </Select>
            {errors.network ? (
              <p className="mt-1 text-xs text-error">{errors.network.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-profile-name">Nome do perfil</RequiredLabel>
            <Input
              id="wallet-profile-name"
              className={formFieldClass}
              {...form.register('profileName')}
            />
            {errors.profileName ? (
              <p className="mt-1 text-xs text-error">{errors.profileName.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-address">Endereço da carteira</RequiredLabel>
            <Input
              id="wallet-address"
              placeholder="Endereço 0x da carteira"
              className={formFieldClass}
              {...form.register('walletAddress')}
            />
            {errors.walletAddress ? (
              <p className="mt-1 text-xs text-error">{errors.walletAddress.message}</p>
            ) : null}
          </div>

          <div className="sm:pt-[29px]">
            <Input
              id="wallet-secondary"
              placeholder="ENS ou carteira secundária (opcional)"
              aria-label="ENS ou carteira secundária (opcional)"
              className={formFieldClass}
              {...form.register('secondaryWallet')}
            />
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-type">Tipo de carteira</RequiredLabel>
            <Select
              value={form.watch('walletType') || undefined}
              onValueChange={(value) =>
                form.setValue('walletType', value as WalletFormValues['walletType'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="wallet-type" className={cn(formFieldClass, 'h-10')}>
                <SelectValue placeholder="Selecione uma carteira" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metamask">MetaMask</SelectItem>
                <SelectItem value="coinbase">Coinbase Wallet</SelectItem>
                <SelectItem value="walletconnect">WalletConnect</SelectItem>
                <SelectItem value="phantom">Phantom</SelectItem>
              </SelectContent>
            </Select>
            {errors.walletType ? (
              <p className="mt-1 text-xs text-error">{errors.walletType.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-referral">Código de indicação</RequiredLabel>
            <Input
              id="wallet-referral"
              className={formFieldClass}
              {...form.register('referralCode')}
            />
            {errors.referralCode ? (
              <p className="mt-1 text-xs text-error">{errors.referralCode.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-email">E-mail</RequiredLabel>
            <Input
              id="wallet-email"
              type="email"
              className={formFieldClass}
              {...form.register('email')}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-ens">Nome ENS</RequiredLabel>
            <div className="flex gap-2.5">
              <Select
                value={form.watch('ensTld')}
                onValueChange={(value) => form.setValue('ensTld', value, { shouldDirty: true })}
              >
                <SelectTrigger className={cn(formFieldClass, 'h-10 w-[78px] shrink-0 px-2')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".eth">.eth</SelectItem>
                  <SelectItem value=".xyz">.xyz</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="wallet-ens"
                className={cn(formFieldClass, 'flex-1')}
                {...form.register('ensName')}
              />
            </div>
            {errors.ensName ? (
              <p className="mt-1 text-xs text-error">{errors.ensName.message}</p>
            ) : null}
          </div>
        </div>

        <Button
          type="submit"
          disabled={busy}
          className="mt-8 h-10 w-[131px] rounded-md text-sm font-bold"
        >
          {busy ? 'Salvando…' : 'Salvar carteira'}
        </Button>
      </form>
    </section>
  )
}
