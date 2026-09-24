import type { AuditRecord } from '@/lib/internal-control'
import { formatDate } from '@/lib/format'

export function AuditTimeline({ record }: { record: AuditRecord }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">Audit timeline</h2>
      <p className="text-[11px] text-muted-foreground">Full history from decision to compliance</p>
      <ol className="mt-3 flex flex-col">
        {record.timeline.map((event, i) => {
          const last = i === record.timeline.length - 1
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {!last && <span className="w-px flex-1 bg-border" aria-hidden />}
              </div>
              <div className={last ? 'pb-0.5' : 'pb-4'}>
                <p className="text-xs font-medium leading-tight">{event.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{formatDate(event.date)}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
