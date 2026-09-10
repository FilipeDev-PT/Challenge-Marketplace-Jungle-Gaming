import { FacebookIcon, GoogleIcon } from '@/components/kurio/icons'
import { toastUnavailable } from '@/components/kurio/UnavailableAction'
import { Button } from '@/components/ui/button'
type AuthSocialButtonsProps = {
  buttonClassName: string
}
export function AuthSocialButtons({ buttonClassName }: AuthSocialButtonsProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={buttonClassName}
        onClick={() => toastUnavailable()}
      >
        <GoogleIcon className="size-[18px] shrink-0" />
        Continuar com Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className={buttonClassName}
        onClick={() => toastUnavailable()}
      >
        <FacebookIcon className="size-[18px] shrink-0" />
        Continuar com Facebook
      </Button>
    </>
  )
}
