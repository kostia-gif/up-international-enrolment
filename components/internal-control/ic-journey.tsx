import { ScanSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

// Where Internal Control sits in the student journey. Internal Control has
// visibility across this journey without becoming part of the admissions
// approval process itself.
const STEPS = [
  { label: 'Application' },
  { label: 'International Admissions', sub: 'Application reviewed' },
  { label: 'Unconditional Offer', sub: 'Confirmed' },
  { label: 'Internal Control sample', sub: '~20% selected', highlight: true },
  { label: 'Visa / travel to NZ' },
  { label: 'School receives final info' },
  { label: 'Internal Control audit', sub: 'Final evidence verified', highlight: true },
  { label: 'SMS compliance confirmed' },
]

export function IcJourney() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-ai/12 text-ai">
          <ScanSearch className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">Where Internal Control sits</h2>
          <p className="text-[11px] text-muted-foreground">
            An independent lens over the same student — from the admissions decision to
            post-arrival compliance.
          </p>
        </div>
      </div>

      <ol className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex min-w-[8.5rem] flex-1 items-start gap-2">
            <div className="flex flex-col items-center pt-0.5">
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full text-[10px] font-semibold tabular-nums',
                  step.highlight
                    ? 'bg-ai text-ai-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {i + 1}
              </span>
              {i < STEPS.length - 1 && <span className="mt-1 h-8 w-px bg-border" aria-hidden />}
            </div>
            <div className="min-w-0 pb-2">
              <p
                className={cn(
                  'text-pretty text-xs font-medium leading-tight',
                  step.highlight ? 'text-ai' : 'text-foreground',
                )}
              >
                {step.label}
              </p>
              {step.sub && (
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{step.sub}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
