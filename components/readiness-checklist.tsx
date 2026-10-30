import { AlertTriangle, Circle, CircleCheck, CircleDashed } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Application } from '@/lib/types'
import { readinessSummary } from '@/lib/readiness'

type RowState = 'done' | 'open' | 'idle'

function Row({ state, label, detail }: { state: RowState; label: string; detail?: string }) {
  const Icon = state === 'done' ? CircleCheck : state === 'open' ? CircleDashed : Circle
  return (
    <li className="flex items-start gap-2.5">
      <Icon
        aria-hidden
        className={cn(
          'mt-0.5 size-4 shrink-0',
          state === 'done'
            ? 'text-success'
            : state === 'open'
              ? 'text-warning'
              : 'text-muted-foreground/60',
        )}
      />
      <div className="min-w-0">
        <p className="text-sm font-medium leading-5">{label}</p>
        {detail && <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{detail}</p>}
      </div>
    </li>
  )
}

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

export function ReadinessChecklist({ app, className }: { app: Application; className?: string }) {
  const s = readinessSummary(app)
  const entryProblems = app.requirements.filter((r) => r.status === 'problem' && r.note)

  const reqState: RowState =
    s.requirements.total === 0 ? 'idle' : s.requirements.outstanding.length === 0 ? 'done' : 'open'
  const reqParts = [
    `${s.requirements.met} of ${s.requirements.total} met`,
    ...s.requirements.outstanding.slice(0, 2),
    s.requirements.outstanding.length > 2 ? `+${s.requirements.outstanding.length - 2}` : null,
    s.requirements.conditioned.length > 0
      ? `${s.requirements.conditioned.length === 1 ? s.requirements.conditioned[0] : `${s.requirements.conditioned.length} items`} becomes a condition on the offer`
      : null,
  ].filter(Boolean)
  const reqDetail =
    s.requirements.total === 0 ? 'Choose a course to see what is needed' : reqParts.join(' · ')

  const a = s.answers
  const hasAnyField = app.documents.length > 0 || app.stage !== 'Draft'
  const ansState: RowState = !hasAnyField ? 'idle' : a.total === 0 ? 'done' : 'open'
  const ansParts = [
    a.conflicts > 0 && plural(a.conflicts, 'conflict'),
    a.toConfirm > 0 && `${a.toConfirm} to confirm`,
    a.missing > 0 && `${a.missing} to complete`,
  ].filter(Boolean) as string[]
  const ansDetail = !hasAnyField
    ? 'Filled from documents, then completed by you'
    : a.total === 0
      ? 'All complete'
      : ansParts.join(' · ')

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={cn(
            'size-2 rounded-full',
            s.ready ? 'bg-success' : 'bg-warning',
          )}
        />
        <p className="text-sm font-semibold">{s.ready ? 'Ready to submit' : 'Not ready to submit'}</p>
      </div>
      <ul className="flex flex-col gap-2.5">
        <Row state={reqState} label="Requirements" detail={reqDetail} />
        <Row state={ansState} label="Answers" detail={ansDetail} />
        <Row
          state={s.ready ? 'done' : 'idle'}
          label="Offer"
          detail={s.ready ? 'Can be issued on submit' : 'Complete the above first'}
        />
      </ul>
      {entryProblems.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-md border border-warning/40 bg-warning/10 p-3" role="status">
          <p className="flex items-center gap-1.5 text-xs font-semibold">
            <AlertTriangle className="size-3.5 text-warning" aria-hidden />
            Entry requirement not met
          </p>
          <ul className="flex flex-col gap-1">
            {entryProblems.map((r) => (
              <li key={r.id} className="text-xs leading-relaxed text-pretty">
                {r.note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
