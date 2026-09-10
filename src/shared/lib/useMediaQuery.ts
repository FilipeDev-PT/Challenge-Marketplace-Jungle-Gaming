import { useEffect, useState } from 'react'
function readMatches(query: string): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(query).matches
}
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => readMatches(query))
  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return matches
}
