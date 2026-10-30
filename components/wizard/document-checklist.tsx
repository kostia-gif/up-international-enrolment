'use client'

import { CircleCheck, FileSearch, Files } from 'lucide-react'
import type { Requirement, RequirementCategory } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'

// Step 2 panel: which documents this course needs and which have been read.
// Deliberately says nothing about whether the content meets entry rules — that
// is Step 3's job.
const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  identity: 'Identity',
  academic: 'Academic',
  english: 'English',
  course: 'Course',
  other: 'Course-specific',
}

const ORDER: RequirementCategory[] = ['identity', 'academic', 'english', 'other']

export function DocumentChecklist({
  requirements,
  courseName,
}: {
  requirements: Requirement[]
  courseName?: string
}) {
  const evidence = requirements.filter(
    (r) => r.category !== 'course' && r.status !== 'not-applicable',
  )
  if (evidence.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 p-4">
        <p className="text-sm text-muted-foreground text-pretty">
          Select a course to see which documents it needs.
        </p>
      </div>
    )
  }

  const met = evidence.filter((r) => r.status === 'met' || r.status === 'expiring').length
  const started = met > 0
  const complete = met === evidence.length
  const groups = ORDER.map((cat) => ({
    cat,
    items: evidence.filter((r) => r.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-balance">
          {courseName ? `Documents for ${courseName}` : 'Documents required'}
        </h2>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {met} / {evidence.length} received
        </span>
      </div>

      <div
        className={cn(
          'flex items-start gap-3 border-b px-5 py-4',
          complete
            ? 'border-success/30 bg-success/10'
            : started
              ? 'border-border bg-muted/40'
              : 'border-border bg-muted/50',
        )}
        role="status"
        aria-live="polite"
      >
        {complete ? (
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        ) : started ? (
          <Files className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        ) : (
          <FileSearch className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pretty">
            {complete
              ? 'All documents received'
              : started
                ? `${evidence.length - met} still to add`
                : 'Waiting for documents'}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
            {complete
              ? 'Each file has been read, translated where needed and checked for completeness. Continue to assess the application.'
              : started
                ? 'You can continue and assess now; anything missing is listed in the assessment and can be uploaded later.'
                : 'Add the passport, academic transcripts and English test. Each is read and checked as it arrives.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {groups.map((g) => (
          <div key={g.cat}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {CATEGORY_LABELS[g.cat]}
            </p>
            <ul className="flex flex-col gap-2">
              {g.items.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm leading-tight text-pretty">{r.label}</p>
                    {r.note && (
                      <p className="mt-0.5 text-xs text-muted-foreground text-pretty">{r.note}</p>
                    )}
                  </div>
                  <StatusBadge kind="requirement" status={r.status} className="shrink-0" iconOnly />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
