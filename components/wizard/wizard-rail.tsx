'use client'

import { CircleCheck, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { ReadinessGauges } from '@/components/readiness-gauge'
import { WizardAssistant } from './wizard-assistant'

export function WizardRail({ processing }: { processing?: boolean }) {
  const { step, goToStep, maxStepReached, documents } = useWizard()

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
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Readiness
          </span>
          {processing && (
            <span className="flex items-center gap-1 text-xs text-info">
              <Loader className="size-3.5 animate-spin" /> Reviewing
            </span>
          )}
        </div>
        <WizardGaugeBridge />
        {documents.length > 0 && (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            {documents.length} document{documents.length === 1 ? '' : 's'} attached
          </p>
        )}
      </div>

      <WizardAssistant />
    </aside>
  )
}

// The gauges take an Application; the wizard exposes a draft via readiness, but
// ReadinessGauges recomputes from an app object, so build a minimal one.
function WizardGaugeBridge() {
  const { student, courses, documents, fields, requirements, requests, notes } = useWizard()
  const draft = {
    id: 'draft',
    preId: '',
    studentName: `${student.given} ${student.family}`,
    agentId: 'draft',
    agencyId: 'psl',
    course: courses[0] ?? {
      brand: 'NZMA' as const,
      programmeName: '',
      level: '',
      levelGroup: 'Vocational' as const,
      campus: '',
      intakeDate: '',
      priceBundle: '',
      durationMonths: 0,
    },
    bundle: courses.length > 1 ? courses : undefined,
    stage: 'Draft' as const,
    route: 'auto' as const,
    documents,
    fields,
    requirements,
    conditions: [],
    requests,
    events: [],
    notesToAdmissions: notes,
    daysInStage: 0,
    createdAt: '',
  }
  return <ReadinessGauges app={draft} />
}
