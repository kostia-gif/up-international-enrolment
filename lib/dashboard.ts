import type { Application, LooIssuer, PaymentState, Requirement, Stage, VisaState } from './types'
import type { Tone } from './status'

export const STAGE_TONE: Record<Stage, Tone> = {
  Draft: 'neutral',
  Submitted: 'info',
  'Conditional offer': 'ai',
  Unconditional: 'success',
  'Payment & visa': 'warning',
}

// Drafts live in their own tray above the board, not as a column.
export interface BoardColumnDef {
  key: Exclude<Stage, 'Draft'>
  label: string
  tone: Tone
  // Shown greyed out as a preview; not interactive in the POC.
  phase2?: boolean
}

export const BOARD_COLUMNS: BoardColumnDef[] = [
  { key: 'Submitted', label: 'Submitted', tone: STAGE_TONE.Submitted },
  { key: 'Conditional offer', label: 'Conditional offer', tone: STAGE_TONE['Conditional offer'] },
  { key: 'Unconditional', label: 'Unconditional', tone: STAGE_TONE.Unconditional },
  { key: 'Payment & visa', label: 'Payment & visa', tone: STAGE_TONE['Payment & visa'], phase2: true },
]

export type WaitingOn = 'you' | 'up' | 'inz'

// Who owns the next action. Drafts, open agent/student conditions, evidence
// gaps, outstanding payments and visa approvals sit with the agent.
export function waitingOn(app: Application): WaitingOn {
  if (app.duplicateHold) return 'up'
  if (app.stage === 'Draft') return 'you'
  if (app.stage === 'Unconditional') return 'you'
  if (app.stage === 'Payment & visa') {
    if (app.payment && app.payment.state !== 'paid') return 'you'
    if (app.visa?.state === 'lodged') return 'inz'
    if (app.visa?.state !== 'approved') return 'you'
    return 'up'
  }
  if (app.crmHold?.reason === 'documents') return 'you'
  if (app.conditions.some((c) => c.status === 'open' && c.owner !== 'up')) return 'you'
  return 'up'
}

export const WAITING_LABEL: Record<WaitingOn, string> = {
  you: 'Waiting on you',
  up: 'Waiting on UP',
  inz: 'Waiting on INZ',
}

export const LOO_ISSUER_LABEL: Record<LooIssuer, string> = {
  agent: 'Issued by agent',
  up: 'Issued by UP',
}

export function hasOffer(app: Application): boolean {
  return (
    app.stage === 'Conditional offer' ||
    app.stage === 'Unconditional' ||
    app.stage === 'Payment & visa'
  )
}

export function isUnconditional(app: Application): boolean {
  return app.stage === 'Unconditional' || app.stage === 'Payment & visa'
}

export const PAYMENT_META: Record<PaymentState, { label: string; tone: Tone }> = {
  outstanding: { label: 'Payment outstanding', tone: 'danger' },
  'part-paid': { label: 'Part paid', tone: 'warning' },
  paid: { label: 'Paid in full', tone: 'success' },
}

export const VISA_META: Record<VisaState, { label: string; tone: Tone }> = {
  'not-lodged': { label: 'Visa not lodged', tone: 'neutral' },
  lodged: { label: 'Visa lodged', tone: 'info' },
  approved: { label: 'Visa approved', tone: 'success' },
}

export function formatNzd(amount: number): string {
  return `NZD ${amount.toLocaleString('en-NZ')}`
}

export function needsVisaApproval(app: Application): boolean {
  return app.stage === 'Payment & visa' && app.visa?.state !== 'approved'
}

const AWAITING_PRIORITY: Requirement['category'][] = ['english', 'academic', 'other', 'identity']

// Outstanding evidence an agent can resolve by dropping a file. English and
// academic evidence surface first.
export interface OutstandingDoc {
  requirementId: string
  label: string
  category: Requirement['category']
  english: boolean
}

export function outstandingDocs(app: Application): OutstandingDoc[] {
  return app.requirements
    .filter(
      (r) =>
        r.category !== 'course' &&
        (r.status === 'missing' || r.status === 'problem' || r.status === 'expiring'),
    )
    .sort(
      (a, b) => AWAITING_PRIORITY.indexOf(a.category) - AWAITING_PRIORITY.indexOf(b.category),
    )
    .map((r) => ({
      requirementId: r.id,
      label: r.label,
      category: r.category,
      english: r.category === 'english',
    }))
}
