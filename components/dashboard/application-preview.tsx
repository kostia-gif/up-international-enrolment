'use client'

import Link from 'next/link'
import { ArrowRight, CircleArrowRight, Hourglass } from 'lucide-react'
import type { Application } from '@/lib/types'
import { formatDate, formatDateTime } from '@/lib/format'
import { hasOffer, isUnconditional, nextAction, offerSummary, WAITING_LABEL } from '@/lib/dashboard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/status-badge'
import { UnconditionalChecklist } from '@/components/unconditional-checklist'
import { CardDropPanel } from './card-drop-panel'
import { cn } from '@/lib/utils'

export function ApplicationPreview({
  app,
  onOpenChange,
}: {
  app: Application | undefined
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={Boolean(app)} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        {app && <PreviewBody app={app} />}
      </DialogContent>
    </Dialog>
  )
}

function PreviewBody({ app }: { app: Application }) {
  const action = nextAction(app)
  const yours = action.owner === 'you'
  const offer = offerSummary(app)
  const conditional = hasOffer(app) && !isUnconditional(app)
  const requirements = app.requirements.filter((r) => r.status !== 'not-applicable')
  const recent = [...app.events].sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 4)
  const location = app.course.delivery === 'online' ? 'Online' : app.course.campus

  return (
    <>
      <DialogHeader className="shrink-0 gap-1 border-b border-border p-5 pr-12">
        <p className="text-xs font-medium text-muted-foreground">
          {app.stage === 'Draft' ? 'Draft' : app.stage} · <span className="font-mono">{app.preId}</span>
        </p>
        <DialogTitle className="text-lg font-semibold">{app.studentName}</DialogTitle>
        <DialogDescription className="text-pretty">{app.course.programmeName}</DialogDescription>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
        <section
          aria-label="Next step"
          className={cn(
            'flex items-start gap-3 rounded-lg border p-3.5',
            yours ? 'border-warning/40 bg-warning/10' : 'border-border bg-muted/50',
          )}
        >
          {yours ? (
            <CircleArrowRight className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          ) : (
            <Hourglass className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
          )}
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-medium text-muted-foreground">{WAITING_LABEL[action.owner]}</p>
            <p className="text-sm font-semibold text-pretty">{action.label}</p>
          </div>
        </section>

        {(offer || app.stage === 'Submitted') && (
          <section aria-labelledby="preview-offer" className="flex flex-col gap-2">
            <h3 id="preview-offer" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Offer
            </h3>
            <p className="text-sm font-medium">{offer ?? 'No offer yet — with UP admissions'}</p>
          </section>
        )}

        {conditional && <UnconditionalChecklist app={app} />}

        <CardDropPanel app={app} />

        {requirements.length > 0 && (
          <section aria-labelledby="preview-evidence" className="flex flex-col gap-2">
            <h3 id="preview-evidence" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Evidence requirements
            </h3>
            <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {requirements.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="text-pretty">{r.label}</span>
                  <StatusBadge kind="requirement" status={r.status} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="preview-course" className="flex flex-col gap-2">
          <h3 id="preview-course" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Course
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Detail label="Provider" value={app.course.brand} />
            <Detail label="Location" value={location} />
            <Detail label="Intake" value={formatDate(app.course.intakeDate)} />
            <Detail label="Documents" value={`${app.documents.length} on file`} />
          </dl>
        </section>

        {recent.length > 0 && (
          <section aria-labelledby="preview-activity" className="flex flex-col gap-2">
            <h3 id="preview-activity" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recent activity
            </h3>
            <ol className="flex flex-col gap-2">
              {recent.map((e, i) => (
                <li key={`${e.ts}-${i}`} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-pretty">{e.label}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {formatDateTime(e.ts)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-border bg-muted/40 p-4">
        <Button render={<Link href={`/applications/${app.id}`} />} nativeButton={false} className="gap-1.5">
          {app.stage === 'Draft' ? 'Continue draft' : 'Open application'}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-pretty">{value}</dd>
    </div>
  )
}
