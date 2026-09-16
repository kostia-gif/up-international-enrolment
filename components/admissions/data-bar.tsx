'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Check,
  Pencil,
  Sparkles,
  X,
  ScanLine,
  CircleDashed,
} from 'lucide-react'
import type { Application, Field } from '@/lib/types'
import { useStore } from '@/lib/store'
import { fieldProvenance } from '@/lib/admissions'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const DOC_PROVENANCE: Record<string, string> = {
  Passport: 'Read from passport',
  Transcript: 'Read from transcript',
  EnglishTest: 'Read from English test',
  CV: 'Read from CV',
  Reference: 'Read from reference',
  FinancialEvidence: 'Read from financial evidence',
  InsuranceEvidence: 'Read from insurance policy',
  Supporting: 'Read from supporting document',
}

// Plausible AI drafts for the fields an officer might have to complete by hand.
// Keeps the "AI can input, then approve" flow demonstrable without a backend.
function aiSuggestionFor(app: Application, key: string): string | null {
  const val = (k: string) => app.fields.find((f) => f.key === k)?.value ?? ''
  const map: Record<string, string> = {
    preferred_name: val('given_name'),
    marital_status: 'Single',
    ethnicity: 'Prefer not to say',
    iwi: 'Not applicable',
    visa_status: 'Student visa (to be applied for)',
    prev_study_nz: 'No',
    gender: 'Not specified',
    preferred_contact: 'Email',
    alt_phone: val('mobile'),
    disability_support: 'None declared',
    medical_conditions: 'None declared',
    medications: 'None',
    special_diet: 'None',
    gp_details: 'To be provided on arrival',
    country_of_birth: val('nationality'),
    first_language: 'Not specified',
  }
  const s = map[key]
  return s && s.trim() !== '' ? s : null
}

function FieldRow({ app, field }: { app: Application; field: Field }) {
  const { confirmField, setFieldValue, aiSuggestField } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(field.value)

  const provenanceDoc = fieldProvenance(app, field)
  const provenanceLabel = provenanceDoc ? DOC_PROVENANCE[provenanceDoc] : null
  const isMissing = field.status === 'missing' || field.value.trim() === ''
  const needsApproval = field.status === 'ai' || field.status === 'conflict'
  const suggestion = isMissing ? aiSuggestionFor(app, field.key) : null

  function save() {
    setFieldValue(app.id, field.key, draft)
    setEditing(false)
    toast.success(`${field.label} updated`)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border p-3',
        needsApproval
          ? 'border-ai/30 bg-ai/[0.04]'
          : isMissing
            ? 'border-dashed border-border bg-muted/20'
            : 'border-border bg-card',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
        <StatusBadge kind="field" status={field.status} iconOnly className="shrink-0" />
      </div>

      {editing ? (
        <div className="flex items-center gap-1.5">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            className="h-8 text-sm"
          />
          <Button size="icon" className="size-8 shrink-0" aria-label="Save" onClick={save}>
            <Check className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            aria-label="Cancel"
            onClick={() => {
              setDraft(field.value)
              setEditing(false)
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm text-pretty', isMissing && 'italic text-muted-foreground')}>
            {isMissing ? 'Not provided' : field.value}
          </p>
          <button
            type="button"
            onClick={() => {
              setDraft(field.value)
              setEditing(true)
            }}
            aria-label={`Edit ${field.label}`}
            className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-3.5" />
          </button>
        </div>
      )}

      {!editing && (provenanceLabel || needsApproval || isMissing) && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {provenanceLabel && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
              <ScanLine className="size-3" /> {provenanceLabel}
              {field.confidence != null && (
                <span className="text-muted-foreground">
                  · {Math.round(field.confidence * 100)}%
                </span>
              )}
            </span>
          )}
          {needsApproval && (
            <>
              {!provenanceLabel && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ai">
                  <Sparkles className="size-3" />
                  {field.status === 'conflict'
                    ? 'Conflict — confirm the value'
                    : 'AI draft — approve to confirm'}
                </span>
              )}
              {field.status === 'conflict' && provenanceLabel && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive">
                  <Sparkles className="size-3" /> Conflict — confirm
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="h-6 gap-1 px-2 text-[11px]"
                onClick={() => {
                  confirmField(app.id, field.key)
                  toast.success(`${field.label} approved`)
                }}
              >
                <Check className="size-3" /> Approve
              </Button>
            </>
          )}
          {isMissing && suggestion && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 gap-1 px-2 text-[11px]"
              onClick={() => {
                aiSuggestField(app.id, field.key, suggestion)
                toast.success(`AI drafted ${field.label} — approve to confirm`)
              }}
            >
              <Sparkles className="size-3" /> AI draft
            </Button>
          )}
          {isMissing && !suggestion && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <CircleDashed className="size-3" /> Awaiting input
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function DataBar({
  app,
  fieldKeys,
  columns = 1,
}: {
  app: Application
  fieldKeys: string[]
  columns?: 1 | 2
}) {
  const fields = fieldKeys
    .map((k) => app.fields.find((f) => f.key === k))
    .filter((f): f is Field => Boolean(f))

  if (fields.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
        No data fields for this step.
      </p>
    )
  }

  return (
    <div className={cn('grid gap-2.5', columns === 2 && 'sm:grid-cols-2')}>
      {fields.map((f) => (
        <FieldRow key={f.key} app={app} field={f} />
      ))}
    </div>
  )
}
