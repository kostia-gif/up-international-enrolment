'use client'

import { Check, CircleAlert, Info, Minus, ClipboardList } from 'lucide-react'
import type { Application } from '@/lib/types'
import { SOP_STAGES, tasksFor, taskDone, type SopPlacement, type AutoState } from '@/lib/sop'
import { cn } from '@/lib/utils'

const AUTO_STYLE: Record<AutoState, { icon: typeof Check; cls: string }> = {
  pass: { icon: Check, cls: 'text-success' },
  fail: { icon: CircleAlert, cls: 'text-warning' },
  na: { icon: Minus, cls: 'text-muted-foreground' },
  info: { icon: Info, cls: 'text-primary' },
}

export function SopTasks({
  app,
  step,
  ticks,
  onToggle,
  title = 'SOP tasks for this step',
}: {
  app: Application
  step: SopPlacement
  ticks: Record<string, boolean>
  onToggle: (id: string) => void
  title?: string
}) {
  const tasks = tasksFor(step)
  if (tasks.length === 0) return null
  const done = tasks.filter((t) => taskDone(t, app, ticks)).length
  const stages = Array.from(new Set(tasks.map((t) => t.stage)))

  return (
    <section className="rounded-lg border border-border bg-card" aria-label={title}>
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h2 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ClipboardList className="size-3.5" /> {title}
        </h2>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
            done === tasks.length ? 'bg-success/10 text-success' : 'bg-secondary text-foreground/80',
          )}
        >
          {done}/{tasks.length} complete
        </span>
      </header>
      <div className="flex flex-col">
        {stages.map((stage) => {
          const def = SOP_STAGES.find((s) => s.stage === stage)
          return (
            <div key={stage} className="border-b border-border last:border-b-0">
              <p className="bg-muted/40 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                SOP {stage} · {def?.title}
              </p>
              <ul className="flex flex-col">
                {tasks
                  .filter((t) => t.stage === stage)
                  .map((t) => {
                    const r = t.auto?.(app)
                    const autoOk = r?.state === 'pass' || r?.state === 'na'
                    const ticked = !!ticks[t.id]
                    const complete = ticked || autoOk
                    const style = r ? AUTO_STYLE[r.state] : null
                    const Icon = style?.icon
                    return (
                      <li key={t.id} className="flex items-start gap-2.5 px-3 py-2">
                        <input
                          id={`sop-${t.id}`}
                          type="checkbox"
                          className="mt-0.5 size-4 shrink-0 accent-primary disabled:opacity-60"
                          checked={complete}
                          disabled={autoOk}
                          onChange={() => onToggle(t.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <label
                            htmlFor={`sop-${t.id}`}
                            className={cn(
                              'text-sm leading-snug text-pretty',
                              complete ? 'text-muted-foreground' : 'text-foreground',
                            )}
                          >
                            {t.label}
                            {t.required && !complete && (
                              <span className="ml-1.5 text-[10px] font-medium uppercase tracking-wide text-warning">
                                Required
                              </span>
                            )}
                          </label>
                          {t.detail && (
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
                          )}
                          {r && Icon && (
                            <p className={cn('mt-1 inline-flex items-start gap-1 text-xs', style.cls)}>
                              <Icon className="mt-0.5 size-3 shrink-0" />
                              <span>
                                {r.text}
                                {r.state === 'fail' && ticked && ' · resolved by officer'}
                              </span>
                            </p>
                          )}
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// A 16-stage map of the SOP showing where each stage is captured and how far
// through it this application is.
export function SopCoverage({
  app,
  ticks,
  approved,
}: {
  app: Application
  ticks: Record<string, boolean>
  approved: Record<string, boolean>
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4" aria-labelledby="sop-coverage">
      <h2 id="sop-coverage" className="text-sm font-semibold">
        Pre-enrolment SOP coverage
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Every stage of the current-state procedure, and where this review records it.
      </p>
      <ol className="mt-3 grid gap-1.5 sm:grid-cols-2">
        {SOP_STAGES.map((s) => {
          const tasks = tasksFor(s.step === 'intake' ? 'checks' : s.step).filter((t) => t.stage === s.stage)
          const done = tasks.filter((t) => taskDone(t, app, ticks)).length
          const state =
            s.step === 'post-offer'
              ? 'later'
              : s.step === 'intake' || (approved[s.step] && done === tasks.length)
                ? 'done'
                : done > 0
                  ? 'partial'
                  : 'open'
          return (
            <li
              key={s.stage}
              className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs"
            >
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold tabular-nums',
                  state === 'done'
                    ? 'bg-success/15 text-success'
                    : state === 'partial'
                      ? 'bg-warning/15 text-warning'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {state === 'done' ? <Check className="size-3" /> : s.stage}
              </span>
              <span className="min-w-0 flex-1 truncate text-foreground/90">{s.title}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {state === 'later' ? 'After offer' : tasks.length > 0 ? `${done}/${tasks.length}` : ''}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
