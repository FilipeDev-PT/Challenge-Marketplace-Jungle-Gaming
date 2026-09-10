export function parseAuthSearch(search: Record<string, unknown>): {
  redirect?: string
  from?: string
} {
  return {
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    from: typeof search.from === 'string' ? search.from : undefined,
  }
}
