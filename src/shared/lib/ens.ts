export function splitEns(ens?: string | null): {
  name: string
  tld: string
} {
  if (!ens) return { name: '', tld: '.eth' }
  if (ens.endsWith('.xyz')) return { name: ens.slice(0, -4), tld: '.xyz' }
  if (ens.endsWith('.eth')) return { name: ens.slice(0, -4), tld: '.eth' }
  return { name: ens, tld: '.eth' }
}
