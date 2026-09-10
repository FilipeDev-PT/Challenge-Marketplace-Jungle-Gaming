import type { ReactNode } from 'react'
import { toastUnavailable } from '@/components/kurio/UnavailableAction'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { FooterContent } from '@/shared/api/cms-contracts'
import { cn } from '@/shared/lib/cn'
function FooterLink({ children }: { children: string }) {
  return (
    <button
      type="button"
      className="block text-left text-sm leading-[30px] text-foreground hover:text-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={() => toastUnavailable()}
    >
      {children}
    </button>
  )
}
function SocialIconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-[30px] items-center justify-center rounded-sm border border-border-soft text-text-secondary hover:text-text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      onClick={() => toastUnavailable()}
    >
      {children}
    </button>
  )
}
function socialGlyph(id: string) {
  switch (id) {
    case 'facebook':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M8.5 4.5V3.8c0-.5.3-.8 1-.8H10.5V1H9c-1.8 0-2.8 1.1-2.8 2.8v.7H4.5V6.5h1.7V13h2.3V6.5H10l.5-2H8.5Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'instagram':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect
            x="2"
            y="2"
            width="10"
            height="10"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="7" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10.2" cy="3.8" r="0.7" fill="currentColor" />
        </svg>
      )
    case 'x':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2.5 2.5 11.5 11.5M11.5 2.5 2.5 11.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'linkedin':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M3.2 5.5h1.8V12H3.2V5.5Zm.9-2.9a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM6.2 5.5h1.7v.9h.1c.2-.4.9-1 1.9-1 2 0 2.4 1.3 2.4 3V12H9.5V9c0-.7 0-1.6-1-1.6s-1.1.8-1.1 1.6V12H6.2V5.5Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'youtube':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect
            x="1.5"
            y="3.5"
            width="11"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="M6 5.5v3l3-1.5-3-1.5Z" fill="currentColor" />
        </svg>
      )
    default:
      return <span className="text-[10px] font-bold">{id.slice(0, 1).toUpperCase()}</span>
  }
}
export function AppFooter({
  className,
  content,
  isLoading,
}: {
  className?: string
  content?: FooterContent | null
  isLoading?: boolean
}) {
  if (isLoading || !content) {
    return (
      <footer className={cn('min-h-[720px] w-full', className)} aria-label="Rodapé">
        <Skeleton className="h-[720px] w-full" />
      </footer>
    )
  }
  const taglineLines = content.brand.tagline.split('\n')
  return (
    <footer className={cn('min-h-[720px] w-full', className)} aria-label="Rodapé">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="bg-surface-card p-8 md:px-8 md:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-0">
            {content.features.map((feature, index) => (
              <div key={feature.title} className="flex min-w-0 flex-1 items-stretch">
                {index > 0 ? (
                  <div
                    className="mx-0 hidden w-px shrink-0 self-stretch bg-primary lg:block"
                    aria-hidden
                  />
                ) : null}
                <div className="flex flex-col gap-3 px-4">
                  <div
                    className="flex size-[74px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-ink"
                    aria-hidden="true"
                  >
                    {feature.letter}
                  </div>
                  <p className="text-[17px] font-bold leading-4 text-foreground">{feature.title}</p>
                  <p className="max-w-[204px] text-sm leading-[22px] text-text-secondary">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex min-w-0 flex-[1.2] items-stretch">
              <div
                className="mx-0 hidden w-px shrink-0 self-stretch bg-primary lg:block"
                aria-hidden
              />
              <div className="flex w-full flex-col gap-4 px-4 lg:max-w-[357px]">
                <p className="text-lg font-bold leading-4 text-foreground">
                  {content.newsletter.title}
                </p>
                <form
                  className="flex h-10 w-full overflow-hidden rounded-[6px] bg-surface-dark shadow-[0_0_10px_rgba(10,6,4,0.45)]"
                  onSubmit={(event) => {
                    event.preventDefault()
                    toastUnavailable()
                  }}
                >
                  <label className="sr-only" htmlFor="footer-newsletter">
                    E-mail para novidades
                  </label>
                  <Input
                    id="footer-newsletter"
                    type="email"
                    placeholder={content.newsletter.placeholder}
                    className="h-10 flex-1 rounded-none border-0 bg-transparent px-3 text-sm text-foreground placeholder:text-secondary"
                    aria-describedby="footer-newsletter-hint"
                  />
                  <Button
                    type="submit"
                    className="h-10 w-[85px] shrink-0 rounded-none rounded-r-[6px] px-4 text-[18px] font-bold text-ink"
                  >
                    {content.newsletter.ctaLabel}
                  </Button>
                </form>
                <p
                  id="footer-newsletter-hint"
                  className="text-[13px] leading-[22px] text-text-secondary"
                >
                  {content.newsletter.hint}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark px-6 py-6 md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center lg:gap-8">
            <p className="text-sm font-bold tracking-[0.1em] text-foreground">
              {content.brand.name}
            </p>
            <p className="text-sm leading-[22px] text-foreground">
              {taglineLines.map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br className="hidden sm:block" /> : null}
                  {line}
                </span>
              ))}
            </p>
            <button
              type="button"
              className="text-left text-sm leading-[22px] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => toastUnavailable()}
            >
              {content.brand.email}
            </button>
            <button
              type="button"
              className="text-left text-sm leading-[22px] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => toastUnavailable()}
            >
              {content.brand.phone}
            </button>
          </div>
        </div>

        <div className="bg-surface-card p-6 md:p-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.linkColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-2">
                <p className="text-lg font-bold leading-4 text-foreground">{column.title}</p>
                <div>
                  {column.links.map((link) => (
                    <FooterLink key={link}>{link}</FooterLink>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <p className="text-lg font-bold leading-4 text-foreground">Redes sociais</p>
                <div className="flex gap-2.5">
                  {content.socials.map((social) => (
                    <SocialIconButton key={social.id} label={social.label}>
                      {socialGlyph(social.id)}
                    </SocialIconButton>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-lg font-bold leading-4 text-foreground">Carteiras compatíveis</p>
                <div className="flex h-[26px] items-center justify-center rounded-md border border-border-soft bg-surface-dark px-2">
                  <p className="text-[9px] font-bold tracking-[0.1px] text-text-accent">
                    {content.compatibleWallets.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="py-2 text-center text-sm leading-[30px] text-foreground">
          {content.copyright}
        </p>
      </div>
    </footer>
  )
}
