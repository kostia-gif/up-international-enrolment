'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft, FileText } from 'lucide-react'
import { useWizard, WIZARD_STEPS, type StepKey } from '@/lib/wizard'
import { WizardRail } from './wizard-rail'
import { StepCreate } from './step-create'
import { StepDocuments } from './step-documents'
import { StepReview } from './step-review'
import { StepRequests } from './step-requests'
import { StepSubmit } from './step-submit'
import { Button } from '@/components/ui/button'

const TITLES: Record<number, string> = {
  1: 'Create application',
  2: 'Documents',
  3: 'Review and complete',
  4: 'Requests and notes',
}

export function WizardShell() {
  const { step, goToStep, courses } = useWizard()
  const [processing, setProcessing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const canAdvanceStep1 = courses.length > 0

  function next() {
    if (step < 4) goToStep((step + 1) as StepKey)
    else setSubmitting(true)
  }
  function back() {
    if (submitting) {
      setSubmitting(false)
      return
    }
    if (step > 1) goToStep((step - 1) as StepKey)
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <WizardRail processing={processing} />
      </div>

      <div className="min-w-0">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Step {step} of 4
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              {submitting ? 'Review & submit' : TITLES[step]}
            </h1>
          </div>
          <Button variant="outline" size="sm" render={<Link href="/" />} nativeButton={false}>
            Save and close
          </Button>
        </div>

        {!submitting && (
          <>
            {step === 1 && <StepCreate />}
            {step === 2 && <StepDocuments onProcessingChange={setProcessing} />}
            {step === 3 && <StepReview />}
            {step === 4 && <StepRequests />}
          </>
        )}
        {submitting && <StepSubmit />}

        {!submitting && (
          <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="ghost"
              onClick={back}
              disabled={step === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <div className="flex items-center gap-3">
              {step === 4 && (
                <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <FileText className="size-3.5 text-primary" />
                  Review the application and draft offer next
                </span>
              )}
              <Button
                onClick={next}
                disabled={step === 1 && !canAdvanceStep1}
                className="gap-1.5"
              >
                {step === 4 ? 'Continue to review' : 'Continue'}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
        {submitting && (
          <div className="mt-8 border-t border-border pt-4">
            <Button variant="ghost" onClick={back} className="gap-1.5">
              <ArrowLeft className="size-4" /> Back to requests
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
