'use client'

import {
  ArrowRight,
  CircleCheck,
  CircleAlert,
  Files,
  GraduationCap,
  Languages,
  Plane,
  School,
  TriangleAlert,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import type { AssessmentCheck, CheckKind, Tone } from '@/lib/assessment'
import { INZ_DATA_LABEL } from '@/lib/eligibility'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const KIND_ICON: Record<CheckKind, LucideIcon> = {
  documents: Files,
  entry: GraduationCap,
  english: Languages,
  immigration: Plane,
  course: School,
}

const KIND_LABEL: Record<CheckKind, string> = {
  documents: 'Documents',
  entry: 'Academic entry',
  english: 'English',
  immigration: 'Immigration',
  course: 'Course-specific',
}

const TONE_LABEL: Record<Tone, string> = {
  green: 'Proceed',
  amber: 'Proceed with action',
  red: 'Unlikely to proceed',
}

const TONE_RING: Record<Tone, string> = {
  green: 'border-success/40 bg-success/10',
  amber: 'border-warning/40 bg-warning/10',
  red: 'border-destructive/40 bg-destructive/10',
}

const TONE_TEXT: Record<Tone, string> = {
  green: 'text-success',
  amber: 'text-warning',
  red: 'text-destructive',
}

const TONE_DOT: Record<Tone, string> = {
  green: 'bg-success',
  amber: 'bg-warning',
  red: 'bg-destructive',
}

function ToneIcon({ tone, className }: { tone: Tone; className?: string }) {
  const Icon = tone === 'green' ? CircleCheck : tone === 'amber' ? CircleAlert : TriangleAlert
  return <Icon className={cn(TONE_TEXT[tone], className)} aria-hidden />
}

export function StepAssessment() {
  const { assessment, course, suggestions, setCourse, goToStep, documents } = useWizard()
  const { overall, headline, summary, checks, risk } = assessment
  const entryGap = checks.some((c) => c.kind === 'entry' && c.tone === 'amber' && suggestions.length > 0)

  return (
    <div className="flex flex-col gap-6">
      <section
        className={cn('rounded-xl border p-6', TONE_RING[overall])}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-4">
          <ToneIcon tone={overall} className="mt-0.5 size-7 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className={cn('text-xs font-semibold uppercase tracking-wider', TONE_TEXT[overall])}>
              {TONE_LABEL[overall]}
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-snug text-balance">{headline}</h2>
            <p className="mt-2 text-sm leading-relaxed text-pretty">{summary}</p>
            {course && (
              <p className="mt-3 text-xs text-muted-foreground">
                {course.brand} · {course.programmeName} · intake {formatDate(course.intakeDate)} ·{' '}
                {documents.filter((d) => d.status === 'checked').length} document
                {documents.filter((d) => d.status === 'checked').length === 1 ? '' : 's'} read
              </p>
            )}
          </div>
        </div>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Checks at a glance">
          {checks.map((c) => (
            <li
              key={c.kind}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs"
            >
              <span className={cn('size-2 rounded-full', TONE_DOT[c.tone])} aria-hidden />
              {KIND_LABEL[c.kind]}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="checks-heading" className="flex flex-col gap-3">
        <h3 id="checks-heading" className="text-sm font-semibold">
          What the rules found
        </h3>
        <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {checks.map((c) => (
            <CheckRow key={c.kind} check={c} />
          ))}
        </ol>
        {risk && (
          <p className="text-xs text-muted-foreground">
            {INZ_DATA_LABEL}. Illustrative figures for the POC.
          </p>
        )}
      </section>

      {entryGap && suggestions.length > 0 && (
        <section
          aria-labelledby="alt-heading"
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
        >
          <div>
            <h3 id="alt-heading" className="text-sm font-semibold">
              Alternative courses that fit the qualification
            </h3>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Switching keeps every document already read. The assessment re-runs for the new
              course.
            </p>
          </div>
          <ul className="flex flex-col gap-2">
            {suggestions.map((s) => (
              <li
                key={s.programme.id}
                className="flex flex-col gap-2 rounded-md border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-pretty">{s.programme.programmeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.programme.brand} · next intake {formatDate(s.intake)} · {s.reason}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  onClick={() => setCourse(s.programme, s.intake)}
                >
                  Switch course <ArrowRight className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium">What happens next</p>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            {overall === 'red'
              ? 'You can continue, but admissions will review this application before any offer. Consider the alternatives above first.'
              : assessment.conditionalOfferAllowed
                ? assessment.admissionsReviewRequired
                  ? 'Continue to complete the answers. A conditional offer can be created; admissions reviews the flagged items.'
                  : 'Continue to complete the answers. If everything checks out, an offer can be issued straight away.'
                : 'Continue to complete the answers and add RPL or special admission evidence so admissions can consider the application.'}
          </p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => goToStep(2)}>
          <Upload className="size-3.5" /> Add more documents
        </Button>
      </section>
    </div>
  )
}

function CheckRow({ check }: { check: AssessmentCheck }) {
  const Icon = KIND_ICON[check.kind]
  return (
    <li className="flex items-start gap-4 p-4">
      <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        <span
          className={cn(
            'absolute -right-1 -top-1 size-3 rounded-full ring-2 ring-card',
            TONE_DOT[check.tone],
          )}
          aria-hidden
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {KIND_LABEL[check.kind]}
          </p>
          <span className={cn('text-xs font-medium', TONE_TEXT[check.tone])}>
            {check.tone === 'green' ? 'OK' : check.tone === 'amber' ? 'Action needed' : 'High risk'}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-pretty">{check.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
          {check.detail}
        </p>
        {check.actions.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1">
            {check.actions.map((a) => (
              <li key={a} className="flex items-start gap-2 text-sm leading-relaxed text-pretty">
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}
