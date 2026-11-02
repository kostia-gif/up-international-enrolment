import { ShieldCheck, TrendingUp } from 'lucide-react'
import {
  NETWORK_QUALITY,
  QUALITY_DIMENSIONS,
  TIER_META,
  qualityScore,
  tierFor,
  type AgentProfile,
  type AgentTier,
} from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'

const TIER_TONE: Record<AgentTier, { ring: string; text: string; bg: string }> = {
  gold: {
    ring: 'stroke-[oklch(0.78_0.16_80)]',
    text: 'text-[oklch(0.6_0.14_75)]',
    bg: 'bg-[oklch(0.78_0.16_80)]/15',
  },
  silver: { ring: 'stroke-muted-foreground', text: 'text-muted-foreground', bg: 'bg-muted' },
  standard: { ring: 'stroke-info', text: 'text-info', bg: 'bg-info/10' },
}

function ScoreRing({ score, tier }: { score: number; tier: AgentTier }) {
  const r = 44
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c
  return (
    <div className="relative grid size-32 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="size-32 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className={cn('fill-none transition-[stroke-dasharray]', TIER_TONE[tier].ring)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums text-foreground">{score}</span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Quality
        </span>
      </div>
    </div>
  )
}

function Bar({
  label,
  detail,
  value,
  network,
  weight,
}: {
  label: string
  detail: string
  value: number
  network: number
  weight: number
}) {
  const delta = value - network
  const tone =
    delta >= 3 ? 'text-success' : delta <= -3 ? 'text-destructive' : 'text-muted-foreground'
  const fill = delta >= 3 ? 'bg-success' : delta <= -3 ? 'bg-destructive' : 'bg-info'
  return (
    <li className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">{Math.round(weight * 100)}% of score</span>
        </div>
        <span className="flex items-baseline gap-2 tabular-nums">
          <span className="text-sm font-semibold text-foreground">{value}</span>
          <span className={cn('text-xs', tone)}>
            {delta > 0 ? '+' : ''}
            {delta} vs network
          </span>
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', fill)} style={{ width: `${value}%` }} />
        <span
          className="absolute -top-0.5 h-3 w-0.5 rounded-full bg-foreground/70"
          style={{ left: `${network}%` }}
          title={`Network average ${network}`}
          aria-hidden
        />
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{detail}</p>
    </li>
  )
}

export function AgentQuality({ profile }: { profile: AgentProfile }) {
  const score = qualityScore(profile.quality)
  const tier = tierFor(profile)
  const meta = TIER_META[tier]
  const next: AgentTier | null = tier === 'gold' ? null : tier === 'silver' ? 'gold' : 'silver'

  const blockers: string[] = []
  if (next) {
    const needed = TIER_META[next].minScore - score
    if (needed > 0) blockers.push(`${needed} more point${needed === 1 ? '' : 's'} on the overall score`)
    if (next === 'gold') {
      if (profile.quality.trust < 90) blockers.push(`trust score of 90 or more (currently ${profile.quality.trust})`)
      if (profile.status !== 'Active') blockers.push('an Active account')
    }
  }

  return (
    <section
      aria-labelledby="quality-heading"
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <h2 id="quality-heading" className="text-base font-semibold text-foreground">
          Quality score
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          How much UP can rely on this agent&apos;s applications. Weighted across four measures
          over the last 12 months; the tier is earned from the score.
        </p>
      </header>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <ScoreRing score={score} tier={tier} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold',
              TIER_TONE[tier].bg,
              TIER_TONE[tier].text,
            )}
          >
            <ShieldCheck className="size-4" aria-hidden />
            {meta.label}
          </span>
          <p className="text-sm leading-relaxed text-foreground text-pretty">{meta.description}</p>
          {next && (
            <p className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground text-pretty">
              <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                To reach {TIER_META[next].label}: {blockers.length ? blockers.join('; ') : 'hold current standing through the next review'}.
              </span>
            </p>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {QUALITY_DIMENSIONS.map((d) => (
          <Bar
            key={d.key}
            label={d.label}
            detail={d.detail}
            value={profile.quality[d.key]}
            network={NETWORK_QUALITY[d.key]}
            weight={d.weight}
          />
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Gold requires a score of {TIER_META.gold.minScore}+, trust of 90+ and an Active account.
        Silver requires {TIER_META.silver.minScore}+. Reviewed quarterly by UP.
      </p>
    </section>
  )
}
