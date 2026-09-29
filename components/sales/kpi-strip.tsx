import type { kpis } from '@/lib/sales'
import { cn } from '@/lib/utils'

type Kpis = ReturnType<typeof kpis>

export function KpiStrip({ k }: { k: Kpis }) {
  const items = [
    { label: 'Applicants', value: k.total, hint: `${k.last30} in the last 30 days` },
    { label: 'Conversion', value: `${k.conversion}%`, hint: `${k.enrolled} enrolled of ${k.submitted} submitted` },
    { label: 'Unfinished apps', value: k.unfinished, hint: 'Started but not submitted' },
    {
      label: 'Outstanding conditions',
      value: k.openConditions,
      hint: `Across ${k.conditionalFiles} conditional offers`,
      emphasis: true,
    },
    { label: 'Admissions on hold', value: k.onHold, hint: 'Saved & closed, back in CRM' },
    { label: 'Visas with INZ', value: k.withInz, hint: 'Lodged or PPI' },
  ]
  return (
    <section aria-label="Key figures" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {items.map((i) => (
        <div
          key={i.label}
          className={cn(
            'flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm',
            i.emphasis ? 'border-warning/40 ring-1 ring-warning/20' : 'border-border',
          )}
        >
          <span className="text-xs font-medium text-muted-foreground">{i.label}</span>
          <span className={cn('text-2xl font-semibold tabular-nums tracking-tight', i.emphasis && 'text-warning')}>
            {i.value}
          </span>
          <span className="text-[11px] leading-snug text-muted-foreground">{i.hint}</span>
        </div>
      ))}
    </section>
  )
}
