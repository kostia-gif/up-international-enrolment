import { Handshake } from 'lucide-react'
import {
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  RISK_COACHING,
  RISK_META,
  RISK_TIPS,
  type VisaRisk,
} from '@/lib/eligibility'
import { cn } from '@/lib/utils'

// Visa coaching for medium and high bands: what INZ looks for and why.
// Renders nothing for low risk, where there is nothing extra to prepare.
export function VisaRiskNotice({
  risk,
  className,
  compact = false,
}: {
  risk: VisaRisk | null
  className?: string
  // One-line variant for applications already with UP.
  compact?: boolean
}) {
  if (!risk || risk.level === 'low') return null
  const high = risk.level === 'high'
  const chip = high ? 'bg-destructive/10 text-destructive' : 'bg-warning/12 text-warning'
  const coaching = RISK_COACHING[risk.level]

  if (compact) {
    return (
      <details className={cn('group rounded-lg border border-border bg-card px-3 py-2', className)}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm">
          <Handshake className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1 text-pretty">
            <span className={cn('mr-1.5 rounded-full px-2 py-0.5 text-xs font-semibold', chip)}>
              {RISK_META[risk.level].short}
            </span>
            <span className="text-muted-foreground">{coaching.headline}</span>
          </span>
          <span className="shrink-0 text-xs font-medium text-primary group-open:hidden">What helps</span>
          <span className="hidden shrink-0 text-xs font-medium text-primary group-open:inline">Hide</span>
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
    <section aria-label="Visa guidance" className={cn('rounded-lg border border-border bg-card p-4', className)}>
      <div className="flex items-start gap-3">
        <Handshake className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', chip)}>
              {RISK_META[risk.level].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {risk.nationality} · {COURSE_TYPE_LABEL[risk.courseType]} study
            </span>
          </div>
          <h3 className="text-sm font-semibold text-pretty">{coaching.headline}</h3>
          <p className="text-sm leading-relaxed text-pretty">{coaching.message}</p>
        </div>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {RISK_TIPS.map((tip) => (
          <li key={tip.title} className="rounded-md border border-border bg-background p-3">
            <p className="text-sm font-medium">{tip.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-pretty">{tip.detail}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">
              <span className="font-medium">Why it matters: </span>
              {tip.why}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
    </section>
  )
}
