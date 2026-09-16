'use client'

import { useState } from 'react'
import {
  Loader,
  ShieldCheck,
  CircleCheck,
  IdCard,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react'
import {
  simulateProviderConfirm,
  type EnglishScore,
  type ProviderVerification,
} from '@/lib/simulate'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Inline English-test verification for Step 2 of the wizard. Mirrors the
// business rules on the application view: the score has already been read and
// validated against the entry requirement, so this picks up at the "verify with
// the provider" decision, shows the candidate ID that will be used, confirms via
// the provider API, and reports the authentic result. onDone fires when the
// agent finishes, so the caller can file the verified score.
type Step = 'validated' | 'confirm' | 'verifying' | 'verified'

const STEP_LABELS = ['Validate score', 'Verify with provider', 'Complete']
const STEP_INDEX: Record<Step, number> = {
  validated: 0,
  confirm: 1,
  verifying: 1,
  verified: 2,
}

export function EnglishVerifyInline({
  fileName,
  score,
  onDone,
  onSkip,
}: {
  fileName: string
  score: EnglishScore
  onDone: (v: ProviderVerification) => void
  onSkip: () => void
}) {
  const [step, setStep] = useState<Step>('validated')
  const [verification, setVerification] = useState<ProviderVerification | null>(null)
  const meets = score.meetsRequirement

  async function confirm() {
    setStep('verifying')
    const res = await simulateProviderConfirm()
    setVerification(res)
    setStep('verified')
  }

  return (
    <div className="rounded-lg border border-ai/30 bg-ai/5 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-md bg-ai/15 text-ai">
          <ShieldCheck className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">English test — verify with provider</p>
          <p className="truncate text-xs text-muted-foreground">{fileName}</p>
        </div>
      </div>

      <Stepper current={STEP_INDEX[step]} />

      <div className="mt-3 flex flex-col gap-3">
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border p-3',
            meets
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive',
          )}
        >
          <CircleCheck className="size-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {meets ? 'Validated — score meets requirements' : 'Score below the requirement'}
            </p>
            <p className="text-xs">
              {score.testType} overall {score.overall} · minimum {score.minRequired}
            </p>
          </div>
        </div>

        {step === 'validated' && meets && (
          <div className="rounded-md border border-border bg-card p-3">
            <p className="text-sm font-medium">Do you want to verify the score now?</p>
            <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
              We&apos;ll confirm authenticity directly with the test provider. Skip and English is
              carried as an outstanding condition on the offer.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1 gap-1.5" onClick={() => setStep('confirm')}>
                Yes, verify now <ArrowRight className="size-3.5" />
              </Button>
              <Button size="sm" variant="outline" onClick={onSkip}>
                Not now
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-pretty">
              We&apos;ll confirm this score with{' '}
              <span className="font-medium text-foreground">Pearson Score Verification</span> using
              the candidate&apos;s registration ID.
            </p>
            <div className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
              <span className="grid size-9 place-items-center rounded-full bg-muted">
                <IdCard className="size-5 text-muted-foreground" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Candidate ID / registration number</p>
                <p className="font-mono text-sm font-semibold">{score.candidateId}</p>
              </div>
            </div>
            <Button className="gap-1.5" onClick={confirm}>
              <ShieldCheck className="size-4" /> Confirm with Pearson
            </Button>
          </div>
        )}

        {step === 'verifying' && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Loader className="size-6 animate-spin text-info" />
            <p className="text-sm font-medium">Confirming with Pearson Score Verification…</p>
            <p className="text-xs text-muted-foreground text-pretty">
              Checking the report against the provider&apos;s record to confirm it is authentic and
              unaltered.
            </p>
          </div>
        )}

        {step === 'verified' && verification && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-success">
              <ShieldCheck className="size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Verified authentic — English requirement met</p>
                <p className="text-xs">
                  {verification.provider} · {verification.scoreReportCode}
                </p>
              </div>
            </div>
            <Button className="gap-1.5" onClick={() => onDone(verification)}>
              <BadgeCheck className="size-4" /> Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Verification progress">
      {STEP_LABELS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                done && 'bg-success text-success-foreground',
                active && 'bg-primary text-primary-foreground',
                !done && !active && 'bg-muted text-muted-foreground',
              )}
            >
              {done ? <CircleCheck className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                'truncate text-[11px]',
                active ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
