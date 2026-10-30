import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { EFFECT_LABEL, STATUS_LABEL, type BusinessRule, type RuleEffect } from '@/lib/business-rules'
import { ENGLISH_BY_LEVEL, MIN_GRADE, TEACHING_RULE, type EnglishRule } from '@/lib/entry-rules'

const EFFECT_TONE: Record<RuleEffect, string> = {
  blocks: 'border-destructive/30 bg-destructive/10 text-destructive',
  warns: 'border-warning/40 bg-warning/10 text-foreground',
  informs: 'border-border bg-muted text-muted-foreground',
  routes: 'border-primary/30 bg-primary/10 text-primary',
}

export function RuleList({ rules }: { rules: BusinessRule[] }) {
  return (
    <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {rules.map((r) => (
        <li key={r.id} className="flex flex-col gap-3 p-4 md:flex-row md:gap-6">
          <div className="flex shrink-0 flex-row items-start justify-between gap-2 md:w-56 md:flex-col">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
              <h2 className="text-sm font-semibold text-foreground text-pretty">{r.title}</h2>
            </div>
            <div className="flex shrink-0 flex-wrap gap-1.5">
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-xs font-medium',
                  EFFECT_TONE[r.effect],
                )}
              >
                {EFFECT_LABEL[r.effect]}
              </span>
              {r.status === 'planned' && (
                <span className="rounded-full border border-dashed border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {STATUS_LABEL.planned}
                </span>
              )}
            </div>
          </div>
          <dl className="grid flex-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">When</dt>
              <dd className="leading-relaxed text-foreground text-pretty">{r.when}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Then</dt>
              <dd className="leading-relaxed text-foreground text-pretty">{r.then}</dd>
            </div>
            {r.automation && (
              <div className="flex flex-col gap-1 rounded-md bg-muted/60 px-3 py-2 md:col-span-2">
                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ai">
                  <Sparkles className="size-3.5" aria-hidden />
                  AI and integrations
                </dt>
                <dd className="leading-relaxed text-foreground text-pretty">{r.automation}</dd>
              </div>
            )}
          </dl>
        </li>
      ))}
    </ol>
  )
}

function englishCells(rule: EnglishRule) {
  return [
    `${rule.ielts.toFixed(1)} (bands ${rule.ieltsBand.toFixed(1)})`,
    `${rule.pte} (bands ${rule.pteBand})`,
  ]
}

export function EntryThresholds() {
  const rows: { level: string; rule: EnglishRule; grade?: number }[] = [
    ...(Object.keys(ENGLISH_BY_LEVEL) as (keyof typeof ENGLISH_BY_LEVEL)[]).map((level) => ({
      level,
      rule: ENGLISH_BY_LEVEL[level],
      grade: MIN_GRADE[level],
    })),
    { level: 'Teaching programmes', rule: TEACHING_RULE },
  ]

  return (
    <section aria-labelledby="thresholds-heading" className="flex flex-col gap-3">
      <h2 id="thresholds-heading" className="text-base font-semibold text-foreground">
        Entry thresholds by course level
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 font-semibold">Course level</th>
              <th scope="col" className="px-4 py-2 font-semibold">IELTS overall</th>
              <th scope="col" className="px-4 py-2 font-semibold">PTE overall</th>
              <th scope="col" className="px-4 py-2 font-semibold">Transcript average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => {
              const [ielts, pte] = englishCells(row.rule)
              return (
                <tr key={row.level}>
                  <th scope="row" className="px-4 py-2 font-medium text-foreground">{row.level}</th>
                  <td className="px-4 py-2 tabular-nums text-foreground">{ielts}</td>
                  <td className="px-4 py-2 tabular-nums text-foreground">{pte}</td>
                  <td className="px-4 py-2 tabular-nums text-muted-foreground">
                    {row.grade != null ? `${Math.round(row.grade * 100)}% minimum` : 'Not assessed'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
