// The UP International pre-enrolment process, as run by the admissions team:
// Enroller intake → allocation → three initial checks → CRM assessment →
// conditional offer → unconditional offer → invoice & payment → push to Yoobee.
// Admissions uses this to walk a file; Internal Control uses the same model to
// confirm each control point was actually followed.
import type { Application } from './types'
import type { Tone } from './status'
import { admissionsBucket } from './admissions'

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

export type PhaseKey =
  | 'intake'
  | 'checks'
  | 'assessment'
  | 'conditional'
  | 'unconditional'
  | 'payment'
  | 'pushed'

export interface PhaseDef {
  key: PhaseKey
  label: string
  detail: string
}

export const PHASES: PhaseDef[] = [
  { key: 'intake', label: 'Intake', detail: 'Enroller → CRM unassigned → allocated to an officer' },
  { key: 'checks', label: 'Initial checks', detail: 'Duplicate · agent or direct · visa refusal' },
  { key: 'assessment', label: 'Assessment', detail: 'Files, Contact, Opportunity, Workflow, Price Bundle' },
  { key: 'conditional', label: 'Conditional offer', detail: 'Created, reviewed and sent through Enroller' },
  { key: 'unconditional', label: 'Unconditional', detail: 'Conditions met — offer & enrolment pack issued' },
  { key: 'payment', label: 'Invoice & payment', detail: 'Invoice, payment confirmation, receipt' },
  { key: 'pushed', label: 'Pushed to Yoobee', detail: 'Enrolment requirements confirmed' },
]

// Where an application sits in the admissions process right now.
export function phaseFor(app: Application): PhaseKey {
  const bucket = admissionsBucket(app)
  if (bucket === 'decided') {
    if (app.stage === 'Paid') return 'pushed'
    if (app.stage === 'Accepted') return 'payment'
    return 'unconditional'
  }
  if (bucket === 'conditional') return 'conditional'
  return initialChecks(app).some((c) => c.outcome.blocking) ? 'checks' : 'assessment'
}

// ---------------------------------------------------------------------------
// Three initial checks
// ---------------------------------------------------------------------------

export type CheckKey = 'duplicate' | 'channel' | 'visa'

export interface CheckOption {
  id: string
  label: string
  // What the process says to do when this branch applies.
  action: string
  tone: Tone
  // A blocking branch holds the file at initial checks until resolved.
  blocking: boolean
}

export interface CheckDef {
  key: CheckKey
  title: string
  question: string
  options: CheckOption[]
}

export const CHECK_DEFS: CheckDef[] = [
  {
    key: 'duplicate',
    title: 'Duplicate application?',
    question: 'Search CRM for another opportunity for this student.',
    options: [
      {
        id: 'none',
        label: 'No duplicate',
        action: 'Proceed to the next check.',
        tone: 'success',
        blocking: false,
      },
      {
        id: 'same-twice',
        label: 'Same application submitted twice',
        action: 'Close the extra opportunity, then continue with the original.',
        tone: 'warning',
        blocking: false,
      },
      {
        id: 'agent-b-uncond',
        label: 'Different agents — original has an Unconditional Offer',
        action: "Close Agent B's application.",
        tone: 'danger',
        blocking: true,
      },
      {
        id: 'agent-b-cond',
        label: 'Different agents — original has a Conditional Offer only',
        action: 'Complete the change of agent process before continuing.',
        tone: 'warning',
        blocking: true,
      },
    ],
  },
  {
    key: 'channel',
    title: 'Agent or direct application?',
    question: 'Confirm the agent contract status and the INZ visa decline rate.',
    options: [
      {
        id: 'direct',
        label: 'Direct application',
        action: 'Check the INZ visa decline rate for the student’s nationality.',
        tone: 'info',
        blocking: false,
      },
      {
        id: 'agent-active',
        label: 'Agent — active',
        action: 'Check the INZ visa decline rate for the student’s nationality.',
        tone: 'success',
        blocking: false,
      },
      {
        id: 'agent-lapsed',
        label: 'Agent — lapsed or expired',
        action: 'Contact the Regional Manager and wait for confirmation.',
        tone: 'danger',
        blocking: true,
      },
    ],
  },
  {
    key: 'visa',
    title: 'Previous visa refusal?',
    question: 'Review the student’s immigration history and any decline letter.',
    options: [
      {
        id: 'none',
        label: 'No previous refusal',
        action: 'Proceed to assessment.',
        tone: 'success',
        blocking: false,
      },
      {
        id: 'funds',
        label: 'Refused — funds or general issues',
        action: 'Review the decline letter; continue with agent assistance.',
        tone: 'warning',
        blocking: false,
      },
      {
        id: 'genuine',
        label: 'Refused — serious or recent genuine intent concerns',
        action: 'Normally close the application.',
        tone: 'danger',
        blocking: true,
      },
    ],
  },
]

// Published INZ student-visa decline rates by nationality (illustrative).
const INZ_DECLINE_RATES: Record<string, number> = {
  India: 34,
  Nepal: 41,
  'Sri Lanka': 27,
  Pakistan: 38,
  Bangladesh: 46,
  Vietnam: 12,
  China: 6,
  Philippines: 15,
  Thailand: 9,
  Indonesia: 11,
  Fiji: 18,
  Nigeria: 100,
}

export type DeclineBand = 'low' | 'elevated' | 'extreme'

export interface DeclineRate {
  nationality: string
  rate: number
  band: DeclineBand
  action: string
  tone: Tone
}

export function inzDeclineRate(nationality: string): DeclineRate {
  const rate = INZ_DECLINE_RATES[nationality] ?? 8
  if (rate >= 100)
    return {
      nationality,
      rate,
      band: 'extreme',
      action: 'Extremely high — normally close the application.',
      tone: 'danger',
    }
  if (rate >= 20)
    return {
      nationality,
      rate,
      band: 'elevated',
      action: '20% or higher — check with the Regional Manager before continuing.',
      tone: 'warning',
    }
  return {
    nationality,
    rate,
    band: 'low',
    action: 'Below 20% — continue to the previous visa refusal check.',
    tone: 'success',
  }
}

function fieldValue(app: Application, key: string): string {
  return app.fields.find((f) => f.key === key)?.value ?? ''
}

export function nationalityOf(app: Application): string {
  return fieldValue(app, 'nationality') || 'Unknown'
}

export interface CheckResult {
  def: CheckDef
  outcome: CheckOption
}

// The branch each check lands on for this file, pre-filled from what the
// platform already knows. The officer can override it in the review.
export function initialChecks(app: Application): CheckResult[] {
  const pick = (key: CheckKey, id: string): CheckResult => {
    const def = CHECK_DEFS.find((d) => d.key === key)!
    return { def, outcome: def.options.find((o) => o.id === id) ?? def.options[0] }
  }
  const visaStatus = fieldValue(app, 'visa_status').toLowerCase()
  const visaId = /genuine/.test(visaStatus)
    ? 'genuine'
    : /refus|declin/.test(visaStatus)
      ? 'funds'
      : 'none'
  return [
    pick('duplicate', app.duplicateHold ? 'agent-b-cond' : 'none'),
    pick('channel', app.agentId && app.agentId !== 'direct' ? 'agent-active' : 'direct'),
    pick('visa', visaId),
  ]
}

// ---------------------------------------------------------------------------
// CRM assessment areas — where each part of the assessment is recorded.
// ---------------------------------------------------------------------------

export const CRM_AREAS = {
  files: { label: 'Files', detail: 'Rename submitted documents' },
  nzqa: { label: 'NZQA', detail: 'Programme entry requirements in the NZQA approval letter' },
  verification: { label: 'Verification', detail: 'Passport and academic documents verified' },
  contact: { label: 'Contact', detail: 'Personal details, address, stakeholder, residency' },
  opportunity: { label: 'Opportunity', detail: 'Required education and other fields' },
  workflow: { label: 'Workflow', detail: 'Academic, English, interview & portfolio assessment' },
  priceBundle: { label: 'Price Bundle', detail: 'Price list, programme, scholarship, insurance period' },
} as const

export type CrmArea = keyof typeof CRM_AREAS

// ---------------------------------------------------------------------------
// Invoice & payment — the outstanding-balance rule that decides which letter
// goes to the student.
// ---------------------------------------------------------------------------

export type BalanceScenario = 'paid' | 'insurance-only' | 'under-100' | 'over-100'

export interface PaymentOutcome {
  key: BalanceScenario
  label: string
  rule: string
  letters: string[]
  next: string
  tone: Tone
  // Whether the file can move on to enrolment confirmation now.
  canProceed: boolean
}

export const PAYMENT_OUTCOMES: PaymentOutcome[] = [
  {
    key: 'paid',
    label: 'Paid in full',
    rule: 'No outstanding balance',
    letters: ['Receipt (by email)'],
    next: 'Confirm enrolment requirements are complete',
    tone: 'success',
    canProceed: true,
  },
  {
    key: 'insurance-only',
    label: 'Insurance fee only',
    rule: 'Only the insurance fee is outstanding',
    letters: ['Receipt'],
    next: 'Wait for and check the student’s own insurance evidence, then continue with receipt',
    tone: 'info',
    canProceed: true,
  },
  {
    key: 'under-100',
    label: 'Less than $100',
    rule: 'Balance under $100, excluding insurance-only cases',
    letters: ['Receipt', 'Payment Request Letter'],
    next: 'Continue with receipt — small balance followed up separately',
    tone: 'warning',
    canProceed: true,
  },
  {
    key: 'over-100',
    label: '$100 or more',
    rule: 'Balance of $100 or more',
    letters: ['Payment Request Letter only'],
    next: 'Wait for further payment, then update the invoice and re-check',
    tone: 'danger',
    canProceed: false,
  },
]

export function paymentOutcome(key: BalanceScenario): PaymentOutcome {
  return PAYMENT_OUTCOMES.find((p) => p.key === key)!
}

export function balanceScenarioFor(outstanding: number, insuranceOnly: boolean): BalanceScenario {
  if (outstanding <= 0) return 'paid'
  if (insuranceOnly) return 'insurance-only'
  return outstanding < 100 ? 'under-100' : 'over-100'
}
