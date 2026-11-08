import type { Application, LooIssuer, PaymentState, Requirement, Stage, VisaState } from './types'
import type { Tone } from './status'
import { unconditionalChecklist } from './documents'

export const STAGE_TONE: Record<Stage, Tone> = {
  Draft: 'neutral',
  Submitted: 'info',
  'Conditional offer': 'ai',
  Unconditional: 'success',
  'Payment & visa': 'warning',
}

export interface BoardColumnDef {
  key: Stage
  label: string
  tone: Tone
  // Shown greyed out as a preview; not interactive in the POC.
  phase2?: boolean
}

export const BOARD_COLUMNS: BoardColumnDef[] = [
  { key: 'Draft', label: 'Drafts', tone: STAGE_TONE.Draft },
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
  you: 'Your action',
  up: 'With UP admissions',
  inz: 'With Immigration NZ',
}

export interface NextAction {
  owner: WaitingOn
  label: string
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

// One plain-language answer to "what happens next, and who does it?" shared by
// the board card, list row and preview so the wording never drifts.
export function nextAction(app: Application): NextAction {
  const owner = waitingOn(app)
  if (app.duplicateHold) return { owner, label: 'UP is checking for a duplicate application' }
  if (owner === 'inz') return { owner, label: 'Visa decision pending' }
  if (owner === 'up') return { owner, label: 'UP admissions is reviewing' }

  if (app.stage === 'Draft') return { owner, label: 'Finish and submit the draft' }
  if (app.stage === 'Unconditional') return { owner, label: 'Arrange acceptance and payment' }
  if (app.stage === 'Payment & visa') {
    if (app.payment && app.payment.state !== 'paid') return { owner, label: 'Collect tuition payment' }
    return { owner, label: 'Upload visa approval' }
  }
  const docs =
    app.stage === 'Conditional offer'
      ? Math.max(
          unconditionalChecklist(app).filter((i) => i.state === 'outstanding').length,
          outstandingDocs(app).length,
        )
      : outstandingDocs(app).length
  if (docs > 0) return { owner, label: `Upload ${plural(docs, 'document')}` }
  const conditions = app.conditions.filter((c) => c.status === 'open' && c.owner !== 'up').length
  if (conditions > 0) return { owner, label: `Clear ${plural(conditions, 'condition')}` }
  return { owner, label: 'Review the application' }
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

// Same wording on every card in an offer stage: offer type, then who issued it.
export function offerSummary(app: Application): string | null {
  if (!hasOffer(app)) return null
  const type = isUnconditional(app) ? 'Unconditional offer' : 'Conditional offer'
  if (!app.looIssuedBy) return type
  return `${type} · ${app.looIssuedBy === 'agent' ? 'issued by agent' : 'issued by UP'}`
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
