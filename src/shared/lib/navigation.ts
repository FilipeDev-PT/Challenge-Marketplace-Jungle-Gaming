export function resolveSafeRedirect(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/'
  }
  if (raw.includes('://')) return '/'
  return raw
}

export function authFromForPath(pathname: string): string {
  const safe = resolveSafeRedirect(pathname)
  if (safe.startsWith('/checkout')) return '/cart'
  if (safe.startsWith('/account')) return '/'
  if (safe.startsWith('/orders')) return '/'
  return safe
}

export function resolveAuthCloseHref(from: unknown, redirect: unknown): string {
  const candidate = resolveSafeRedirect(
    typeof from === 'string' && from.length > 0 ? from : redirect,
  )
  return authFromForPath(candidate)
}

type HrefNavigate = (opts: {
  href: string
  replace?: boolean
}) => Promise<unknown> | unknown

export async function navigateByHref(
  navigate: HrefNavigate,
  href: string,
  options?: { replace?: boolean },
) {
  await navigate({ href: resolveSafeRedirect(href), replace: options?.replace })
}
