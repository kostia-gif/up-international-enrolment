'use client'

import type { Requirement, RequirementCategory } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import type { CourseSuggestion } from '@/lib/entry-rules'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  identity: 'Identity',
  academic: 'Academic',
  english: 'English',
  course: 'Course-specific',
  other: 'Other',
}

const ORDER: RequirementCategory[] = ['identity', 'academic', 'english', 'course', 'other']

export function ChecklistPanel({
  requirements,
  title = 'Requirements',
  englishRule,
  hasIssues = false,
  suggestions = [],
  onSwitchCourse,
}: {
  requirements: Requirement[]
  title?: string
  englishRule?: string
  hasIssues?: boolean
  suggestions?: CourseSuggestion[]
  onSwitchCourse?: (s: CourseSuggestion) => void
}) {
  if (requirements.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card/50 p-4">
        <p className="text-sm text-muted-foreground text-pretty">
          Select a course to see the requirements for this programme and nationality.
        </p>
      </div>
    )
  }

  const groups = ORDER.map((cat) => ({
    cat,
    items: requirements.filter((r) => r.category === cat),
  })).filter((g) => g.items.length > 0)

  // Only count uploaded-evidence requirements. The "course" item is a
  // selection state (met as soon as a programme is chosen), so counting it
  // would show "1 / N met" before any documents are added.
  const evidenceReqs = requirements.filter((r) => r.category !== 'course')
  const met = evidenceReqs.filter((r) => r.status === 'met').length
  const problems = requirements.filter((r) => r.status === 'problem')

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-balance">{title}</h2>
          {englishRule && (
            <p className="mt-0.5 text-xs text-muted-foreground">English: {englishRule}</p>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {met} / {evidenceReqs.length} met
        </span>
      </div>
      {hasIssues && problems.length > 0 && (
        <div className="flex flex-col gap-3 border-b border-border bg-warning/10 px-4 py-3" role="status">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm font-semibold">
                {problems.length === 1
                  ? '1 entry requirement not met'
                  : `${problems.length} entry requirements not met`}
              </p>
              <ul className="mt-1 flex flex-col gap-1">
                {problems.map((p) => (
                  <li key={p.id} className="text-xs leading-relaxed text-pretty">
                    {p.note ?? p.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Recommended alternatives
              </p>
              <ul className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <li key={s.programme.id}>
                    <button
                      type="button"
                      onClick={() => onSwitchCourse?.(s)}
                      disabled={!onSwitchCourse}
                      className="group flex w-full items-start justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-tight text-pretty">
                          {s.programme.programmeName}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {s.programme.brand} · Next intake {s.intake}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground text-pretty">
                          {s.reason}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                        Switch
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4 p-4">
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
