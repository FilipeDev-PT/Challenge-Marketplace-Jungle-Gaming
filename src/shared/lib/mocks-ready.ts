import { MSW_ENABLED } from '@/shared/lib/msw-enabled'

let settle: (() => void) | null = null
export const mocksReady: Promise<void> = MSW_ENABLED
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
