'use client'

import { CircleCheck, Info, TriangleAlert, Globe2 } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { getCorridor, liveComments, riskOf, ELIGIBILITY_UPDATED } from '@/lib/eligibility'
import { ApprovalMeter } from '@/components/eligibility/live-eligibility'
import { cn } from '@/lib/utils'

const TONE = {
  good: { Icon: CircleCheck, cls: 'text-success' },
  warn: { Icon: TriangleAlert, cls: 'text-warning' },
  info: { Icon: Info, cls: 'text-muted-foreground' },
} as const

export function EligibilityInsights() {
  const { fields, documents, courses, requests } = useWizard()
  const nationality = fields.find((f) => f.key === 'nationality')?.value ?? ''
  const level = courses[0]?.levelGroup
  const stat = nationality && level ? getCorridor(nationality, level) : null
  const sponsored = requests.some((r) => r.type === 'sponsorship')
  const comments = liveComments(stat, documents, fields, sponsored)

  return (
    <aside
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      aria-label="Live visa eligibility insights"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Globe2 className="size-4 text-ai" /> Visa eligibility
        </h3>
        <span className="text-[10px] text-muted-foreground">INZ data · {ELIGIBILITY_UPDATED}</span>
      </div>

      {stat ? (
        <>
          <ApprovalMeter stat={stat} />
          {riskOf(stat.approvalRate) === 'high' && (
            <p className="rounded-md bg-destructive/5 px-2.5 py-1.5 text-xs text-destructive text-pretty">
              High decline corridor. Make sure the file answers the top decline reasons before you
              submit.
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-muted-foreground text-pretty">
          {nationality
            ? 'No INZ stats for this nationality yet.'
            : 'Upload the passport to see approval rates for this student’s country and course level.'}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {comments.map((c, i) => {
          const { Icon, cls } = TONE[c.tone]
          return (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
              <Icon className={cn('mt-0.5 size-3.5 shrink-0', cls)} />
              <span className="text-pretty">{c.text}</span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
