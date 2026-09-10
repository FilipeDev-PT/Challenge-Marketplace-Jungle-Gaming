export function clearLcpBoot(): void {
  window.setTimeout(() => {
    const clear = (
      window as Window & {
        __KURIO_CLEAR_LCP_BOOT__?: () => void
      }
    ).__KURIO_CLEAR_LCP_BOOT__
    clear?.()
  }, 300)
}
