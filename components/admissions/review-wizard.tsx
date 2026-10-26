'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Check, PauseCircle, StickyNote, ChevronDown, History } from 'lucide-react'
import type { Application, Field } from '@/lib/types'
import { useStore } from '@/lib/store'
import { REVIEW_STEPS, sourceDocument } from '@/lib/admissions'
import { toCrmPayload } from '@/lib/crm'
import {
  computeReadiness,
  blockingItems,
  isFieldComplete,
  requiredFields,
} from '@/lib/readiness'
import { formatDate, formatDateTime } from '@/lib/format'
import { HOLD_REASON_LABEL } from '@/lib/holds'
import { DocPanes } from '@/components/doc-panes'
import { StatusBadge } from '@/components/status-badge'
import { ADMISSIONS_OFFICER } from '@/components/admissions/admissions-header'
import { HoldDialog } from '@/components/admissions/save-close-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function ReviewWizard({ app }: { app: Application }) {
  const [current, setCurrent] = useState(0)
  const [holdOpen, setHoldOpen] = useState(false)
  const step = REVIEW_STEPS[current]
  const last = current === REVIEW_STEPS.length - 1

  return (
    <div>
      <Stepper current={current} onSelect={setCurrent} />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {app.crmHold && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            <History className="mt-0.5 size-4 shrink-0 text-warning" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                On hold — {HOLD_REASON_LABEL[app.crmHold.reason]}.
              </span>{' '}
              {app.crmHold.savedBy}, {formatDate(app.crmHold.savedAt)}
              {app.crmHold.note ? `. ${app.crmHold.note}` : ''}
            </p>
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {app.studentName} · {app.preId} · Step {current + 1} of {REVIEW_STEPS.length}
            </p>
            <h1 className="text-lg font-semibold tracking-tight">{step.title}</h1>
          </div>
          {app.notesToAdmissions && (
            <span
              className="inline-flex max-w-md items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning"
              title={app.notesToAdmissions}
            >
              <StickyNote className="size-3.5 shrink-0" />
              <span className="truncate">{app.notesToAdmissions}</span>
            </span>
          )}
        </div>

        {step.kind === 'documents' && <DocumentsStep app={app} />}
        {step.kind === 'fields' && <FieldsStep app={app} />}
        {step.kind === 'decision' && <DecisionStep app={app} onHold={() => setHoldOpen(true)} />}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
          <Button
            variant="ghost"
            className="gap-1.5"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {!last && (
            <Button className="gap-1.5" onClick={() => setCurrent((c) => c + 1)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </main>

      <HoldDialog app={app} open={holdOpen} onOpenChange={setHoldOpen} />
    </div>
  )
}

function Stepper({ current, onSelect }: { current: number; onSelect: (i: number) => void }) {
  return (
    <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-3 md:px-6">
        {REVIEW_STEPS.map((s, i) => {
          const active = i === current
          const done = i < current
          return (
            <button
              key={s.kind}
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : done
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'grid size-4 place-items-center rounded-full text-[10px] tabular-nums',
                  active ? 'bg-primary-foreground/20' : done ? 'bg-success/20' : 'bg-muted',
                )}
              >
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              {s.short}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DocumentsStep({ app }: { app: Application }) {
  if (app.documents.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
        No documents.
      </p>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      {app.documents.map((d) => (
        <div key={d.id} className="rounded-lg border border-border bg-muted/20 p-4">
          <DocPanes doc={d} />
        </div>
      ))}
    </div>
  )
}

function FieldsStep({ app }: { app: Application }) {
  const { confirmAllAiFields } = useStore()
  const pending = app.fields.filter((f) => f.status === 'ai' || f.status === 'conflict').length
  const sections = Array.from(new Set(app.fields.map((f) => f.section)))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{pending} to confirm</p>
        <Button
          size="sm"
          variant="outline"
          disabled={pending === 0}
          onClick={() => confirmAllAiFields(app.id)}
          className="gap-1.5"
        >
          <Check className="size-3.5" /> Confirm all AI fields
        </Button>
      </div>
      {sections.map((section) => (
        <section key={section}>
          <h2 className="mb-2 text-sm font-semibold">{section}</h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Field</th>
                  <th scope="col" className="px-3 py-2 font-medium">Value</th>
                  <th scope="col" className="px-3 py-2 font-medium">Source</th>
                  <th scope="col" className="px-3 py-2 font-medium">Confidence</th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {app.fields
                  .filter((f) => f.section === section)
                  .map((f) => (
                    <FieldRow key={f.key} app={app} field={f} />
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}

function FieldRow({ app, field }: { app: Application; field: Field }) {
  const { confirmField, setFieldValue } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.value)
  const doc = sourceDocument(app, field)
  const needsAction = field.status === 'ai' || field.status === 'conflict'

  function save() {
    setFieldValue(app.id, field.key, draft.trim())
    setEditing(false)
  }

  return (
    <tr className={cn(needsAction && 'bg-ai/5')}>
      <th scope="row" className="px-3 py-2 text-left font-normal text-muted-foreground">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </th>
      <td className="px-3 py-2 font-medium">
        {editing ? (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) save()
            }}
            className="h-8"
            aria-label={field.label}
            autoFocus
          />
        ) : (
          field.value || <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-3 py-2 text-xs text-muted-foreground">
        {doc ? `${doc.type}${field.sourcePage ? ` p.${field.sourcePage}` : ''}` : field.source === 'agent' ? 'Agent' : '—'}
      </td>
      <td className="px-3 py-2 text-xs tabular-nums text-muted-foreground">
        {field.confidence != null ? `${Math.round(field.confidence * 100)}%` : '—'}
      </td>
      <td className="px-3 py-2 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {editing ? (
            <Button size="sm" onClick={save}>
              Save
            </Button>
          ) : (
            <>
              <StatusBadge kind="field" status={field.status} />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDraft(field.value)
                  setEditing(true)
                }}
              >
                Correct
              </Button>
              {needsAction && field.value.trim() !== '' && (
                <Button size="sm" variant="outline" onClick={() => confirmField(app.id, field.key)}>
                  Confirm
                </Button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function DecisionStep({ app, onHold }: { app: Application; onHold: () => void }) {
  const { approve } = useStore()
  const router = useRouter()
  const readiness = computeReadiness(app)
  const blocking = blockingItems(app)
  const unconfirmed = requiredFields(app.fields).filter((f) => !isFieldComplete(f, app.fields)).length
  const payload = app.crmPayload ?? toCrmPayload(app, new Date().toISOString())

  function handleApprove() {
    approve(app.id, ADMISSIONS_OFFICER.name)
    toast.success('Approved and pushed to Dynamics 365', { description: app.studentName })
    router.push('/admissions')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Readiness</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[11px] text-muted-foreground">Evidence</dt>
              <dd className={cn('font-medium', readiness.evidenceMet ? 'text-success' : 'text-warning')}>
                {readiness.evidenceMet ? 'Met' : 'Not met'}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Required fields</dt>
              <dd className="font-medium tabular-nums">
                {readiness.fieldsDone} / {readiness.fieldsTotal}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-muted-foreground">Unconfirmed</dt>
              <dd className="font-medium tabular-nums">{unconfirmed}</dd>
            </div>
          </dl>
          {blocking.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
              {blocking.map((b) => (
                <li key={b}>· {b}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Conditions</h2>
          <ul className="flex flex-col divide-y divide-border">
            {app.conditions.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="text-pretty">{c.label}</span>
                <StatusBadge kind="condition" status={c.status} className="shrink-0" />
              </li>
            ))}
            {app.conditions.length === 0 && <li className="py-2 text-xs text-muted-foreground">None</li>}
          </ul>
        </section>

        <details className="group rounded-lg border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold">
            Dynamics 365 payload
            <span className="inline-flex items-center gap-2 text-[11px] font-normal text-muted-foreground">
              {app.crmPushedAt ? `Pushed ${formatDateTime(app.crmPushedAt)}` : 'Preview'}
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <pre className="max-h-96 overflow-auto border-t border-border bg-muted/30 px-4 py-3 font-mono text-[11px] leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      </div>

      <aside className="flex flex-col gap-2 self-start rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Decision</h2>
        <Button className="gap-1.5" onClick={handleApprove}>
          <Check className="size-4" /> Approve
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={onHold}>
          <PauseCircle className="size-4" /> Hold
        </Button>
      </aside>
    </div>
  )
}
