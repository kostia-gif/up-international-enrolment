'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Receipt, FileText, CircleCheck, CircleDashed, Send, ShieldCheck, Hourglass } from 'lucide-react'
import type { Application } from '@/lib/types'
import { PAYMENT_OUTCOMES, paymentOutcome, type BalanceScenario } from '@/lib/pre-enrolment'
import { toneBadge } from '@/lib/status'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ENROLMENT_REQUIREMENTS = [
  'Unconditional Offer and Enrolment Pack issued',
  'Invoice created and payment confirmation received',
  'Payment updated on the invoice',
  'Insurance evidence checked for the full study period',
]

// Post-unconditional steps: invoice, the outstanding-balance rule that decides
// which letter is issued, enrolment confirmation, then the push to Yoobee.
export function PaymentEnrolment({ app }: { app: Application }) {
  const [scenario, setScenario] = useState<BalanceScenario>('paid')
  const [lettersIssued, setLettersIssued] = useState(false)
  const [insuranceChecked, setInsuranceChecked] = useState(false)
  const [pushed, setPushed] = useState(false)

  const outcome = paymentOutcome(scenario)
  const needsInsurance = scenario === 'insurance-only'
  const canPush = outcome.canProceed && lettersIssued && (!needsInsurance || insuranceChecked)

  function selectScenario(s: BalanceScenario) {
    setScenario(s)
    setLettersIssued(false)
    setInsuranceChecked(false)
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4" aria-labelledby="payment-heading">
      <div className="flex items-center justify-between gap-2">
        <h2 id="payment-heading" className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Receipt className="size-4 text-muted-foreground" /> Invoice & payment
        </h2>
        <span className="text-[11px] text-muted-foreground">
          Invoice INV-{app.preId.replace(/\D/g, '')} · {app.course.priceBundle}
        </span>
      </div>
      <p className="mt-1 text-pretty text-xs text-muted-foreground">
        Update the payment on the invoice, then choose the outstanding balance. The rule decides which
        letter is sent.
      </p>

      <fieldset className="mt-3 grid gap-2 sm:grid-cols-2">
        <legend className="sr-only">Outstanding balance</legend>
        {PAYMENT_OUTCOMES.map((p) => {
          const active = p.key === scenario
          return (
            <label
              key={p.key}
              className={cn(
                'flex cursor-pointer flex-col gap-0.5 rounded-md border px-3 py-2 transition-colors',
                active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40',
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="balance"
                  checked={active}
                  onChange={() => selectScenario(p.key)}
                  className="accent-primary"
                />
                {p.label}
              </span>
              <span className="pl-5 text-[11px] text-muted-foreground text-pretty">{p.rule}</span>
            </label>
          )
        })}
      </fieldset>

      <div className={cn('mt-3 rounded-md border p-3', toneBadge[outcome.tone])}>
        <p className="text-xs font-semibold">Issue: {outcome.letters.join(' + ')}</p>
        <p className="mt-0.5 text-pretty text-[11px] opacity-90">Next: {outcome.next}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={lettersIssued ? 'outline' : 'default'}
          className="gap-1.5"
          disabled={lettersIssued}
          onClick={() => {
            setLettersIssued(true)
            toast.success(`${outcome.letters.join(' + ')} issued to ${app.studentName}`)
          }}
        >
          <FileText className="size-3.5" />
          {lettersIssued ? 'Issued' : `Issue ${outcome.letters.join(' + ')}`}
        </Button>
        {needsInsurance && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={insuranceChecked}
            onClick={() => setInsuranceChecked(true)}
          >
            <ShieldCheck className="size-3.5" />
            {insuranceChecked ? 'Insurance evidence checked' : 'Mark insurance evidence checked'}
          </Button>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="text-sm font-semibold">Confirm enrolment requirements</h3>
        <ul className="mt-2 flex flex-col gap-1.5 text-xs">
          {ENROLMENT_REQUIREMENTS.map((r, i) => {
            const done =
              i < 2 ||
              (i === 2 && lettersIssued) ||
              (i === 3 && (needsInsurance ? insuranceChecked : lettersIssued))
            return (
              <li key={r} className="flex items-center gap-2">
                {done ? (
                  <CircleCheck className="size-3.5 shrink-0 text-success" />
                ) : (
                  <CircleDashed className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className={done ? '' : 'text-muted-foreground'}>{r}</span>
              </li>
            )
          })}
        </ul>

        {pushed ? (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success">
            <CircleCheck className="size-3.5" /> Enrolment pushed to Yoobee — pre-enrolment complete
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!canPush}
              onClick={() => {
                setPushed(true)
                toast.success('Enrolment pushed to Yoobee')
              }}
            >
              <Send className="size-3.5" /> Push enrolment to Yoobee
            </Button>
            {!outcome.canProceed && (
              <span className="inline-flex items-center gap-1 text-[11px] text-destructive">
                <Hourglass className="size-3.5" /> Waiting for further payment
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
