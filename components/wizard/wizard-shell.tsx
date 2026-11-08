'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { WizardStepper } from './wizard-stepper'
import { WizardSummary } from './wizard-summary'
import { StepCreate } from './step-create'
import { StepDocuments } from './step-documents'
import { StepAssessment } from './step-assessment'
import { StepAnswers } from './step-answers'
import { StepReview } from './step-review'
import { Button } from '@/components/ui/button'

const LAST_STEP = WIZARD_STEPS[WIZARD_STEPS.length - 1].key

const CONTINUE_LABEL: Partial<Record<StepKey, string>> = {
  1: 'Continue to documents',
  2: 'Check eligibility',
  3: 'Continue to details',
  4: 'Continue to review',
}

export function WizardShell() {
  const { step, goToStep, duplicate, draft, journey, assessment, planComplete } = useWizard()
  const linkedToOtherAgent = duplicate.state === 'hold'
  const [processing, setProcessing] = useState(false)
  const title = WIZARD_STEPS.find((s) => s.key === step)?.label ?? ''
  const studentLabel = draft.studentName !== 'New student' ? draft.studentName : 'New application'

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {title}
            {journey && (
              <Link
                href="/journeys"
                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium hover:text-foreground"
              >
                Journey: {journey.title}
              </Link>
            )}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{studentLabel}</h1>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/" />} nativeButton={false}>
          Save and close
        </Button>
      </div>

      <WizardStepper />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          {step === 1 && <StepCreate />}
          {step === 2 && <StepDocuments onProcessingChange={setProcessing} />}
          {step === 3 && <StepAssessment />}
          {step === 4 && <StepAnswers />}
          {step === 5 && <StepReview />}

          <div className="sticky bottom-0 z-10 mt-8 -mx-4 flex items-center justify-between border-t border-border bg-background/90 px-4 py-3 backdrop-blur-md md:-mx-6 md:px-6 lg:mx-0 lg:rounded-b-lg lg:px-0">
            <Button
              variant="ghost"
              onClick={() => step > 1 && goToStep((step - 1) as StepKey)}
              disabled={step === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" aria-hidden /> Back
            </Button>
            {step < LAST_STEP && (
              <Button
                onClick={() => goToStep((step + 1) as StepKey)}
                disabled={
                  (step === 1 && !planComplete) ||
                  (step === 2 && (processing || linkedToOtherAgent)) ||
                  (step === 3 && assessment.blocked)
                }
                className="gap-1.5"
              >
                {CONTINUE_LABEL[step] ?? 'Continue'}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>

        <div className="order-first lg:order-none lg:sticky lg:top-20 lg:self-start">
          <WizardSummary processing={processing} />
        </div>
      </div>
    </div>
  )
}
