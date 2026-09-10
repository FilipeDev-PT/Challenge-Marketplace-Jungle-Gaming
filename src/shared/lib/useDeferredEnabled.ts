import { useEffect, useState } from 'react'

export function useDeferredEnabled(delayMs = 0) {
  const [enabled, setEnabled] = useState(delayMs <= 0)

  useEffect(() => {
    if (delayMs <= 0) {
      const id = window.requestAnimationFrame(() => setEnabled(true))
      return () => window.cancelAnimationFrame(id)
    }

    const timer = window.setTimeout(() => setEnabled(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return enabled
}
