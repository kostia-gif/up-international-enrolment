'use client'

import { Copy, Handshake, Plane, Globe2, CircleCheck, CircleAlert, OctagonX } from 'lucide-react'
import type { Application } from '@/lib/types'
import {
  CHECK_DEFS,
  inzDeclineRate,
  nationalityOf,
  type CheckKey,
  type DeclineRate,
} from '@/lib/pre-enrolment'
import { toneBadge } from '@/lib/status'
import { cn } from '@/lib/utils'

export type CheckChoices = Record<CheckKey, string>

const CHECK_ICONS: Record<CheckKey, typeof Copy> = {
  duplicate: Copy,
  channel: Handshake,
  visa: Plane,
}

// A file is held at initial checks while any branch is blocking, the INZ
// decline rate is extreme, or an elevated rate lacks Regional Manager sign-off.
export function checksBlockReason(
  choices: CheckChoices,
  decline: DeclineRate,
  rmConfirmed: boolean,
): string | null {
  for (const def of CHECK_DEFS) {
    const opt = def.options.find((o) => o.id === choices[def.key])
    if (opt?.blocking) return opt.action
  }
  if (decline.band === 'extreme') return decline.action
  if (decline.band === 'elevated' && !rmConfirmed)
    return 'Record Regional Manager confirmation for the elevated INZ decline rate'
  return null
}

export function InitialChecks({
  app,
  choices,
  onChange,
  rmConfirmed,
  onRmConfirmed,
}: {
  app: Application
  choices: CheckChoices
  onChange: (key: CheckKey, id: string) => void
  rmConfirmed: boolean
  onRmConfirmed: (v: boolean) => void
}) {
  const decline = inzDeclineRate(nationalityOf(app))
  const block = checksBlockReason(choices, decline, rmConfirmed)

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          'flex items-start gap-2 rounded-lg border p-3 text-sm',
          block
            ? 'border-destructive/30 bg-destructive/5 text-destructive'
            : 'border-success/30 bg-success/10 text-success',
        )}
        role="status"
      >
        {block ? (
          <OctagonX className="mt-0.5 size-4 shrink-0" />
        ) : (
          <CircleCheck className="mt-0.5 size-4 shrink-0" />
        )}
        <div>
          <p className="font-medium">
            {block ? 'File held at initial checks' : 'All three initial checks passed'}
          </p>
          <p className="text-pretty text-xs opacity-90">
            {block ?? 'Continue to rename files and check programme entry requirements.'}
          </p>
        </div>
      </div>

      <ol className="grid gap-4 lg:grid-cols-3">
        {CHECK_DEFS.map((def, i) => {
          const Icon = CHECK_ICONS[def.key]
          const selected = def.options.find((o) => o.id === choices[def.key])
          return (
            <li key={def.key} className="flex flex-col rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
                  {i + 1}
                </span>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
                <h2 className="text-sm font-semibold">{def.title}</h2>
              </div>
              <p className="mt-1.5 text-pretty text-xs text-muted-foreground">{def.question}</p>

              <fieldset className="mt-3 flex flex-col gap-1.5">
                <legend className="sr-only">{def.title}</legend>
                {def.options.map((o) => {
                  const active = choices[def.key] === o.id
                  return (
                    <label
                      key={o.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-2 text-xs transition-colors',
                        active
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                    >
                      <input
                        type="radio"
                        name={`check-${def.key}`}
                        value={o.id}
                        checked={active}
                        onChange={() => onChange(def.key, o.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <span className="text-pretty font-medium">{o.label}</span>
                    </label>
                  )
                })}
              </fieldset>

              {selected && (
                <p
                  className={cn(
                    'mt-3 rounded-md border px-2.5 py-2 text-pretty text-[11px] font-medium',
                    toneBadge[selected.tone],
                  )}
                >
                  Next: {selected.action}
                </p>
              )}

              {def.key === 'channel' && (
                <DeclineRateCard
                  decline={decline}
                  rmConfirmed={rmConfirmed}
                  onRmConfirmed={onRmConfirmed}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function DeclineRateCard({
  decline,
  rmConfirmed,
  onRmConfirmed,
}: {
  decline: DeclineRate
  rmConfirmed: boolean
  onRmConfirmed: (v: boolean) => void
}) {
  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <Globe2 className="size-3.5 text-info" /> INZ decline rate · {decline.nationality}
        </span>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums',
            toneBadge[decline.tone],
          )}
        >
          {decline.rate}%
        </span>
      </div>
      <p className="mt-1 text-pretty text-[11px] text-muted-foreground">{decline.action}</p>
      {decline.band === 'elevated' && (
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px] font-medium">
          <input
            type="checkbox"
            checked={rmConfirmed}
            onChange={(e) => onRmConfirmed(e.target.checked)}
            className="accent-primary"
          />
          {rmConfirmed ? (
            <span className="inline-flex items-center gap-1 text-success">
              <CircleCheck className="size-3.5" /> Regional Manager confirmed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-warning">
              <CircleAlert className="size-3.5" /> Regional Manager confirmation received
            </span>
          )}
        </label>
      )}
    </div>
  )
}
