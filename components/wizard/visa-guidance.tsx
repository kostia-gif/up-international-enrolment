'use client'

import { CircleAlert, FileCheck2, Handshake, Lightbulb, ShieldCheck, Upload } from 'lucide-react'
import {
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  RISK_COACHING,
  RISK_META,
  RISK_TIPS,
  type RiskLevel,
  type VisaRisk,
} from '@/lib/eligibility'
import type { Document, VisaSubmission, VisaSubmitter } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const BAND_CHIP: Record<RiskLevel, string> = {
  low: 'bg-success/12 text-success',
  medium: 'bg-warning/12 text-warning',
  high: 'bg-destructive/10 text-destructive',
}

// Low / Medium / High band with coaching copy. No percentages: the band is
// what the agent needs, and the tone is partnership rather than gatekeeping.
export function RiskAssessment({ risk, outcomeNote }: { risk: VisaRisk | null; outcomeNote: string }) {
  if (!risk) {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/6 p-4">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-warning">Visa guidance needs the passport</h3>
          <p className="text-sm text-pretty">
            Country of citizenship is missing. Upload the passport or add it in Student details and
            we&apos;ll show what to prepare for the visa.
          </p>
        </div>
      </section>
    )
  }

  const low = risk.level === 'low'
  const coaching = RISK_COACHING[risk.level]
  const Icon = low ? ShieldCheck : Handshake

  return (
    <section
      aria-label="Visa guidance"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        low ? 'border-success/30 bg-success/6' : 'border-border bg-card',
      )}
    >
      <Icon className={cn('mt-0.5 size-6 shrink-0', low ? 'text-success' : 'text-primary')} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', BAND_CHIP[risk.level])}>
            {RISK_META[risk.level].label}
          </span>
          <span className="text-xs text-muted-foreground">
            {risk.nationality} · {COURSE_TYPE_LABEL[risk.courseType]} study
          </span>
        </div>
        <h3 className="text-base font-semibold text-pretty">{coaching.headline}</h3>
        <p className="text-sm leading-relaxed text-pretty">{coaching.message}</p>
        <p className="text-xs text-muted-foreground text-pretty">{outcomeNote}</p>
        <p className="text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
      </div>
    </section>
  )
}

// What INZ looks for and why, with optional places to add it now. Nothing
// here blocks submission.
export function VisaCoaching({
  purpose,
  onPurpose,
  fundsDoc,
  onAddFunds,
}: {
  purpose: string
  onPurpose: (v: string) => void
  fundsDoc?: Document
  onAddFunds: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h4 className="flex items-center gap-1.5 text-sm font-semibold">
          <Lightbulb className="size-4 text-primary" aria-hidden />
          How to help your student
        </h4>
        <p className="text-sm text-muted-foreground text-pretty">
          What Immigration New Zealand usually looks for, and why. Gathering these from the start
          avoids delays later.
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {RISK_TIPS.map((tip) => (
          <li key={tip.title} className="flex flex-col gap-1 rounded-md border border-border bg-card p-3">
            <p className="text-sm font-medium">{tip.title}</p>
            <p className="text-xs leading-relaxed text-pretty">{tip.detail}</p>
            <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
              <span className="font-medium">Why it matters: </span>
              {tip.why}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 rounded-md border border-dashed border-border p-3">
        <p className="text-sm font-medium">
          Add to the application now{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visa-purpose" className="text-xs text-muted-foreground">
            Reason for study notes
          </Label>
          <Textarea
            id="visa-purpose"
            value={purpose}
            onChange={(e) => onPurpose(e.target.value)}
            rows={3}
            placeholder="Why this course, why New Zealand, why now, and how it fits the student’s plans at home"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">Financial document</p>
          {fundsDoc ? (
            <p className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
              <FileCheck2 className="size-4 shrink-0 text-success" aria-hidden />
              <span className="truncate">{fundsDoc.fileName}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {fundsDoc.pages} pages · checked
              </span>
            </p>
          ) : (
            <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={onAddFunds}>
              <Upload className="size-3.5" aria-hidden /> Add bank statement (demo)
            </Button>
          )}
        </div>
      </div>
    </div>
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

// Asked at Review, beside the visa guidance: who will lodge the student visa.
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
          We&apos;ll share the visa guidance above with the student alongside their offer, so they
          know which documents to prepare.
        </p>
      )}
    </fieldset>
  )
}
