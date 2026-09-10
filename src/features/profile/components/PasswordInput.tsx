import { useState, type ComponentProps } from 'react'
import { EyeIcon, EyeOffIcon } from '@/components/kurio/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/shared/lib/cn'
type PasswordInputProps = ComponentProps<typeof Input> & {
  label: string
  error?: string
}
const fieldClass =
  'h-10 rounded-md border-border bg-ink-soft px-3 pr-11 text-sm text-foreground placeholder:text-secondary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary'
export function PasswordInput({ id, label, error, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="max-w-[417px]">
      <Label htmlFor={id} className="mb-2 block text-sm text-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn(fieldClass, className)}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
        </button>
      </div>
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  )
}
