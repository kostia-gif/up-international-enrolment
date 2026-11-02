import { ShieldCheck } from 'lucide-react'
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

// Short labels for the compact bars; full wording lives in the tooltip.
const SHORT_LABEL: Record<string, string> = {
  completeness: 'Completeness',
  acceptance: 'Acceptance',
  trust: 'Trust',
  inzPassThrough: 'INZ pass-through',
}

function ScoreRing({ score, tier }: { score: number; tier: AgentTier }) {
  const r = 42
  const c = 2 * Math.PI * r
  const dash = (score / 100) * c
  return (
    <div className="relative grid size-20 shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="size-20 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} className="fill-none stroke-muted" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className={cn('fill-none', TIER_TONE[tier].ring)}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <span className="absolute text-2xl font-semibold tabular-nums text-foreground">{score}</span>
    </div>
  )
}

export function AgentQuality({ profile }: { profile: AgentProfile }) {
  const score = qualityScore(profile.quality)
  const tier = tierFor(profile)
  const next: AgentTier | null = tier === 'gold' ? null : tier === 'silver' ? 'gold' : 'silver'
  const gap = next ? Math.max(0, TIER_META[next].minScore - score) : 0

  return (
    <section
      aria-labelledby="quality-heading"
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <ScoreRing score={score} tier={tier} />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 id="quality-heading" className="text-base font-semibold text-foreground">
            Quality score
          </h2>
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              TIER_TONE[tier].bg,
              TIER_TONE[tier].text,
            )}
          >
            <ShieldCheck className="size-3.5" aria-hidden />
            {TIER_META[tier].label}
          </span>
          <p className="text-xs text-muted-foreground text-pretty">
            {next
              ? gap > 0
                ? `${gap} points to ${TIER_META[next].label}`
                : `Score meets ${TIER_META[next].label}; ${next === 'gold' ? 'needs trust 90+ and an Active account' : 'confirmed at next review'}`
              : 'Last 12 months · reviewed quarterly'}
          </p>
        </div>
      </div>

      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {QUALITY_DIMENSIONS.map((d) => {
          const value = profile.quality[d.key]
          const network = NETWORK_QUALITY[d.key]
          const delta = value - network
          const fill = delta >= 3 ? 'bg-success' : delta <= -3 ? 'bg-destructive' : 'bg-info'
          return (
            <li key={d.key} className="flex flex-col gap-1" title={d.detail}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="text-foreground">{SHORT_LABEL[d.key] ?? d.label}</span>
                <span className="tabular-nums font-semibold text-foreground">{value}</span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-muted">
                <div className={cn('h-full rounded-full', fill)} style={{ width: `${value}%` }} />
                <span
                  className="absolute -top-0.5 h-2.5 w-0.5 rounded-full bg-foreground/60"
                  style={{ left: `${network}%` }}
                  aria-hidden
                />
              </div>
              <span className="sr-only">
                {d.detail} Network average {network}.
              </span>
            </li>
          )
        })}
      </ul>

      <p className="text-[11px] text-muted-foreground">Tick marks show the network average.</p>
    </section>
  )
}
