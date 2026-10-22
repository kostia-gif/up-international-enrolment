'use client'

import Link from 'next/link'
import { ArrowRight, Clock, Zap, StickyNote, type LucideIcon } from 'lucide-react'
import type { Application } from '@/lib/types'
import { RelativeTime } from '@/components/relative-time'
import { admissionsQueue, queueGroup, sortedByAge } from '@/lib/admissions'
import { toneBadge, type Tone } from '@/lib/status'
import { cn } from '@/lib/utils'
import { HOLD_REASON_LABEL } from '@/lib/holds'

function QueueCard({ app }: { app: Application }) {
  return (
    <Link
      href={`/admissions/${app.id}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-tight text-pretty">{app.studentName}</p>
          <p className="text-[11px] text-muted-foreground">{app.preId}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground/80">{app.course.brand}</span>
        <span aria-hidden>·</span>
        <span className="text-pretty">{app.course.programmeName}</span>
      </p>
      {app.crmHold && (
        <p
          className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning"
          title={app.crmHold.note || undefined}
        >
          <span className="size-1.5 rounded-full bg-warning" aria-hidden />
          On hold · {HOLD_REASON_LABEL[app.crmHold.reason]}
        </p>
      )}
      {app.notesToAdmissions && (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
          <StickyNote className="mt-0.5 size-3 shrink-0" aria-hidden />
          <span className="line-clamp-2 text-pretty">{app.notesToAdmissions}</span>
        </p>
      )}
      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-3" aria-hidden />
          Submitted <RelativeTime iso={app.createdAt} />
        </span>
        <span className="text-[10px] text-muted-foreground">{app.stage}</span>
      </div>
    </Link>
  )
}

function Group({
  title,
  description,
  tone,
  icon: Icon,
  apps,
}: {
  title: string
  description: string
  tone: Tone
  icon: LucideIcon
  apps: Application[]
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className={cn('grid size-7 place-items-center rounded-lg', toneBadge[tone])}>
          <Icon className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-tight">{title}</h2>
          <p className="truncate text-[11px] text-muted-foreground">{description}</p>
        </div>
        <span className="ml-auto rounded-full bg-card px-2 py-0.5 text-xs font-semibold tabular-nums text-muted-foreground ring-1 ring-border">
          {apps.length}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {apps.map((app) => (
          <QueueCard key={app.id} app={app} />
        ))}
        {apps.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-xs text-muted-foreground">
            None
          </p>
        )}
      </div>
    </section>
  )
}

export function ReviewQueue({ applications }: { applications: Application[] }) {
  const queue = sortedByAge(admissionsQueue(applications))
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Group
        title="Fast-track"
        description="Auto-routed, LoO issued, needs sign-off"
        tone="ai"
        icon={Zap}
        apps={queue.filter((a) => queueGroup(a) === 'fast-track')}
      />
      <Group
        title="Review"
        description="Routed by an agent note"
        tone="info"
        icon={StickyNote}
        apps={queue.filter((a) => queueGroup(a) === 'review')}
      />
    </div>
  )
}
