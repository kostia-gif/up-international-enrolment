'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, ChevronDown, CircleCheck, Lock } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { isFieldComplete } from '@/lib/readiness'
import { fieldError, isApplicable } from '@/lib/field-specs'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FieldRow } from './field-row'
import { AiConfirmTable } from './ai-confirm-table'
import { AddressLookup } from './address-lookup'
import { SpecialAdmissions } from './special-admissions'
import { NeuroSupportNote } from './neuro-support-note'
import { ENGLISH_PENDING_KEY, EnglishPending, hasEnglishResult, isEnglishPending } from './english-pending'
import { SourceDocuments } from './source-documents'
import { DocumentViewerDialog, type ViewerFocus } from '@/components/document-viewer'
import type { Document, Field, FieldSection } from '@/lib/types'

export function needsAttention(f: Field, fields: Field[]): boolean {
  if (!isApplicable(f, fields) || f.kind === 'derived') return false
  if (f.status === 'conflict') return true
  if (f.source === 'ai' && f.status === 'ai') return true
  if (fieldError(f, fields)) return true
  return f.required && !isFieldComplete(f, fields)
}

type Group = {
  id: string
  title: string
  sections: FieldSection[]
  optional?: boolean
}

const GROUPS: Group[] = [
  { id: 'student', title: 'Student', sections: ['Personal', 'English'] },
  { id: 'contact', title: 'Contact', sections: ['Contact', 'Home address', 'Emergency contact'] },
  {
    id: 'education',
    title: 'Education',
    sections: ['Secondary education', 'Tertiary education', 'Study record', 'Study gap'],
  },
  { id: 'visa', title: 'Visa, health and insurance', sections: ['Immigration', 'Health', 'Insurance'] },
  { id: 'optional', title: 'Funding and agent', sections: ['Funding', 'Agent'], optional: true },
]

// A field actually read from a document (templates mark fields AI *could*
// fill as source 'ai' even while still blank, so check the value too).
function isAiRead(f: Field): boolean {
  return f.source === 'ai' && f.value.trim() !== '' && f.status !== 'conflict'
}

// Fields the agent answers by hand: applicable, not calculated, not set by
// UP, and not read from a document (those live in the confirm table).
function isManual(f: Field, fields: Field[]): boolean {
  return (
    isApplicable(f, fields) &&
    f.kind !== 'derived' &&
    f.source !== 'up' &&
    f.status !== 'conflict' &&
    !isAiRead(f)
  )
}

// The pending-English checkbox has its own control, and the English result
// fields are hidden while the agent has said a test is still to come. The
// open-answer count must use the same rule, or it counts fields nobody can see.
function shownInForm(f: Field, fields: Field[]): boolean {
  if (f.key === ENGLISH_PENDING_KEY) return false
  if (f.section === 'English' && isEnglishPending(fields) && !hasEnglishResult(fields)) return false
  return true
}

export function StepAnswers() {
  const {
    fields,
    documents,
    course,
    entryIssues,
    suggestions,
    focusFieldKey,
    focusField,
    setFieldValue,
    confirmField,
    confirmAllAi,
    notes,
    setNotes,
    goToStep,
  } = useWizard()

  const conflicts = fields.filter((f) => f.status === 'conflict' && isApplicable(f, fields))
  const aiFields = fields.filter(
    (f) => isAiRead(f) && f.kind !== 'derived' && isApplicable(f, fields),
  )
  // Unconfirmed reads plus confirmed values edited into something invalid:
  // both still block the offer, so the tile must count them.
  const aiPending = aiFields.filter(
    (f) => f.status === 'ai' || fieldError(f, fields) !== null,
  ).length

  const groups = GROUPS.map((group) => {
    const parts = group.sections
      .map((section) => ({
        section,
        fields: fields.filter((f) => f.section === section && isManual(f, fields)),
      }))
      .filter((p) => p.fields.length > 0)
    const open = parts.reduce(
      (n, p) => n + p.fields.filter((f) => shownInForm(f, fields) && needsAttention(f, fields)).length,
      0,
    )
    return { ...group, parts, open }
  }).filter((g) => g.parts.length > 0)

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const first = groups.find((g) => g.open > 0)
    return new Set(first ? [first.id] : [])
  })

  // Arriving from a Review blocker: open the group that owns the field, then
  // scroll to and focus its control so it cannot hide in a collapsed section.
  useEffect(() => {
    if (!focusFieldKey) return
    const field = fields.find((f) => f.key === focusFieldKey)
    const group = field && groups.find((g) => g.sections.includes(field.section))
    if (group) setExpanded((prev) => new Set(prev).add(group.id))
    const timer = setTimeout(() => {
      const el = document.getElementById(focusFieldKey)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (el instanceof HTMLElement) el.focus({ preventScroll: true })
      focusField(null)
    }, 80)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusFieldKey])

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const goToNext = (current: string) => {
    const idx = groups.findIndex((g) => g.id === current)
    const next = groups.slice(idx + 1).find((g) => g.open > 0) ?? groups[idx + 1]
    setExpanded((prev) => {
      const set = new Set(prev)
      set.delete(current)
      if (next) set.add(next.id)
      return set
    })
    if (next) {
      requestAnimationFrame(() =>
        document
          .getElementById(`group-${next.id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  const manualOpen = groups.reduce((n, g) => n + g.open, 0)
  const allDone = conflicts.length === 0 && aiPending === 0 && manualOpen === 0

  const docName = (id?: string) => {
    const d = documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
  }

  const [viewing, setViewing] = useState<{ doc: Document; focus?: ViewerFocus } | null>(null)
  const viewDoc = (doc: Document) => setViewing({ doc })
  const viewSource = (f: Field) => {
    const doc = documents.find((x) => x.id === f.sourceDoc)
    if (doc) setViewing({ doc, focus: { page: f.sourcePage, fieldLabel: f.label } })
  }
  const sourceHandler = (f: Field) => (f.sourceDoc ? () => viewSource(f) : undefined)

  const jump = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="flex flex-col gap-5">
      <nav aria-label="What still needs attention" className="grid gap-2 sm:grid-cols-3">
        <TriageTile
          count={conflicts.length}
          label="Conflicts"
          hint="Pick the right answer"
          tone="warning"
          onClick={() => jump('triage-conflicts')}
        />
        <TriageTile
          count={aiPending}
          label="Confirm what AI read"
          hint="One click if it looks right"
          tone="ai"
          onClick={() => jump('triage-confirm')}
        />
        <TriageTile
          count={manualOpen}
          label="Complete the rest"
          hint="Not in the documents"
          tone="default"
          onClick={() => jump('triage-form')}
        />
      </nav>

      {course && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            Course set by UP: {course.brand} · {course.programmeName} · {course.campus} · intake{' '}
            {formatDate(course.intakeDate)}
          </span>
        </p>
      )}

      <SourceDocuments documents={documents} fields={fields} onView={viewDoc} />
      <DocumentViewerDialog
        doc={viewing?.doc ?? null}
        focus={viewing?.focus}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />

      {conflicts.length > 0 && (
        <section
          id="triage-conflicts"
          aria-labelledby="conflicts-heading"
          className="scroll-mt-4 rounded-lg border border-warning/40 bg-card"
        >
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-3">
            <h3 id="conflicts-heading" className="flex items-center gap-1.5 text-sm font-semibold">
              <AlertTriangle className="size-4 text-warning" aria-hidden />
              Two answers disagree
            </h3>
            <p className="text-xs text-muted-foreground">
              The document and a typed answer differ. Choose which one is correct.
            </p>
          </div>
          <div className="grid gap-2 p-2 sm:grid-cols-2">
            {conflicts.map((f) => (
              <FieldRow
                key={f.key}
                field={f}
                docName={docName(f.sourceDoc)}
                error={fieldError(f, fields)}
                onChange={(v) => setFieldValue(f.key, v)}
                onViewDoc={sourceHandler(f)}
              />
            ))}
          </div>
        </section>
      )}

      {aiFields.length > 0 && (
        <AiConfirmTable
          fields={aiFields}
          documents={documents}
          course={course}
          issues={entryIssues}
          suggestions={suggestions}
          onConfirm={confirmField}
          onConfirmAll={confirmAllAi}
          onChange={setFieldValue}
          allFields={fields}
          openKey={focusFieldKey}
          onViewSource={viewSource}
          onUploadMore={() => goToStep(2)}
          note={notes}
          onNoteChange={setNotes}
        />
      )}

      <section id="triage-form" aria-labelledby="form-heading" className="scroll-mt-4 flex flex-col gap-3">
        <div>
          <h3 id="form-heading" className="text-sm font-semibold">
            Complete the rest
          </h3>
          <p className="text-xs text-muted-foreground">
            {manualOpen === 0
              ? 'Everything the documents couldn’t tell us is answered.'
              : `${manualOpen} answer${manualOpen === 1 ? '' : 's'} the documents can’t provide. Required ones are marked *.`}
          </p>
          {manualOpen > 0 && manualOpen <= 5 && (
            <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Answers still open">
              {groups.flatMap((g) =>
                g.parts.flatMap((p) =>
                  p.fields
                    .filter((f) => shownInForm(f, fields) && needsAttention(f, fields))
                    .map((f) => (
                      <li key={f.key}>
                        <button
                          type="button"
                          onClick={() => focusField(f.key)}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs hover:border-primary hover:text-primary"
                        >
                          {f.label}
                          <span className="text-muted-foreground">· {g.title}</span>
                        </button>
                      </li>
                    )),
                ),
              )}
            </ul>
          )}
        </div>

        <ol className="flex flex-col gap-2">
          {groups.map((group) => {
            const isOpen = expanded.has(group.id)
            const done = group.open === 0
            const panelId = `group-panel-${group.id}`
            return (
              <li
                key={group.id}
                id={`group-${group.id}`}
                className={cn(
                  'scroll-mt-4 rounded-lg border bg-card',
                  isOpen ? 'border-primary/40' : 'border-border',
                )}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(group.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-5 shrink-0 items-center justify-center rounded-full border',
                      done ? 'border-success bg-success text-background' : 'border-border',
                    )}
                  >
                    {done ? <CircleCheck className="size-3.5" /> : null}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium">
                    {group.title}
                    {group.optional && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-xs tabular-nums',
                      done ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {done ? 'Complete' : `${group.open} to answer`}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>

                {isOpen && (
                  <div id={panelId} className="flex flex-col gap-5 border-t border-border p-4">
                    {group.parts.map((part) => (
                      <section key={part.section} className="flex flex-col gap-2">
                        {group.parts.length > 1 && (
                          <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {part.section}
                          </h4>
                        )}
                        {part.section === 'Home address' && (
                          <AddressLookup
                            country={fields.find((x) => x.key === 'addr_country')?.value ?? ''}
                            onCountryChange={(c) => setFieldValue('addr_country', c)}
                            onSelect={(a) => {
                              setFieldValue('addr_country', a.country)
                              setFieldValue('addr_line1', a.line1)
                              setFieldValue('addr_line2', a.line2 ?? '')
                              setFieldValue('addr_city', a.city)
                              setFieldValue('addr_region', a.region)
                              setFieldValue('addr_postcode', a.postcode)
                            }}
                          />
                        )}
                        {part.section === 'Health' && (
                          <NeuroSupportNote programmeName={course?.programmeName} />
                        )}
                        {part.section === 'English' && (
                          <EnglishPending
                            fields={fields}
                            onChange={(p) => setFieldValue(ENGLISH_PENDING_KEY, p ? 'Yes' : '')}
                          />
                        )}
                        <div className="grid gap-2 sm:grid-cols-2">
                          {part.fields
                            .filter((f) => shownInForm(f, fields))
                            .map((f) => (
                              <FieldRow
                                key={f.key}
                                field={f}
                                docName={docName(f.sourceDoc)}
                                error={fieldError(f, fields)}
                                onChange={(v) => setFieldValue(f.key, v)}
                                onViewDoc={sourceHandler(f)}
                              />
                            ))}
                        </div>
                      </section>
                    ))}
                    {group.id === 'education' && <SpecialAdmissions />}
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant={done ? 'default' : 'outline'}
                        onClick={() => goToNext(group.id)}
                      >
                        {done ? 'Done, next section' : 'Next section'}
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      {allDone ? (
        <p className="flex items-center gap-1.5 text-sm text-success">
          <CircleCheck className="size-4" /> All answers complete. Continue to review.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-pretty">
          You can continue and come back, but the offer can&apos;t be issued until every answer is
          complete.
        </p>
      )}
    </div>
  )
}

function TriageTile({
  count,
  label,
  hint,
  tone,
  onClick,
}: {
  count: number
  label: string
  hint: string
  tone: 'warning' | 'ai' | 'default'
  onClick: () => void
}) {
  const done = count === 0
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={done}
      className={cn(
        'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors',
        done
          ? 'border-border bg-muted/40 text-muted-foreground'
          : tone === 'warning'
            ? 'border-warning/40 bg-warning/5 hover:bg-warning/10'
            : tone === 'ai'
              ? 'border-ai/30 bg-ai/5 hover:bg-ai/10'
              : 'border-border bg-card hover:bg-muted/50',
      )}
    >
      <span
        className={cn(
          'grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold tabular-nums',
          done
            ? 'bg-success/15 text-success'
            : tone === 'warning'
              ? 'bg-warning/15 text-foreground'
              : tone === 'ai'
                ? 'bg-ai/15 text-ai'
                : 'bg-muted text-foreground',
        )}
      >
        {done ? <CircleCheck className="size-4" aria-hidden /> : count}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-muted-foreground">{done ? 'Done' : hint}</span>
      </span>
    </button>
  )
}
