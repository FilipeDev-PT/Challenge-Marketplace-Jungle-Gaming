import { Label } from '@/components/ui/label'
export const formFieldClass =
  'h-10 rounded-md border-border bg-ink-soft px-3 text-sm text-foreground placeholder:text-secondary focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary'
export function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <Label
      htmlFor={htmlFor}
      className="mb-2 inline-flex items-start gap-0.5 text-sm text-foreground"
    >
      {children}
      <span className="text-error" aria-hidden>
        *
      </span>
    </Label>
  )
}
