import { CircleAlert, CircleCheck, Lightbulb, TrendingUp } from 'lucide-react'
import type { AgentProfile, Measure, MeasureStatus } from '@/lib/agent-profiles'
import { measuresFor, nextStepFor } from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'

const STATUS_META: Record<MeasureStatus, { label: string; dot: string; text: string; bar: string; ring: string }> = {
  strong: { label: 'Strong', dot: 'bg-success', text: 'text-success', bar: 'bg-success', ring: 'border-success/30 bg-success/5' },
  onTrack: { label: 'On track', dot: 'bg-warning', text: 'text-warning', bar: 'bg-warning', ring: 'border-warning/30 bg-warning/5' },
  needsAttention: {
    label: 'Needs attention',
    dot: 'bg-destructive',
    text: 'text-destructive',
    bar: 'bg-destructive',
    ring: 'border-destructive/30 bg-destructive/5',
  },
}

// At-a-glance bar: the fill is the agent's own rate, the tick is the
// target/average/expected rate it's judged against.
function MeasureBar({ rate, target, status }: { rate: number; target: number; status: MeasureStatus }) {
  const fillPct = Math.min(Math.round(rate * 100), 100)
  const targetPct = Math.min(Math.round(target * 100), 100)
  return (
    <div
      role="img"
      aria-label={`${Math.round(rate * 100)}%, target ${Math.round(target * 100)}%`}
      className="relative h-2 rounded-full bg-muted"
    >
      <div
        className={cn('absolute inset-y-0 left-0 rounded-full', STATUS_META[status].bar)}
        style={{ width: `${fillPct}%` }}
      />
      <div className="absolute -top-0.5 h-3 w-0.5 rounded-full bg-foreground/60" style={{ left: `${targetPct}%` }} />
    </div>
  )
}

function MeasureCard({ measure }: { measure: Measure }) {
  const meta = measure.status ? STATUS_META[measure.status] : null
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-lg border p-4',
        meta ? meta.ring : 'border-border bg-card',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">{measure.label}</h3>
        {meta && (
          <span className={cn('flex items-center gap-1 text-xs font-semibold', meta.text)}>
            <span className={cn('size-1.5 rounded-full', meta.dot)} aria-hidden />
            {meta.label}
          </span>
        )}
      </div>
      {measure.status && measure.rate != null && measure.target != null && (
        <MeasureBar rate={measure.rate} target={measure.target} status={measure.status} />
      )}
      <p className="text-sm text-foreground text-pretty">{measure.countText}</p>
      {measure.compareText && (
        <p className="text-xs text-muted-foreground text-pretty">{measure.compareText}</p>
      )}
    </div>
  )
}

export function AgentPerformance({ profile }: { profile: AgentProfile }) {
  const measures = measuresFor(profile)
  const nextStep = nextStepFor(profile)
  const building = profile.performance.applications < 10

  return (
    <section aria-labelledby="performance-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="performance-heading" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <TrendingUp className="size-4 text-muted-foreground" aria-hidden />
          Your performance
        </h2>
        <span className="text-xs text-muted-foreground">Last 12 months · reviewed quarterly</span>
      </div>

      {building && (
        <p className="flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs leading-relaxed text-muted-foreground text-pretty">
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Submit 10 applications to unlock your performance status. These are counts only for now.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {measures.map((m) => (
          <MeasureCard key={m.key} measure={m} />
        ))}
      </div>

      {nextStep && (
        <p className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm leading-relaxed text-pretty">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Next step: </span>
            <span className="text-muted-foreground">{nextStep}</span>
          </span>
        </p>
      )}
      {!nextStep && !building && (
        <p className="flex items-center gap-2 text-xs text-success">
          <CircleCheck className="size-3.5" aria-hidden />
          Every measure is Strong.
        </p>
      )}
    </section>
  )
}
