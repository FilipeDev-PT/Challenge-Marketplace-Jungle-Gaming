# Mapa de testes E2E — KURIO

Suite Playwright em [`e2e/`](../e2e/), fixtures em [`e2e/support/`](../e2e/support/).  
Auditoria Lighthouse em [`audits/lighthouse/`](../audits/lighthouse/).

Comandos:

```bash
npm run test:e2e      # build + Chromium desktop 1440 + mobile 390
npm run test:e2e:ui
npm run lighthouse    # 3 runs × home/detail × mobile/desktop → mediana
```

Isolamento: cada teste chama `POST /api/__mocks/reset` e limpa token/sessionStorage via fixture.  
REST passa pelos handlers MSW; tempo real via `socket.io-client` + `POST /api/__mocks/emit`.  
Relatório HTML: `playwright-report/`; traces: `retain-on-failure`.

---

## §9 Playwright — matriz

| # | Requisito | Status | Spec / teste | Cenário / emit | Viewport |
|---|-----------|--------|--------------|----------------|----------|
| 1 | Busca, filtros combinados, ordenação, paginação, histórico | Coberto | `catalog.spec.ts` — busca sincroniza com URL; filtros combinados, ordenação, paginação e histórico; deep link | — | desktop + mobile |
| 2 | Acesso direto ao detalhe + NFT inexistente | Coberto | `nft-detail.spec.ts` — acesso direto; id desconhecido 404 | — | desktop + mobile |
| 3 | Cadastro, login, sessão expirada, logout, troca de usuário | Coberto | `auth.spec.ts` — cadastro; login/logout; troca de usuário; **sessão expirada** | `session-expired` | desktop + mobile |
| 4 | Favoritos + falha de mutation + recuperação | Coberto | `favorites.spec.ts` — sucesso; rollback com `fail-favorites` + retry após limpar cenário | `fail-favorites` | desktop + mobile |
| 5 | Carrinho: qty, remoção, cupom, persistência refresh/login | Coberto | `cart.spec.ts` — qty/remove/cupom; reload; convidado→login | `WELCOME10` | desktop + mobile |
| 6 | Compra completa até recibo confirmado | Coberto | `checkout.spec.ts` — compra completa até confirmação | — | desktop + mobile |
| 7 | Falha de pagamento, clique repetido, timeout + idempotência | Coberto | `checkout.spec.ts` — pagamento recusado; duplo clique (1 pedido); timeout-order | `payment-refused`, `timeout-order` | desktop + mobile |
| 8 | Perfil, avatar, senha, carteiras + validação | Coberto | `account.spec.ts` — edita perfil; avatar; senha OK + erro; carteira + validação | — | desktop + mobile |
| 9 | Preço/disponibilidade via Socket.IO no checkout | Coberto | `realtime.spec.ts` — preço ao vivo no cart/checkout; disponibilidade zera e impede confirmação | `nft.updated` via `__mocks/emit` | desktop + mobile |
| 10 | Eventos duplicados/antigos, disconnect, pedido pendente | Coberto | `realtime.spec.ts` — versão antiga ignorada; **disconnect (WS bloqueado) + reconcile REST**; retoma pedido pendente após reload | `order.updated` / `__mocks/disconnect-sockets` | desktop + mobile |
| 11 | Teclado, foco de diálogos, validação de formulários | Coberto | `a11y-ui.spec.ts` — teclado login; validação login/cadastro; foco sheet filtros | — | desktop + mobile |
| 12 | Skeletons, falha, retry | Coberto | `loading.spec.ts` — latency + skeleton; offline + retry | `latency`, `offline` | desktop + mobile |
| 13 | Fluxos principais Chromium desktop + mobile | Coberto | `playwright.config.ts` projects `desktop` / `mobile` | — | 1440×900, 390×844 |
| 14 | Regressão visual início, detalhe, carrinho, pagamento | Coberto | `visual.spec.ts` — home, detalhe, carrinho, checkout | seed estável | desktop (baseline versionada) |
| 15 | Estado isolado; latência/eventos controlados | Coberto | `support/fixtures.ts` reset; cenários MSW; `__mocks/emit` | todos acima | — |
| 16 | Relatório HTML + traces de falha | Coberto | `playwright.config.ts` | — | — |
| 17 | Realtime via Socket.IO client; REST via MSW | Coberto | asserts sem reload em `realtime.spec.ts`; handlers em `src/mocks` | — | — |

### Cenários MSW extras

| Cenário | Spec |
|---------|------|
| `empty` | `catalog.spec.ts` — catálogo vazio |
| `out-of-order` | `catalog.spec.ts` — última busca vence |
| `price-changed` | `checkout.spec.ts` — cotação exige revalidação |

---

## §10 Lighthouse

| Item | Status | Onde |
|------|--------|------|
| Home + detalhe NFT | Coberto | `audits/lighthouse/run.mjs` |
| Mobile + desktop | Coberto | perfis no runner |
| 3 medições → mediana | Coberto | `aggregate.mjs` |
| LCP, CLS, TBT | Coberto | `REPORT.md` |
| HTML/JSON versionados (config) | Coberto | `config.json` + `reports/` (artefatos gerados) |
| Justificativa &lt; metas | Coberto | notas em `REPORT.md` |

Metas do enunciado (Perf ≥90, A11y ≥95, BP ≥95, SEO ≥90): atingidas — ver medianas em `REPORT.md`.

---

## Estrutura de pastas

```
e2e/
  support/
    fixtures.ts
    helpers.ts
    avatar.png
  *.spec.ts
  visual.spec.ts-snapshots/
audits/lighthouse/
docs/test-map.md
```
