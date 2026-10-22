import type { Application, Requirement, Stage } from './types'
import type { Tone } from './status'

// Board columns map one-to-one onto the four stages.
export interface BoardColumnDef {
  key: Stage
  label: string
  tone: Tone
}

export const BOARD_COLUMNS: BoardColumnDef[] = [
  { key: 'Draft', label: 'Draft', tone: 'neutral' },
  { key: 'Submitted', label: 'Submitted', tone: 'info' },
  { key: 'Conditional offer', label: 'Conditional offer', tone: 'ai' },
  { key: 'Unconditional', label: 'Unconditional', tone: 'success' },
]

export function columnFor(app: Application): Stage {
  return app.stage
}

export type WaitingOn = 'you' | 'up'

// Who owns the next action. Drafts, open agent/student conditions and evidence
// gaps sit with the agent; everything else is with UP.
export function waitingOn(app: Application): WaitingOn {
  if (app.duplicateHold) return 'up'
  if (app.stage === 'Draft') return 'you'
  if (app.stage === 'Unconditional') return 'you'
  if (app.crmHold?.reason === 'documents') return 'you'
  if (app.conditions.some((c) => c.status === 'open' && c.owner !== 'up')) return 'you'
  return 'up'
}

export const WAITING_LABEL: Record<WaitingOn, string> = {
  you: 'Waiting on you',
  up: 'Waiting on UP',
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
