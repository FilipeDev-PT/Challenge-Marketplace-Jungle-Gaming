import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('@/features/catalog/pages/HomePage').then((m) => ({ default: m.HomePage })),
)

export const NftDetailPage = lazy(() =>
  import('@/features/nft-detail/pages/NftDetailPage').then((m) => ({ default: m.NftDetailPage })),
)

export const CartPage = lazy(() =>
  import('@/features/cart/pages/CartPage').then((m) => ({ default: m.CartPage })),
)

export const CheckoutPage = lazy(() =>
  import('@/features/checkout/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })),
)

export const OrderConfirmationPage = lazy(() =>
  import('@/features/checkout/pages/OrderConfirmationPage').then((m) => ({
    default: m.OrderConfirmationPage,
  })),
)

export const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)

export const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)

export const ProfilePage = lazy(() =>
  import('@/features/profile/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)

export const WalletsPage = lazy(() =>
  import('@/features/wallets/pages/WalletsPage').then((m) => ({ default: m.WalletsPage })),
)
