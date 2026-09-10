import { useState } from 'react'
import { ZoomIcon } from '@/components/kurio/icons'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/shared/lib/cn'
import { clearLcpBoot } from '@/shared/lib/lcp-boot'
type NftGalleryProps = {
  name: string
  images: string[]
  activeIndex: number
  onSelect: (index: number) => void
}
export function NftGallery({ name, images, activeIndex, onSelect }: NftGalleryProps) {
  const [zoomOpen, setZoomOpen] = useState(false)
  const activeSrc = images[activeIndex] ?? images[0]
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-7">
      <ul
        className="flex gap-3 sm:w-[100px] sm:flex-col sm:gap-4"
        aria-label="Miniaturas da galeria"
      >
        {images.map((src, index) => (
          <li key={`thumb-${index}`}>
            <button
              type="button"
              className={cn(
                'size-[100px] overflow-hidden rounded-[8px] bg-surface-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                activeIndex === index ? 'ring-2 ring-primary' : '',
              )}
              aria-label={`Ver imagem ${index + 1}`}
              aria-current={activeIndex === index}
              onClick={() => onSelect(index)}
            >
              <img
                src={src}
                alt=""
                className="size-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative mx-auto size-full max-w-[444px] shrink-0 sm:mx-0">
        <div className="relative aspect-square size-full overflow-hidden rounded-[22px] bg-surface-card p-5">
          <img
            src={activeSrc}
            alt={name}
            className="size-full rounded-[18px] object-cover"
            width={404}
            height={404}
            fetchPriority="high"
            decoding="async"
            onLoad={() => clearLcpBoot()}
          />
          <button
            type="button"
            className="absolute right-[14px] top-[14px] flex size-[30px] items-center justify-center rounded-full border border-foreground/90 bg-transparent text-foreground hover:bg-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Ampliar imagem"
            onClick={() => setZoomOpen(true)}
          >
            <ZoomIcon className="size-5" />
          </button>
        </div>
      </div>

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-[min(92vw,720px)] border-border bg-ink-deep p-3 sm:p-4">
          <DialogTitle className="sr-only">Ampliação — {name}</DialogTitle>
          <img
            src={activeSrc}
            alt={name}
            className="max-h-[80vh] w-full rounded-[18px] object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
