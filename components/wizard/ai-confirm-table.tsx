'use client'

import { useState } from 'react'
import { AlertTriangle, Check, ChevronDown, Pencil, Sparkles } from 'lucide-react'
import type { Course, Document, Field } from '@/lib/types'
import { specFor } from '@/lib/field-specs'
import { formatDate } from '@/lib/format'
import {
  hasEntryIssues,
  issueForField,
  type CourseSuggestion,
  type EntryIssues,
} from '@/lib/entry-rules'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function display(field: Field): string {
  if (ISO_DATE.test(field.value)) return formatDate(field.value)
  return field.value
}

function Row({
  field,
  source,
  issue,
  confirmed,
  onConfirm,
  onChange,
}: {
  field: Field
  source: string
  issue?: string
  confirmed: boolean
  onConfirm: () => void
  onChange: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(field.value)
  const spec = specFor(field.key)

  const commit = () => {
    setEditing(false)
    if (value !== field.value) onChange(value)
    else onConfirm()
  }

  return (
    <li
      className={cn(
        'grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-2.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,11rem)_auto]',
        confirmed && !issue && 'text-muted-foreground',
        issue && 'bg-warning/5',
      )}
    >
      <span className="text-xs font-medium text-muted-foreground sm:text-sm sm:font-normal">
        {field.label}
      </span>
      <span className="col-span-2 min-w-0 sm:col-span-1">
        {editing ? (
          <Input
            autoFocus
            type={spec.input === 'date' || ISO_DATE.test(field.value) ? 'date' : 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) commit()
              if (e.key === 'Escape') {
                setValue(field.value)
                setEditing(false)
              }
            }}
            className="h-8"
            aria-label={`Edit ${field.label}`}
          />
        ) : (
          <span className="flex min-w-0 items-center gap-1.5">
            {issue && (
              <AlertTriangle className="size-3.5 shrink-0 text-warning" aria-hidden />
            )}
            <span
              className={cn('block truncate text-sm', !confirmed && 'font-medium text-foreground')}
            >
              {display(field) || <span className="italic text-muted-foreground">blank</span>}
            </span>
          </span>
        )}
      </span>
      <span className="hidden truncate text-xs text-muted-foreground sm:block">{source}</span>
      <span className="flex items-center justify-end gap-1">
        {!editing && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setValue(field.value)
              setEditing(true)
            }}
            aria-label={`Edit ${field.label}`}
          >
            <Pencil className="size-3.5" />
          </Button>
        )}
        {confirmed ? (
          <span className="grid size-7 place-items-center text-success" aria-label="Confirmed">
            <Check className="size-4" />
          </span>
        ) : (
          !editing && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onConfirm}
              aria-label={`Confirm ${field.label}`}
            >
              <Check className="size-3.5" />
            </Button>
          )
        )}
      </span>
      {issue && (
        <p className="col-span-2 text-xs leading-relaxed text-foreground text-pretty sm:col-span-4">
          {issue}
        </p>
      )}
    </li>
  )
}

export function AiConfirmTable({
  fields,
  documents,
  course,
  issues,
  suggestions = [],
  onConfirm,
  onConfirmAll,
  onChange,
}: {
  fields: Field[]
  documents: Document[]
  course?: Course | null
  issues?: EntryIssues
  suggestions?: CourseSuggestion[]
  onConfirm: (key: string) => void
  onConfirmAll: () => void
  onChange: (key: string, value: string) => void
}) {
  const [showConfirmed, setShowConfirmed] = useState(false)
  const pending = fields.filter((f) => f.status === 'ai')
  const confirmed = fields.filter((f) => f.status !== 'ai')
  const entryIssues = issues ?? {}
  const issueList = [entryIssues.qualification, entryIssues.grade, entryIssues.english].filter(
    (s): s is string => Boolean(s),
  )
  const flagged = hasEntryIssues(entryIssues)

  const sourceFor = (f: Field) => {
    const d = documents.find((x) => x.id === f.sourceDoc)
    const name = d?.type ?? 'Document'
    const parts = [name, f.sourcePage ? `p.${f.sourcePage}` : null, f.confidence != null ? `${Math.round(f.confidence * 100)}%` : null]
    return parts.filter(Boolean).join(' · ')
  }

  return (
    <section
      id="triage-confirm"
      aria-labelledby="confirm-heading"
      className="scroll-mt-4 rounded-lg border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h3 id="confirm-heading" className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="size-4 text-ai" aria-hidden />
            Confirm what AI read
          </h3>
          <p className="text-xs text-muted-foreground">
            {pending.length === 0
              ? `${confirmed.length} answers confirmed from the documents`
              : `${pending.length} to confirm · tap the pencil to correct one`}
          </p>
        </div>
        {pending.length > 0 && (
          <Button size="sm" onClick={onConfirmAll} className="gap-1.5">
            <Check className="size-3.5" /> Confirm all {pending.length}
          </Button>
        )}
      </div>

      {flagged && (
        <div
          role="status"
          className="flex flex-col gap-2 border-b border-warning/30 bg-warning/10 px-4 py-3"
        >
          <p className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <span className="text-pretty">
              <span className="font-semibold">
                {issueList.length === 1
                  ? 'One answer falls short of the entry requirement'
                  : `${issueList.length} answers fall short of the entry requirements`}
              </span>
              {course?.programmeName && (
                <span className="text-muted-foreground"> for {course.programmeName}</span>
              )}
              <span className="text-muted-foreground">
                . Check the document is read correctly before confirming; if the value is right,
                the application still goes to UP for a decision.
              </span>
            </span>
          </p>
          {suggestions.length > 0 && (
            <p className="pl-6 text-xs text-muted-foreground text-pretty">
              Alternatives the student would meet:{' '}
              {suggestions.map((s) => s.programme.programmeName).join(', ')}. You can switch
              programme at Review.
            </p>
          )}
        </div>
      )}

      {pending.length > 0 && (
        <ul className="divide-y divide-border">
          {pending.map((f) => (
            <Row
              key={f.key}
              field={f}
              source={sourceFor(f)}
              issue={issueForField(f.key, entryIssues)}
              confirmed={false}
              onConfirm={() => onConfirm(f.key)}
              onChange={(v) => onChange(f.key, v)}
            />
          ))}
        </ul>
      )}

      {confirmed.length > 0 && (
        <div className={cn(pending.length > 0 && 'border-t border-border')}>
          <button
            type="button"
            onClick={() => setShowConfirmed((s) => !s)}
            aria-expanded={showConfirmed}
            className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:bg-muted/50"
          >
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-success" aria-hidden />
              {confirmed.length} confirmed
            </span>
            <ChevronDown className={cn('size-3.5 transition-transform', showConfirmed && 'rotate-180')} aria-hidden />
          </button>
          {showConfirmed && (
            <ul className="divide-y divide-border border-t border-border">
              {confirmed.map((f) => (
                <Row
                  key={f.key}
                  field={f}
                  source={sourceFor(f)}
                  issue={issueForField(f.key, entryIssues)}
                  confirmed
                  onConfirm={() => onConfirm(f.key)}
                  onChange={(v) => onChange(f.key, v)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
