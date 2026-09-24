import { TriangleAlert, CircleCheck } from 'lucide-react'
import type { AuditRecord } from '@/lib/internal-control'
import { exceptionMeta } from '@/lib/internal-control'
import { toneBadge } from '@/lib/status'
import { cn } from '@/lib/utils'

export function ExceptionsPanel({ record }: { record: AuditRecord }) {
  if (record.exceptions.length === 0) {
    return (
      <section className="rounded-2xl border border-success/25 bg-success/[0.05] p-4 shadow-sm">
        <div className="flex items-center gap-2.5">
          <CircleCheck className="size-5 shrink-0 text-success" aria-hidden />
          <div>
            <h2 className="text-sm font-semibold leading-tight">No exceptions</h2>
            <p className="text-[11px] text-muted-foreground">
              Every check reconciled cleanly across all evidence sources.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-warning/30 bg-warning/[0.05] p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-warning/15 text-warning">
          <TriangleAlert className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">
            Exceptions ({record.exceptions.length})
          </h2>
          <p className="text-[11px] text-muted-foreground">Discrepancies Internal Control raised</p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {record.exceptions.map((ex, i) => {
          const meta = exceptionMeta[ex.type]
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-2.5"
            >
              <span
                className={cn(
                  'mt-0.5 shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                  toneBadge[meta.tone],
                )}
              >
                {meta.label}
              </span>
              <p className="text-xs leading-snug text-pretty">{ex.detail}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
