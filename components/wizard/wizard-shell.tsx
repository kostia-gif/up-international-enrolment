'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { WizardRail } from './wizard-rail'
import { StepCreate } from './step-create'
import { StepDocuments } from './step-documents'
import { StepAnswers } from './step-answers'
import { StepReview } from './step-review'
import { Button } from '@/components/ui/button'

export function WizardShell() {
  const { step, goToStep, course, duplicate, draft } = useWizard()
  const linkedToOtherAgent = duplicate.state === 'hold'
  const [processing, setProcessing] = useState(false)
  const title = WIZARD_STEPS.find((s) => s.key === step)?.label ?? ''
  const studentLabel = draft.studentName !== 'New student' ? draft.studentName : null

  const canAdvanceStep1 = course !== null

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <WizardRail processing={processing} />
      </div>

      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {step} of {WIZARD_STEPS.length}
              {studentLabel && <span className="normal-case tracking-normal"> · {studentLabel}</span>}
            </p>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/" />} nativeButton={false}>
            Save and close
          </Button>
        </div>

        {step === 1 && <StepCreate />}
        {step === 2 && <StepDocuments onProcessingChange={setProcessing} />}
        {step === 3 && <StepAnswers />}
        {step === 4 && <StepReview />}

        <div className="sticky bottom-0 z-10 mt-8 -mx-4 flex items-center justify-between border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:-mx-6 md:px-6">
          <Button
            variant="ghost"
            onClick={() => step > 1 && goToStep((step - 1) as StepKey)}
            disabled={step === 1}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          {step < 4 && (
            <Button
              onClick={() => goToStep((step + 1) as StepKey)}
              disabled={
                (step === 1 && !canAdvanceStep1) ||
                (step === 2 && (processing || linkedToOtherAgent))
              }
              className="gap-1.5"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
