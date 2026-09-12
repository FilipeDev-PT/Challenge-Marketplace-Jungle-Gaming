# Tempo real — Socket.IO + MSW

## Transporte

- Cliente: `socket.io-client` na origem da app (`VITE_WS_URL`, path `/socket.io`).
- Mock: MSW `ws.link(/socket\.io/)` + `@mswjs/socket.io-binding` (`toSocketIo`).
- Eventos: `nft.updated`, `order.updated`.
- Persistência e fan-out ficam no mock DB (`localStorage`) + clientes MSW conectados — tudo no browser.

Envelope:

```ts
{
  id: string           // id estável do evento
  resourceId: string   // nftId | orderId
  version: number      // monotônico por recurso
  payload: object
  userId?: string | null
}
```

## Comportamento do cliente

1. Ignora `version` antiga ou duplicada.
2. Filtra `userId` de outra sessão.
3. Atualiza cache TanStack Query; toasts acessíveis (`aria-live` via Sonner).
4. No `connect`/reconnect autenticado, invalida `cart` e `order` e reconcilia via REST.
5. Cleanup: `socket.off` + `disconnect` no unmount / logout.

## Limitações do mock

- O binding não cobre 100% da API Socket.IO (rooms, acks complexos, binary).
- Em alguns ambientes Engine.IO pode negociar `polling` antes de `websocket`; ambos são aceitos.
- Disparo determinístico em E2E via `POST /api/__mocks/emit` (atualiza o mock DB e notifica clientes MSW conectados).
- Forçar queda em E2E: `POST /api/__mocks/disconnect-sockets` e/ou fechar WebSockets no Playwright; após reload/reconnect o cliente reconcilia cart/order via REST mock.
- Em MSW, `window.__KURIO_SOCKET__` fica disponível para inspeção nos testes.
