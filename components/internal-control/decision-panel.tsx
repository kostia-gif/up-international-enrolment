'use client'

import { useState } from 'react'
import { Gavel, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import type { AuditRecord, Decision } from '@/lib/internal-control'
import { decisionMeta } from '@/lib/internal-control'
import { toneBadge } from '@/lib/status'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const OPTIONS: Decision[] = [
  'confirmed',
  'confirmed-follow-up',
  'investigate',
  'compliance-issue',
]

export function DecisionPanel({ record }: { record: AuditRecord }) {
  const [choice, setChoice] = useState<Decision | undefined>(record.decision)
  const [recorded, setRecorded] = useState(record.status === 'complete')

  function record_() {
    if (!choice) return
    setRecorded(true)
    toast.success('Audit outcome recorded', {
      description: decisionMeta[choice].label,
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Gavel className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">Audit outcome</h2>
          <p className="text-[11px] text-muted-foreground">
            Record the Internal Control decision for this student
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((opt) => {
          const meta = decisionMeta[opt]
          const active = choice === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setChoice(opt)}
              aria-pressed={active}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                active
                  ? 'border-primary bg-primary/[0.06] ring-1 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/30',
              )}
            >
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[11px] font-medium',
                  toneBadge[meta.tone],
                )}
              >
                {meta.label}
              </span>
              <span className="text-[11px] leading-tight text-muted-foreground text-pretty">
                {meta.description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        {recorded && choice ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <CheckCircle2 className="size-4" />
            Recorded as “{decisionMeta[choice].label}”
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            Select an outcome to close the audit.
          </span>
        )}
        <Button size="sm" disabled={!choice} onClick={record_} className="gap-1.5">
          <Gavel className="size-3.5" />
          {recorded ? 'Update outcome' : 'Record outcome'}
        </Button>
      </div>
    </section>
  )
}
