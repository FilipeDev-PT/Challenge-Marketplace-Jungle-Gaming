export function clearLcpBoot(): void {
  const clear = (
    window as Window & {
      __KURIO_CLEAR_LCP_BOOT__?: () => void
    }
  ).__KURIO_CLEAR_LCP_BOOT__
  clear?.()
}
