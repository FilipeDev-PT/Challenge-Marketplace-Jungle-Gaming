let settle: (() => void) | null = null
const mswEnabled = import.meta.env.VITE_ENABLE_MSW === 'true'
export const mocksReady: Promise<void> = mswEnabled
  ? new Promise<void>((resolve) => {
      settle = resolve
    })
  : Promise.resolve()
export function markMocksReady(): void {
  settle?.()
  settle = null
}
export function whenMocksReady(): Promise<void> {
  return mocksReady
}
