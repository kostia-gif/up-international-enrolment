'use client'

import { useRef, type RefObject } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowRight,
  CircleAlert,
  CircleArrowRight,
  CircleCheck,
  Download,
  FileText,
  Hourglass,
  Upload,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { relativeTime } from '@/lib/format'
import { hasOffer, isUnconditional, nextAction, WAITING_LABEL } from '@/lib/dashboard'
import { unconditionalChecklist } from '@/lib/documents'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function ApplicationPreview({
  app,
  onOpenChange,
}: {
  app: Application | undefined
  onOpenChange: (open: boolean) => void
}) {
  // Focus the top of the scroll area on open; the default first-tabbable
  // target sits mid-body and scrolls the modal past the next action.
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <Dialog open={Boolean(app)} onOpenChange={onOpenChange}>
      <DialogContent
        initialFocus={bodyRef}
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        {app && <PreviewBody app={app} bodyRef={bodyRef} />}
      </DialogContent>
    </Dialog>
  )
}

interface ChecklistRow {
  id: string
  title: string
  detail?: string
}

function checklistGroups(app: Application) {
  const conditionItems = hasOffer(app) && !isUnconditional(app) ? unconditionalChecklist(app) : []
  const requirements = app.requirements.filter((r) => r.status !== 'not-applicable')

  const needed: ChecklistRow[] = [
    ...conditionItems
      .filter((i) => i.state === 'outstanding')
      .map((i) => ({ id: i.id, title: i.document, detail: i.detail })),
    // Once an offer has conditions, those are the agent's to-do list; unmet entry
    // requirements are already restated as conditions, so listing both would double up.
    ...requirements
      .filter((r) => r.status !== 'met' && conditionItems.length === 0)
      .map((r) => ({
        id: r.id,
        title: r.label,
        detail:
          r.note ??
          (r.status === 'expiring'
            ? 'Expires before the course starts · upload a new one'
            : r.status === 'problem'
              ? 'Problem with the evidence · upload a new one'
              : 'Not provided yet'),
      })),
  ]
  const withUp: ChecklistRow[] = conditionItems
    .filter((i) => i.state === 'with-up')
    .map((i) => ({ id: i.id, title: i.document, detail: 'Submitted · UP admissions is checking it' }))
  const done: ChecklistRow[] = [
    ...requirements.filter((r) => r.status === 'met').map((r) => ({ id: r.id, title: r.label })),
    ...conditionItems
      .filter((i) => i.state === 'received')
      .map((i) => ({ id: i.id, title: i.document })),
  ]
  return { needed, withUp, done }
}

function PreviewBody({
  app,
  bodyRef,
}: {
  app: Application
  bodyRef: RefObject<HTMLDivElement | null>
}) {
  const action = nextAction(app)
  const yours = action.owner === 'you'
  const offered = hasOffer(app)
  const unconditional = isUnconditional(app)
  const { needed, withUp, done } = checklistGroups(app)
  const events = [...app.events].sort((a, b) => b.ts.localeCompare(a.ts))
  const lastUpdate = events[0]?.ts ?? app.createdAt
  const documentsHref = `/applications/${app.id}?tab=documents`
  const issuer = app.looIssuedBy === 'agent' ? 'you' : 'UP'
  const offerTitle = `${unconditional ? 'Unconditional' : 'Conditional'} offer issued by ${issuer}`

  return (
    <>
      <DialogHeader className="shrink-0 gap-1 border-b border-border px-6 py-5 pr-14">
        <div className="flex flex-wrap items-center gap-2">
          <DialogTitle className="text-xl font-semibold">{app.studentName}</DialogTitle>
          <span className="rounded-full border border-primary/30 bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            {app.stage}
          </span>
        </div>
        <DialogDescription className="text-pretty">
          {app.course.programmeName} · Updated {relativeTime(lastUpdate)}
        </DialogDescription>
      </DialogHeader>

      <div
        ref={bodyRef}
        tabIndex={-1}
        className="grid min-h-0 flex-1 overflow-y-auto outline-none md:grid-cols-[minmax(0,1fr)_17rem]"
      >
        <div className="flex flex-col gap-6 p-6">
          {offered ? (
            <section
              aria-label="Offer"
              className="flex flex-wrap items-start justify-between gap-3 bg-secondary px-5 py-4"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="font-semibold text-secondary-foreground">{offerTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {issuer === 'UP'
                    ? 'UP Education emails this offer to you and the student.'
                    : 'You issued this offer when you submitted the application.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success('Letter of Offer downloaded (PDF)')}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-secondary-foreground"
              >
                <Download className="size-3.5" aria-hidden />
                Download offer
              </button>
            </section>
          ) : (
            <section
              aria-label="Next step"
              className={cn(
                'flex items-start gap-3 border px-5 py-4',
                yours ? 'border-action-border bg-action-soft' : 'border-border bg-muted/50',
              )}
            >
              {yours ? (
                <CircleArrowRight className="mt-0.5 size-5 shrink-0 text-action" aria-hidden />
              ) : (
                <Hourglass className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="text-xs font-medium text-muted-foreground">{WAITING_LABEL[action.owner]}</p>
                <p className="text-sm font-semibold text-pretty">{action.label}</p>
              </div>
            </section>
          )}

          {needed.length + withUp.length + done.length > 0 && (
            <section aria-labelledby="preview-checklist" className="flex flex-col gap-4">
              <h3 id="preview-checklist" className="text-lg font-semibold">
                {offered && !unconditional ? 'To go unconditional' : 'Entry requirements'}
              </h3>

              {needed.length > 0 && (
                <ChecklistGroup label="Needed from you" tone="action">
                  {needed.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3.5">
                      <CircleAlert className="size-5 shrink-0 text-action" aria-hidden />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-sm font-semibold text-pretty">{row.title}</span>
                        {row.detail && (
                          <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                            {row.detail}
                          </span>
                        )}
                      </span>
                      <Button
                        render={<Link href={documentsHref} />}
                        nativeButton={false}
                        size="sm"
                        className="shrink-0 gap-1.5"
                        aria-label={`Upload ${row.title}`}
                      >
                        <Upload className="size-3.5" aria-hidden />
                        Upload
                      </Button>
                    </li>
                  ))}
                </ChecklistGroup>
              )}

              {withUp.length > 0 && (
                <ChecklistGroup label="With UP admissions">
                  {withUp.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3">
                      <Hourglass className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium text-pretty">{row.title}</span>
                        <span className="text-xs text-muted-foreground">{row.detail}</span>
                      </span>
                    </li>
                  ))}
                </ChecklistGroup>
              )}

              {done.length > 0 && (
                <ChecklistGroup label="Done">
                  {done.map((row) => (
                    <li key={row.id} className="flex items-center gap-3 px-4 py-3">
                      <CircleCheck className="size-5 shrink-0 text-success" aria-hidden />
                      <span className="text-sm text-pretty">{row.title}</span>
                    </li>
                  ))}
                </ChecklistGroup>
              )}
            </section>
          )}
        </div>

        <aside
          aria-label="Application summary"
          className="flex flex-col gap-7 border-t border-border bg-muted/50 p-6 md:border-t-0 md:border-l"
        >
          <section aria-labelledby="preview-details" className="flex flex-col gap-3">
            <h3 id="preview-details" className="text-sm font-semibold">
              Application details
            </h3>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
              <Detail label="Reference" value={app.preId} mono />
              <Detail label="Started" value={relativeTime(app.createdAt)} />
              <Detail label="Intake" value={intakeLabel(app.course.intakeDate)} />
              <Detail
                label="Campus"
                value={app.course.delivery === 'online' ? 'Online' : app.course.campus}
              />
              <Detail label="Duration" value={`${app.course.durationMonths} months`} />
            </dl>
          </section>

          <section aria-labelledby="preview-docs" className="flex flex-col gap-3">
            <h3 id="preview-docs" className="text-sm font-semibold">
              Uploaded documents
            </h3>
            {app.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">None yet</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {app.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 text-sm">
                    <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="truncate">{d.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {events.length > 0 && (
            <section aria-labelledby="preview-activity" className="flex flex-col gap-3">
              <h3 id="preview-activity" className="text-sm font-semibold">
                Activity
              </h3>
              <ol className="flex flex-col">
                {events.slice(0, 4).map((e, i, list) => (
                  <li key={`${e.ts}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < list.length - 1 && (
                      <span className="absolute top-3 bottom-0 left-[4.5px] w-px bg-input" aria-hidden />
                    )}
                    <span
                      className={cn(
                        'relative mt-1.5 size-2.5 shrink-0 rounded-full',
                        i === 0 ? 'bg-primary' : 'border border-muted-foreground bg-muted',
                      )}
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm text-pretty">{e.label}</span>
                      <span className="text-xs text-muted-foreground">{relativeTime(e.ts)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-border px-6 py-4">
        <Button
          variant="outline"
          render={<Link href={`/applications/${app.id}`} />}
          nativeButton={false}
          className="gap-1.5 border-primary font-semibold text-primary hover:bg-secondary hover:text-secondary-foreground"
        >
          {app.stage === 'Draft' ? 'Continue draft' : 'Open full application'}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </>
  )
}

function ChecklistGroup({
  label,
  tone,
  children,
}: {
  label: string
  tone?: 'action'
  children: React.ReactNode
}) {
  return (
    <div className="border border-border bg-card">
      <p
        className={cn(
          'border-b px-4 py-2 text-xs font-semibold tracking-wide uppercase',
          tone === 'action'
            ? 'border-action-border bg-action-soft text-action'
            : 'border-border bg-muted/50 text-muted-foreground',
        )}
      >
        {label}
      </p>
      <ul className="flex flex-col divide-y divide-border">{children}</ul>
    </div>
  )
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('font-medium text-pretty', mono && 'font-mono text-[13px]')}>{value}</dd>
    </>
  )
}

function intakeLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric' })
}
