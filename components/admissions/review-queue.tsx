'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Zap,
  FileCheck2,
  CircleDashed,
  Layers,
  Mail,
  type LucideIcon,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { formatShortDate } from '@/lib/format'
import { RelativeTime } from '@/components/relative-time'
import {
  admissionsQueue,
  admissionsBucket,
  admissionsCallouts,
  agentOfferGenerated,
  sortedAwaiting,
  engagementSummary,
  lastCrmSync,
  type AdmissionsBucket,
} from '@/lib/admissions'
import { toneBadge, toneDot, type Tone } from '@/lib/status'
import { cn } from '@/lib/utils'
import { HOLD_REASON_LABEL } from '@/lib/holds'

function Callouts({ app }: { app: Application }) {
  const callouts = admissionsCallouts(app)
  if (callouts.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {callouts.map((c) => (
        <span
          key={c.label}
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
            toneBadge[c.tone],
          )}
        >
          {c.label === 'Fast track' && <Zap className="size-3" aria-hidden />}
          <span className={cn('size-1.5 rounded-full', toneDot[c.tone])} aria-hidden />
          {c.label}
        </span>
      ))}
    </div>
  )
}

function CourseLine({ app }: { app: Application }) {
  const extra = app.bundle && app.bundle.length > 1 ? app.bundle.length - 1 : 0
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground/80">{app.course.brand}</span>
      <span aria-hidden>·</span>
      <span className="text-pretty">{app.course.programmeName}</span>
      {extra > 0 && (
        <span className="inline-flex items-center gap-1 rounded bg-ai/10 px-1.5 py-0.5 text-[10px] font-medium text-ai">
          <Layers className="size-3" /> +{extra} in bundle
        </span>
      )}
    </p>
  )
}

// Continuous-sync marker: master data lives in Dynamics CRM, so every card
// shows when the record was last reconciled to reassure officers it is current.
function CrmSync({ app }: { app: Application }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      Synced with CRM <RelativeTime iso={lastCrmSync(app)} />
    </span>
  )
}

// Recent communications indicator. Nested inside the card's Link, so it cancels
// navigation and opens the communications flow focused on this applicant.
function EngagementChip({
  app,
  onOpenComms,
}: {
  app: Application
  onOpenComms: (id: string) => void
}) {
  const e = engagementSummary(app)
  if (e.commsCount === 0) return null
  const label =
    e.docCount > 0
      ? `${e.docCount} new doc${e.docCount === 1 ? '' : 's'}`
      : `${e.commsCount} message${e.commsCount === 1 ? '' : 's'}`
  function open(ev: React.SyntheticEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    onOpenComms(app.id)
  }
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') open(ev)
      }}
      title={e.lastLabel ? `${e.lastLabel} — view communications` : 'View communications'}
      className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info transition-colors hover:border-info/60 hover:bg-info/15"
    >
      <Mail className="size-3" aria-hidden />
      {label}
    </span>
  )
}

function QueueCard({
  app,
  rank,
  onOpenComms,
}: {
  app: Application
  rank?: number
  onOpenComms: (id: string) => void
}) {
  const offer = agentOfferGenerated(app)
  return (
    <Link
      href={`/admissions/${app.id}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {rank != null && (
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
            {rank}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight text-pretty">{app.studentName}</p>
              <p className="text-[11px] text-muted-foreground">{app.preId}</p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
          </div>
          <CourseLine app={app} />
          {app.crmHold && (
            <p
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning"
              title={app.crmHold.note || undefined}
            >
              <span className="size-1.5 rounded-full bg-warning" aria-hidden />
              On hold · {HOLD_REASON_LABEL[app.crmHold.reason]} · at {app.crmHold.stepTitle}
            </p>
          )}
          <div className="mt-2">
            <Callouts app={app} />
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5 border-t border-border/60 pt-2">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-3" aria-hidden />
                Submitted <RelativeTime iso={app.createdAt} />
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-medium',
                  offer ? 'text-ai' : 'text-muted-foreground',
                )}
              >
                {offer ? (
                  <>
                    <FileCheck2 className="size-3.5" aria-hidden /> Agent conditional offer
                  </>
                ) : (
                  <>
                    <CircleDashed className="size-3.5" aria-hidden /> No offer yet
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <CrmSync app={app} />
              <EngagementChip app={app} onOpenComms={onOpenComms} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function DenseCard({
  app,
  onOpenComms,
}: {
  app: Application
  onOpenComms: (id: string) => void
}) {
  return (
    <Link
      href={`/admissions/${app.id}`}
      className="group flex flex-col gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{app.studentName}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {app.course.brand} · {formatShortDate(app.course.intakeDate)}
          </p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-1.5">
        <CrmSync app={app} />
        <EngagementChip app={app} onOpenComms={onOpenComms} />
      </div>
    </Link>
  )
}

const BUCKET_ICON: Record<AdmissionsBucket, LucideIcon> = {
  awaiting: Clock,
  conditional: FileCheck2,
  decided: FileCheck2,
}

function BucketHeader({
  title,
  description,
  count,
  tone,
  icon: Icon,
}: {
  title: string
  description: string
  count: number
  tone: Tone
  icon: LucideIcon
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2.5">
      <span className={cn('grid size-7 place-items-center rounded-lg', toneBadge[tone])}>
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold leading-tight">{title}</h2>
        <p className="truncate text-[11px] text-muted-foreground">{description}</p>
      </div>
      <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
        {count}
      </span>
    </div>
  )
}

export function ReviewQueue({
  applications,
  onOpenComms,
}: {
  applications: Application[]
  onOpenComms: (id: string) => void
}) {
  const queue = admissionsQueue(applications)
  const awaiting = sortedAwaiting(queue.filter((a) => admissionsBucket(a) === 'awaiting'))
  const conditional = queue.filter((a) => admissionsBucket(a) === 'conditional')
  const decided = queue.filter((a) => admissionsBucket(a) === 'decided')

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="lg:col-span-2">
        <BucketHeader
          title="Awaiting review"
          description="Submitted by agents — prioritised, fast-track first"
          count={awaiting.length}
          tone="info"
          icon={Clock}
        />
        <div className="flex flex-col gap-2.5">
          {awaiting.map((app, i) => (
            <QueueCard key={app.id} app={app} rank={i + 1} onOpenComms={onOpenComms} />
          ))}
          {awaiting.length === 0 && (
            <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-xs text-muted-foreground">
              Nothing waiting on admissions right now.
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <section>
          <BucketHeader
            title="Conditional — tracking"
            description="Offer issued, conditions outstanding"
            count={conditional.length}
            tone="ai"
            icon={BUCKET_ICON.conditional}
          />
          <div className="flex flex-col gap-2">
            {conditional.map((app) => (
              <DenseCard key={app.id} app={app} onOpenComms={onOpenComms} />
            ))}
            {conditional.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                None
              </p>
            )}
          </div>
        </section>

        <section>
          <BucketHeader
            title="Decided"
            description="Unconditional, accepted or enrolled"
            count={decided.length}
            tone="success"
            icon={BUCKET_ICON.decided}
          />
          <div className="flex flex-col gap-2">
            {decided.map((app) => (
              <DenseCard key={app.id} app={app} onOpenComms={onOpenComms} />
            ))}
            {decided.length === 0 && (
              <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                None
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
