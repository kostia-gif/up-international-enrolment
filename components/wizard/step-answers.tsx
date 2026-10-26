'use client'

import { useMemo, useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { isFieldComplete } from '@/lib/readiness'
import { FIELD_SECTIONS } from '@/lib/blank-fields'
import { fieldError, isApplicable } from '@/lib/field-specs'
import { Button } from '@/components/ui/button'
import { FieldRow } from './field-row'
import type { Field } from '@/lib/types'

export function needsAttention(f: Field, fields: Field[]): boolean {
  if (!isApplicable(f, fields) || f.kind === 'derived') return false
  if (f.status === 'conflict') return true
  if (f.source === 'ai' && f.status === 'ai') return true
  if (fieldError(f, fields)) return true
  return f.required && !isFieldComplete(f, fields)
}

// Yes/No answers reveal their follow-ups straight away, so keep a parent
// question visible once answered while its follow-ups still need attention.
function isParentOf(parent: Field, fields: Field[]): boolean {
  return fields.some(
    (f) => f.key !== parent.key && f.section === parent.section && needsAttention(f, fields),
  )
}

export function StepAnswers() {
  const { fields, documents, setFieldValue, confirmAllAi } = useWizard()
  const [showAll, setShowAll] = useState(false)

  const visible = useMemo(
    () =>
      fields.filter((f) => {
        if (!isApplicable(f, fields)) return false
        if (showAll) return true
        if (needsAttention(f, fields)) return true
        const input = f.kind === 'manual' && f.value ? f.value : ''
        return (input === 'Yes' || input === 'No') && isParentOf(f, fields)
      }),
    [fields, showAll],
  )
  const outstanding = fields.filter((f) => needsAttention(f, fields)).length
  const unconfirmedAi = fields.filter((f) => f.source === 'ai' && f.status === 'ai').length

  const docName = (id?: string) => {
    const d = documents.find((x) => x.id === id)
    return d?.fileName || d?.originalName
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
          <CircleCheck className="size-4" /> All answers are complete. Continue to review the
          application.
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
                    error={fieldError(f, fields)}
                    onChange={(v) => setFieldValue(f.key, v)}
                  />
                ))}
              </div>
            </section>
          )
        })
      )}

      {outstanding > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium tabular-nums text-foreground">{outstanding}</span>{' '}
          {outstanding === 1 ? 'answer still needs' : 'answers still need'} attention. You can
          continue and come back, but the offer can&apos;t be issued until they&apos;re complete.
        </p>
      )}
    </div>
  )
}
