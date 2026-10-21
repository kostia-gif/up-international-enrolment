'use client'

import { useState } from 'react'
import { Radar, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react'
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

export const RISK_STYLE: Record<Risk, { text: string; bar: string; chip: string; label: string }> = {
  low: { text: 'text-success', bar: 'bg-success', chip: 'bg-success/10 text-success', label: 'Low risk' },
  medium: { text: 'text-warning', bar: 'bg-warning', chip: 'bg-warning/10 text-warning', label: 'Watch' },
  high: { text: 'text-destructive', bar: 'bg-destructive', chip: 'bg-destructive/10 text-destructive', label: 'High decline' },
}

export function TrendIcon({ trend }: { trend: number }) {
  if (trend <= -3) return <TrendingDown className="size-3.5 text-destructive" aria-hidden />
  if (trend >= 3) return <TrendingUp className="size-3.5 text-success" aria-hidden />
  return <Minus className="size-3.5 text-muted-foreground" aria-hidden />
}

export function ApprovalMeter({ stat }: { stat: CorridorStat }) {
  const risk = riskOf(stat.approvalRate)
  const s = RISK_STYLE[risk]
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className={cn('text-2xl font-semibold tabular-nums', s.text)}>
          {stat.approvalRate}%
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">INZ approval</span>
        </p>
        <span className={cn('rounded px-1.5 py-0.5 text-[11px] font-medium', s.chip)}>{s.label}</span>
      </div>
      <div
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={stat.approvalRate}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="INZ approval rate"
      >
        <div className={cn('h-full rounded-full', s.bar)} style={{ width: `${stat.approvalRate}%` }} />
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
        <TrendIcon trend={stat.trend} />
        {stat.trend > 0 ? '+' : ''}
        {stat.trend}pp vs last quarter · {stat.decisions} decisions
      </p>
    </div>
  )
}

// Headline panel at the top of UP Advisor: a watchlist of the worst corridors
// plus a country × level checker with decline reasons and guidelines.
export function LiveEligibility({ onAsk }: { onAsk: (prompt: string) => void }) {
  const [country, setCountry] = useState('India')
  const [level, setLevel] = useState<CourseLevel>('Vocational')
  const stat = getCorridor(country, level)
  const hot = watchlist(4)

  return (
    <section className="rounded-xl border border-border bg-background" aria-label="Live eligibility">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Live eligibility
          <span className="font-normal text-muted-foreground">· INZ visa outcomes</span>
        </p>
        <p className="text-xs text-muted-foreground">Rolling 90 days · updated {ELIGIBILITY_UPDATED}</p>
      </div>

      <div className="grid gap-4 p-3 md:grid-cols-5">
        <div className="flex flex-col gap-3 md:col-span-3">
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
          </div>

          {stat && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ApprovalMeter stat={stat} />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Top decline reasons</p>
                <ul className="mt-1 ml-4 list-disc text-xs leading-relaxed">
                  {stat.declineReasons.slice(0, 3).map((r) => (
                    <li key={r} className="text-pretty">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="sm:col-span-2">
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
              <button
                type="button"
                onClick={() =>
                  onAsk(
                    `Give me a visa eligibility briefing for a ${country} student applying for a ${level} course: INZ approval stats, the main decline risks, and exactly how I should prepare the application.`,
                  )
                }
                className="w-fit text-xs font-medium text-ai hover:underline sm:col-span-2"
              >
                Ask UP Advisor for a full briefing
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 md:border-l md:border-border md:pl-4">
          <p className="text-xs font-medium text-muted-foreground">Highest decline corridors</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {hot.map((h) => {
              const s = RISK_STYLE[riskOf(h.approvalRate)]
              return (
                <li key={`${h.country}-${h.level}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setCountry(h.country)
                      setLevel(h.level)
                    }}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
                  >
                    <span className="text-pretty">
                      <span className="font-medium">{h.country}</span>
                      <span className="text-muted-foreground"> · {h.level}</span>
                    </span>
                    <span className={cn('flex shrink-0 items-center gap-1 font-medium tabular-nums', s.text)}>
                      <Radar className="size-3" aria-hidden />
                      {100 - h.approvalRate}% declined
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
