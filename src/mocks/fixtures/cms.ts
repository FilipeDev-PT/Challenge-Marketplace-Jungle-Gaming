import type { AccountNav, FooterContent, HomeContent } from '@/shared/api/cms-contracts'
import {
  homeCatalogDefault,
  homeFeaturedBannerDefault,
  homeHeroDefault,
} from '@/shared/content/home-defaults'
export const homeContentSeed: HomeContent = {
  hero: homeHeroDefault,
  featuredBanner: homeFeaturedBannerDefault,
  catalog: homeCatalogDefault,
  promos: [
    {
      id: 'promo-genesis',
      title: 'Lançamentos gênesis\nde edição limitada',
      body: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
      imageUrl: '/assets/promo/promo-01.webp',
      ctaLabel: 'Explorar',
    },
    {
      id: 'promo-curated',
      title: 'Arte digital selecionada\ne muito mais',
      body: 'Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.',
      imageUrl: '/assets/promo/promo-02.webp',
      ctaLabel: 'Explorar',
    },
  ],
  blog: {
    heading: 'Diário da Cunhagem',
    subheading:
      'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
    posts: [
      {
        id: 'blog-1',
        title: 'Como funciona a propriedade de NFTs',
        excerpt: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
        meta: '12 de setembro  |  Leitura de 6 min',
        imageUrl: '/assets/nfts/golden-beat.webp',
        ctaLabel: 'Ler mais →',
      },
      {
        id: 'blog-2',
        title: '10 artistas digitais para acompanhar',
        excerpt: 'Conheça criadores que moldam a cultura digital.',
        meta: '13 de setembro  |  Leitura de 2 min',
        imageUrl: '/assets/nfts/emerald-ape.webp',
        ctaLabel: 'Ler mais →',
      },
      {
        id: 'blog-3',
        title: 'Raridade, atributos e procedência',
        excerpt: 'Entenda raridade, procedência, direitos autorais e utilidade.',
        meta: '15 de setembro  |  Leitura de 3 min',
        imageUrl: '/assets/nfts/neon-vessel.webp',
        ctaLabel: 'Ler mais →',
      },
      {
        id: 'blog-4',
        title: 'Como proteger sua carteira',
        excerpt: 'Proteja sua carteira, seus ativos e sua identidade.',
        meta: '15 de setembro  |  Leitura de 2 min',
        imageUrl: '/assets/nfts/emerald-ape.webp',
        ctaLabel: 'Ler mais →',
      },
    ],
  },
}
export const footerContentSeed: FooterContent = {
  features: [
    {
      letter: 'W',
      title: 'Segurança da carteira',
      body: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
    },
    {
      letter: 'C',
      title: 'Criadores em destaque',
      body: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
    },
    {
      letter: 'D',
      title: 'Alertas de lançamentos',
      body: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
    },
  ],
  newsletter: {
    title: 'Antecipe-se ao próximo lançamento',
    placeholder: 'digite seu e-mail...',
    ctaLabel: 'Enviar',
    hint: 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.',
  },
  brand: {
    name: 'KURIO',
    tagline: 'Feito para colecionadores,\ncriadores e cultura',
    email: 'contato@email.com',
    phone: '+55 11 4002 8922',
  },
  linkColumns: [
    {
      title: 'Meu perfil',
      links: ['Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
    },
    {
      title: 'Central de ajuda',
      links: ['Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'],
    },
    {
      title: 'Coleções',
      links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
    },
  ],
  socials: [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'x', label: 'X' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'youtube', label: 'YouTube' },
  ],
  compatibleWallets: ['METAMASK', 'WALLETCONNECT', 'COINBASE'],
  copyright: '© 2026 Kurio. Propriedade digital para todos.',
}
export const accountNavSeed: AccountNav = {
  title: 'Meu perfil',
  items: [
    { id: 'profile', label: 'Dados do perfil', href: '/account/profile', icon: 'user' },
    { id: 'wallets', label: 'Carteiras', href: '/account/wallets', icon: 'pin' },
    { id: 'activity', label: 'Atividade', href: null, icon: 'cart' },
    { id: 'watchlist', label: 'Lista de interesse', href: null, icon: 'heart' },
    { id: 'offers', label: 'Ofertas', href: null, icon: 'chart' },
    { id: 'downloads', label: 'Arquivos baixados', href: null, icon: 'download' },
    { id: 'support', label: 'Suporte', href: null, icon: 'warning' },
  ],
  logoutLabel: 'Sair',
}
