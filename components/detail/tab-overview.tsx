'use client'

import { ChevronDown, Database, FileSignature } from 'lucide-react'
import { NewBadge } from '@/components/new-badge'
import { newUpConditionalOffer } from '@/lib/documents'
import type { Application } from '@/lib/types'
import { ReadinessGauges } from '@/components/readiness-gauge'
import { StatusBadge } from '@/components/status-badge'
import { UnconditionalChecklist } from '@/components/unconditional-checklist'
import { hasOffer, isUnconditional, waitingOn, WAITING_LABEL } from '@/lib/dashboard'
import { formatDate, formatDateTime } from '@/lib/format'
import { ConditionsList } from './conditions-list'
import { OfferLetters } from './offer-letters'

export function TabOverview({ app, viewedAt }: { app: Application; viewedAt?: string }) {
  const offer = hasOffer(app)
  const unconditional = isUnconditional(app)
  const openConditions = app.conditions.filter((c) => c.status !== 'cleared')
  const docName = (id?: string) => app.documents.find((d) => d.id === id)?.originalName
  const newUpOffer = newUpConditionalOffer(app, viewedAt)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {newUpOffer && (
          <div role="status" className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
            <FileSignature className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-semibold">
                UP has issued a new conditional offer
                <NewBadge />
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                Issued by {newUpOffer.issuedBy} on {formatDate(newUpOffer.issuedAt)}
                {newUpOffer.includesPricing ? ', with pricing' : ''}. Download it from Letters of offer below.
              </p>
            </div>
          </div>
        )}
        {offer && !unconditional && <UnconditionalChecklist app={app} />}
        {app.conditions.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">
              Conditions{openConditions.length > 0 ? ` (${openConditions.length} open)` : ''}
            </h2>
            <ConditionsList app={app} />
          </section>
        )}

        {offer && <OfferLetters app={app} viewedAt={viewedAt} />}

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

        <details className="group rounded-lg border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-semibold">
            Fields ({app.fields.length})
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <dl className="grid gap-x-6 gap-y-3 border-t border-border p-4 text-sm sm:grid-cols-2">
            {app.fields.map((f) => (
              <div key={f.key}>
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="text-pretty">
                  {f.value || <span className="text-muted-foreground">Missing</span>}
                  {f.sourceDoc && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      {docName(f.sourceDoc)}
                      {f.sourcePage ? ` p.${f.sourcePage}` : ''}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-semibold">Readiness</h2>
          <ReadinessGauges app={app} />
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Status</h2>
          <dl className="grid gap-3 text-sm">
            <Meta label="Stage" value={app.stage} />
            <Meta label="Waiting on" value={WAITING_LABEL[waitingOn(app)]} />
            <Meta label="Programme" value={app.course.programmeName} />
            <Meta label="Campus" value={app.course.campus} />
            <Meta label="Intake" value={formatDate(app.course.intakeDate)} />
            <Meta label="Duration" value={`${app.course.durationMonths} months`} />
          </dl>
        </section>

        <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <Database className="size-3.5 shrink-0" aria-hidden />
          {app.crmPushedAt
            ? `Pushed to Dynamics 365 at ${formatDateTime(app.crmPushedAt)}`
            : 'Not yet pushed'}
        </p>
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
