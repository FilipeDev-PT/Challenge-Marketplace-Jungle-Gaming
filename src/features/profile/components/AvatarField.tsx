import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
type AvatarFieldProps = {
  avatarUrl: string | null | undefined
  fileInputRef: RefObject<HTMLInputElement | null>
  onPickFile: (file: File) => void
  onRemove: () => void
}
export function AvatarField({ avatarUrl, fileInputRef, onPickFile, onRemove }: AvatarFieldProps) {
  return (
    <div>
      <Label className="mb-2 block text-sm text-foreground">Avatar</Label>
      <div className="flex items-center gap-4">
        <div className="flex size-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-ink-soft bg-primary/20">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.4"
                className="text-text-secondary"
              />
              <circle cx="9" cy="10" r="1.5" fill="currentColor" className="text-text-secondary" />
              <path
                d="M3 16l5-4 3 2 4-5 6 7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
                className="text-text-secondary"
              />
            </svg>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onPickFile(file)
          }}
        />
        <div className="flex items-center gap-5">
          <Button
            type="button"
            className="h-10 w-[98px] rounded-md text-sm font-bold"
            onClick={() => fileInputRef.current?.click()}
          >
            Alterar
          </Button>
          <button
            type="button"
            className="text-sm text-foreground hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onRemove}
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  )
}
