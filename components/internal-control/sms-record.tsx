import { Database } from 'lucide-react'
import type { AuditRecord } from '@/lib/internal-control'
import { smsMeta } from '@/lib/internal-control'
import { toneBadge } from '@/lib/status'
import { cn } from '@/lib/utils'

// The Student Management System record held by the school — the final
// operational source of truth that Internal Control checks against.
export function SmsRecord({ record }: { record: AuditRecord }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-info/12 text-info">
          <Database className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">School SMS record</h2>
          <p className="text-[11px] text-muted-foreground">
            {record.school} · Student Management System
          </p>
        </div>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {record.smsRecord.map((item) => {
          const meta = smsMeta[item.state]
          return (
            <li
              key={item.label}
              className={cn(
                'rounded-lg border p-2.5',
                item.state === 'present'
                  ? 'border-border bg-secondary/30'
                  : item.state === 'different'
                    ? 'border-warning/25 bg-warning/[0.06]'
                    : 'border-destructive/25 bg-destructive/[0.06]',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </span>
                <span
                  className={cn(
                    'rounded-full border px-1.5 py-0.5 text-[9px] font-medium',
                    toneBadge[meta.tone],
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-pretty">
                {item.value ?? <span className="text-muted-foreground">Not recorded</span>}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
