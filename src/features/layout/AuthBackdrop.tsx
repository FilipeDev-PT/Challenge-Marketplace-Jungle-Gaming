export function AuthBackdrop() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden rounded-none" aria-hidden>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 70% 35%, rgba(210,138,76,0.28), transparent 55%), linear-gradient(180deg, #1a100c 0%, #140d0a 100%)',
        }}
      />
      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-10 px-2 py-16 md:flex-row md:items-center md:pl-10">
        <div className="flex max-w-[480px] flex-col gap-4">
          <p className="text-sm font-medium tracking-[0.1em] text-text-primary/80">
            MERCADO DE NFTS
          </p>
          <p className="text-[28px] font-bold leading-tight text-text-primary/90 md:text-[36px]">
            Descubra coleções
            <span className="block">exclusivas</span>
          </p>
          <p className="max-w-md text-sm leading-6 text-text-secondary/80">
            Explore arte digital verificada e finalize compras com carteira conectada.
          </p>
        </div>
        <div className="mx-auto size-[280px] shrink-0 overflow-hidden rounded-[24px] bg-surface-card/60 md:ml-auto md:size-[360px]">
          <img
            src="/assets/nfts/emerald-ape.webp"
            alt=""
            className="size-full object-cover opacity-70"
            width={360}
            height={360}
          />
        </div>
      </div>
    </div>
  )
}
