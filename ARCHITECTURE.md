# ARCHITECTURE.md — KURIO

Arquitetura da SPA do desafio: **API REST e tempo real 100% mockados no browser** (MSW + `localStorage`). A entrega não usa nem documenta integração com API externa.

## Visão geral

```
Browser
├── React (Vite) + TanStack Router / Query + Axios
├── socket.io-client → path /socket.io
└── MSW service worker
    ├── REST /api/*          (handlers)
    ├── WS Engine.IO         (@mswjs/socket.io-binding)
    └── localStorage         kurio:mock-db:v8 (seed + estado)
```

Entrada deferida no build (após LCP estático) para Perf; MSW habilita ~500 ms após o paint (`src/main.tsx`). Em `dev`, o entry Vite carrega normalmente. Em ambos os modos os dados vêm do MSW.

---

## Contratos REST

Base: `VITE_API_BASE_URL` (padrão `/api`, path relativo atendido pelo MSW).  
Auth: `Authorization: Bearer <token>`.  
Convidado: `X-Guest-Id` (UUID em `localStorage.kurio:guestId`).  
Cenário: `X-Mock-Scenario` (espelha `sessionStorage.kurio:scenario`).

Resumo (detalhe em [docs/api-contracts.md](docs/api-contracts.md)):

| Área | Endpoints principais |
|------|----------------------|
| Auth | `POST /auth/register`, `/login`, `GET /auth/session`, `POST /auth/logout` |
| Catálogo | `GET /nfts`, `GET /nfts/:id` |
| Favoritos | `GET/POST /favorites`, `DELETE /favorites/:nftId` |
| Carrinho | `GET /cart`, `POST/PATCH/DELETE /cart/items…` |
| Cotação | `POST /quotes` |
| Pedidos | `POST /orders` (`Idempotency-Key`), `GET /orders/:id` |
| Conta | `GET/PATCH /profile`, `POST /profile/password`, wallets CRUD |
| Meta E2E | `POST /__mocks/reset`, `/emit`, `/disconnect-sockets`, `GET /__mocks/health` |

Erros JSON: `{ code, message, fields? }` com codes `validation | unauthorized | forbidden | not_found | conflict | gone | transient`.

Valores monetários em **strings ETH** (precisão via `decimal.js` no mock).

---

## Eventos Socket.IO

Transporte e limitações: [docs/realtime.md](docs/realtime.md).

| Evento | Uso |
|--------|-----|
| `nft.updated` | Preço / edições / disponibilidade |
| `order.updated` | Status `pending` → `confirmed` \| `refused` |

Envelope:

```ts
{
  id: string
  resourceId: string   // nftId | orderId
  version: number      // monotônico por recurso
  payload: object
  userId?: string | null
}
```

Cliente (`SocketProvider`):

1. Ignora `version` antiga/duplicada.
2. Ignora `userId` de outra sessão.
3. Faz patch no cache Query + toast Sonner.
4. Em `connect` (incl. reconnect) autenticado: invalida `cart` e `order` e reconcilia via REST.
5. Pedido pendente em `sessionStorage.kurio:pending-order` é reconciliado no mount autenticado.

Disparo E2E: `POST /api/__mocks/emit`. Em MSW, `window.__KURIO_SOCKET__` fica exposto para inspeção.

---

## Política de sessão

| Item | Comportamento |
|------|----------------|
| Token | `localStorage.kurio:token` após login/registro |
| Validação | `GET /auth/session`; query TanStack habilitada se há token |
| Expiração | Mock com `expiresAt`; cenário `session-expired` força 401 |
| Logout | `POST /auth/logout` + limpa token + `queryClient.clear()` |
| Troca de usuário | Logout → login; cache limpo; carrinho guest mergeia no login |
| Rotas privadas | Soft gate no router (`/account/*`, `/checkout`) → `/login` se sem sessão |

Senhas seed só como hash no mock DB. Não há refresh token.

---

## Estado do carrinho

| Aspecto | Detalhe |
|---------|---------|
| Dono | `ownerKey` = `user:<id>` ou `guest:<guestId>` |
| Persistência | Dentro de `kurio:mock-db:v8` (MSW), não um slice Redux |
| UI | Queries `cart` + `quotes`; mutations invalidam ambos |
| Convidado → login | `mergeCartsOnLogin(guestId, userId)` no mock |
| Cupom | Aplicado na cotação (`WELCOME10`); total recalculado no mock DB |
| Checkout | Exige auth + carteira selecionada na UI + cotação válida |
| Pós-compra | Itens comprados removidos do carrinho; recibo em `/orders/:id` |

Realtime: `nft.updated` refetcha o carrinho para refletir preço/estoque.

---

## Estratégia de cache (TanStack Query)

Ver [docs/cache-policy.md](docs/cache-policy.md).

| Default | Valor |
|---------|--------|
| `staleTime` | 30 s (catálogo/CMS) |
| Carrinho / quote | Invalidação agressiva pós-mutation |
| `retry` | até 2 (só rede/5xx) |
| `refetchOnReconnect` | true |
| `refetchOnWindowFocus` | false |

Favoritos: update otimista + rollback em erro (`fail-favorites`).  
Queries usam `AbortSignal` do Query para cancelar respostas obsoletas.

---

## Reconciliação REST ↔ Socket.IO

```
Socket event (versão válida)
  → patch cache local (detalhe NFT / order)
  → invalidate listagens / refetch cart
  → toast

Queda / reconnect (connect)
  → invalidate cart + order
  → REST volta a ser fonte da verdade

Pedido pendente
  → sessionStorage kurio:pending-order
  → GET /orders/:id após auth / reload
  → limpa chave se status ≠ pending

Emit offline (sem cliente ouvindo)
  → mock DB atualiza na mesma
  → UI só converge no próximo REST (reload / reconnect / refetch)
```

Idempotência de pedidos: mesma `Idempotency-Key` + mesmo body → mesmo pedido; body diferente → `409 conflict`. Cenário `timeout-order`: pedido já criado no DB enquanto a HTTP atrasa além do timeout do Axios (15 s).

---

## Limitações

- Tempo real via MSW + `@mswjs/socket.io-binding` (sem rooms/acks/binary completos).
- Handshake Engine.IO pode oscilar entre `websocket` e `polling`.
- Boot de produção defere o bundle ~2 s após LCP (plugin Vite); E2E espera `/api/__mocks/health` JSON antes do reset.
- Carteiras/OAuth/blog/criadores: apenas UI (toast “indisponível”).
- Baselines visuais Playwright só no projeto desktop.

---

## Decisões de UX

- Toasts Sonner para mutations e realtime (`aria-live`).
- Links editoriais / social login → toast “indisponível” (não fingem sucesso).
- Auth desktop = modal; mobile = tela cheia (`MobileAuthShell`).
- Home mobile: busca + sheet de filtros; sort do catálogo só no desktop (deep-link `?sort=` no mobile).
- Carrinho mobile: remoção via stepper (ícone lixeira no mínimo).
- Checkout mobile: revalidação de cotação + avisos no rodapé fixo.
- Skeletons + empty/error/retry em catálogo e cotação.
- `prefers-reduced-motion` respeitado nos shimmers.

---

## Desvios / adaptações do Figma

- Frames mobile 414 → layout fluido em 390 (viewport E2E / Lighthouse).
- NFTs e hero em **WebP** (exports Figma comprimidos) por LCP/transfer; JPEG de origem mantido onde aplicável.
- Wordmark tipográfico `KURIO` (sem logo SVG externo).
- Ícones inline (`src/components/kurio/icons.tsx`), sem Lucide.
- Tipografia: Roboto Mono self-hosted (`@fontsource`).
- Foco visível e alvos de toque ajustados para a11y onde o frame era só visual.
- Conteúdo editorial (blog/promo em desktop) oculto ou reduzido no mobile conforme hierarquia do produto, não pixel-perfect de todos os frames secundários.
- Performance: imagem LCP estática em `index.html` + defer do entry; MSW permanece ativo após o boot (não removido para “gaming” de score).

---

## Estrutura relevante

```
src/
  app/           providers, router
  features/      catalog, cart, checkout, auth, account, nft-detail…
  mocks/         handlers, db, scenarios, socket
  shared/        api, lib, ui tokens
e2e/             Playwright + fixtures
audits/lighthouse/
docs/            contratos, cache, realtime, test-map
```
