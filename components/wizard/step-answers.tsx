'use client'

import { useState } from 'react'
import { ChevronDown, CircleCheck } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { isFieldComplete } from '@/lib/readiness'
import { fieldError, isApplicable } from '@/lib/field-specs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FieldRow } from './field-row'
import { AddressLookup } from './address-lookup'
import { SpecialAdmissions } from './special-admissions'
import { ENGLISH_PENDING_KEY, EnglishPending, hasEnglishResult, isEnglishPending } from './english-pending'
import type { Field, FieldSection } from '@/lib/types'

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
  description: string
  sections: FieldSection[]
  optional?: boolean
}

// Student identity (passport, English, course) first, then the questions for the student.
const GROUPS: Group[] = [
  {
    id: 'student',
    title: 'Student and course',
    description: 'Passport details, English test and chosen course',
    sections: ['Personal', 'English', 'Course'],
  },
  {
    id: 'contact',
    title: 'Contact details',
    description: 'How to reach the student and their emergency contact',
    sections: ['Contact', 'Home address', 'Emergency contact'],
  },
  {
    id: 'education',
    title: 'Education history',
    description: 'School, tertiary study, gaps and special admissions / RPL',
    sections: ['Secondary education', 'Tertiary education', 'Study record', 'Study gap'],
  },
  {
    id: 'visa',
    title: 'Visa, health and insurance',
    description: 'Immigration history, health declarations and cover',
    sections: ['Immigration', 'Health', 'Insurance'],
  },
  {
    id: 'optional',
    title: 'Funding and agent',
    description: 'Only if they apply to this student',
    sections: ['Funding', 'Agent'],
    optional: true,
  },
]

export function StepAnswers() {
  const { fields, documents, setFieldValue, confirmAllAi } = useWizard()

  const groups = GROUPS.map((group) => {
    const parts = group.sections
      .map((section) => ({
        section,
        fields: fields.filter(
          (f) => f.section === section && isApplicable(f, fields) && f.kind !== 'derived',
        ),
      }))
      .filter((p) => p.fields.length > 0)
    const open = parts.reduce(
      (n, p) => n + p.fields.filter((f) => needsAttention(f, fields)).length,
      0,
    )
    return { ...group, parts, open }
  }).filter((g) => g.parts.length > 0)

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const first = groups.find((g) => g.open > 0)
    return new Set(first ? [first.id] : [])
  })

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

  const outstanding = groups.reduce((n, g) => n + g.open, 0)
  const completeCount = groups.filter((g) => g.open === 0).length
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
            {completeCount} of {groups.length}
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
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
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
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold">
                    {group.title}
                    {group.optional && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        Optional
                      </span>
                    )}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {group.description}
                  </span>
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
                        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {part.section}
                        </h3>
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
                      {part.section === 'English' && (
                        <EnglishPending
                          fields={fields}
                          onChange={(p) => setFieldValue(ENGLISH_PENDING_KEY, p ? 'Yes' : '')}
                        />
                      )}
                      <div className="grid gap-2 sm:grid-cols-2">
                        {part.fields
                          .filter(
                            (f) =>
                              f.key !== ENGLISH_PENDING_KEY &&
                              !(f.section === 'English' && isEnglishPending(fields) && !hasEnglishResult(fields)),
                          )
                          .map((f) => (
                          <FieldRow
                            key={f.key}
                            field={f}
                            docName={docName(f.sourceDoc)}
                            error={fieldError(f, fields)}
                            onChange={(v) => setFieldValue(f.key, v)}
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
