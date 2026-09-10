import type { Cart, Nft, Order, User, Wallet } from '@/shared/api/contracts'
import { COLLECTIONS, NETWORKS } from '@/mocks/fixtures/seed-meta'
import { hashPassword } from '@/mocks/helpers'
export type StoredUser = User & {
  passwordHash: string
}
export type Coupon = {
  code: string
  percentOff: number
  expiresAt: string | null
  disabled: boolean
}
export type StoredSession = {
  token: string
  userId: string
  expiresAt: string
}
export type StoredQuote = {
  quoteId: string
  ownerKey: string
  couponCode: string | null
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  couponValid: boolean
  stale: boolean
  warnings: string[]
  items: Array<{
    cartItemId: string
    nftId: string
    editionId: string
    quantity: number
    unitPriceEth: string
    lineTotalEth: string
    available: number
    priceChanged?: boolean
    availabilityChanged?: boolean
  }>
  quotedAt: string
  network: 'ethereum' | 'polygon' | 'solana'
}
export type IdempotencyRecord = {
  bodyHash: string
  orderId: string
}
export type MockDbSnapshot = {
  users: StoredUser[]
  sessions: StoredSession[]
  nfts: Nft[]
  favorites: Record<string, string[]>
  carts: Record<string, Cart>
  quotes: Record<string, StoredQuote>
  orders: Order[]
  wallets: Record<string, Wallet[]>
  coupons: Coupon[]
  idempotency: Record<string, IdempotencyRecord>
  eventSeq: number
}
const LISTED_AT = '2026-08-01T12:00:00.000Z'
const CREATORS = ['Nova Sato', 'Kurio Labs', 'Signal Forge', 'Ivory Atelier'] as const
const FIGMA_IMAGES = [
  '/assets/nfts/emerald-ape.webp',
  '/assets/nfts/neon-vessel.webp',
  '/assets/nfts/golden-beat.webp',
] as const
type CatalogEntry = {
  name: string
  priceEth: string
  compareAtEth?: string | null
  tokenId: string
  collection: (typeof COLLECTIONS)[number]
  collectionLabel?: string
  network: (typeof NETWORKS)[number]
  creator: string
  tags: string[]
  shortDescription: string
  description: string
  imageIndex: number
  featured?: boolean
  isNew?: boolean
  trending?: boolean
}
const FIGMA_CATALOG: CatalogEntry[] = [
  {
    name: 'Emerald Ape #042',
    priceEth: '1.19',
    tokenId: '0042',
    collection: 'Arte digital',
    collectionLabel: 'Kurio Apes',
    network: 'ethereum',
    creator: 'Nova Sato',
    tags: ['Óculos', 'Esmeralda', 'Raro'],
    imageIndex: 0,
    featured: true,
    trending: true,
    shortDescription:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    description:
      'Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras. A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
  },
  {
    name: 'Sage Nomad #009',
    priceEth: '1.69',
    tokenId: '0009',
    collection: 'Arte digital',
    network: 'ethereum',
    creator: 'Nova Sato',
    tags: ['Sage', 'Nomad', 'Verde'],
    imageIndex: 0,
    isNew: true,
    shortDescription:
      'Figura nômade em tons de sálvia da coleção Kurio Editions — procedência on-chain e arte desbloqueável para colecionadores.',
    description:
      'Sage Nomad #009 é um retrato digital curado da coleção Kurio Editions. Os atributos ficam nos metadados do token, com verificação na Ethereum e acesso a drops exclusivos para detentores. A peça equilibra serenidade e movimento, com licença de exibição em alta resolução incluída na propriedade.',
  },
  {
    name: 'Neon Vessel #552',
    priceEth: '1.99',
    compareAtEth: '2.29',
    tokenId: '0552',
    collection: 'Arte 3D',
    network: 'ethereum',
    creator: 'Kurio Labs',
    tags: ['Neon', 'Vessel', '3D'],
    imageIndex: 1,
    featured: true,
    trending: true,
    shortDescription:
      'Escultura digital luminosa em neon, verificada na Ethereum, com utilidade de acesso à comunidade Kurio.',
    description:
      'Neon Vessel #552 é uma escultura 3D luminosa da linha Kurio Labs. Metadados no IPFS, contrato ERC-721 verificado e royalty de 5% para o criador nas vendas secundárias. Ideal para colecionadores que buscam presença visual forte e utilidade de acesso.',
  },
  {
    name: 'Cosmic Bloom #118',
    priceEth: '1.29',
    tokenId: '0118',
    collection: 'Generativa',
    network: 'polygon',
    creator: 'Signal Forge',
    tags: ['Cósmico', 'Bloom', 'Generativa'],
    imageIndex: 0,
    isNew: true,
    shortDescription:
      'Floração generativa inspirada em nebulosas — edição limitada com metadados verificáveis na Polygon.',
    description:
      'Cosmic Bloom #118 nasce de um algoritmo generativo da Signal Forge. Cada variação é única, com atributos on-chain e arte desbloqueável em alta resolução. Cunhada na Polygon para taxas acessíveis e procedência imutável.',
  },
  {
    name: 'Violet Nomad #314',
    priceEth: '1.39',
    tokenId: '0314',
    collection: 'Arte digital',
    network: 'ethereum',
    creator: 'Nova Sato',
    tags: ['Violet', 'Nomad', 'Raro'],
    imageIndex: 0,
    trending: true,
    shortDescription:
      'Companheiro do Sage Nomad em violeta — colecionável Kurio Editions com acesso para membros.',
    description:
      'Violet Nomad #314 completa a série Nomad de Nova Sato. Arte finalizada à mão, metadados na Ethereum e benefícios de colecionador, incluindo lançamentos antecipados e registro permanente de propriedade.',
  },
  {
    name: 'Ivory Baron #088',
    priceEth: '1.79',
    tokenId: '0088',
    collection: 'Colecionáveis',
    network: 'ethereum',
    creator: 'Ivory Atelier',
    tags: ['Ivory', 'Baron', 'Luxo'],
    imageIndex: 1,
    featured: true,
    shortDescription:
      'Retrato de corte da Ivory Court — texturas de marfim digital e procedência verificada.',
    description:
      'Ivory Baron #088 pertence à Ivory Court. Acabamento digital sofisticado, atributos raros e royalty automática de 5% nas vendas secundárias. Inclui arte em alta resolução e acesso a eventos da Atelier.',
  },
  {
    name: 'Golden Beat #207',
    priceEth: '0.99',
    tokenId: '0207',
    collection: 'Música',
    network: 'solana',
    creator: 'Signal Forge',
    tags: ['Golden', 'Beat', 'Áudio'],
    imageIndex: 2,
    isNew: true,
    shortDescription: 'Drop audiovisual com capa dourada e stem desbloqueável — cunhado na Solana.',
    description:
      'Golden Beat #207 une capa generativa e áudio desbloqueável. Metadados na Solana, stems exclusivos para o detentor e participação em playlists curadas da Signal Forge.',
  },
  {
    name: 'Golden Signal #160',
    priceEth: '0.39',
    tokenId: '0160',
    collection: 'Utilidade',
    network: 'polygon',
    creator: 'Kurio Labs',
    tags: ['Signal', 'Utility', 'Acesso'],
    imageIndex: 2,
    trending: true,
    shortDescription:
      'Sinal de acesso Kurio — utilidade on-chain para listas de lançamento e alertas de cunhagem.',
    description:
      'Golden Signal #160 é um token de utilidade da Kurio Labs. Concede prioridade em drops selecionados, alertas de cunhagem e badge de colecionador. Cunhado na Polygon com taxas baixas e transferência simples.',
  },
]
function buildNfts(): Nft[] {
  const extras = [
    'Aura Coin #011',
    'Volt Mask #073',
    'Chrome Idol #221',
    'Plasma Totem #044',
    'Gilded Beacon #090',
    'Solar Ledger #015',
    'Circuit Bloom #301',
    'Signal Crown #128',
    'Halo Key #056',
    'Dawn Glyph #019',
    'Marble Throne #077',
    'Pearl Scepter #033',
    'Ivory Mask #102',
    'Court Whisper #064',
    'Alabaster Fang #188',
    'Silk Reliquary #027',
  ]
  const catalog: CatalogEntry[] = [
    ...FIGMA_CATALOG,
    ...extras.map((name, i) => {
      const idx = FIGMA_CATALOG.length + i
      const collection = COLLECTIONS[idx % COLLECTIONS.length]!
      const network = NETWORKS[idx % NETWORKS.length]!
      const creator = CREATORS[idx % CREATORS.length]!
      const price = (0.42 + (i % 9) * 0.11 + Math.floor(i / 5) * 0.08).toFixed(2)
      const shortDescription = `Peça curada da coleção ${collection} na ${network}, com arte desbloqueável e procedência registrada na rede.`
      return {
        name,
        priceEth: price,
        compareAtEth: i % 4 === 0 ? (Number(price) * 1.18).toFixed(2) : null,
        tokenId: String(2000 + i).padStart(4, '0'),
        collection,
        network,
        creator,
        tags: [collection.split(' ')[0]!, network, 'Kurio'],
        imageIndex: i % FIGMA_IMAGES.length,
        featured: i % 6 === 0,
        isNew: i >= 10 || i % 3 === 0,
        trending: i % 4 === 1,
        shortDescription,
        description: `${name} é um colecionável Kurio da coleção ${collection}. ${shortDescription} Metadados verificáveis na ${network}, arte em alta resolução para o detentor e ${creator} recebe 5% de direitos autorais nas vendas secundárias.`,
      } satisfies CatalogEntry
    }),
  ]
  return catalog.map((entry, i) => {
    const index = i + 1
    const imageUrl = FIGMA_IMAGES[entry.imageIndex % FIGMA_IMAGES.length]!
    const gallery = [imageUrl, imageUrl, imageUrl, imageUrl]
    const editionAvailable = i % 7 === 0 ? 0 : 3 + (i % 5)
    const reviewBodies = [
      'Arte impecável e procedência clara on-chain. Compra tranquila.',
      'Metadados bem organizados e a entrega da arte desbloqueável foi rápida.',
      'Coleção consistente — este token se destaca pelos detalhes.',
      'Bom suporte da comunidade Kurio e royalties transparentes.',
      'A resolução da arte e a raridade da edição valem o preço.',
    ]
    const authors = [
      'Luna Coleciona',
      'Marcus ETH',
      'Ava Polygon',
      'Diego Arte',
      'Nina Vault',
      'Theo Mint',
      'Clara Labs',
      'Rafa Onchain',
      'Sofia Gallery',
      'Igor Node',
    ]
    const reviews = Array.from({ length: 19 }, (_, reviewIndex) => ({
      id: `rev-${String(index).padStart(2, '0')}-${String(reviewIndex + 1).padStart(2, '0')}`,
      author: authors[reviewIndex % authors.length]!,
      rating: reviewIndex % 7 === 0 ? 4 : 5,
      body: reviewBodies[reviewIndex % reviewBodies.length]!,
      createdAt: new Date(Date.parse(LISTED_AT) + reviewIndex * 36000000).toISOString(),
    }))
    return {
      id: `nft-${String(index).padStart(2, '0')}`,
      slug: entry.name.toLowerCase().replace(/\s+/g, '-').replace(/#/g, ''),
      name: entry.name,
      description: entry.description,
      summary: entry.shortDescription,
      priceEth: entry.priceEth,
      compareAtEth: entry.compareAtEth ?? null,
      imageUrl,
      gallery,
      collection: entry.collection,
      ...(entry.collectionLabel ? { collectionLabel: entry.collectionLabel } : {}),
      network: entry.network,
      creator: entry.creator,
      tokenId: entry.tokenId,
      tags: [...entry.tags, entry.featured ? 'featured' : 'catalog'],
      featured: Boolean(entry.featured),
      isNew: Boolean(entry.isNew),
      trending: Boolean(entry.trending),
      version: 1,
      editions: [
        {
          id: `ed-${String(index).padStart(2, '0')}-1of1`,
          label: '1/1',
          available: i % 9 === 0 ? 0 : 1,
          maxPerOrder: 1,
        },
        {
          id: `ed-${String(index).padStart(2, '0')}-1of10`,
          label: '1/10',
          available: i % 11 === 0 ? 0 : Math.min(10, 2 + (i % 4)),
          maxPerOrder: 2,
        },
        {
          id: `ed-${String(index).padStart(2, '0')}-1of50`,
          label: '1/50',
          available: editionAvailable,
          maxPerOrder: Math.min(5, Math.max(1, editionAvailable || 1)),
        },
        {
          id: `ed-${String(index).padStart(2, '0')}-open`,
          label: 'ABERTA',
          available: 99,
          maxPerOrder: 5,
        },
      ],
      reviews,
      listedAt: new Date(Date.parse(LISTED_AT) + i * 86400000).toISOString(),
    } satisfies Nft
  })
}
export function createSeedSnapshot(): MockDbSnapshot {
  const collector: StoredUser = {
    id: 'user-collector',
    email: 'collector@kurio.test',
    name: 'Kurio Collector',
    username: 'kuriocollector',
    ens: 'collector.eth',
    phone: '+5511999990001',
    walletNickname: 'Main MetaMask',
    avatarUrl: null,
    createdAt: '2026-01-10T10:00:00.000Z',
    passwordHash: hashPassword('Kurio123!'),
  }
  const alice: StoredUser = {
    id: 'user-alice',
    email: 'alice@kurio.test',
    name: 'Alice Rivera',
    username: 'alicerivera',
    ens: 'alice.eth',
    phone: '+5511988880002',
    walletNickname: 'Alice Phantom',
    avatarUrl: null,
    createdAt: '2026-02-14T15:30:00.000Z',
    passwordHash: hashPassword('Alice123!'),
  }
  const nfts = buildNfts()
  const wallets: Record<string, Wallet[]> = {
    [collector.id]: [
      {
        id: 'wallet-collector-1',
        label: 'Main MetaMask',
        address: '0xCollectorA1b2c3d4e5f678901234567890abcdef01',
        provider: 'metamask',
        network: 'ethereum',
        isPrimary: true,
      },
      {
        id: 'wallet-collector-2',
        label: 'Polygon Spare',
        address: '0xCollectorB2c3d4e5f678901234567890abcdef02',
        provider: 'coinbase',
        network: 'polygon',
        isPrimary: false,
      },
    ],
    [alice.id]: [
      {
        id: 'wallet-alice-1',
        label: 'Alice Phantom',
        address: 'SoLAlice1111111111111111111111111111111111',
        provider: 'phantom',
        network: 'solana',
        isPrimary: true,
      },
      {
        id: 'wallet-alice-2',
        label: 'Alice WalletConnect',
        address: '0xAliceC3d4e5f678901234567890abcdef03000001',
        provider: 'walletconnect',
        network: 'ethereum',
        isPrimary: false,
      },
    ],
  }
  const emptyCart = (): Cart => ({
    items: [],
    couponCode: null,
    updatedAt: LISTED_AT,
  })
  return {
    users: [collector, alice],
    sessions: [],
    nfts,
    favorites: {
      [collector.id]: ['nft-01', 'nft-05', 'nft-12'],
      [alice.id]: ['nft-03', 'nft-08'],
    },
    carts: {
      [`user:${collector.id}`]: emptyCart(),
      [`user:${alice.id}`]: emptyCart(),
    },
    quotes: {},
    orders: [],
    wallets,
    coupons: [
      {
        code: 'WELCOME10',
        percentOff: 10,
        expiresAt: '2099-12-31T23:59:59.000Z',
        disabled: false,
      },
      {
        code: 'EXPIRED50',
        percentOff: 50,
        expiresAt: '2020-01-01T00:00:00.000Z',
        disabled: false,
      },
      {
        code: 'INVALID',
        percentOff: 0,
        expiresAt: null,
        disabled: true,
      },
    ],
    idempotency: {},
    eventSeq: 0,
  }
}
