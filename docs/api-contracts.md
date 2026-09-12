# Contratos REST (MSW)

Base URL: `/api` (path relativo; **sempre** interceptado pelo MSW nesta entrega).  
Autenticação: `Authorization: Bearer <token>`. Visitantes: header `X-Guest-Id`.

## Sessão e conta

| Método | Path | Notas |
|--------|------|-------|
| POST | `/auth/register` | body: name, email, password → Session; 409 conflito |
| POST | `/auth/login` | email, password → Session |
| GET | `/auth/session` | Session atual ou 401 |
| POST | `/auth/logout` | invalida token |

Senhas armazenadas apenas como hash (`hash:…`), nunca em claro.

## NFTs

| Método | Path | Query |
|--------|------|-------|
| GET | `/nfts` | `q`, `collections`, `network`, `priceMin`, `priceMax`, `sort`, `tab`, `page`, `pageSize` |
| GET | `/nfts/:id` | detalhe; 404 se inexistente |

## Favoritos (auth)

| Método | Path |
|--------|------|
| GET | `/favorites` → `{ ids: string[] }` |
| POST | `/favorites` `{ nftId }` |
| DELETE | `/favorites/:nftId` |

## Carrinho (auth ou guest)

| Método | Path |
|--------|------|
| GET | `/cart` |
| POST | `/cart/items` `{ nftId, editionId, quantity }` |
| PATCH | `/cart/items/:id` `{ quantity }` |
| DELETE | `/cart/items/:id` |

## Cotação

| Método | Path |
|--------|------|
| POST | `/quotes` `{ couponCode? }` | subtotal, discount, networkFee, total (ETH strings), warnings |

## Pedidos (auth)

| Método | Path | Headers |
|--------|------|---------|
| POST | `/orders` | `Idempotency-Key` obrigatória |
| GET | `/orders/:id` | recibo/snapshot |

Body: `{ quoteId, walletId, network, collector: { name, email, phone? } }`.

Idempotência: mesma key + mesmo body → mesmo pedido; mesma key + body diferente → `409 conflict`.

Status: `pending` → `confirmed` | `refused` (via Socket.IO).

## Perfil / Carteiras (auth)

| Método | Path |
|--------|------|
| GET/PATCH | `/profile` |
| POST | `/profile/password` `{ currentPassword, newPassword }` |
| GET/POST | `/wallets` |
| PATCH | `/wallets/:id` |

## Erros

```json
{ "code": "validation|unauthorized|forbidden|not_found|conflict|gone|transient", "message": "...", "fields": { } }
```

## Meta (testes)

| Método | Path |
|--------|------|
| POST | `/__mocks/reset` |
| POST | `/__mocks/emit` `{ event, payload }` |
| POST | `/__mocks/disconnect-sockets` |
| GET | `/__mocks/health` |
