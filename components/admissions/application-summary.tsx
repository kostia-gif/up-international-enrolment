'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  StickyNote,
  User,
  Building2,
  Hash,
  CircleCheck,
  Layers,
  FileCheck2,
  CircleDashed,
  Zap,
} from 'lucide-react'
import type { Application, Course } from '@/lib/types'
import { AGENCY } from '@/lib/store'
import { counsellorName } from '@/lib/fixtures'
import { formatDate } from '@/lib/format'
import { ReadinessGauges } from '@/components/readiness-gauge'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  admissionsCallouts,
  agentOfferGenerated,
  canGoUnconditional,
} from '@/lib/admissions'
import { toneBadge, toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'

export function ApplicationSummary({ app }: { app: Application }) {
  const callouts = admissionsCallouts(app)
  const offer = agentOfferGenerated(app)
  const unconditionalReady = canGoUnconditional(app)
  const courses: Course[] = app.bundle && app.bundle.length > 0 ? app.bundle : [app.course]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <Link
        href="/admissions"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to review queue
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{app.studentName}</h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {app.preId}
            </span>
          </div>
          {callouts.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {callouts.map((c) => (
                <span
                  key={c.label}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                    toneBadge[c.tone],
                  )}
                >
                  {c.label === 'Fast track' && <Zap className="size-3" aria-hidden />}
                  <span className={cn('size-1.5 rounded-full', toneDot[c.tone])} aria-hidden />
                  {c.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button
          render={<Link href={`/admissions/${app.id}/review`} />}
          nativeButton={false}
          size="lg"
          className="shrink-0 gap-2"
        >
          Start review
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {app.notesToAdmissions && (
            <section className="rounded-lg border border-warning/40 bg-warning/10 p-4">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-warning">
                <StickyNote className="size-4" />
                Note to admissions — read before reviewing
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-foreground/90">
                {app.notesToAdmissions}
              </p>
            </section>
          )}

          <section className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">
                {courses.length > 1 ? `Courses applied for (${courses.length})` : 'Course applied for'}
              </h2>
              {courses.length > 1 && (
                <span className="inline-flex items-center gap-1 rounded bg-ai/10 px-2 py-0.5 text-[11px] font-medium text-ai">
                  <Layers className="size-3" /> Bundle
                </span>
              )}
            </div>
            <ul className="flex flex-col gap-3">
              {courses.map((c, i) => (
                <li
                  key={`${c.programmeName}-${i}`}
                  className="rounded-md border border-border/70 bg-muted/30 p-3"
                >
                  <p className="text-sm font-medium text-pretty">{c.programmeName}</p>
                  <dl className="mt-2 grid gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
                    <Meta label="Provider" value={c.brand} />
                    <Meta label="Campus" value={c.campus} />
                    <Meta label="Intake" value={formatDate(c.intakeDate)} />
                    <Meta label="Tuition" value={c.priceBundle} />
                  </dl>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Evidence status</h2>
            <ul className="flex flex-col divide-y divide-border">
              {app.requirements.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <span className="text-pretty">{r.label}</span>
                    {r.note && (
                      <p className="text-xs text-muted-foreground text-pretty">{r.note}</p>
                    )}
                  </div>
                  <StatusBadge kind="requirement" status={r.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-4 text-sm font-semibold">Readiness</h2>
            <ReadinessGauges app={app} />
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 text-xs">
              <Row
                icon={offer ? FileCheck2 : CircleDashed}
                tone={offer ? 'text-ai' : 'text-muted-foreground'}
                label={offer ? 'Agent generated a conditional offer' : 'No agent offer yet'}
              />
              <Row
                icon={unconditionalReady ? CircleCheck : CircleDashed}
                tone={unconditionalReady ? 'text-success' : 'text-muted-foreground'}
                label={
                  unconditionalReady
                    ? 'Eligible for an unconditional offer'
                    : 'Conditional offer only for now'
                }
              />
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Agent</h2>
            <dl className="flex flex-col gap-2.5 text-sm">
              <IconMeta icon={User} label="Counsellor" value={counsellorName(app.agentId)} />
              <IconMeta icon={Building2} label="Agency" value={AGENCY.name} />
              {app.agentRef && (
                <IconMeta icon={Hash} label="Agent reference" value={app.agentRef} />
              )}
            </dl>
          </section>

          {app.conditions.filter((c) => c.status !== 'cleared').length > 0 && (
            <section className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold">Outstanding conditions</h2>
              <ul className="flex flex-col gap-2">
                {app.conditions
                  .filter((c) => c.status !== 'cleared')
                  .map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-pretty">{c.label}</span>
                      <StatusBadge kind="condition" status={c.status} iconOnly />
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-pretty">{value}</dd>
    </div>
  )
}

function IconMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-pretty">{value}</dd>
      </div>
    </div>
  )
}

function Row({
  icon: Icon,
  tone,
  label,
}: {
  icon: typeof CircleCheck
  tone: string
  label: string
}) {
  return (
    <p className={cn('inline-flex items-center gap-1.5 font-medium', tone)}>
      <Icon className="size-3.5 shrink-0" />
      {label}
    </p>
  )
}
