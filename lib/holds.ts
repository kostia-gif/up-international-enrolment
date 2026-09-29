import type { HoldReason } from './types'
import type { Tone } from './status'

export interface HoldReasonDef {
  key: HoldReason
  label: string
  // Who admissions is waiting on.
  waitingOn: string
  description: string
  // The wording agents and external stakeholders see. Internal notes stay private.
  externalLabel: string
  tone: Tone
}

export const HOLD_REASONS: HoldReasonDef[] = [
  {
    key: 'documents',
    label: 'Outstanding documentation',
    waitingOn: 'Agent / student',
    description: 'A document is missing, unclear or needs re-sending before the assessment can continue.',
    externalLabel: 'Waiting on documents',
    tone: 'warning',
  },
  {
    key: 'regional-manager',
    label: 'Check with Regional Manager',
    waitingOn: 'Regional Manager',
    description: 'For example, an INZ decline rate of 20% or more, or an agent or market question.',
    externalLabel: 'Under admissions review',
    tone: 'ai',
  },
  {
    key: 'campus-manager',
    label: 'Check with Campus Manager',
    waitingOn: 'Campus Manager',
    description: 'For example, intake capacity, campus fit, an age exception or a special admission.',
    externalLabel: 'Under admissions review',
    tone: 'info',
  },
  {
    key: 'other',
    label: 'Other',
    waitingOn: 'Admissions',
    description: 'Any other reason the review cannot be completed in one sitting.',
    externalLabel: 'Under admissions review',
    tone: 'neutral',
  },
]

export const HOLD_REASON_LABEL: Record<HoldReason, string> = Object.fromEntries(
  HOLD_REASONS.map((r) => [r.key, r.label]),
) as Record<HoldReason, string>

export function holdReasonDef(key: HoldReason): HoldReasonDef {
  return HOLD_REASONS.find((r) => r.key === key)!
}
