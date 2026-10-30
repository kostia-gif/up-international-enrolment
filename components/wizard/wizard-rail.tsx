'use client'

import { CircleCheck, CircleHelp, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { ReadinessChecklist } from '@/components/readiness-checklist'

export function WizardRail({ processing }: { processing?: boolean }) {
  const { step, goToStep, maxStepReached, documents, draft } = useWizard()

  return (
    <aside className="flex flex-col gap-6">
      <ol className="relative flex flex-col gap-0.5">
        {WIZARD_STEPS.map((s, i) => {
          const isActive = s.key === step
          const isDone = s.key < maxStepReached && s.key !== step
          const reachable = s.key <= maxStepReached
          const last = i === WIZARD_STEPS.length - 1
          return (
            <li key={s.key} className="relative">
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-[22px] top-9 h-[calc(100%-1.25rem)] w-px',
                    isDone ? 'bg-success/50' : 'bg-border',
                  )}
                />
              )}
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && goToStep(s.key as StepKey)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-card font-medium text-foreground shadow-sm ring-1 ring-border'
                    : reachable
                      ? 'text-muted-foreground hover:bg-card/70 hover:text-foreground'
                      : 'cursor-not-allowed text-muted-foreground/50',
                )}
              >
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_0_3px_color-mix(in_oklch,var(--primary)_18%,transparent)]'
                      : isDone
                        ? 'border-success bg-success text-success-foreground'
                        : 'border-border bg-background',
                  )}
                >
                  {isDone ? <CircleCheck className="size-3.5" /> : s.key}
                </span>
                <span className="text-pretty">{s.label}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        {processing && (
          <p className="mb-3 flex items-center gap-1 text-xs text-info">
            <Loader className="size-3.5 animate-spin" /> Reading documents
          </p>
        )}
        <ReadinessChecklist app={draft} />
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {documents.length > 0
              ? `${documents.length} document${documents.length === 1 ? '' : 's'}`
              : ''}
          </span>
          <a
            href={`/rules?step=${step}`}
            target="_blank"
            rel="noopener noreferrer"
            title="How this step is decided"
            className="inline-flex size-6 items-center justify-center rounded-full hover:bg-muted hover:text-primary"
          >
            <CircleHelp className="size-4" aria-hidden />
            <span className="sr-only">How this step is decided (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
