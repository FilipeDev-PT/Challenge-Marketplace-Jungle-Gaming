# Política de cache (TanStack Query)

## Defaults

| Opção | Valor | Motivo |
|-------|-------|--------|
| `staleTime` | 30s (queries) | Catálogo estável o bastante para navegação |
| Carrinho / quote | efetivamente fresco (`invalidate` após mutations) | Totais e estoque sensíveis |
| `retry` | até 2, só rede/5xx | Não mascara 4xx de validação |
| `refetchOnReconnect` | true | Reconciliação após queda de rede |
| `refetchOnWindowFocus` | false | Evita flicker em demo |

## Query keys

Isoladas por parâmetros de consulta e por usuário (`favorites`, `profile`, `wallets`) ou `ownerKey` (`user:` / `guest:`) no carrinho.

## Invalidação

- Mutations de carrinho → `cart` + `quote`
- Favoritos → `favorites` (optimistic + rollback)
- Pedido confirmado → `cart` + `order`
- `nft.updated` (socket) → patch do detalhe + invalidate listagem + refetch cart
- Logout / troca de usuário → `queryClient.clear()`

## Optimistic

Favoritar/desfavoritar atualiza a lista localmente; em erro, restaura snapshot anterior.

## Cancelamento / respostas obsoletas

Queries usam `signal` do AbortController do Query. Eventos Socket.IO com `version` menor ou igual à conhecida são ignorados.
