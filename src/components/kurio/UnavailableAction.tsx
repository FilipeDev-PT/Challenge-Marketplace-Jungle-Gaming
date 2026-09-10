import type { MouseEvent, ReactNode } from 'react'
import { toast } from 'sonner'
export const UNAVAILABLE_MESSAGE = 'Recurso indisponível nesta demonstração'
export function toastUnavailable(message = UNAVAILABLE_MESSAGE) {
  toast.message(message)
}
type UnavailableActionProps = {
  children: (props: {
    onClick: (event?: MouseEvent) => void
    'aria-disabled'?: boolean
  }) => ReactNode
  message?: string
}
export function UnavailableAction({ children, message }: UnavailableActionProps) {
  return (
    <>
      {children({
        onClick: (event) => {
          event?.preventDefault()
          toastUnavailable(message)
        },
        'aria-disabled': true,
      })}
    </>
  )
}
