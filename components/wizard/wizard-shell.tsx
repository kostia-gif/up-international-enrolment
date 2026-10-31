'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, ClipboardCheck } from 'lucide-react'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { WizardRail } from './wizard-rail'
import { StepCreate } from './step-create'
import { StepDocuments } from './step-documents'
import { StepAssessment } from './step-assessment'
import { StepAnswers } from './step-answers'
import { StepReview } from './step-review'
import { Button } from '@/components/ui/button'

const LAST_STEP = WIZARD_STEPS[WIZARD_STEPS.length - 1].key

export function WizardShell() {
  const { step, goToStep, course, duplicate, draft, journey, agentRef, assessment } = useWizard()
  const linkedToOtherAgent = duplicate.state === 'hold'
  const [processing, setProcessing] = useState(false)
  const title = WIZARD_STEPS.find((s) => s.key === step)?.label ?? ''
  const studentLabel = draft.studentName !== 'New student' ? draft.studentName : null

  const canAdvanceStep1 = course !== null
  const continueLabel = step === 2 ? 'Continue and assess' : 'Continue'

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <WizardRail processing={processing} />
      </div>

      <div className="min-w-0">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                Step {step}
                <span className="font-normal text-primary/60">/ {WIZARD_STEPS.length}</span>
              </span>
              {studentLabel && <span className="normal-case tracking-normal">{studentLabel}</span>}
              {agentRef && (
                <span className="font-mono font-normal normal-case tracking-normal">{agentRef}</span>
              )}
              {journey && (
                <Link
                  href="/journeys"
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium normal-case tracking-normal text-muted-foreground hover:text-foreground"
                >
                  Journey: {journey.title}
                </Link>
              )}
            </p>
            <h1 className="text-2xl font-semibold">{title}</h1>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/" />} nativeButton={false}>
            Save and close
          </Button>
        </div>

        {step === 1 && <StepCreate />}
        {step === 2 && <StepDocuments onProcessingChange={setProcessing} />}
        {step === 3 && <StepAssessment />}
        {step === 4 && <StepAnswers />}
        {step === 5 && <StepReview />}

        <div className="sticky bottom-0 z-10 mt-8 -mx-4 flex items-center justify-between border-t border-border bg-background/90 px-4 py-3 shadow-[0_-8px_24px_-16px_oklch(0.24_0.04_264/0.25)] backdrop-blur-md md:-mx-6 md:px-6">
          <Button
            variant="ghost"
            onClick={() => step > 1 && goToStep((step - 1) as StepKey)}
            disabled={step === 1}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < LAST_STEP && (
            <Button
              onClick={() => goToStep((step + 1) as StepKey)}
              disabled={
                (step === 1 && !canAdvanceStep1) ||
                (step === 2 && (processing || linkedToOtherAgent)) ||
                (step === 3 && assessment.blocked)
              }
              className="gap-1.5"
            >
              {step === 2 ? <ClipboardCheck className="size-4" /> : null}
              {continueLabel}
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
