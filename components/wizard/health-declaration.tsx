'use client'

import { useRef } from 'react'
import { FileText, HeartHandshake, Upload, X } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

const LEARNING_NEEDS = ['ADHD', 'Anxiety', 'Dyslexia', 'Dyspraxia', 'Autism spectrum', 'Depression']
export const MEDICAL_DOC_TYPE = 'Medical'

type Answer = 'yes' | 'no' | null

// The declaration summary is the single required field, so both answers are
// encoded into it in plain English (admissions reads it as-is).
function parseAnswers(summary: string): { learning: Answer; medical: Answer } {
  if (/no conditions declared/i.test(summary)) return { learning: 'no', medical: 'no' }
  const pick = (label: string): Answer => {
    const m = summary.match(new RegExp(`${label}:\\s*(yes|no)`, 'i'))
    return m ? (m[1].toLowerCase() as Answer) : null
  }
  return { learning: pick('Learning conditions'), medical: pick('Other medical conditions') }
}

function composeSummary(learning: Answer, medical: Answer) {
  if (!learning || !medical) return ''
  if (learning === 'no' && medical === 'no') return 'No conditions declared'
  return `Learning conditions: ${learning === 'yes' ? 'Yes' : 'No'}. Other medical conditions: ${
    medical === 'yes' ? 'Yes' : 'No'
  }.`
}

function YesNo({
  name,
  value,
  onChange,
}: {
  name: string
  value: Answer
  onChange: (v: 'yes' | 'no') => void
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex shrink-0 gap-1.5">
      {(['yes', 'no'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            'h-8 min-w-14 rounded-md border px-3 text-sm font-medium transition-colors',
            value === opt
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-foreground hover:bg-muted',
          )}
        >
          {opt === 'yes' ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )
}

export function HealthDeclaration() {
  const { fields, documents, setFieldValue, addDocumentRow, removeDocument } = useWizard()
  const fileInput = useRef<HTMLInputElement>(null)

  const val = (key: string) => fields.find((f) => f.key === key)?.value ?? ''
  const { learning, medical } = parseAnswers(val('health_declaration'))
  const selectedNeeds = val('learning_support')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const medicalDocs = documents.filter((d) => d.type === MEDICAL_DOC_TYPE)

  function answer(q: 'learning' | 'medical', v: 'yes' | 'no') {
    const next = { learning, medical, [q]: v }
    setFieldValue('health_declaration', composeSummary(next.learning, next.medical))
    if (v === 'no') {
      if (q === 'learning') setFieldValue('learning_support', '')
      else ['medical_conditions', 'medications', 'gp_details'].forEach((k) => setFieldValue(k, ''))
    }
  }

  function toggleNeed(need: string) {
    const next = selectedNeeds.includes(need)
      ? selectedNeeds.filter((s) => s !== need)
      : [...selectedNeeds, need]
    setFieldValue('learning_support', next.join(', '))
  }

  function onFiles(files: FileList | null) {
    Array.from(files ?? []).forEach((file) => {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'pdf'
      addDocumentRow({
        id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: MEDICAL_DOC_TYPE,
        fileName: `Medical_${medicalDocs.length + 1}.${ext}`,
        originalName: file.name,
        language: 'English',
        status: 'checked',
      })
    })
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <p className="flex items-start gap-1.5 rounded-md bg-muted/50 px-2.5 py-2 text-xs font-medium text-foreground text-pretty">
        <HeartHandshake className="mt-px size-3.5 shrink-0 text-primary" />
        This will not affect your application, but helps us plan ahead for the best learning
        support for you.
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              1. Do you have any conditions that affect your learning?
            </p>
            <p className="text-xs text-muted-foreground">
              For example ADHD, anxiety or dyslexia. These go straight to Student Support.
            </p>
          </div>
          <YesNo
            name="Conditions that affect learning"
            value={learning}
            onChange={(v) => answer('learning', v)}
          />
        </div>
        {learning === 'yes' && (
          <div className="flex flex-wrap gap-1.5">
            {LEARNING_NEEDS.map((need) => {
              const on = selectedNeeds.includes(need)
              return (
                <button
                  key={need}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleNeed(need)}
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
        )}
      </div>

      <div className="h-px bg-border" />

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium">2. Do you have any other medical conditions?</p>
            <p className="text-xs text-muted-foreground">
              These are reviewed by faculty so the right support is in place.
            </p>
          </div>
          <YesNo
            name="Other medical conditions"
            value={medical}
            onChange={(v) => answer('medical', v)}
          />
        </div>

        {medical === 'yes' && (
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-xs font-medium">
              Further information
              <Textarea
                value={val('medical_conditions')}
                onChange={(e) => setFieldValue('medical_conditions', e.target.value)}
                placeholder="Condition, current medications, treating doctor…"
                className="min-h-20 text-sm font-normal"
              />
            </label>

            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              id="medical-docs"
              onChange={(e) => onFiles(e.target.files)}
            />
            <label
              htmlFor="medical-docs"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <Upload className="size-3.5" />
              Upload supporting documents (prescriptions, doctor&apos;s letter)
            </label>

            {medicalDocs.length > 0 && (
              <ul className="flex flex-col gap-1">
                {medicalDocs.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-xs"
                  >
                    <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{d.originalName}</span>
                    <button
                      type="button"
                      onClick={() => removeDocument(d.id)}
                      className="ml-auto text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${d.originalName}`}
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
