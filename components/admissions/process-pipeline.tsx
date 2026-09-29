'use client'

import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Application } from '@/lib/types'
import { admissionsQueue } from '@/lib/admissions'
import { PHASES, phaseFor, type PhaseKey } from '@/lib/pre-enrolment'
import { cn } from '@/lib/utils'

// The pre-enrolment process as a strip, with how many files sit in each phase.
// Intake counts CRM opportunities not yet allocated to an officer.
export function ProcessPipeline({
  applications,
  unassigned,
}: {
  applications: Application[]
  unassigned: number
}) {
  const counts = useMemo(() => {
    const c = Object.fromEntries(PHASES.map((p) => [p.key, 0])) as Record<PhaseKey, number>
    for (const a of admissionsQueue(applications)) c[phaseFor(a)]++
    c.intake = unassigned
    return c
  }, [applications, unassigned])

  return (
    <section aria-label="Pre-enrolment process" className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <ol className="flex items-stretch gap-1 overflow-x-auto">
        {PHASES.map((p, i) => {
          const n = counts[p.key]
          const held = p.key === 'checks' && n > 0
          return (
            <li key={p.key} className="flex min-w-[9.5rem] flex-1 items-center gap-1">
              <div
                className={cn(
                  'flex h-full flex-1 flex-col rounded-lg px-2.5 py-2',
                  held ? 'bg-destructive/8' : n > 0 ? 'bg-secondary/60' : 'bg-transparent',
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {i + 1}. {p.label}
                  </span>
                  <span
                    className={cn(
                      'text-base font-semibold tabular-nums',
                      held ? 'text-destructive' : n === 0 && 'text-muted-foreground',
                    )}
                  >
                    {n}
                  </span>
                </div>
                <p className="mt-0.5 text-pretty text-[10px] leading-tight text-muted-foreground">
                  {p.detail}
                </p>
              </div>
              {i < PHASES.length - 1 && (
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
