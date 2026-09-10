import { useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AvatarField } from '@/features/profile/components/AvatarField'
import { cn } from '@/shared/lib/cn'
import { RequiredLabel, formFieldClass } from '@/shared/ui/form-field'
export type ProfileFormValues = {
  name: string
  username: string
  ens: string
  ensTld: string
  email: string
  walletNickname: string
  avatarUrl?: string | null
}
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
type ProfileFormProps = {
  form: UseFormReturn<ProfileFormValues>
}
export function ProfileForm({ form }: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarUrl = form.watch('avatarUrl')
  const { errors } = form.formState
  return (
    <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
      <div>
        <RequiredLabel htmlFor="profile-name">Nome de exibição</RequiredLabel>
        <Input id="profile-name" className={formFieldClass} {...form.register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-error">{errors.name.message}</p> : null}
      </div>

      <div>
        <RequiredLabel htmlFor="profile-username">Nome de usuário</RequiredLabel>
        <Input id="profile-username" className={formFieldClass} {...form.register('username')} />
        {errors.username ? (
          <p className="mt-1 text-xs text-error">{errors.username.message}</p>
        ) : null}
      </div>

      <div>
        <RequiredLabel htmlFor="profile-email">E-mail</RequiredLabel>
        <Input
          id="profile-email"
          type="email"
          className={formFieldClass}
          {...form.register('email')}
        />
        {errors.email ? <p className="mt-1 text-xs text-error">{errors.email.message}</p> : null}
      </div>

      <div>
        <RequiredLabel htmlFor="profile-ens">Nome ENS</RequiredLabel>
        <div className="flex gap-2">
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
            id="profile-ens"
            className={cn(formFieldClass, 'flex-1')}
            {...form.register('ens')}
          />
        </div>
        {errors.ens ? <p className="mt-1 text-xs text-error">{errors.ens.message}</p> : null}
      </div>

      <div>
        <RequiredLabel htmlFor="profile-wallet-nick">Apelido da carteira</RequiredLabel>
        <Input
          id="profile-wallet-nick"
          className={formFieldClass}
          {...form.register('walletNickname')}
        />
        {errors.walletNickname ? (
          <p className="mt-1 text-xs text-error">{errors.walletNickname.message}</p>
        ) : null}
      </div>

      <AvatarField
        avatarUrl={avatarUrl}
        fileInputRef={fileInputRef}
        onPickFile={async (file) => {
          try {
            const dataUrl = await readFileAsDataUrl(file)
            form.setValue('avatarUrl', dataUrl, { shouldDirty: true })
          } catch {
            toast.error('Não foi possível ler a imagem')
          }
        }}
        onRemove={() => form.setValue('avatarUrl', null, { shouldDirty: true })}
      />
    </div>
  )
}
