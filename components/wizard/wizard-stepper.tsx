'use client'

import { Check } from 'lucide-react'
import { useWizard, type StepKey } from '@/lib/wizard'
import { cn } from '@/lib/utils'

// Three phases the agent sees; the middle one groups the document-driven
// screens so there is a single, short stepper instead of five.
export const WIZARD_PHASES: { label: string; steps: { key: StepKey; label: string }[] }[] = [
  { label: 'Course and student', steps: [{ key: 1, label: 'Course and student' }] },
  {
    label: 'Documents and details',
    steps: [
      { key: 2, label: 'Upload' },
      { key: 3, label: 'Eligibility' },
      { key: 4, label: 'Details' },
    ],
  },
  { label: 'Review and submit', steps: [{ key: 5, label: 'Review and submit' }] },
]

export function phaseOf(step: StepKey) {
  return WIZARD_PHASES.findIndex((p) => p.steps.some((s) => s.key === step))
}

export function WizardStepper() {
  const { step, goToStep, maxStepReached } = useWizard()
  const activePhase = phaseOf(step)
  const subSteps = WIZARD_PHASES[activePhase].steps

  return (
    <nav aria-label="Application progress" className="flex flex-col gap-3">
      <ol className="flex items-center gap-2">
        {WIZARD_PHASES.map((phase, i) => {
          const first = phase.steps[0].key
          const last = phase.steps[phase.steps.length - 1].key
          const active = i === activePhase
          const done = i < activePhase || (maxStepReached > last && !active)
          const reachable = first <= maxStepReached
          return (
            <li key={phase.label} className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && goToStep(active ? step : first)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex min-w-0 items-center gap-2 rounded-md py-1 pr-2 text-left text-sm transition-colors',
                  active ? 'font-semibold text-foreground' : reachable ? 'text-foreground hover:text-primary' : 'cursor-not-allowed text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold',
                    active
                      ? 'border-brand bg-brand text-brand-foreground'
                      : done
                        ? 'border-success bg-success text-success-foreground'
                        : 'border-input bg-card text-muted-foreground',
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                  <span className="sr-only">{done ? ' (complete)' : ''}</span>
                </span>
                <span className="truncate">{phase.label}</span>
              </button>
              {i < WIZARD_PHASES.length - 1 && (
                <span
                  aria-hidden
                  className={cn('h-px min-w-4 flex-1', done ? 'bg-success' : 'bg-border')}
                />
              )}
            </li>
          )
        })}
      </ol>

      {subSteps.length > 1 && (
        <ol aria-label={`${WIZARD_PHASES[activePhase].label} sections`} className="flex flex-wrap gap-1">
          {subSteps.map((s) => {
            const active = s.key === step
            const reachable = s.key <= maxStepReached
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goToStep(s.key)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                    active
                      ? 'bg-foreground text-background'
                      : reachable
                        ? 'bg-muted text-foreground hover:bg-border'
                        : 'cursor-not-allowed bg-muted/60 text-muted-foreground',
                  )}
                >
                  {s.label}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </nav>
  )
}
