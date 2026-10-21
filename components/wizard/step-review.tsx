'use client'

import { Fragment, useMemo } from 'react'
import { CircleCheck, ShieldCheck, HeartHandshake } from 'lucide-react'
import { AddressLookup } from './address-lookup'
import { cn } from '@/lib/utils'

const LEARNING_NEEDS = ['ADHD', 'Anxiety', 'Dyslexia', 'Dyspraxia', 'Autism spectrum', 'Depression']

function LearningSupportChips({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const selected = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  function toggle(need: string) {
    const next = selected.includes(need)
      ? selected.filter((s) => s !== need)
      : [...selected, need]
    onChange(next.join(', '))
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2 sm:col-span-2">
      <span className="text-xs text-muted-foreground">Quick select:</span>
      {LEARNING_NEEDS.map((need) => {
        const on = selected.includes(need)
        return (
          <button
            key={need}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(need)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
              on
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted',
            )}
          >
            {need}
          </button>
        )
      })}
    </div>
  )
}
import { useWizard } from '@/lib/wizard'
import { FIELD_SECTIONS } from '@/lib/blank-fields'
import { isFieldDone } from '@/lib/readiness'
import type { FieldSection } from '@/lib/types'
import { FieldRow } from './field-row'
import { Button } from '@/components/ui/button'

// Sections whose values the AI populates from documents — these get a
// "Confirm AI is correct" action beside their header.
const AI_SECTIONS: FieldSection[] = ['Personal', 'Education history']
// Insurance is captured in Step 5 (Requests), so it is not shown here.
const HIDDEN_SECTIONS: FieldSection[] = ['Insurance']

export function StepReview() {
  const { fields, documents, setFieldValue, confirmSectionAi, readiness } = useWizard()

  const docName = (id?: string) => {
    const d = documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
  }

  const blocking = useMemo(
    () => fields.filter((f) => f.required && !isFieldDone(f)),
    [fields],
  )

  const sections = FIELD_SECTIONS.filter((s) => !HIDDEN_SECTIONS.includes(s))

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => {
        const sectionFields = fields.filter((f) => f.section === section)
        if (sectionFields.length === 0) return null

        const isAi = AI_SECTIONS.includes(section)
        const aiFields = sectionFields.filter((f) => f.source === 'ai')
        const unconfirmed = aiFields.filter(
          (f) => f.status === 'ai' || f.status === 'verified' || f.status === 'conflict',
        )
        const allConfirmed = isAi && aiFields.length > 0 && unconfirmed.length === 0

        return (
          <section key={section}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{section}</h3>
              {isAi &&
                aiFields.length > 0 &&
                (allConfirmed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CircleCheck className="size-3.5" /> AI confirmed
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1.5"
                    onClick={() => confirmSectionAi(section)}
                  >
                    <CircleCheck className="size-3.5" /> Confirm AI is correct
                  </Button>
                ))}
            </div>

            {section === 'Education history' && (
              <p className="mb-2 flex items-start gap-1.5 rounded-md border border-success/25 bg-success/5 px-2.5 py-1.5 text-xs text-success text-pretty">
                <ShieldCheck className="mt-px size-3.5 shrink-0" />
                AI reviewed the institution stamps and seals on the transcript — assessed as
                authentic.
              </p>
            )}

            {section === 'Health' && (
              <div className="mb-2 flex flex-col gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-2 text-xs text-muted-foreground">
                <p className="flex items-start gap-1.5 font-medium text-foreground text-pretty">
                  <HeartHandshake className="mt-px size-3.5 shrink-0" />
                  This will not affect your application, but helps us plan ahead for the best
                  learning support for you.
                </p>
                <p className="pl-5 text-pretty">
                  List ADHD, anxiety, dyslexia and similar under <strong>Learning support needs</strong>.
                  These go straight to Student Support. Only <strong>Other medical conditions</strong>{' '}
                  are referred to faculty for review.
                </p>
              </div>
            )}

            <div className="grid gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-2">
              {sectionFields.map((f) => (
                <Fragment key={f.key}>
                  {(f.key === 'cur_addr1' || f.key === 'perm_addr1') && (
                    <AddressLookup
                      prefix={f.key === 'cur_addr1' ? 'cur' : 'perm'}
                      title={f.key === 'cur_addr1' ? 'Current address' : 'Permanent address'}
                      onSelect={(values) =>
                        Object.entries(values).forEach(([k, v]) => v && setFieldValue(k, v))
                      }
                    />
                  )}
                  <FieldRow
                    field={f}
                    docName={docName(f.sourceDoc)}
                    onChange={(v) => setFieldValue(f.key, v)}
                  />
                  {f.key === 'learning_support' && (
                    <LearningSupportChips
                      value={f.value}
                      onChange={(v) => setFieldValue(f.key, v)}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          </section>
        )
      })}

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">LOO-ready</p>
          <span className="text-xs text-muted-foreground tabular-nums">
            {readiness.fieldsDone} / {readiness.fieldsTotal} required fields
          </span>
        </div>
        {readiness.looReady ? (
          <p className="flex items-center gap-1.5 text-sm text-success">
            <CircleCheck className="size-4" /> All required fields complete — ready to generate the
            conditional offer.
          </p>
        ) : (
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Still blocking LOO-ready:</p>
            <ul className="flex flex-wrap gap-1.5">
              {blocking.slice(0, 12).map((f) => (
                <li
                  key={f.key}
                  className="rounded border border-border bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground"
                >
                  {f.label}
                </li>
              ))}
              {blocking.length > 12 && (
                <li className="px-1.5 py-0.5 text-xs text-muted-foreground">
                  +{blocking.length - 12} more
                </li>
              )}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
