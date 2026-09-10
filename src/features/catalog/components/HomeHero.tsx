import { useState } from 'react'
import { ArrowRightIcon } from '@/components/kurio/icons'
import { Button } from '@/components/ui/button'
import type { HomeContent } from '@/shared/api/cms-contracts'
import { useIsDesktop } from '@/shared/lib/breakpoints'
import { cn } from '@/shared/lib/cn'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'
type HomeHeroProps = {
  hero: HomeContent['hero']
}
export function HomeHero({ hero }: HomeHeroProps) {
  const isDesktop = useIsDesktop()
  const [heroSlide, setHeroSlide] = useState(0)
  const heroTitle = hero.titleLines?.length ? hero.titleLines : hero.title.split(/\n|(?=DA ARTE)/)
  const mobileTitle = hero.mobileTitleLines?.length
    ? hero.mobileTitleLines
    : ['SEJA DONO DA', 'CULTURA DIGITAL']
  const mobileBody = hero.mobileBody ?? 'Descubra NFTs selecionados de criadores do mundo todo.'
  const secondaryImage = hero.secondaryImageUrl ?? '/assets/nfts/neon-vessel.webp'
  if (isDesktop) {
    return (
      <section className="mx-auto w-full max-w-[1200px] pt-5">
        <div className="relative flex min-h-[450px] flex-col items-stretch overflow-hidden rounded-none md:flex-row md:items-center md:pl-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at 70% 40%, rgba(210,138,76,0.25), transparent 55%)',
            }}
            aria-hidden
          />
          <div className="relative z-10 flex w-full max-w-[600px] flex-col gap-8 py-10 md:py-12">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-4 tracking-[0.1em] text-text-primary">
                {hero.eyebrow}
              </p>
              <h1 className="text-[34px] font-bold leading-[1.15] text-text-primary md:text-[43px] md:leading-[70px]">
                {heroTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-1 max-w-[557px] text-sm leading-6 text-text-secondary">
                {hero.body}
              </p>
            </div>
            <Button
              asChild
              className="h-10 w-[140px] rounded-md bg-primary pl-7 pr-9 text-base font-bold text-ink hover:bg-primary-light"
            >
              <a href={hero.ctaHref}>{hero.ctaLabel}</a>
            </Button>
            <div className="flex justify-center gap-1" role="tablist" aria-label="Slides do hero">
              {Array.from({ length: hero.slideCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={heroSlide === i}
                  aria-label={`Slide ${i + 1}`}
                  className="flex size-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  onClick={() => setHeroSlide(i)}
                >
                  <span
                    className={cn(
                      'size-2 rounded-[2px] transition-colors',
                      heroSlide === i ? 'bg-primary' : 'bg-border-soft',
                    )}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="relative z-10 mx-auto size-full max-w-[450px] shrink-0 md:ml-auto md:size-[450px]">
            <img
              src={hero.imageUrl}
              alt={hero.imageAlt}
              className="size-full rounded-[24px] object-cover"
              width={450}
              height={450}
              fetchPriority="high"
              decoding="async"
              onLoad={() => clearLcpBoot()}
            />
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="md:hidden">
      <div className="relative overflow-hidden rounded-[24px] bg-[#2a1c14]">
        <div
          className="pointer-events-none absolute -left-20 -top-8 size-[248px] rounded-full bg-primary/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[72px] -top-2.5 size-[248px] rounded-full bg-primary/10"
          aria-hidden
        />
        <div className="relative z-10 flex gap-2 px-4 pb-5 pt-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1">
            <p className="text-xs font-medium leading-4 text-primary">{hero.eyebrow}</p>
            <h1 className="text-[22px] font-bold leading-[1.2] text-foreground">
              {mobileTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-xs leading-[18px] text-text-secondary">{mobileBody}</p>
            <a
              href={hero.ctaHref}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {hero.ctaLabel}
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
          <div className="relative h-[210px] w-[200px] shrink-0">
            <img
              src={hero.imageUrl}
              alt={hero.imageAlt}
              className="absolute left-0 top-[5px] size-[200px] rounded-[20px] object-cover"
              width={200}
              height={200}
              fetchPriority="high"
              decoding="async"
              onLoad={() => clearLcpBoot()}
            />
            <img
              src={secondaryImage}
              alt=""
              className="absolute bottom-0 left-3.5 size-[58px] rounded-full border-2 border-[#2a1c14] object-cover"
              width={58}
              height={58}
              loading="lazy"
              aria-hidden
            />
          </div>
        </div>
        <div
          className="relative z-10 flex justify-center gap-1 pb-3"
          role="tablist"
          aria-label="Slides do hero"
        >
          {Array.from({ length: hero.slideCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={heroSlide === i}
              aria-label={`Slide ${i + 1}`}
              className="flex size-6 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setHeroSlide(i)}
            >
              <span
                className={cn(
                  'size-[7px] rounded-full transition-colors',
                  heroSlide === i ? 'bg-primary' : 'bg-[#3d2a1f]',
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
