import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
const dir = 'audits/lighthouse/reports'
const files = (await readdir(dir)).filter((f) => f.endsWith('.json') && f !== 'summary.json')
const groups = {}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
for (const file of files) {
  const match = file.match(/^(home|detail)-(mobile|desktop)-run(\d)\.json$/)
  if (!match) continue
  const key = `${match[1]}-${match[2]}`
  const lhr = JSON.parse(await readFile(path.join(dir, file), 'utf8'))
  groups[key] ??= {
    performance: [],
    accessibility: [],
    bestPractices: [],
    seo: [],
    lcp: [],
    cls: [],
    tbt: [],
  }
  const g = groups[key]
  g.performance.push(Math.round((lhr.categories.performance?.score ?? 0) * 100))
  g.accessibility.push(Math.round((lhr.categories.accessibility?.score ?? 0) * 100))
  g.bestPractices.push(Math.round((lhr.categories['best-practices']?.score ?? 0) * 100))
  g.seo.push(Math.round((lhr.categories.seo?.score ?? 0) * 100))
  g.lcp.push(lhr.audits['largest-contentful-paint']?.numericValue ?? 0)
  g.cls.push(lhr.audits['cumulative-layout-shift']?.numericValue ?? 0)
  g.tbt.push(lhr.audits['total-blocking-time']?.numericValue ?? 0)
}
const sample = JSON.parse(await readFile(path.join(dir, 'home-mobile-run1.json'), 'utf8'))
const rows = Object.entries(groups).map(([key, g]) => {
  const [page, form] = key.split('-')
  return {
    page,
    form,
    medians: {
      performance: median(g.performance),
      accessibility: median(g.accessibility),
      bestPractices: median(g.bestPractices),
      seo: median(g.seo),
      lcpMs: Math.round(median(g.lcp)),
      cls: Number(median(g.cls).toFixed(3)),
      tbtMs: Math.round(median(g.tbt)),
    },
  }
})
const summary = {
  generatedAt: new Date().toISOString(),
  lighthouseVersion: sample.lighthouseVersion,
  results: rows,
}
await writeFile(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 2))
const lines = [
  '# Lighthouse Report — KURIO',
  '',
  `Generated: ${summary.generatedAt}`,
  '',
  '## Environment',
  '',
  `- Lighthouse: ${summary.lighthouseVersion}`,
  '- Build: production preview + VITE_ENABLE_MSW=true',
  '- Aggregation: median of 3 runs per page/profile',
  '- HTML/JSON: `audits/lighthouse/reports/`',
  '',
  '## Medians',
  '',
  '| Page | Profile | Perf | A11y | BP | SEO | LCP (ms) | CLS | TBT (ms) |',
  '|------|---------|------|------|----|-----|----------|-----|----------|',
]
for (const row of rows) {
  const m = row.medians
  lines.push(
    `| ${row.page} | ${row.form} | ${m.performance} | ${m.accessibility} | ${m.bestPractices} | ${m.seo} | ${m.lcpMs} | ${m.cls} | ${m.tbtMs} |`,
  )
}
lines.push('', '## Notes', '')
const below = rows.filter(
  (r) =>
    r.medians.performance < 90 ||
    r.medians.accessibility < 95 ||
    r.medians.bestPractices < 95 ||
    r.medians.seo < 90,
)
if (below.length) {
  lines.push(`Medianas abaixo da meta em: ${below.map((b) => `${b.page}/${b.form}`).join(', ')}.`)
  lines.push(
    'Causas principais: LCP/TBT pelo registro do service worker MSW e bundle JS (~846KB sem code-split agressivo); CLS mitigado com skeletons dimensionados. Mitigações possíveis: lazy routes + defer do worker após first paint — sem remover funcionalidades da entrega.',
  )
} else {
  lines.push('Todas as medianas atingiram as metas do enunciado.')
}
await writeFile('audits/lighthouse/REPORT.md', `${lines.join('\n')}\n`)
console.log(lines.join('\n'))
