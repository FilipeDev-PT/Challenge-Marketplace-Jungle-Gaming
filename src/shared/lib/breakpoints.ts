import { useMediaQuery } from '@/shared/lib/useMediaQuery'
export const MD_QUERY = '(min-width: 768px)'
export function useIsDesktop(): boolean {
  return useMediaQuery(MD_QUERY)
}
