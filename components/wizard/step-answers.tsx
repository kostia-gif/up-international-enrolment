'use client'

import { useState } from 'react'
import { ChevronDown, CircleCheck } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { isFieldComplete } from '@/lib/readiness'
import { DOCUMENT_SECTIONS, FIELD_SECTIONS, OPTIONAL_SECTIONS } from '@/lib/blank-fields'
import { fieldError, isApplicable } from '@/lib/field-specs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FieldRow } from './field-row'
import type { Field, FieldSection } from '@/lib/types'

export function needsAttention(f: Field, fields: Field[]): boolean {
  if (!isApplicable(f, fields) || f.kind === 'derived') return false
  if (f.status === 'conflict') return true
  if (f.source === 'ai' && f.status === 'ai') return true
  if (fieldError(f, fields)) return true
  return f.required && !isFieldComplete(f, fields)
}

// Student identity (passport, English, course) first, then the questions for the student.
const SECTION_ORDER: FieldSection[] = [
  ...DOCUMENT_SECTIONS,
  ...FIELD_SECTIONS.filter((s) => !DOCUMENT_SECTIONS.includes(s)),
]

export function StepAnswers() {
  const { fields, documents, setFieldValue, confirmAllAi } = useWizard()

  const sections = SECTION_ORDER.map((section) => {
    const sectionFields = fields.filter(
      (f) => f.section === section && isApplicable(f, fields) && f.kind !== 'derived',
    )
    const open = sectionFields.filter((f) => needsAttention(f, fields)).length
    return { section, sectionFields, open, optional: OPTIONAL_SECTIONS.includes(section) }
  }).filter((s) => s.sectionFields.length > 0)

  const [expanded, setExpanded] = useState<Set<FieldSection>>(() => {
    const first = sections.find((s) => s.open > 0)
    return new Set(first ? [first.section] : [])
  })

  const toggle = (section: FieldSection) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(section)) next.delete(section)
      else next.add(section)
      return next
    })

  const goToNext = (current: FieldSection) => {
    const idx = sections.findIndex((s) => s.section === current)
    const next = sections.slice(idx + 1).find((s) => s.open > 0) ?? sections[idx + 1]
    setExpanded((prev) => {
      const set = new Set(prev)
      set.delete(current)
      if (next) set.add(next.section)
      return set
    })
    if (next) {
      requestAnimationFrame(() =>
        document
          .getElementById(`section-${next.section}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    }
  }

  const outstanding = sections.reduce((n, s) => n + s.open, 0)
  const completeCount = sections.filter((s) => s.open === 0).length
  const unconfirmedAi = fields.filter((f) => f.source === 'ai' && f.status === 'ai').length

  const docName = (id?: string) => {
    const d = documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">
            {completeCount} of {sections.length}
          </span>{' '}
          sections complete
        </p>
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
      </div>

      <ol className="flex flex-col gap-2">
        {sections.map(({ section, sectionFields, open, optional }) => {
          const isOpen = expanded.has(section)
          const done = open === 0
          const panelId = `section-panel-${section}`
          return (
            <li
              key={section}
              id={`section-${section}`}
              className={cn(
                'scroll-mt-4 rounded-lg border bg-card',
                isOpen ? 'border-primary/40' : 'border-border',
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(section)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  aria-hidden
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border',
                    done
                      ? 'border-success bg-success text-background'
                      : 'border-border text-muted-foreground',
                  )}
                >
                  {done ? <CircleCheck className="size-4" /> : null}
                </span>
                <span className="flex-1 text-sm font-semibold">
                  {section}
                  {optional && ' '}
                  {optional && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    done ? 'text-success' : 'text-muted-foreground',
                  )}
                >
                  {done ? 'Complete' : `${open} to answer`}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-4 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              {isOpen && (
                <div id={panelId} className="flex flex-col gap-3 border-t border-border p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sectionFields.map((f) => (
                      <FieldRow
                        key={f.key}
                        field={f}
                        docName={docName(f.sourceDoc)}
                        error={fieldError(f, fields)}
                        onChange={(v) => setFieldValue(f.key, v)}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant={done ? 'default' : 'outline'}
                      onClick={() => goToNext(section)}
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

      {outstanding > 0 ? (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">{outstanding}</span>{' '}
          {outstanding === 1 ? 'answer still needs' : 'answers still need'} attention. You can
          continue and come back, but the offer can&apos;t be issued until they&apos;re complete.
        </p>
      ) : (
        <p className="flex items-center gap-1.5 text-sm text-success">
          <CircleCheck className="size-4" /> All answers are complete. Continue to review the
          application.
        </p>
      )}
    </div>
  )
}
