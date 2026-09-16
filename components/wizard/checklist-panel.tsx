'use client'

import type { Requirement, RequirementCategory } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'

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
}: {
  requirements: Requirement[]
  title?: string
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

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {met} / {evidenceReqs.length} met
        </span>
      </div>
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
