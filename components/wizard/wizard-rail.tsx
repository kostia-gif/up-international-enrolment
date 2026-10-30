'use client'

import { CircleCheck, CircleHelp, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { ReadinessChecklist } from '@/components/readiness-checklist'

export function WizardRail({ processing }: { processing?: boolean }) {
  const { step, goToStep, maxStepReached, documents, draft } = useWizard()

  return (
    <aside className="flex flex-col gap-6">
      <ol className="flex flex-col gap-1">
        {WIZARD_STEPS.map((s) => {
          const isActive = s.key === step
          const isDone = s.key < maxStepReached && s.key !== step
          const reachable = s.key <= maxStepReached
          return (
            <li key={s.key}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && goToStep(s.key as StepKey)}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 font-medium text-foreground'
                    : reachable
                      ? 'text-muted-foreground hover:bg-muted'
                      : 'cursor-not-allowed text-muted-foreground/50',
                )}
              >
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-full border text-xs font-medium',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isDone
                        ? 'border-success bg-success text-success-foreground'
                        : 'border-border',
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

      <div className="rounded-lg border border-border bg-card p-4">
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
