import { ChevronRightIcon } from '@/components/kurio/icons'
import { Button } from '@/components/ui/button'
import { toastUnavailable } from '@/components/kurio'
import type { HomeContent } from '@/shared/api/cms-contracts'
type PromoBannersProps = {
  promos: HomeContent['promos']
}
export function PromoBanners({ promos }: PromoBannersProps) {
  return (
    <section className="mx-auto mt-20 w-full max-w-[1200px]">
      <div className="flex flex-col gap-[28px] md:flex-row md:justify-between">
        {promos.map((card) => {
          const titleLines = card.title.split('\n')
          return (
            <article
              key={card.id}
              className="grid h-[250px] w-full overflow-hidden rounded-[8px] bg-surface-card md:max-w-[586px] md:grid-cols-[292px_1fr]"
            >
              <img
                src={card.imageUrl}
                alt=""
                width={292}
                height={250}
                className="h-[250px] w-full max-w-none object-cover md:w-[292px]"
                aria-hidden
              />
              <div className="flex min-h-0 min-w-0 flex-col items-end justify-between py-9 pr-7 text-right">
                <div className="flex w-full flex-col items-end gap-3">
                  <h3 className="text-[18px] font-bold leading-6 text-foreground">
                    {titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  <p className="max-w-[263px] text-sm leading-6 text-text-secondary">{card.body}</p>
                </div>
                <Button
                  type="button"
                  className="flex h-10 w-[140px] shrink-0 items-center justify-center gap-1 rounded-[6px] text-sm font-medium text-ink"
                  onClick={() => toastUnavailable()}
                >
                  <span>{card.ctaLabel}</span>
                  <ChevronRightIcon className="size-[18px]" />
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
