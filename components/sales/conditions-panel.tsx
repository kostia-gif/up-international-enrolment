import type { conditionBreakdown } from '@/lib/sales'
import type { Audience } from '@/lib/entry-requirements'
import { toneBadge, toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'
import { displayName } from './display'

type Breakdown = ReturnType<typeof conditionBreakdown>

export function ConditionsPanel({ data, audience }: { data: Breakdown; audience: Audience }) {
  const maxType = Math.max(1, ...data.byType.map((t) => t.count))
  const showList = audience !== 'stakeholder'
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-warning/30 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold">Outstanding conditions</h2>
          <p className="text-xs text-muted-foreground">
            {data.total} conditions open across {data.files} conditional offers. Each one blocks an unconditional offer and the visa.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-medium text-muted-foreground">By condition type</h3>
          {data.byType.map((t) => (
            <div key={t.type} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="font-medium">{t.type}</span>
                <span className="tabular-nums text-muted-foreground">
                  <span className="font-semibold text-foreground">{t.count}</span> · avg {t.avgAge}d
                  {t.stale > 0 && <span className="text-danger"> · {t.stale} over 30d</span>}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-warning" style={{ width: `${(t.count / maxType) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs font-medium text-muted-foreground">Age of open conditions</h3>
          <div className="grid grid-cols-2 gap-2">
            {data.byAge.map((b) => (
              <div key={b.label} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={cn('size-1.5 rounded-full', toneDot[b.tone])} aria-hidden />
                  {b.label}
                </span>
                <span className="text-xl font-semibold tabular-nums">{b.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showList && data.oldest.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">Chase list — oldest first</h3>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Student</th>
                  {audience === 'internal' && <th scope="col" className="px-3 py-2 font-medium">Agency</th>}
                  <th scope="col" className="px-3 py-2 font-medium">Programme</th>
                  <th scope="col" className="px-3 py-2 font-medium">Conditions</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Oldest</th>
                </tr>
              </thead>
              <tbody>
                {data.oldest.slice(0, 8).map(({ record, maxAge }) => (
                  <tr key={record.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{displayName(record, audience)}</td>
                    {audience === 'internal' && <td className="px-3 py-2 text-muted-foreground">{record.agencyName}</td>}
                    <td className="px-3 py-2 text-muted-foreground">
                      {record.brand} · {record.programme}
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex flex-wrap gap-1">
                        {record.conditions.map((c) => (
                          <span key={c.type} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                            {c.type}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[10px] font-medium tabular-nums',
                          toneBadge[maxAge > 60 ? 'danger' : maxAge > 30 ? 'warning' : 'neutral'],
                        )}
                      >
                        {maxAge}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
