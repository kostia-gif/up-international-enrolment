'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, Eye, MessageSquarePlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  fieldForIssue,
  ISSUE_LABEL,
  type CourseSuggestion,
  type EntryIssues,
} from '@/lib/entry-rules'
import type { Course, Field } from '@/lib/types'

const ISSUE_KINDS: (keyof EntryIssues)[] = ['qualification', 'grade', 'english']

export function EntryShortfall({
  issues,
  fields,
  course,
  suggestions = [],
  note,
  onNoteChange,
  onViewSource,
  onUploadMore,
}: {
  issues: EntryIssues
  fields: Field[]
  course?: Course | null
  suggestions?: CourseSuggestion[]
  note: string
  onNoteChange: (v: string) => void
  onViewSource?: (field: Field) => void
  onUploadMore: () => void
}) {
  const [noteOpen, setNoteOpen] = useState(note.trim() !== '')
  const kinds = ISSUE_KINDS.filter((k) => issues[k])
  if (kinds.length === 0) return null

  return (
    <section
      id="triage-entry-gap"
      aria-labelledby="entry-gap-heading"
      className="scroll-mt-4 rounded-lg border border-warning/40 bg-card"
    >
      <div className="flex items-start gap-2 border-b border-warning/30 bg-warning/10 px-4 py-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 id="entry-gap-heading" className="text-sm font-semibold text-pretty">
            {kinds.length === 1
              ? 'The documents fall short of one entry requirement'
              : `The documents fall short of ${kinds.length} entry requirements`}
            {course?.programmeName && (
              <span className="font-normal text-muted-foreground"> for {course.programmeName}</span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground text-pretty">
            This is separate from confirming what AI read above — it&apos;s a gap to resolve, not a
            value to check. Add evidence or context so UP admissions can decide, or switch to a
            course the qualification already meets.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
      <ul className="flex flex-col gap-2">
        {kinds.map((kind) => {
          const field = fieldForIssue(kind, fields)
          return (
            <li
              key={kind}
              className="flex flex-col gap-2 rounded-md border border-warning/30 bg-card px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="min-w-0 text-xs text-pretty">
                <span className="font-semibold">{ISSUE_LABEL[kind]}.</span>{' '}
                <span className="text-muted-foreground">{issues[kind]}</span>
              </p>
              {field && onViewSource && (
                <button
                  type="button"
                  onClick={() => onViewSource(field)}
                  className="inline-flex shrink-0 items-center gap-1 self-start rounded-md px-1.5 py-1 text-xs font-medium text-ai hover:bg-ai/10 sm:self-auto"
                >
                  <Eye className="size-3.5" aria-hidden /> View document
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={onUploadMore} className="gap-1.5 bg-card">
          <Upload className="size-3.5" aria-hidden /> Upload further evidence
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setNoteOpen((o) => !o)}
          aria-expanded={noteOpen}
          className={cn('gap-1.5 bg-card', noteOpen && 'border-primary text-primary')}
        >
          <MessageSquarePlus className="size-3.5" aria-hidden />
          {note.trim() ? 'Edit note for admissions' : 'Add note for admissions'}
        </Button>
        {suggestions.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowRight className="size-3.5" aria-hidden />
            Would meet {suggestions.map((s) => s.programme.programmeName).join(', ')} — switch
            programme at Review.
          </span>
        )}
      </div>

      {noteOpen && (
        <div className="flex flex-col gap-1">
          <Textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={3}
            placeholder="e.g. Student has 4 years' relevant work experience; updated IELTS result sitting 12 Dec."
            aria-label="Note for admissions"
            className="bg-card text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            Sent with the application and shown again at Review.
          </p>
        </div>
      )}
      </div>
    </section>
  )
}
