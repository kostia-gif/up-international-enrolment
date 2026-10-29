'use client'

import type { Requirement, RequirementCategory } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import { AlertTriangle, CircleCheck, FileSearch, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<RequirementCategory, string> = {
  identity: 'Identity',
  academic: 'Academic',
  english: 'English',
  course: 'Course-specific',
  other: 'Other',
}

const ORDER: RequirementCategory[] = ['identity', 'academic', 'english', 'course', 'other']

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function needPhrase(r: Requirement): string {
  if (r.status === 'problem') {
    if (r.category === 'english') return 'a higher English test score'
    if (r.category === 'academic') return 'academic results that meet the entry level'
    return lowerFirst(r.label)
  }
  if (r.status === 'expiring') {
    if (r.category === 'identity') return 'a passport valid for the course'
    if (r.category === 'english') return 'an English test valid at the start date'
    return `an up-to-date ${lowerFirst(r.label)}`
  }
  if (r.category === 'english') return 'an English test result'
  if (r.category === 'academic') return 'academic transcripts'
  if (r.category === 'identity') return 'a passport'
  return lowerFirst(r.label)
}

function joinAnd(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

type Verdict =
  | { kind: 'waiting' }
  | { kind: 'met' }
  | { kind: 'outstanding'; headline: string; items: Requirement[] }

function getVerdict(requirements: Requirement[]): Verdict {
  const evidence = requirements.filter(
    (r) => r.category !== 'course' && r.status !== 'not-applicable',
  )
  const started = evidence.some((r) => r.status !== 'missing')
  if (!started) return { kind: 'waiting' }

  const outstanding = evidence.filter((r) => r.status !== 'met')
  if (outstanding.length === 0) return { kind: 'met' }

  const metAreas = (['academic', 'english'] as const).filter((cat) => {
    const inCat = evidence.filter((r) => r.category === cat)
    return inCat.length > 0 && inCat.every((r) => r.status === 'met')
  })
  const needs = [...new Set(outstanding.map(needPhrase))]
  const headline =
    metAreas.length > 0
      ? `Meets the ${joinAnd(metAreas)} requirement${metAreas.length > 1 ? 's' : ''} and needs ${joinAnd(needs)}.`
      : `Needs ${joinAnd(needs)} to meet the entry requirements.`

  return { kind: 'outstanding', headline, items: outstanding }
}

function VerdictBand({ verdict, courseName }: { verdict: Verdict; courseName?: string }) {
  if (verdict.kind === 'waiting') {
    return (
      <div className="flex items-start gap-3 border-b border-border bg-muted/50 px-5 py-4" role="status">
        <FileSearch className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pretty">Waiting for documents</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
            Add the passport, academic transcripts and English test. AI checks each one against
            the requirements below as it is read.
          </p>
        </div>
      </div>
    )
  }

  const met = verdict.kind === 'met'
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b px-5 py-4',
        met ? 'border-success/30 bg-success/10' : 'border-warning/30 bg-warning/10',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {met ? (
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        ) : (
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        )}
        <p className="text-base font-semibold leading-snug text-balance">
          {met
            ? `Meets the entry requirements${courseName ? ` for ${courseName}` : ''}.`
            : verdict.headline}
        </p>
      </div>

      {met ? (
        <p className="pl-8 text-sm leading-relaxed text-pretty">
          Everything checked so far meets the published requirements. Continue to the next step.
        </p>
      ) : (
        <div className="flex flex-col gap-2 pl-8">
          <ul className="flex flex-col gap-1.5">
            {verdict.items.map((r) => (
              <li key={r.id} className="text-sm leading-relaxed text-pretty">
                <span className="font-medium">{r.label}</span>
                {(r.issue ?? r.note) && (
                  <span className="text-muted-foreground">{` — ${r.issue ?? r.note}`}</span>
                )}
                {!r.issue && !r.note && r.status === 'missing' && (
                  <span className="text-muted-foreground"> — not uploaded yet</span>
                )}
              </li>
            ))}
          </ul>
          {verdict.items.some((r) => r.category === 'academic') && (
            <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-card p-3">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              <p className="text-sm leading-relaxed text-pretty">
                {verdict.items.some((r) => r.category === 'academic' && r.status === 'problem')
                  ? 'The qualification doesn’t meet the entry level. '
                  : 'No qualification has been checked yet. '}
                The student may need a special admission condition or RPL evidence. You can add
                this under <span className="font-medium">Education history → Special admissions
                &amp; RPL</span> in the next step.
              </p>
            </div>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            You can continue now and upload these later. Anything still outstanding becomes a
            condition on the offer.
          </p>
        </div>
      )}
    </div>
  )
}

export function ChecklistPanel({
  requirements,
  title = 'Requirements',
  courseName,
  englishRule,
}: {
  requirements: Requirement[]
  title?: string
  courseName?: string
  englishRule?: string
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

  // The "course" item is a selection state, so it's excluded from the met count.
  const evidenceReqs = requirements.filter((r) => r.category !== 'course')
  const met = evidenceReqs.filter((r) => r.status === 'met').length

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
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

      <VerdictBand verdict={getVerdict(requirements)} courseName={courseName} />

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
                    {(r.issue ?? r.note) && (
                      <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                        {r.issue ?? r.note}
                      </p>
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
