import { ShieldAlert } from 'lucide-react'
import {
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  RISK_META,
  RISK_TIPS,
  type VisaRisk,
} from '@/lib/eligibility'
import { cn } from '@/lib/utils'

// Banner for students from countries with a higher refusal rate for the
// chosen course type. Renders nothing for low-risk combinations.
export function VisaRiskNotice({
  risk,
  className,
  compact = false,
}: {
  risk: VisaRisk | null
  className?: string
  // One-line variant for applications already with UP, where the advice is no longer actionable.
  compact?: boolean
}) {
  if (!risk || risk.level === 'low') return null
  const high = risk.level === 'high'

  if (compact) {
    return (
      <details
        className={cn(
          'group rounded-lg border px-3 py-2',
          high ? 'border-destructive/30 bg-destructive/6' : 'border-warning/30 bg-warning/6',
          className,
        )}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm">
          <ShieldAlert
            className={cn('size-4 shrink-0', high ? 'text-destructive' : 'text-warning')}
            aria-hidden
          />
          <span className="min-w-0 flex-1 text-pretty">
            <span className={cn('font-medium', high ? 'text-destructive' : 'text-warning')}>
              {RISK_META[risk.level].label}
            </span>
            <span className="text-muted-foreground">
              {' '}
              · about <span className="tabular-nums">{risk.approvalRate}%</span> of {risk.nationality}{' '}
              {COURSE_TYPE_LABEL[risk.courseType].toLowerCase()} visas are approved
            </span>
          </span>
          <span className="shrink-0 text-xs font-medium text-primary group-open:hidden">
            What helps
          </span>
          <span className="hidden shrink-0 text-xs font-medium text-primary group-open:inline">
            Hide
          </span>
        </summary>
        <ul className="mt-2 flex flex-col gap-1.5 border-t border-border/60 pt-2">
          {RISK_TIPS.map((tip) => (
            <li key={tip.title} className="text-xs leading-relaxed">
              <span className="font-medium">{tip.title}.</span>{' '}
              <span className="text-muted-foreground">{tip.detail}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
      </details>
    )
  }

  return (
    <section
      aria-label={RISK_META[risk.level].label}
      className={cn(
        'rounded-lg border p-4',
        high ? 'border-destructive/30 bg-destructive/6' : 'border-warning/30 bg-warning/6',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert
          className={cn('mt-0.5 size-5 shrink-0', high ? 'text-destructive' : 'text-warning')}
          aria-hidden
        />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className={cn('text-sm font-semibold', high ? 'text-destructive' : 'text-warning')}>
            {RISK_META[risk.level].label}: {risk.nationality} ×{' '}
            {COURSE_TYPE_LABEL[risk.courseType]}
          </h3>
          <p className="text-sm leading-relaxed text-foreground text-pretty">
            About <strong className="tabular-nums">{risk.approvalRate}%</strong> of comparable
            student visa applications are approved. Strengthen the file before submitting.
          </p>
        </div>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {RISK_TIPS.map((tip) => (
          <li key={tip.title} className="rounded-md border border-border bg-card p-3">
            <p className="text-sm font-medium">{tip.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground text-pretty">
              {tip.detail}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
    </section>
  )
}
