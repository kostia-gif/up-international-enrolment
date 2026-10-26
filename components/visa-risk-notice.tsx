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
}: {
  risk: VisaRisk | null
  className?: string
}) {
  if (!risk || risk.level === 'low') return null
  const high = risk.level === 'high'

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
