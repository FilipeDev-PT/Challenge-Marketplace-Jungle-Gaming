import { delay, HttpResponse } from 'msw'
export const MOCK_SCENARIOS = [
  'latency',
  'out-of-order',
  'timeout-order',
  'price-changed',
  'payment-refused',
  'session-expired',
  'empty',
  'offline',
  'fail-favorites',
] as const
export type MockScenario = (typeof MOCK_SCENARIOS)[number]
export function getScenario(request: Request): MockScenario | null {
  const raw = request.headers.get('X-Mock-Scenario')?.trim()
  if (!raw) return null
  return (MOCK_SCENARIOS as readonly string[]).includes(raw) ? (raw as MockScenario) : null
}
function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}
export async function applyScenario(
  request: Request,
  options?: {
    skipSessionExpired?: boolean
  },
): Promise<Response | null> {
  const scenario = getScenario(request)
  if (scenario === 'offline') {
    return HttpResponse.error()
  }
  if (scenario === 'session-expired' && !options?.skipSessionExpired) {
    return HttpResponse.json(
      { code: 'unauthorized', message: 'Sessão expirada. Faça login novamente.' },
      { status: 401 },
    )
  }
  if (scenario === 'latency') {
    await delay(randomBetween(800, 2000))
  }
  if (scenario === 'out-of-order') {
    await delay(randomBetween(100, 2200))
  }
  return null
}
export async function applyTimeoutOrderDelay(request: Request): Promise<void> {
  if (getScenario(request) === 'timeout-order') {
    await delay(16500)
  }
}
