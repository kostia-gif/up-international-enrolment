'use client'

import { CircleCheck } from 'lucide-react'
import type { Application } from '@/lib/types'
import { ReadinessGauges } from '@/components/readiness-gauge'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/format'
import { RelativeTime } from '@/components/relative-time'
import { actorMeta } from '@/lib/actor'

export function TabOverview({ app }: { app: Application }) {
  const recent = [...app.events].slice(-4).reverse()
  const openConditions = app.conditions.filter((c) => c.status !== 'cleared')

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Course</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <Meta label="Programme" value={app.course.programmeName} />
            <Meta label="Brand" value={app.course.brand} />
            <Meta label="Campus" value={app.course.campus} />
            <Meta label="Intake" value={formatDate(app.course.intakeDate)} />
            <Meta label="Price bundle" value={app.course.priceBundle} />
            <Meta label="Duration" value={`${app.course.durationMonths} months`} />
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Evidence requirements</h2>
          <ul className="flex flex-col divide-y divide-border">
            {app.requirements.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-pretty">{r.label}</span>
                <StatusBadge kind="requirement" status={r.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Recent activity</h2>
          <ul className="flex flex-col gap-3">
            {recent.map((e, i) => {
              const meta = actorMeta[e.actor]
              const Icon = meta.icon
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={`mt-0.5 rounded-full p-1 ${meta.chip}`}>
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-pretty">{e.label}</p>
                    {e.detail && (
                      <p className="text-xs text-muted-foreground text-pretty">{e.detail}</p>
                    )}
                  </div>
                  <RelativeTime
                    className="ml-auto shrink-0 text-xs text-muted-foreground"
                    iso={e.ts}
                  />
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-semibold">Readiness</h2>
          <ReadinessGauges app={app} />
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Outstanding conditions</h2>
          {openConditions.length === 0 ? (
            <p className="flex items-center gap-1.5 text-sm text-success">
              <CircleCheck className="size-4" /> All conditions cleared
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {openConditions.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-pretty">{c.label}</span>
                  <StatusBadge kind="condition" status={c.status} iconOnly />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-pretty">{value}</dd>
    </div>
  )
}
