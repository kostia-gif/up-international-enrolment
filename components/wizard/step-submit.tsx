'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Users,
  Loader,
  CircleCheck,
  ArrowRight,
  ChevronDown,
  CircleAlert,
} from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { useStore } from '@/lib/store'
import { computeRoute, blockingItems, isFieldDone } from '@/lib/readiness'
import { FIELD_SECTIONS } from '@/lib/blank-fields'
import { withCrmPush } from '@/lib/crm'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LetterOfOfferPanel } from '@/components/letter-of-offer'
import { FieldRow } from './field-row'
import type { Application, Field } from '@/lib/types'

type Phase = 'check' | 'generating' | 'done-auto' | 'done-review'

function needsAttention(f: Field): boolean {
  if (f.status === 'conflict') return true
  if (f.source === 'ai' && f.status === 'ai') return true
  return f.required && !isFieldDone(f)
}

export function StepSubmit() {
  const wizard = useWizard()
  const { fields, documents, draft, readiness, setFieldValue, confirmAllAi, notes, setNotes } =
    wizard
  const { addApplication, activeUserId } = useStore()
  const [phase, setPhase] = useState<Phase>('check')
  const [created, setCreated] = useState<Application | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [noteOpen, setNoteOpen] = useState(notes.trim() !== '')

  const route = computeRoute(draft)
  const blocking = blockingItems(draft)
  const looConditions = draft.conditions.map((c) => c.label)
  const visible = useMemo(
    () => (showAll ? fields : fields.filter(needsAttention)),
    [fields, showAll],
  )
  const unconfirmedAi = fields.filter((f) => f.source === 'ai' && f.status === 'ai').length

  const docName = (id?: string) => {
    const d = documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
  }

  function submit() {
    const app = wizard.buildApplication(activeUserId, 'psl')
    const ts = new Date().toISOString()
    if (route === 'auto') {
      setPhase('generating')
      setTimeout(() => {
        const issued = withCrmPush({
          ...app,
          stage: 'Conditional offer',
          route: 'auto',
          events: [
            { ts, actor: 'agent', label: 'Application submitted' },
            { ts, actor: 'up', label: 'Conditional offer issued' },
            { ts, actor: 'up', label: 'Pushed to Dynamics 365' },
          ],
        })
        addApplication(issued)
        setCreated(issued)
        setPhase('done-auto')
      }, 1500)
    } else {
      const submitted: Application = {
        ...app,
        stage: 'Submitted',
        route: 'review',
        events: [{ ts, actor: 'agent', label: 'Submitted to admissions review' }],
      }
      addApplication(submitted)
      setCreated(submitted)
      setPhase('done-review')
    }
  }

  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-16 text-center">
        <Loader className="size-6 animate-spin text-ai" />
        <p className="text-sm font-medium">Generating conditional Letter of Offer…</p>
      </div>
    )
  }

  if ((phase === 'done-auto' || phase === 'done-review') && created) {
    const auto = phase === 'done-auto'
    return (
      <div className="flex flex-col gap-4">
        <div
          className={
            auto
              ? 'flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-4'
              : 'flex items-start gap-2 rounded-md border border-info/30 bg-info/5 p-4'
          }
        >
          {auto ? (
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
          ) : (
            <Users className="mt-0.5 size-5 shrink-0 text-info" />
          )}
          <div>
            <p className="font-medium">
              {auto ? 'Conditional offer issued' : 'Sent to admissions review'}
            </p>
            <p className="text-sm text-muted-foreground">
              {created.studentName} · {created.course.programmeName}
            </p>
          </div>
        </div>

        <LetterOfOfferPanel
          data={{
            studentName: created.studentName,
            preId: created.preId,
            course: created.course,
            conditions: looConditions,
            hideCosts: true,
          }}
        />

        <div className="flex gap-2">
          <Button
            render={<Link href={`/applications/${created.id}`} />}
            nativeButton={false}
            className="gap-1.5"
          >
            Open application <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={unconfirmedAi === 0}
          onClick={confirmAllAi}
        >
          <CircleCheck className="size-3.5" /> Confirm all AI fields
          {unconfirmedAi > 0 && <span className="tabular-nums">({unconfirmedAi})</span>}
        </Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="size-4 accent-primary"
          />
          Show all fields
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="flex items-center gap-1.5 rounded-lg border border-border bg-card p-4 text-sm text-success">
          <CircleCheck className="size-4" /> No fields need attention
        </p>
      ) : (
        FIELD_SECTIONS.map((section) => {
          const sectionFields = visible.filter((f) => f.section === section)
          if (sectionFields.length === 0) return null
          return (
            <section key={section}>
              <h3 className="mb-2 text-sm font-semibold">{section}</h3>
              <div className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-2">
                {sectionFields.map((f) => (
                  <FieldRow
                    key={f.key}
                    field={f}
                    docName={docName(f.sourceDoc)}
                    onChange={(v) => setFieldValue(f.key, v)}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}

      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Readiness</h3>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
            <dt className="text-muted-foreground">Evidence</dt>
            <dd className={readiness.evidenceMet ? 'text-success' : 'text-warning'}>
              {readiness.evidenceMet ? 'Met' : 'Incomplete'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
            <dt className="text-muted-foreground">LoO ready</dt>
            <dd className={readiness.looReady ? 'text-success' : 'text-warning'}>
              {readiness.looReady
                ? 'Yes'
                : `${readiness.fieldsDone} / ${readiness.fieldsTotal} fields`}
            </dd>
          </div>
        </dl>
        {blocking.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Blocking</p>
            <ul className="flex flex-col gap-1 text-sm">
              {blocking.map((b) => (
                <li key={b} className="flex items-start gap-1.5">
                  <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
                  <span className="text-pretty">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Draft Letter of Offer</h3>
        <LetterOfOfferPanel
          data={{
            studentName: draft.studentName,
            preId: 'DRAFT',
            course: wizard.course ?? undefined,
            conditions: looConditions,
            hideCosts: true,
          }}
        />
      </section>

      <section className="rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={() => setNoteOpen((o) => !o)}
          aria-expanded={noteOpen}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
        >
          Note to admissions
          <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
            Optional
            <ChevronDown className={noteOpen ? 'size-4 rotate-180' : 'size-4'} />
          </span>
        </button>
        {noteOpen && (
          <div className="border-t border-border p-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              aria-label="Note to admissions"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              A note sends the application to admissions review.
            </p>
          </div>
        )}
      </section>

      <div
        className={
          route === 'auto'
            ? 'flex items-start gap-2 rounded-md border border-ai/30 bg-ai/5 p-4'
            : 'flex items-start gap-2 rounded-md border border-info/30 bg-info/5 p-4'
        }
      >
        {route === 'auto' ? (
          <Sparkles className="mt-0.5 size-4 shrink-0 text-ai" />
        ) : (
          <Users className="mt-0.5 size-4 shrink-0 text-info" />
        )}
        <p className="text-sm">
          {route === 'auto'
            ? 'Conditional offer is issued on submit and pushed to Dynamics 365.'
            : 'Goes to admissions review: note to admissions.'}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Button
          size="lg"
          className="w-fit"
          disabled={route === 'auto' && !readiness.looReady}
          onClick={submit}
        >
          {route === 'auto' ? 'Submit and issue conditional offer' : 'Submit for review'}
        </Button>
        {route === 'auto' && !readiness.looReady && (
          <p className="text-xs text-muted-foreground">
            Clear the blocking items, or add a note to send this to review.
          </p>
        )}
      </div>
    </div>
  )
}
