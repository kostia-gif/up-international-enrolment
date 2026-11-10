'use client'

import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react'
import {
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  RISK_COACHING,
  RISK_META,
  RISK_TIPS,
  type RiskLevel,
  type VisaRisk,
} from '@/lib/eligibility'
import type { VisaSubmission, VisaSubmitter } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const BAND_STYLE: Record<
  RiskLevel,
  { bar: string; body: string; border: string; icon: typeof CircleCheck; tile: string }
> = {
  low: {
    bar: 'bg-success text-success-foreground',
    body: 'bg-success/8',
    border: 'border-success',
    icon: CircleCheck,
    tile: 'border-success/25',
  },
  medium: {
    bar: 'bg-warning text-warning-foreground',
    body: 'bg-warning/8',
    border: 'border-warning',
    icon: TriangleAlert,
    tile: 'border-warning/25',
  },
  high: {
    bar: 'bg-destructive text-destructive-foreground',
    body: 'bg-destructive/6',
    border: 'border-destructive',
    icon: TriangleAlert,
    tile: 'border-destructive/25',
  },
}

// Colour-blocked visa band: a solid bar states the band, the body lists what
// to prepare for medium and high. No percentages are shown to agents.
export function RiskAssessment({ risk, outcomeNote }: { risk: VisaRisk | null; outcomeNote: string }) {
  if (!risk) {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/6 p-4">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-warning">Visa risk not assessed yet</h3>
          <p className="text-sm text-pretty">
            Country of citizenship is missing. Upload the passport or add it in Student details.
          </p>
        </div>
      </section>
    )
  }

  const style = BAND_STYLE[risk.level]
  const coaching = RISK_COACHING[risk.level]
  const Icon = style.icon
  const showTips = risk.level !== 'low'

  return (
    <section
      aria-label={`${RISK_META[risk.level].label}: ${coaching.headline}`}
      className={cn('overflow-hidden rounded-lg border-2', style.border)}
    >
      <div className={cn('flex items-center gap-3 px-4 py-3', style.bar)}>
        <Icon className="size-7 shrink-0" aria-hidden />
        <div className="flex min-w-0 flex-col">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
            {RISK_META[risk.level].label}
          </p>
          <h3 className="text-lg font-bold leading-tight text-balance">{coaching.headline}</h3>
        </div>
        <span className="ml-auto hidden shrink-0 text-xs opacity-90 sm:inline">
          {risk.nationality} · {COURSE_TYPE_LABEL[risk.courseType]}
        </span>
      </div>

      <div className={cn('flex flex-col gap-3 p-4', style.body)}>
        <p className="text-sm leading-relaxed text-pretty">{coaching.message}</p>

        {showTips && (
          <ul className="grid gap-2 sm:grid-cols-2">
            {RISK_TIPS.map((tip) => (
              <li key={tip.title} className={cn('flex flex-col gap-1 rounded-md border bg-card p-3', style.tile)}>
                <p className="text-sm font-semibold">{tip.title}</p>
                <p className="text-xs leading-relaxed text-pretty">{tip.detail}</p>
                <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{tip.why}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-xs font-medium text-pretty">{outcomeNote}</p>
          <p className="text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
        </div>
      </div>
    </section>
  )
}

const SUBMITTER_OPTIONS: { value: VisaSubmitter; label: string; detail: string }[] = [
  { value: 'agent', label: 'Yes, I am', detail: 'You will lodge the student visa with INZ.' },
  {
    value: 'adviser',
    label: 'No, another licensed immigration adviser',
    detail: 'A licensed adviser outside your agency lodges it.',
  },
  { value: 'student', label: 'No, the student', detail: 'The student lodges the visa themselves.' },
]

export function visaSubmissionComplete(v: VisaSubmission | null): boolean {
  if (!v) return false
  return v.by !== 'adviser' || Boolean(v.adviserName?.trim())
}

export function visaSubmitterLabel(v: VisaSubmission): string {
  if (v.by === 'agent') return 'Visa to be lodged by the agent'
  if (v.by === 'student') return 'Visa to be lodged by the student'
  return `Visa to be lodged by licensed immigration adviser ${v.adviserName ?? ''}${
    v.adviserLicence ? ` (licence ${v.adviserLicence})` : ''
  }`.trim()
}

// Asked at Review, beside the visa band: who will lodge the student visa.
export function VisaSubmitterQuestion({
  value,
  onChange,
}: {
  value: VisaSubmission | null
  onChange: (v: VisaSubmission) => void
}) {
  return (
    <fieldset className="flex flex-col gap-3 border-t border-border pt-4">
      <legend className="mb-2 text-sm font-semibold">Are you the submitting officer for the student visa?</legend>
      <div className="flex flex-col gap-2">
        {SUBMITTER_OPTIONS.map((o) => {
          const checked = value?.by === o.value
          return (
            <label
              key={o.value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                checked ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <input
                type="radio"
                name="visa-submitter"
                value={o.value}
                checked={checked}
                onChange={() => onChange({ ...value, by: o.value })}
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{o.label}</span>
                <span className="text-xs text-muted-foreground">{o.detail}</span>
              </span>
            </label>
          )
        })}
      </div>

      {value?.by === 'adviser' && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adviser-name">Adviser name</Label>
            <Input
              id="adviser-name"
              value={value.adviserName ?? ''}
              onChange={(e) => onChange({ ...value, adviserName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adviser-licence">
              IAA licence number <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="adviser-licence"
              value={value.adviserLicence ?? ''}
              onChange={(e) => onChange({ ...value, adviserLicence: e.target.value })}
              className="font-mono"
            />
          </div>
        </div>
      )}
      {value?.by === 'student' && (
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          The visa guidance above is shared with the student alongside their offer.
        </p>
      )}
    </fieldset>
  )
}
