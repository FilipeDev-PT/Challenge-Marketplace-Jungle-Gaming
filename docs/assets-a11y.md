# Assets e acessibilidade

## Assets

- Wordmark tipográfico `KURIO` (sem SVG externo de logo).
- Hero: asset Figma exportado e comprimido em `public/assets/hero/featured.webp` (JPEG original mantido).
- NFTs/promo: WebP derivados dos exports Figma em `public/assets/nfts/` e `public/assets/promo/`; SVGs `nft-01.svg` … `nft-08.svg` auxiliares.
- Ícones de UI: SVGs inline em `src/components/kurio/icons.tsx` (sem pack Lucide), alinhados ao layout Figma; exports auxiliares em `public/assets/icons/`.
- Fonte: Roboto Mono latin 400/500/700 via `@fontsource/roboto-mono` (self-hosted no build).

Substituições: artes do catálogo usam WebP determinísticos (mesmo conteúdo visual do Figma) para LCP/transfer; tokens de cor/tipografia seguem as variables do arquivo Figma.

## Ajustes de a11y vs layout

- Foco visível global (`:focus-visible`) com outline primary.
- Diálogos/sheets Radix com focus trap.
- Labels associadas e `aria-describedby` em erros de formulário.
- Skeletons com shimmer respeitam `prefers-reduced-motion`.
- Feedback de mutations/realtime via Sonner (`aria-live`).
- Links editoriais (Blog, Criadores, Aprenda, OAuth social) não fingem sucesso — toast “indisponível”.
- Breakpoints avaliados: 390, 768, 1440 (frames mobile Figma em 414 adaptados).
