import { authHandlers } from '@/mocks/handlers/auth'
import { nftsHandlers } from '@/mocks/handlers/nfts'
import { favoritesHandlers } from '@/mocks/handlers/favorites'
import { cartHandlers } from '@/mocks/handlers/cart'
import { quotesHandlers } from '@/mocks/handlers/quotes'
import { ordersHandlers } from '@/mocks/handlers/orders'
import { profileHandlers } from '@/mocks/handlers/profile'
import { walletsHandlers } from '@/mocks/handlers/wallets'
import { cmsHandlers } from '@/mocks/handlers/cms'
import { metaHandlers } from '@/mocks/handlers/meta'
import { socketHandler } from '@/mocks/socket'
export const handlers = [
  ...authHandlers,
  ...cmsHandlers,
  ...nftsHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...quotesHandlers,
  ...ordersHandlers,
  ...profileHandlers,
  ...walletsHandlers,
  ...metaHandlers,
  socketHandler,
]
