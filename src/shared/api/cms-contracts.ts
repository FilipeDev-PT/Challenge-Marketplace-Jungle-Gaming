import { z } from 'zod'
export const facetItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  count: z.number().int().nonnegative(),
})
export const facetsSchema = z.object({
  collections: z.array(facetItemSchema),
  networks: z.array(facetItemSchema),
  priceBounds: z.object({
    min: z.number(),
    max: z.number(),
  }),
})
export type Facets = z.infer<typeof facetsSchema>
export const homeHeroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  titleLines: z.array(z.string()).optional(),
  mobileTitleLines: z.array(z.string()).optional(),
  body: z.string(),
  mobileBody: z.string().optional(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  imageUrl: z.string(),
  secondaryImageUrl: z.string().optional(),
  imageAlt: z.string(),
  slideCount: z.number().int().positive(),
})
export const homePromoSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  imageUrl: z.string(),
  ctaLabel: z.string(),
})
export const homeBlogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  meta: z.string(),
  imageUrl: z.string(),
  ctaLabel: z.string(),
})
export const homeContentSchema = z.object({
  hero: homeHeroSchema,
  featuredBanner: z.object({
    title: z.string(),
    badge: z.string(),
  }),
  catalog: z.object({
    tabs: z.array(z.object({ id: z.string(), label: z.string() })),
    sortOptions: z.array(z.object({ id: z.string(), label: z.string() })),
  }),
  blog: z.object({
    heading: z.string(),
    subheading: z.string(),
    posts: z.array(homeBlogPostSchema),
  }),
  promos: z.array(homePromoSchema),
})
export type HomeContent = z.infer<typeof homeContentSchema>
export const footerFeatureSchema = z.object({
  letter: z.string(),
  title: z.string(),
  body: z.string(),
})
export const footerLinkColumnSchema = z.object({
  title: z.string(),
  links: z.array(z.string()),
})
export const footerContentSchema = z.object({
  features: z.array(footerFeatureSchema),
  newsletter: z.object({
    title: z.string(),
    placeholder: z.string(),
    ctaLabel: z.string(),
    hint: z.string(),
  }),
  brand: z.object({
    name: z.string(),
    tagline: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  linkColumns: z.array(footerLinkColumnSchema),
  socials: z.array(z.object({ id: z.string(), label: z.string() })),
  compatibleWallets: z.array(z.string()),
  copyright: z.string(),
})
export type FooterContent = z.infer<typeof footerContentSchema>
export const accountNavItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string().nullable(),
  icon: z.string(),
})
export const accountNavSchema = z.object({
  title: z.string(),
  items: z.array(accountNavItemSchema),
  logoutLabel: z.string(),
})
export type AccountNav = z.infer<typeof accountNavSchema>
