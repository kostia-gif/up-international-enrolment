import type { HoldReason } from './types'
import type { Tone } from './status'

export interface HoldReasonDef {
  key: HoldReason
  label: string
  tone: Tone
}

export const HOLD_REASONS: HoldReasonDef[] = [
  { key: 'documents', label: 'Documents', tone: 'warning' },
  { key: 'manager', label: 'Manager', tone: 'info' },
  { key: 'other', label: 'Other', tone: 'neutral' },
]

export const HOLD_REASON_LABEL: Record<HoldReason, string> = Object.fromEntries(
  HOLD_REASONS.map((r) => [r.key, r.label]),
) as Record<HoldReason, string>

export function holdReasonDef(key: HoldReason): HoldReasonDef {
  return HOLD_REASONS.find((r) => r.key === key)!
}
