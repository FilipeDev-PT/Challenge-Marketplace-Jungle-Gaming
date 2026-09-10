import { ensureGuestId } from '@/shared/lib/guest'
export function getOwnerKey(userId: string | null | undefined): string {
  if (userId) return `user:${userId}`
  return `guest:${ensureGuestId()}`
}
export function getStoredToken(): string | null {
  return localStorage.getItem('kurio:token')
}
export function setStoredToken(token: string | null) {
  if (token) localStorage.setItem('kurio:token', token)
  else localStorage.removeItem('kurio:token')
}
export function clearPrivateStorage() {
  localStorage.removeItem('kurio:token')
  sessionStorage.removeItem('kurio:checkout-context')
}
