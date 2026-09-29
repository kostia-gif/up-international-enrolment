import { CheckCircle2, CircleAlert, CircleDashed, Workflow } from 'lucide-react'
import {
  controlResultMeta,
  controlSummary,
  processControlsFor,
  type ControlPhase,
  type ControlResult,
  type ControlRow,
} from '@/lib/ic-process'
import { toneBadge } from '@/lib/status'
import { cn } from '@/lib/utils'

const PHASE_ORDER: ControlPhase[] = ['Initial checks', 'Assessment', 'Offer', 'Payment', 'Enrolment']

const RESULT_ICON: Record<ControlResult, typeof CheckCircle2> = {
  pass: CheckCircle2,
  exception: CircleAlert,
  'not-evidenced': CircleDashed,
}

const RESULT_ICON_CLASS: Record<ControlResult, string> = {
  pass: 'text-success',
  exception: 'text-destructive',
  'not-evidenced': 'text-warning',
}

export function ProcessControls({ recordId }: { recordId: string }) {
  const rows = processControlsFor(recordId)
  const summary = controlSummary(rows)

  return (
    <section className="rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
        <div className="flex items-start gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ai/12 text-ai">
            <Workflow className="size-3.5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold leading-tight">Pre-enrolment process controls</h2>
            <p className="mt-0.5 text-pretty text-[11px] text-muted-foreground">
              Each admissions control re-performed against the CRM trail — from initial checks to the
              push to Yoobee.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          <span className={cn('rounded-full border px-2 py-0.5', toneBadge.success)}>
            {summary.pass}/{summary.total} evidenced
          </span>
          {summary.exception > 0 && (
            <span className={cn('rounded-full border px-2 py-0.5', toneBadge.danger)}>
              {summary.exception} exception{summary.exception > 1 ? 's' : ''}
            </span>
          )}
          {summary.missing > 0 && (
            <span className={cn('rounded-full border px-2 py-0.5', toneBadge.warning)}>
              {summary.missing} not evidenced
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
        {PHASE_ORDER.map((phase) => (
          <PhaseColumn key={phase} phase={phase} rows={rows.filter((r) => r.phase === phase)} />
        ))}
      </div>
    </section>
  )
}

function PhaseColumn({ phase, rows }: { phase: ControlPhase; rows: ControlRow[] }) {
  const worst: ControlResult = rows.some((r) => r.result === 'exception')
    ? 'exception'
    : rows.some((r) => r.result === 'not-evidenced')
      ? 'not-evidenced'
      : 'pass'

  return (
    <div className="flex flex-col gap-3 bg-card p-4 first:rounded-bl-2xl last:rounded-br-2xl">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {phase}
        </h3>
        <span
          className={cn('size-2 rounded-full', {
            'bg-success': worst === 'pass',
            'bg-warning': worst === 'not-evidenced',
            'bg-destructive': worst === 'exception',
          })}
          aria-label={controlResultMeta[worst].label}
        />
      </div>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => {
          const Icon = RESULT_ICON[row.result]
          return (
            <li key={row.key} className="flex gap-2">
              <Icon className={cn('mt-0.5 size-4 shrink-0', RESULT_ICON_CLASS[row.result])} />
              <div className="min-w-0">
                <p className="text-xs font-medium leading-snug">{row.title}</p>
                <p className="mt-0.5 text-pretty text-[11px] leading-snug text-muted-foreground">
                  {row.test}
                </p>
                <p
                  className={cn(
                    'mt-1.5 inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium leading-snug',
                    toneBadge[controlResultMeta[row.result].tone],
                  )}
                >
                  {row.note}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
