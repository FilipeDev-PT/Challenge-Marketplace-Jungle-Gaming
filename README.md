# KURIO — Marketplace de NFTs (Desafio Frontend)

SPA React + TypeScript do marketplace **KURIO**, com fidelidade ao Figma GreenMint. **Toda a API e o tempo real rodam no browser via MSW** (REST + Socket.IO mockados). Não é necessário — nem previsto — nenhum serviço externo além do `npm run dev` / `preview`.

## Stack

| Responsabilidade | Tecnologia |
|------------------|------------|
| UI | React 19 |
| Linguagem | TypeScript |
| Build | Vite |
| Rotas | TanStack Router |
| Estado remoto | TanStack Query |
| HTTP | Axios → handlers MSW |
| Tempo real | socket.io-client → MSW WebSocket |
| Estilo | Tailwind CSS v4 |
| Componentes | shadcn/ui (Radix) adaptado |
| Dados / mocks | MSW + `@mswjs/socket.io-binding` + `localStorage` |
| E2E | Playwright |
| Auditoria | Lighthouse |
| Lint | Oxlint |

## Setup

Requisitos: Node.js 20+ e npm.

```bash
npm install
cp .env.example .env   # se ainda não existir
npx playwright install chromium
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173). O MSW sobe automaticamente (`VITE_ENABLE_MSW=true`) e atende `/api` + `/socket.io` com o banco seed em `localStorage` (`kurio:mock-db:v8`).

## Deploy (Vercel)

SPA estático: a API REST e o Socket.IO continuam no browser via MSW (igual ao localhost). Não há backend na Vercel.

1. Envie este repositório para o GitHub.
2. Na [Vercel](https://vercel.com): **Add New → Project** e importe o repo.
3. O `vercel.json` já define Framework (Vite), build (`npm run build`), pasta `dist` e Node 22.
4. As variáveis `VITE_*` já estão em `.env.production` e no `vercel.json` — **não precisa** cadastrá-las no dashboard.
5. Deploy. Cada push em `main` republica.

O rewrite em `vercel.json` devolve `index.html` para rotas sem extensão (`/nfts/:id`, `/cart`, `/checkout`, `/login`, `/account/profile`, …). Assim F5, URL colada e voltar/avançar do browser funcionam. O Service Worker do MSW (`/mockServiceWorker.js`) é servido como arquivo real, com `Service-Worker-Allowed: /`, para o mock de `/api` e `/socket.io` (refresh em tempo real) subir no domínio HTTPS da Vercel.

## Variáveis de ambiente

Arquivo `.env` local e `.env.production` no Git (ver `.env.example`). Todas apontam para o mock no browser — não há URL de API externa.

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `VITE_ENABLE_MSW` | `true` | Obrigatório para a demo: ativa MSW (REST + WebSocket) |
| `VITE_API_BASE_URL` | `/api` | Prefixo das requests Axios interceptadas pelo MSW |
| `VITE_WS_URL` | `/` | Origem do `socket.io-client` (path `/socket.io`, também mockado) |

Mantenha `VITE_ENABLE_MSW=true` em desenvolvimento, preview, E2E, Lighthouse e no build da Vercel. Sem isso o deploy sobe a UI sem dados.

## Credenciais fictícias (seed MSW)

| Papel | E-mail | Senha |
|-------|--------|-------|
| Colecionador | `collector@kurio.test` | `Kurio123!` |
| Alice | `alice@kurio.test` | `Alice123!` |

- Cupom válido: `WELCOME10`
- Cadastro cria usuário novo com e-mail único (ex.: `seu+teste@kurio.test`)
- Senhas no mock só como hash (`hash:…`); sessão em `localStorage` (`kurio:token`)

## Seleção e reset dos cenários MSW

### Ativar cenário

No DevTools (Console):

```js
sessionStorage.setItem('kurio:scenario', 'payment-refused')
location.reload()
```

O Axios envia o valor no header `X-Mock-Scenario` em toda request (lido pelos handlers MSW).

### Limpar cenário

```js
sessionStorage.removeItem('kurio:scenario')
location.reload()
```

### Reset do banco mock

```js
await fetch('/api/__mocks/reset', { method: 'POST' })
localStorage.removeItem('kurio:token')
sessionStorage.clear()
location.reload()
```

Chaves úteis: `kurio:mock-db:v8`, `kurio:guestId`, `kurio:token`, `kurio:scenario`, `kurio:pending-order`.

| Cenário | Efeito |
|---------|--------|
| `latency` | Atraso 800–2000 ms |
| `out-of-order` | Atraso aleatório (corrida de busca) |
| `timeout-order` | Pedido já gravado no mock DB; resposta HTTP atrasa > timeout Axios (15 s) |
| `price-changed` | Cotação `stale` / warnings de preço |
| `payment-refused` | Pedido recusado |
| `session-expired` | Requests autenticadas → 401 |
| `empty` | Catálogo sem itens |
| `offline` | Falha de rede simulada (`HttpResponse.error`) |
| `fail-favorites` | Mutation de favoritos falha (rollback otimista) |

## Reproduzir fluxos de falha (manual)

Com `npm run dev` e login `collector@kurio.test` / `Kurio123!` quando necessário:

1. **Pagamento recusado** — cenário `payment-refused`, checkout → Confirmar → recusa; carrinho preservado.
2. **Cotação desatualizada** — `price-changed` → checkout → **Revalidar cotação**; confirmar desabilitado até limpar/revalidar.
3. **Timeout + idempotência** — `timeout-order` → confirmar → UI trata timeout; pedido já existe no mock DB (recibo/reconciliação).
4. **Sessão expirada** — logado + `session-expired` + reload → token limpo, vai para login.
5. **Offline + retry** — `offline` na home → erro → limpar cenário → **Tentar novamente**.
6. **Favoritos** — `fail-favorites` no detalhe → falha + rollback; limpar cenário e favoritar de novo.
7. **Empty / latency / out-of-order** — ativar na home e observar catálogo / busca.

Emit Socket.IO via mock (opcional):

```js
await fetch('/api/__mocks/emit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'nft.updated',
    payload: {
      id: 'manual-1',
      resourceId: 'nft-02',
      version: 99,
      payload: { priceEth: '9.99' },
    },
  }),
})
```

## Comandos

```bash
npm run dev              # app + MSW (único modo de dados da entrega)
npm run build            # typecheck (tsc -b) + bundle Vite
npm run preview          # serve o dist (E2E / Lighthouse)
npm run typecheck        # verificação de tipos TypeScript
npm run lint             # Oxlint
npm run test:e2e         # build + Playwright (desktop 1440 + mobile 390)
npm run test:e2e:ui      # Playwright UI
npm run lighthouse       # build + 3× home/detail × mobile/desktop → mediana
```

Relatório E2E: `playwright-report/`. Relatório Lighthouse: `audits/lighthouse/REPORT.md`.

## Documentação

| Doc | Conteúdo |
|-----|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Contratos mock, sessão, carrinho, cache, REST↔Socket, UX, Figma |
| [docs/api-contracts.md](docs/api-contracts.md) | Tabela REST (handlers MSW) |
| [docs/cache-policy.md](docs/cache-policy.md) | Política TanStack Query |
| [docs/realtime.md](docs/realtime.md) | Envelope e transporte Socket.IO mock |
| [docs/test-map.md](docs/test-map.md) | Matriz E2E §9 + Lighthouse §10 |
| [docs/assets-a11y.md](docs/assets-a11y.md) | Assets e a11y |
| [audits/lighthouse/REPORT.md](audits/lighthouse/REPORT.md) | Medianas Perf/A11y/BP/SEO |

## Escopo fora da entrega

Blockchain, extensões de carteira de terceiros e páginas editoriais (Blog / Criadores / Aprenda) existem só como UI; ações não implementadas mostram toast “indisponível”. Toda a lógica de domínio da entrega está nos mocks MSW.
