import { z } from 'zod'
export const ethStringSchema = z.string().regex(/^-?\d+(\.\d+)?$/, 'Invalid ETH amount')
export const apiErrorSchema = z.object({
  code: z.enum([
    'validation',
    'unauthorized',
    'forbidden',
    'not_found',
    'conflict',
    'gone',
    'transient',
  ]),
  message: z.string(),
  fields: z.record(z.string(), z.string()).optional(),
})
export type ApiErrorBody = z.infer<typeof apiErrorSchema>
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string().optional(),
  ens: z.string().optional(),
  phone: z.string().optional(),
  walletNickname: z.string().optional(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
})
export type User = z.infer<typeof userSchema>
export const sessionSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  user: userSchema,
})
export type Session = z.infer<typeof sessionSchema>
export const nftEditionSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.number().int().nonnegative(),
  maxPerOrder: z.number().int().positive(),
})
export const nftReviewSchema = z.object({
  id: z.string(),
  author: z.string(),
  rating: z.number().int().min(1).max(5),
  body: z.string(),
  createdAt: z.string(),
})
export type NftReview = z.infer<typeof nftReviewSchema>
export const nftSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  summary: z.string().optional(),
  priceEth: ethStringSchema,
  compareAtEth: ethStringSchema.nullable().optional(),
  imageUrl: z.string(),
  gallery: z.array(z.string()),
  collection: z.string(),
  collectionLabel: z.string().optional(),
  network: z.enum(['ethereum', 'polygon', 'solana']),
  creator: z.string(),
  tokenId: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean(),
  isNew: z.boolean(),
  trending: z.boolean(),
  version: z.number().int(),
  editions: z.array(nftEditionSchema),
  reviews: z.array(nftReviewSchema).default([]),
  listedAt: z.string(),
})
export type Nft = z.infer<typeof nftSchema>
export const nftListResponseSchema = z.object({
  items: z.array(nftSchema),
  page: z.number().int(),
  pageSize: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
})
export type NftListResponse = z.infer<typeof nftListResponseSchema>
export const cartItemSchema = z.object({
  id: z.string(),
  nftId: z.string(),
  editionId: z.string(),
  quantity: z.number().int().positive(),
  unitPriceEth: ethStringSchema,
  name: z.string(),
  imageUrl: z.string(),
  network: z.string(),
  tokenId: z.string().optional(),
  editionLabel: z.string().optional(),
  available: z.number().int(),
  version: z.number().int(),
})
export type CartItem = z.infer<typeof cartItemSchema>
export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  couponCode: z.string().nullable(),
  updatedAt: z.string(),
})
export type Cart = z.infer<typeof cartSchema>
export const quoteSchema = z.object({
  subtotalEth: ethStringSchema,
  discountEth: ethStringSchema,
  networkFeeEth: ethStringSchema,
  totalEth: ethStringSchema,
  couponCode: z.string().nullable(),
  couponValid: z.boolean(),
  stale: z.boolean().optional(),
  warnings: z.array(z.string()).default([]),
  items: z.array(
    z.object({
      cartItemId: z.string(),
      nftId: z.string(),
      editionId: z.string(),
      quantity: z.number().int(),
      unitPriceEth: ethStringSchema,
      lineTotalEth: ethStringSchema,
      available: z.number().int(),
      priceChanged: z.boolean().optional(),
      availabilityChanged: z.boolean().optional(),
    }),
  ),
  quotedAt: z.string(),
  quoteId: z.string(),
})
export type Quote = z.infer<typeof quoteSchema>
export const walletSchema = z.object({
  id: z.string(),
  label: z.string(),
  address: z.string(),
  provider: z.enum(['metamask', 'coinbase', 'walletconnect', 'phantom']),
  network: z.enum(['ethereum', 'polygon', 'solana']),
  isPrimary: z.boolean(),
})
export type Wallet = z.infer<typeof walletSchema>
export const orderItemSchema = z.object({
  nftId: z.string(),
  name: z.string(),
  tokenId: z.string(),
  imageUrl: z.string(),
  editionId: z.string(),
  quantity: z.number().int(),
  unitPriceEth: ethStringSchema,
  lineTotalEth: ethStringSchema,
})
export const orderSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'confirmed', 'refused']),
  transactionId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().int(),
  walletLabel: z.string(),
  network: z.string(),
  explorerUrl: z.string().nullable(),
  items: z.array(orderItemSchema),
  subtotalEth: ethStringSchema,
  discountEth: ethStringSchema,
  networkFeeEth: ethStringSchema,
  totalEth: ethStringSchema,
  couponCode: z.string().nullable(),
  idempotencyKey: z.string(),
})
export type Order = z.infer<typeof orderSchema>
export const favoriteIdsSchema = z.object({
  ids: z.array(z.string()),
})
export const socketEnvelopeSchema = z.object({
  id: z.string(),
  resourceId: z.string(),
  version: z.number().int(),
  payload: z.record(z.string(), z.unknown()),
  userId: z.string().nullable().optional(),
})
export type SocketEnvelope = z.infer<typeof socketEnvelopeSchema>
