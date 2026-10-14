'use client'

import { ArrowRight, CircleCheck, CircleAlert, OctagonX, Sparkles, FileText } from 'lucide-react'
import type { Application } from '@/lib/types'
import { initialChecks, inzDeclineRate, nationalityOf } from '@/lib/pre-enrolment'
import { cn } from '@/lib/utils'

type Status = 'pass' | 'warn' | 'fail'

const STATUS_STYLE: Record<Status, { icon: typeof CircleCheck; className: string }> = {
  pass: { icon: CircleCheck, className: 'text-success' },
  warn: { icon: CircleAlert, className: 'text-warning' },
  fail: { icon: OctagonX, className: 'text-destructive' },
}

// Shown on the first review page only. These run before the review starts, so
// the admissions officer sees the outcome rather than re-doing the work.
export function PreReviewStatus({ app }: { app: Application }) {
  return (
    <div className="mb-5 grid gap-4 lg:grid-cols-2">
      <InitialChecksStatus app={app} />
      <RenamedFiles app={app} />
    </div>
  )
}

function InitialChecksStatus({ app }: { app: Application }) {
  const decline = inzDeclineRate(nationalityOf(app))
  const rows = initialChecks(app).map((c) => {
    let status: Status = c.outcome.blocking ? 'fail' : c.outcome.tone === 'warning' ? 'warn' : 'pass'
    let detail = c.outcome.label
    if (c.def.key === 'channel') {
      if (decline.band === 'extreme') status = 'fail'
      else if (decline.band === 'elevated' && status === 'pass') status = 'warn'
      detail = `${c.outcome.label} · INZ decline ${decline.rate}% (${decline.nationality})`
    }
    return { key: c.def.key, title: c.def.title, detail, status }
  })
  const allPassed = rows.every((r) => r.status !== 'fail')

  return (
    <section
      aria-labelledby="initial-checks-status"
      className={cn(
        'rounded-lg border bg-card p-4',
        allPassed ? 'border-success/30' : 'border-destructive/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="initial-checks-status" className="text-sm font-semibold">
            Initial checks
          </h2>
          <p className="text-[11px] text-muted-foreground">Completed before review</p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
            allPassed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
          )}
        >
          {allPassed ? 'All passed' : 'Should not be in review'}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((r) => {
          const { icon: Icon, className } = STATUS_STYLE[r.status]
          return (
            <li key={r.key} className="flex items-start gap-2.5 text-sm">
              <Icon className={cn('mt-0.5 size-4 shrink-0', className)} aria-hidden />
              <div className="min-w-0">
                <p className="font-medium">{r.title}</p>
                <p className="text-pretty text-xs text-muted-foreground">{r.detail}</p>
              </div>
              <span className="sr-only">
                {r.status === 'pass' ? 'Passed' : r.status === 'warn' ? 'Passed with note' : 'Failed'}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function RenamedFiles({ app }: { app: Application }) {
  const docs = app.documents
  const renamed = docs.filter((d) => d.originalName !== d.fileName)

  return (
    <section aria-labelledby="renamed-files" className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="renamed-files" className="text-sm font-semibold">
            Files renamed
          </h2>
          <p className="text-[11px] text-muted-foreground">Document Name + Student ID</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-info/10 px-2 py-0.5 text-[11px] font-medium text-info">
          <Sparkles className="size-3" aria-hidden /> AI renamed {renamed.length} of {docs.length}
        </span>
      </div>

      {docs.length > 0 ? (
        <ul className="mt-3 flex max-h-44 flex-col gap-2 overflow-y-auto">
          {docs.map((d) => (
            <li key={d.id} className="flex items-start gap-2.5 text-sm">
              <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs">
                <span className="truncate text-muted-foreground line-through decoration-muted-foreground/50">
                  {d.originalName}
                </span>
                <ArrowRight className="size-3 shrink-0 text-muted-foreground" aria-hidden />
                <span className="truncate font-medium text-foreground">{d.fileName}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No documents on this application yet.</p>
      )}
    </section>
  )
}
