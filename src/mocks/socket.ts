import { ws } from 'msw'
import { toSocketIo } from '@mswjs/socket.io-binding'
import type { SocketEnvelope } from '@/shared/api/contracts'
type IoClient = ReturnType<typeof toSocketIo>['client']
type ClosableClient = {
  close: (code?: number, reason?: string) => void
}
export const realtime = ws.link(/socket\.io/)
const connectedClients = new Set<IoClient>()
const closableConnections = new Set<ClosableClient>()
export const socketHandler = realtime.addEventListener('connection', (connection) => {
  const io = toSocketIo(connection)
  connectedClients.add(io.client)
  closableConnections.add(connection.client)
  connection.client.addEventListener('close', () => {
    connectedClients.delete(io.client)
    closableConnections.delete(connection.client)
  })
})
function broadcast(event: string, payload: SocketEnvelope): void {
  for (const client of connectedClients) {
    client.emit(event, payload)
  }
}
export function emitNftUpdated(envelope: SocketEnvelope): void {
  broadcast('nft.updated', envelope)
}
export function emitOrderUpdated(envelope: SocketEnvelope): void {
  broadcast('order.updated', envelope)
}
export function getConnectedSocketClientCount(): number {
  return connectedClients.size
}
export function disconnectAllSocketClients(): number {
  const count = closableConnections.size
  for (const client of [...closableConnections]) {
    try {
      client.close(1000, 'mock-disconnect')
    } catch {}
  }
  closableConnections.clear()
  connectedClients.clear()
  return count
}
export function emitMockEvent(event: string, payload: SocketEnvelope): void {
  if (event === 'nft.updated') {
    emitNftUpdated(payload)
    return
  }
  if (event === 'order.updated') {
    emitOrderUpdated(payload)
    return
  }
  broadcast(event, payload)
}
