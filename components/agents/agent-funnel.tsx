import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import {
  buildFunnel,
  overallConversion,
  PAR_BAND,
  type Comparison,
  type FunnelStep,
} from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`

export function AgentFunnel({ funnel }: { funnel: number[] }) {
  const steps = buildFunnel(funnel)
  const overall = overallConversion(funnel)
  const scored = steps.filter((s) => s.deltaPts !== undefined)
  const best = [...scored].sort((a, b) => (b.deltaPts ?? 0) - (a.deltaPts ?? 0))[0]
  const worst = [...scored].sort((a, b) => (a.deltaPts ?? 0) - (b.deltaPts ?? 0))[0]

  return (
    <section aria-labelledby="funnel-heading" className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="funnel-heading" className="text-base font-semibold text-foreground">
            Application success rate
          </h2>
          <p className="text-sm text-muted-foreground">
            Last 12 months, compared with the UP network average.
          </p>
        </div>
        <Legend />
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          label="Applications to visa"
          value={pct(overall.rate)}
          sub={`Network ${pct(overall.baseline)}`}
          comparison={overall.comparison}
          deltaPts={overall.deltaPts}
        />
        {best && (
          <Summary
            label="Strongest stage"
            value={best.stage}
            sub={`${pct(best.rate ?? 0)} vs ${pct(best.baselineRate ?? 0)}`}
            comparison={best.comparison}
            deltaPts={best.deltaPts}
          />
        )}
        {worst && (
          <Summary
            label="Needs attention"
            value={worst.stage}
            sub={`${pct(worst.rate ?? 0)} vs ${pct(worst.baselineRate ?? 0)}`}
            comparison={worst.comparison}
            deltaPts={worst.deltaPts}
          />
        )}
      </div>

      <ol className="flex flex-col gap-1">
        {steps.map((s, i) => (
          <FunnelRow key={s.stage} step={s} isFirst={i === 0} />
        ))}
      </ol>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Conversion is measured from the previous stage. Within {PAR_BAND} points of the network average counts as on par.
      </p>
    </section>
  )
}

function FunnelRow({ step, isFirst }: { step: FunnelStep; isFirst: boolean }) {
  const width = Math.max(step.ofTotal * 100, 2)
  const baselineAt = (step.baselineCount / (step.count / step.ofTotal || 1)) * 100

  return (
    <li className="flex flex-col gap-2 rounded-lg px-1 py-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex w-36 shrink-0 items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-0">
        <span className="text-sm font-medium text-foreground">{step.stage}</span>
        <span className="text-xs text-muted-foreground">{isFirst ? 'Starting volume' : `${pct(step.ofTotal)} of total`}</span>
      </div>

      <div className="relative h-9 flex-1 rounded-md bg-muted">
        <div
          className={cn(
            'flex h-full items-center justify-end rounded-md px-2.5 transition-[width]',
            isFirst ? 'bg-primary' : barColor(step.comparison),
          )}
          style={{ width: `${width}%` }}
        >
          <span className="text-sm font-semibold tabular-nums text-primary-foreground">{step.count}</span>
        </div>
        {!isFirst && (
          <span
            className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground/70"
            style={{ left: `${Math.min(baselineAt, 100)}%` }}
            title={`Network average would reach ${step.baselineCount}`}
            aria-hidden
          />
        )}
      </div>

      <div className="flex w-44 shrink-0 items-center justify-between gap-2 sm:justify-end">
        {isFirst ? (
          <span className="text-xs text-muted-foreground">Baseline: 100%</span>
        ) : (
          <>
            <span className="text-xs text-muted-foreground tabular-nums">
              {pct(step.rate ?? 0)} <span className="opacity-70">vs {pct(step.baselineRate ?? 0)}</span>
            </span>
            <DeltaChip comparison={step.comparison} deltaPts={step.deltaPts} />
          </>
        )}
      </div>
    </li>
  )
}

function barColor(c?: Comparison) {
  if (c === 'better') return 'bg-success'
  if (c === 'worse') return 'bg-destructive'
  return 'bg-info'
}

export function DeltaChip({ comparison, deltaPts }: { comparison?: Comparison; deltaPts?: number }) {
  if (comparison === undefined || deltaPts === undefined) return null
  const Icon = comparison === 'better' ? ArrowUpRight : comparison === 'worse' ? ArrowDownRight : Minus
  const label = comparison === 'par' ? 'On par' : `${deltaPts > 0 ? '+' : ''}${deltaPts} pts`
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums',
        comparison === 'better' && 'border-success/30 bg-success/10 text-success',
        comparison === 'worse' && 'border-destructive/30 bg-destructive/10 text-destructive',
        comparison === 'par' && 'border-info/30 bg-info/10 text-info',
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </span>
  )
}

function Summary({
  label,
  value,
  sub,
  comparison,
  deltaPts,
}: {
  label: string
  value: string
  sub: string
  comparison?: Comparison
  deltaPts?: number
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-background p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-start justify-between gap-2">
        <span className="text-lg font-semibold leading-tight text-foreground text-pretty">{value}</span>
        <DeltaChip comparison={comparison} deltaPts={deltaPts} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">{sub}</span>
    </div>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-success" aria-hidden /> Better
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-info" aria-hidden /> On par
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-destructive" aria-hidden /> Worse
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-0.5 rounded-full bg-foreground/70" aria-hidden /> Network average
      </li>
    </ul>
  )
}
