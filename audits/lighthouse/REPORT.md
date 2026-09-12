# Lighthouse Report — KURIO

Generated: 2026-09-12T05:50:12.517Z

## Environment

- Node: v24.19.0
- Platform: win32
- Lighthouse: ^13.4.1
- Base URL: http://127.0.0.1:4195
- Conditions: production preview + VITE_ENABLE_MSW=true; 3 runs → median

## Medians

| Page | Profile | Perf | A11y | BP | SEO | LCP (ms) | CLS | TBT (ms) |
|------|---------|------|------|----|-----|----------|-----|----------|
| home | mobile | 100 | 100 | 100 | 92 | 1061 | 0 | 43 |
| home | desktop | 98 | 100 | 100 | 92 | 1056 | 0.002 | 51 |
| detail | mobile | 100 | 100 | 100 | 92 | 1058 | 0 | 26 |
| detail | desktop | 98 | 100 | 100 | 92 | 1058 | 0 | 40 |

## Notes

Todas as medianas atingiram as metas do desafio (§10).

## Configuração versionada

- `audits/lighthouse/config.json` — páginas, perfis, metas e métricas
- `audits/lighthouse/run.mjs` — 3 runs → mediana, HTML/JSON em `reports/`
- Comando: `npm run lighthouse` (build de produção + preview + auditoria)