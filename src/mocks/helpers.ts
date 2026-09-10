import { HttpResponse } from 'msw'
import type { ApiErrorBody } from '@/shared/api/contracts'
export function hashPassword(password: string): string {
  return `hash:${password}`
}
export function verifyPassword(password: string, passwordHash: string): boolean {
  return passwordHash === hashPassword(password)
}
export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
export function nowIso(): string {
  return new Date().toISOString()
}
export function hashBody(value: unknown): string {
  const json = stableStringify(value)
  let hash = 0
  for (let i = 0; i < json.length; i += 1) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0
  }
  return `${json.length.toString(16)}:${hash.toString(16)}`
}
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b),
  )
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`
}
export function jsonError(
  code: ApiErrorBody['code'],
  message: string,
  status: number,
  fields?: Record<string, string>,
) {
  const body: ApiErrorBody = fields ? { code, message, fields } : { code, message }
  return HttpResponse.json(body, { status })
}
export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  const token = header.slice('Bearer '.length).trim()
  return token || null
}
export function parseListParam(value: string | null): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}
