import { CircleCheck, CircleAlert, CircleDashed, FileText, ShieldCheck } from 'lucide-react'
import type { AuditRecord, EvidenceItem, EvidenceState } from '@/lib/internal-control'
import { evidenceAvailableCount } from '@/lib/internal-control'
import { cn } from '@/lib/utils'

function stateIcon(state: EvidenceState) {
  if (state === 'available') return CircleCheck
  if (state === 'different') return CircleAlert
  return CircleDashed
}

function stateTone(state: EvidenceState) {
  if (state === 'available') return 'text-success'
  if (state === 'different') return 'text-warning'
  return 'text-destructive'
}

function EvidenceList({ items }: { items: EvidenceItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border/70">
      {items.map((item) => {
        const Icon = stateIcon(item.state)
        return (
          <li key={item.label} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
            <Icon className={cn('mt-0.5 size-4 shrink-0', stateTone(item.state))} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium leading-tight">{item.label}</p>
              {item.value && (
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground text-pretty">
                  {item.value}
                </p>
              )}
              {item.note && (
                <p className="mt-0.5 text-[11px] font-medium leading-tight text-warning">
                  {item.note}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

// The top-of-workspace completeness summary: which required sources are in.
export function EvidenceStatus({ record }: { record: AuditRecord }) {
  const { available, total } = evidenceAvailableCount(record)
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Evidence status</h2>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[11px] font-medium',
            available === total
              ? 'border-success/25 bg-success/12 text-success'
              : 'border-warning/25 bg-warning/12 text-warning',
          )}
        >
          {available} of {total} required evidence sources available
        </span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {record.evidenceStatus.map((e) => (
          <li
            key={e.label}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-2.5 py-2',
              e.available
                ? 'border-success/25 bg-success/[0.06]'
                : 'border-destructive/25 bg-destructive/[0.06]',
            )}
          >
            {e.available ? (
              <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
            ) : (
              <CircleAlert className="size-4 shrink-0 text-destructive" aria-hidden />
            )}
            <span className="text-[11px] font-medium leading-tight text-pretty">{e.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Right column: the two evidence groups, kept visually very distinct.
export function EvidenceGroups({ record }: { record: AuditRecord }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-info/12 text-info">
            <FileText className="size-3.5" />
          </span>
          <h3 className="text-sm font-semibold leading-tight">Original admissions evidence</h3>
        </div>
        <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
          Available when International Admissions approved the application
        </p>
        <EvidenceList items={record.originalEvidence} />
      </section>

      <section className="rounded-2xl border border-ai/25 bg-ai/[0.04] p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-ai/15 text-ai">
            <ShieldCheck className="size-3.5" />
          </span>
          <h3 className="text-sm font-semibold leading-tight">Final compliance evidence</h3>
        </div>
        <p className="mb-3 mt-1 text-[11px] text-muted-foreground">
          Often only available after the student arrives in New Zealand
        </p>
        <EvidenceList items={record.finalEvidence} />
      </section>
    </div>
  )
}
