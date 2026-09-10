import type { Cart, CartItem, Nft, Order, Session, User, Wallet } from '@/shared/api/contracts'
import {
  createSeedSnapshot,
  type IdempotencyRecord,
  type MockDbSnapshot,
  type StoredQuote,
  type StoredSession,
  type StoredUser,
} from '@/mocks/fixtures/seed'
import { createId, getBearerToken, nowIso } from '@/mocks/helpers'
import { emitNftUpdated, emitOrderUpdated } from '@/mocks/socket'
const STORAGE_KEY = 'kurio:mock-db:v8'
function clone<T>(value: T): T {
  return structuredClone(value)
}
function publicUser(user: StoredUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    ens: user.ens,
    phone: user.phone,
    walletNickname: user.walletNickname,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  }
}
export class MockDb {
  private data: MockDbSnapshot
  constructor() {
    this.data = this.loadFromStorage() ?? createSeedSnapshot()
    this.save()
  }
  reset(): void {
    this.data = createSeedSnapshot()
    this.save()
  }
  private loadFromStorage(): MockDbSnapshot | null {
    try {
      if (typeof localStorage === 'undefined') return null
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as MockDbSnapshot
    } catch {
      return null
    }
  }
  save(): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
  }
  nextEventId(): string {
    this.data.eventSeq += 1
    this.save()
    return `evt-${this.data.eventSeq}`
  }
  getUsers(): StoredUser[] {
    return this.data.users
  }
  findUserByEmail(email: string): StoredUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }
  findUserById(id: string): StoredUser | undefined {
    return this.data.users.find((u) => u.id === id)
  }
  addUser(user: StoredUser): User {
    this.data.users.push(user)
    this.data.favorites[user.id] = []
    this.data.wallets[user.id] = []
    this.data.carts[`user:${user.id}`] = {
      items: [],
      couponCode: null,
      updatedAt: nowIso(),
    }
    this.save()
    return publicUser(user)
  }
  updateUser(userId: string, patch: Partial<Omit<StoredUser, 'id' | 'createdAt'>>): User {
    const user = this.findUserById(userId)
    if (!user) throw new Error('User not found')
    Object.assign(user, patch)
    this.save()
    return publicUser(user)
  }
  createSession(userId: string, ttlMs = 7 * 24 * 60 * 60 * 1000): Session {
    const user = this.findUserById(userId)
    if (!user) throw new Error('User not found')
    const token = createId('tok')
    const expiresAt = new Date(Date.now() + ttlMs).toISOString()
    const session: StoredSession = { token, userId, expiresAt }
    this.data.sessions.push(session)
    this.save()
    return { token, expiresAt, user: publicUser(user) }
  }
  revokeSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token)
    this.save()
  }
  getSession(request: Request): Session | null {
    const token = getBearerToken(request)
    if (!token) return null
    const stored = this.data.sessions.find((s) => s.token === token)
    if (!stored) return null
    if (Date.parse(stored.expiresAt) <= Date.now()) {
      this.revokeSession(token)
      return null
    }
    const user = this.findUserById(stored.userId)
    if (!user) return null
    return { token: stored.token, expiresAt: stored.expiresAt, user: publicUser(user) }
  }
  requireSession(request: Request): Session | null {
    return this.getSession(request)
  }
  getOwnerKey(request: Request): string {
    const session = this.getSession(request)
    if (session) return `user:${session.user.id}`
    const guestId = request.headers.get('X-Guest-Id')?.trim()
    return `guest:${guestId || 'anonymous'}`
  }
  mergeCartsOnLogin(guestId: string | null, userId: string): void {
    if (!guestId) return
    const guestKey = `guest:${guestId}`
    const userKey = `user:${userId}`
    const guestCart = this.data.carts[guestKey]
    if (!guestCart?.items.length) return
    const userCart = this.ensureCart(userKey)
    for (const incoming of guestCart.items) {
      const existing = userCart.items.find(
        (item) => item.nftId === incoming.nftId && item.editionId === incoming.editionId,
      )
      if (existing) {
        const nft = this.findNft(incoming.nftId)
        const edition = nft?.editions.find((e) => e.id === incoming.editionId)
        const max = edition?.maxPerOrder ?? existing.quantity + incoming.quantity
        const available = edition?.available ?? existing.available
        existing.quantity = Math.min(max, available, existing.quantity + incoming.quantity)
        existing.unitPriceEth = incoming.unitPriceEth
        existing.available = available
        existing.version = Math.max(existing.version, incoming.version)
      } else {
        userCart.items.push({ ...incoming, id: createId('cartitem') })
      }
    }
    if (guestCart.couponCode && !userCart.couponCode) {
      userCart.couponCode = guestCart.couponCode
    }
    userCart.updatedAt = nowIso()
    this.data.carts[guestKey] = { items: [], couponCode: null, updatedAt: nowIso() }
    this.save()
  }
  listNfts(): Nft[] {
    return this.data.nfts
  }
  findNft(id: string): Nft | undefined {
    return this.data.nfts.find((n) => n.id === id || n.slug === id)
  }
  updateNft(
    id: string,
    patch: Partial<Pick<Nft, 'priceEth' | 'compareAtEth' | 'featured' | 'isNew' | 'trending'>> & {
      editions?: Nft['editions']
    },
    options?: {
      emit?: boolean
      userId?: string | null
    },
  ): Nft | undefined {
    const nft = this.findNft(id)
    if (!nft) return undefined
    if (patch.priceEth !== undefined) nft.priceEth = patch.priceEth
    if (patch.compareAtEth !== undefined) nft.compareAtEth = patch.compareAtEth
    if (patch.featured !== undefined) nft.featured = patch.featured
    if (patch.isNew !== undefined) nft.isNew = patch.isNew
    if (patch.trending !== undefined) nft.trending = patch.trending
    if (patch.editions) nft.editions = patch.editions
    nft.version += 1
    this.syncCartItemsForNft(nft)
    this.save()
    if (options?.emit !== false) {
      emitNftUpdated({
        id: this.nextEventId(),
        resourceId: nft.id,
        version: nft.version,
        payload: {
          id: nft.id,
          priceEth: nft.priceEth,
          compareAtEth: nft.compareAtEth ?? null,
          editions: nft.editions,
          version: nft.version,
        },
        userId: options?.userId ?? null,
      })
    }
    return nft
  }
  private syncCartItemsForNft(nft: Nft): void {
    for (const cart of Object.values(this.data.carts)) {
      let touched = false
      for (const item of cart.items) {
        if (item.nftId !== nft.id) continue
        const edition = nft.editions.find((e) => e.id === item.editionId)
        item.unitPriceEth = nft.priceEth
        item.available = edition?.available ?? 0
        item.version = nft.version
        item.name = nft.name
        item.imageUrl = nft.imageUrl
        item.network = nft.network
        touched = true
      }
      if (touched) cart.updatedAt = nowIso()
    }
  }
  getFavorites(userId: string): string[] {
    return this.data.favorites[userId] ?? []
  }
  addFavorite(userId: string, nftId: string): string[] {
    const list = this.data.favorites[userId] ?? (this.data.favorites[userId] = [])
    if (!list.includes(nftId)) list.push(nftId)
    this.save()
    return [...list]
  }
  removeFavorite(userId: string, nftId: string): string[] {
    const list = this.data.favorites[userId] ?? []
    this.data.favorites[userId] = list.filter((id) => id !== nftId)
    this.save()
    return [...(this.data.favorites[userId] ?? [])]
  }
  ensureCart(ownerKey: string): Cart {
    const existing = this.data.carts[ownerKey]
    if (existing) return existing
    const cart: Cart = { items: [], couponCode: null, updatedAt: nowIso() }
    this.data.carts[ownerKey] = cart
    this.save()
    return cart
  }
  getCart(ownerKey: string): Cart {
    return clone(this.ensureCart(ownerKey))
  }
  setCartCoupon(ownerKey: string, couponCode: string | null): Cart {
    const cart = this.ensureCart(ownerKey)
    cart.couponCode = couponCode
    cart.updatedAt = nowIso()
    this.save()
    return clone(cart)
  }
  addCartItem(
    ownerKey: string,
    input: {
      nftId: string
      editionId: string
      quantity: number
    },
  ): Cart {
    const nft = this.findNft(input.nftId)
    if (!nft) throw new Error('NFT_NOT_FOUND')
    const edition = nft.editions.find((e) => e.id === input.editionId)
    if (!edition) throw new Error('EDITION_NOT_FOUND')
    if (edition.available <= 0) throw new Error('UNAVAILABLE')
    const cart = this.ensureCart(ownerKey)
    const existing = cart.items.find(
      (item) => item.nftId === input.nftId && item.editionId === input.editionId,
    )
    const nextQty = (existing?.quantity ?? 0) + input.quantity
    if (nextQty > edition.available || nextQty > edition.maxPerOrder) {
      throw new Error('QUANTITY_EXCEEDED')
    }
    if (existing) {
      existing.quantity = nextQty
      existing.unitPriceEth = nft.priceEth
      existing.available = edition.available
      existing.version = nft.version
      existing.tokenId = nft.tokenId
      existing.editionLabel = edition.label
    } else {
      const item: CartItem = {
        id: createId('cartitem'),
        nftId: nft.id,
        editionId: edition.id,
        quantity: input.quantity,
        unitPriceEth: nft.priceEth,
        tokenId: nft.tokenId,
        editionLabel: edition.label,
        name: nft.name,
        imageUrl: nft.imageUrl,
        network: nft.network,
        available: edition.available,
        version: nft.version,
      }
      cart.items.push(item)
    }
    cart.updatedAt = nowIso()
    this.save()
    return clone(cart)
  }
  patchCartItem(ownerKey: string, itemId: string, quantity: number): Cart {
    const cart = this.ensureCart(ownerKey)
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) throw new Error('ITEM_NOT_FOUND')
    const nft = this.findNft(item.nftId)
    const edition = nft?.editions.find((e) => e.id === item.editionId)
    if (!edition || !nft) throw new Error('EDITION_NOT_FOUND')
    if (quantity > edition.available || quantity > edition.maxPerOrder) {
      throw new Error('QUANTITY_EXCEEDED')
    }
    item.quantity = quantity
    item.unitPriceEth = nft.priceEth
    item.available = edition.available
    item.version = nft.version
    cart.updatedAt = nowIso()
    this.save()
    return clone(cart)
  }
  removeCartItem(ownerKey: string, itemId: string): Cart {
    const cart = this.ensureCart(ownerKey)
    cart.items = cart.items.filter((i) => i.id !== itemId)
    cart.updatedAt = nowIso()
    this.save()
    return clone(cart)
  }
  removePurchasedFromCart(
    ownerKey: string,
    purchased: Array<{
      nftId: string
      editionId: string
      quantity: number
    }>,
  ): void {
    const cart = this.ensureCart(ownerKey)
    for (const bought of purchased) {
      const item = cart.items.find(
        (i) => i.nftId === bought.nftId && i.editionId === bought.editionId,
      )
      if (!item) continue
      item.quantity -= bought.quantity
      if (item.quantity <= 0) {
        cart.items = cart.items.filter((i) => i.id !== item.id)
      }
    }
    cart.updatedAt = nowIso()
    this.save()
  }
  getCoupon(code: string) {
    return this.data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase())
  }
  saveQuote(quote: StoredQuote): void {
    this.data.quotes[quote.quoteId] = quote
    this.save()
  }
  getQuote(quoteId: string): StoredQuote | undefined {
    return this.data.quotes[quoteId]
  }
  getIdempotency(userId: string, key: string): IdempotencyRecord | undefined {
    return this.data.idempotency[`${userId}:${key}`]
  }
  setIdempotency(userId: string, key: string, record: IdempotencyRecord): void {
    this.data.idempotency[`${userId}:${key}`] = record
    this.save()
  }
  addOrder(order: Order): Order {
    this.data.orders.push(order)
    this.save()
    return clone(order)
  }
  findOrder(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id)
  }
  updateOrderStatus(
    orderId: string,
    status: Order['status'],
    extras?: Partial<Pick<Order, 'transactionId' | 'explorerUrl'>>,
    userId?: string | null,
  ): Order | undefined {
    const order = this.findOrder(orderId)
    if (!order) return undefined
    if (order.status === 'confirmed' || order.status === 'refused') {
      return clone(order)
    }
    order.status = status
    order.updatedAt = nowIso()
    order.version += 1
    if (extras?.transactionId !== undefined) order.transactionId = extras.transactionId
    if (extras?.explorerUrl !== undefined) order.explorerUrl = extras.explorerUrl
    this.save()
    emitOrderUpdated({
      id: this.nextEventId(),
      resourceId: order.id,
      version: order.version,
      payload: {
        id: order.id,
        status: order.status,
        transactionId: order.transactionId,
        explorerUrl: order.explorerUrl,
        version: order.version,
        updatedAt: order.updatedAt,
      },
      userId: userId ?? null,
    })
    return clone(order)
  }
  decrementEditions(
    items: Array<{
      nftId: string
      editionId: string
      quantity: number
    }>,
  ): void {
    for (const line of items) {
      const nft = this.findNft(line.nftId)
      if (!nft) continue
      const edition = nft.editions.find((e) => e.id === line.editionId)
      if (!edition) continue
      edition.available = Math.max(0, edition.available - line.quantity)
      nft.version += 1
      this.syncCartItemsForNft(nft)
      emitNftUpdated({
        id: this.nextEventId(),
        resourceId: nft.id,
        version: nft.version,
        payload: {
          id: nft.id,
          priceEth: nft.priceEth,
          editions: nft.editions,
          version: nft.version,
        },
        userId: null,
      })
    }
    this.save()
  }
  getWallets(userId: string): Wallet[] {
    return clone(this.data.wallets[userId] ?? [])
  }
  addWallet(userId: string, wallet: Wallet): Wallet[] {
    const list = this.data.wallets[userId] ?? (this.data.wallets[userId] = [])
    if (wallet.isPrimary) {
      for (const w of list) w.isPrimary = false
    }
    list.push(wallet)
    this.save()
    return this.getWallets(userId)
  }
  patchWallet(userId: string, walletId: string, patch: Partial<Wallet>): Wallet[] {
    const list = this.data.wallets[userId] ?? []
    const wallet = list.find((w) => w.id === walletId)
    if (!wallet) throw new Error('WALLET_NOT_FOUND')
    if (patch.label !== undefined) wallet.label = patch.label
    if (patch.address !== undefined) wallet.address = patch.address
    if (patch.provider !== undefined) wallet.provider = patch.provider
    if (patch.network !== undefined) wallet.network = patch.network
    if (patch.isPrimary === true) {
      for (const w of list) w.isPrimary = w.id === walletId
    } else if (patch.isPrimary === false) {
      wallet.isPrimary = false
    }
    this.save()
    return this.getWallets(userId)
  }
}
export const db = new MockDb()
