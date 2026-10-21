'use client'

import { useState } from 'react'
import { ChevronDown, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { getCorridor, liveComments, riskOf, ELIGIBILITY_UPDATED } from '@/lib/eligibility'
import { LikelihoodChip, trendText } from '@/components/eligibility/live-eligibility'
import { cn } from '@/lib/utils'

const TONE = {
  good: { Icon: CircleCheck, cls: 'text-success' },
  warn: { Icon: TriangleAlert, cls: 'text-warning' },
  info: { Icon: Info, cls: 'text-muted-foreground' },
} as const

// Collapsible visa-eligibility row inside the wizard's Readiness card.
export function EligibilityInsights() {
  const [open, setOpen] = useState(false)
  const { fields, documents, courses, requests } = useWizard()
  const nationality = fields.find((f) => f.key === 'nationality')?.value ?? ''
  const level = courses[0]?.levelGroup
  const stat = nationality && level ? getCorridor(nationality, level) : null
  const sponsored = requests.some((r) => r.type === 'sponsorship')
  const comments = liveComments(stat, documents, fields, sponsored)
  const warnings = comments.filter((c) => c.tone === 'warn').length

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="visa-eligibility-body"
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-xs font-medium">Visa eligibility</span>
        <span className="flex items-center gap-1.5">
          {stat ? (
            <LikelihoodChip stat={stat} />
          ) : (
            <span className="text-[11px] text-muted-foreground">Pending</span>
          )}
          {warnings > 0 && !open && (
            <span className="text-[11px] text-warning tabular-nums">{warnings} to check</span>
          )}
          <ChevronDown
            className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </span>
      </button>

      {open && (
        <div id="visa-eligibility-body" className="mt-2 flex flex-col gap-2">
          {stat ? (
            <p className="text-xs text-muted-foreground text-pretty">
              {stat.country} · {stat.level} — {trendText(stat.trend).toLowerCase()} at INZ.
              {riskOf(stat.approvalRate) === 'high' &&
                ' Make sure the file answers the common decline reasons before you submit.'}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground text-pretty">
              {nationality
                ? 'No INZ data for this nationality yet.'
                : 'Upload the passport and pick a course to see the visa outlook.'}
            </p>
          )}
          <ul className="flex flex-col gap-1.5">
            {comments.map((c, i) => {
              const { Icon, cls } = TONE[c.tone]
              return (
                <li key={i} className="flex items-start gap-1.5 text-xs leading-relaxed">
                  <Icon className={cn('mt-0.5 size-3.5 shrink-0', cls)} aria-hidden />
                  <span className="text-pretty">{c.text}</span>
                </li>
              )
            })}
          </ul>
          <p className="text-[10px] text-muted-foreground">INZ data · {ELIGIBILITY_UPDATED}</p>
        </div>
      )}
    </div>
  )
}
