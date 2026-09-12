import type { HomeContent } from '@/shared/api/cms-contracts'
export const homeHeroDefault: HomeContent['hero'] = {
  eyebrow: 'Bem-vindo à Kurio',
  title: 'SEJA DONO DO FUTURO DA ARTE DIGITAL',
  titleLines: ['SEJA DONO DO FUTURO', 'DA ARTE DIGITAL'],
  mobileTitleLines: ['SEJA DONO DA', 'CULTURA DIGITAL'],
  body: 'Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.',
  mobileBody: 'Descubra NFTs selecionados de criadores do mundo todo.',
  ctaLabel: 'EXPLORAR',
  ctaHref: '#catalog',
  imageUrl: '',
  secondaryImageUrl: '',
  imageAlt: '',
  slideCount: 3,
}
export const homeCatalogDefault: HomeContent['catalog'] = {
  tabs: [
    { id: 'all', label: 'Todos os NFTs' },
    { id: 'new', label: 'Novos lançamentos' },
    { id: 'trending', label: 'Em alta' },
  ],
  sortOptions: [
    { id: 'recent', label: 'Listados recentemente' },
    { id: 'price-asc', label: 'Preço: menor para maior' },
    { id: 'price-desc', label: 'Preço: maior para menor' },
    { id: 'name-asc', label: 'Nome A–Z' },
  ],
}
export const homeFeaturedBannerDefault: HomeContent['featuredBanner'] = {
  title: 'NFT EM DESTAQUE',
  badge: 'OFERTA LIMITADA',
}
