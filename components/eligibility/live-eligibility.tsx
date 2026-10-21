'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, Globe2 } from 'lucide-react'
import {
  ELIGIBILITY_COUNTRIES,
  ELIGIBILITY_UPDATED,
  LEVEL_GROUPS,
  getCorridor,
  riskOf,
  watchlist,
  type CorridorStat,
  type Risk,
} from '@/lib/eligibility'
import type { CourseLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

// Decline risk maps to an approval likelihood for agents: low risk = High likelihood.
export const LIKELIHOOD: Record<Risk, { label: 'High' | 'Medium' | 'Low'; chip: string; dot: string }> = {
  low: { label: 'High', chip: 'bg-success/10 text-success', dot: 'bg-success' },
  medium: { label: 'Medium', chip: 'bg-warning/10 text-warning', dot: 'bg-warning' },
  high: { label: 'Low', chip: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
}

export function LikelihoodChip({ stat, className }: { stat: CorridorStat; className?: string }) {
  const l = LIKELIHOOD[riskOf(stat.approvalRate)]
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
        l.chip,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', l.dot)} aria-hidden />
      {l.label}
      <span className="sr-only"> visa approval likelihood</span>
    </span>
  )
}

export function trendText(trend: number) {
  if (trend <= -3) return 'Trending down'
  if (trend >= 3) return 'Trending up'
  return 'Stable'
}

// Compact visa-outlook strip at the top of UP Advisor. Collapsed it shows only
// the corridors on watch; expand to check a nationality × course level.
export function LiveEligibility({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState('India')
  const [level, setLevel] = useState<CourseLevel>('Vocational')
  const stat = getCorridor(country, level)
  const hot = watchlist(3)

  return (
    <section className="rounded-lg border border-border bg-background" aria-label="Visa outlook">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="visa-outlook-body"
        className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 text-left hover:bg-muted/50"
      >
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <Globe2 className="size-4 text-muted-foreground" aria-hidden />
          Visa outlook
        </span>
        {!open && (
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>On watch:</span>
            {hot.map((h) => (
              <span key={`${h.country}-${h.level}`} className="rounded bg-muted px-1.5 py-0.5">
                {h.country} · {h.level}
              </span>
            ))}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          {open ? 'Hide' : 'Explore'}
          <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
        </span>
      </button>

      {open && (
        <div id="visa-outlook-body" className="flex flex-col gap-3 border-t border-border p-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="elig-country">
              Nationality
            </label>
            <select
              id="elig-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-8 rounded-md border border-border bg-card px-2 text-sm"
            >
              {ELIGIBILITY_COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label="Course level">
              {LEVEL_GROUPS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  aria-pressed={level === l}
                  className={cn(
                    'rounded px-2 py-1 text-xs font-medium transition-colors',
                    level === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            {stat && (
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                Approval likelihood <LikelihoodChip stat={stat} /> {trendText(stat.trend)}
              </span>
            )}
          </div>

          {stat && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Common decline reasons</p>
                <ul className="mt-1 ml-4 list-disc text-xs leading-relaxed">
                  {stat.declineReasons.slice(0, 3).map((r) => (
                    <li key={r} className="text-pretty">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Apply the right way</p>
                <ul className="mt-1 flex flex-col gap-1 text-xs leading-relaxed">
                  {stat.guidance.map((g) => (
                    <li key={g} className="flex items-start gap-1.5 text-pretty">
                      <ArrowRight className="mt-0.5 size-3 shrink-0 text-primary" aria-hidden />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">On watch:</span>
              {hot.map((h) => (
                <button
                  key={`${h.country}-${h.level}`}
                  type="button"
                  onClick={() => {
                    setCountry(h.country)
                    setLevel(h.level)
                  }}
                  className="flex items-center gap-1.5 rounded-md border border-border px-1.5 py-0.5 hover:bg-muted"
                >
                  {h.country} · {h.level}
                  <LikelihoodChip stat={h} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">INZ data · {ELIGIBILITY_UPDATED}</span>
              <button
                type="button"
                onClick={() =>
                  onAsk(
                    `Give me a visa eligibility briefing for a ${country} student applying for a ${level} course: the main decline risks and exactly how I should prepare the application.`,
                  )
                }
                className="text-xs font-medium text-ai hover:underline"
              >
                Ask for a briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
