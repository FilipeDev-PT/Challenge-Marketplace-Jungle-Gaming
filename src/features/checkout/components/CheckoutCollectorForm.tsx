import type { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CollectorFormValues } from '@/features/checkout/model/types'
import { cn } from '@/shared/lib/cn'
import { RequiredLabel, formFieldClass } from '@/shared/ui/form-field'

export type { CollectorFormValues }

type CheckoutCollectorFormProps = {
  form: UseFormReturn<CollectorFormValues>
  onSubmit: (values: CollectorFormValues) => void
}
export function CheckoutCollectorForm({ form, onSubmit }: CheckoutCollectorFormProps) {
  const { errors } = form.formState
  return (
    <section className="min-w-0 flex-1 lg:max-w-[862px]">
      <h2 className="mb-6 text-base font-bold leading-4 text-foreground">Perfil do colecionador</h2>

      <form
        id="checkout-form"
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
          <div>
            <RequiredLabel htmlFor="display-name">Nome de exibição</RequiredLabel>
            <Input id="display-name" className={formFieldClass} {...form.register('displayName')} />
            {errors.displayName ? (
              <p className="mt-1 text-xs text-error">{errors.displayName.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="username">Nome de usuário</RequiredLabel>
            <Input id="username" className={formFieldClass} {...form.register('username')} />
            {errors.username ? (
              <p className="mt-1 text-xs text-error">{errors.username.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="network">Rede </RequiredLabel>
            <Select
              value={form.watch('network') || undefined}
              onValueChange={(value) =>
                form.setValue('network', value as CollectorFormValues['network'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="network" className={cn(formFieldClass, 'h-10')}>
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
            <RequiredLabel htmlFor="profile-name">Nome do perfil</RequiredLabel>
            <Input id="profile-name" className={formFieldClass} {...form.register('profileName')} />
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

          <div>
            <Label htmlFor="secondary-wallet" className="mb-2 block text-sm text-foreground">
              ENS ou carteira secundária (opcional)
            </Label>
            <Input
              id="secondary-wallet"
              placeholder="ENS ou carteira secundária (opcional)"
              className={formFieldClass}
              {...form.register('secondaryWallet')}
            />
          </div>

          <div>
            <RequiredLabel htmlFor="wallet-type">Tipo de carteira</RequiredLabel>
            <Select
              value={form.watch('walletType') || undefined}
              onValueChange={(value) =>
                form.setValue('walletType', value as CollectorFormValues['walletType'], {
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
            <RequiredLabel htmlFor="referral">Código de indicação</RequiredLabel>
            <Input id="referral" className={formFieldClass} {...form.register('referralCode')} />
            {errors.referralCode ? (
              <p className="mt-1 text-xs text-error">{errors.referralCode.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="email">E-mail</RequiredLabel>
            <Input id="email" type="email" className={formFieldClass} {...form.register('email')} />
            {errors.email ? (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <RequiredLabel htmlFor="ens-name">Nome ENS</RequiredLabel>
            <div className="flex gap-2">
              <Select
                value={form.watch('ensTld')}
                onValueChange={(value) => form.setValue('ensTld', value)}
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
                id="ens-name"
                className={cn(formFieldClass, 'flex-1')}
                {...form.register('ensName')}
              />
            </div>
            {errors.ensName ? (
              <p className="mt-1 text-xs text-error">{errors.ensName.message}</p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          role="radio"
          aria-checked={form.watch('useOtherWallet')}
          className="inline-flex items-center gap-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => form.setValue('useOtherWallet', !form.getValues('useOtherWallet'))}
        >
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full border',
              form.watch('useOtherWallet') ? 'border-primary' : 'border-text-secondary',
            )}
            aria-hidden
          >
            {form.watch('useOtherWallet') ? (
              <span className="size-2 rounded-full bg-primary" />
            ) : null}
          </span>
          Usar outra carteira?
        </button>

        <div>
          <Label htmlFor="notes" className="mb-2 block text-sm text-foreground">
            Observação do colecionador (opcional)
          </Label>
          <textarea
            id="notes"
            rows={5}
            className={cn(
              'w-full resize-y w-[48%] rounded-md border border-border bg-ink-soft px-3 py-2 text-sm text-foreground placeholder:text-secondary',
              'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
            )}
            {...form.register('notes')}
          />
        </div>
      </form>
    </section>
  )
}
