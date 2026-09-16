// The status vocabulary is fixed across every screen: same words, same colours,
// same icons. Everything maps to one of these tones.
import {
  CircleCheck,
  CircleDashed,
  TriangleAlert,
  CircleAlert,
  Clock,
  CircleDot,
  Minus,
  Sparkles,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type {
  RequirementStatus,
  ConditionStatus,
  FieldStatus,
  DocStatus,
} from './types'

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'ai' | 'neutral'

// Soft badge classes per tone, using the semantic tokens defined in globals.css.
export const toneBadge: Record<Tone, string> = {
  success: 'bg-success/12 text-success border-success/25',
  warning: 'bg-warning/12 text-warning border-warning/25',
  danger: 'bg-destructive/12 text-destructive border-destructive/25',
  info: 'bg-info/12 text-info border-info/25',
  ai: 'bg-ai/12 text-ai border-ai/25',
  neutral: 'bg-muted text-muted-foreground border-border',
}

export const toneDot: Record<Tone, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  info: 'bg-info',
  ai: 'bg-ai',
  neutral: 'bg-muted-foreground/50',
}

interface StatusMeta {
  label: string
  tone: Tone
  icon: LucideIcon
}

export const requirementMeta: Record<RequirementStatus, StatusMeta> = {
  met: { label: 'Met', tone: 'success', icon: CircleCheck },
  missing: { label: 'Missing', tone: 'neutral', icon: CircleDashed },
  problem: { label: 'Problem', tone: 'danger', icon: CircleAlert },
  expiring: { label: 'Expiring', tone: 'warning', icon: TriangleAlert },
  'not-applicable': { label: 'Not applicable', tone: 'neutral', icon: Minus },
}

export const conditionMeta: Record<ConditionStatus, StatusMeta> = {
  open: { label: 'Open', tone: 'warning', icon: CircleDot },
  submitted: { label: 'Submitted', tone: 'info', icon: Clock },
  cleared: { label: 'Cleared', tone: 'success', icon: CircleCheck },
}

export const fieldMeta: Record<FieldStatus, StatusMeta> = {
  ai: { label: 'AI', tone: 'ai', icon: Sparkles },
  confirmed: { label: 'Confirmed', tone: 'success', icon: CircleCheck },
  verified: { label: 'Verified', tone: 'success', icon: ShieldCheck },
  missing: { label: 'Missing', tone: 'neutral', icon: CircleDashed },
  conflict: { label: 'Conflict', tone: 'danger', icon: CircleAlert },
}

export const docMeta: Record<DocStatus, StatusMeta> = {
  queued: { label: 'Queued', tone: 'neutral', icon: CircleDashed },
  reviewing: { label: 'Reviewing', tone: 'info', icon: Clock },
  checked: { label: 'Checked', tone: 'success', icon: CircleCheck },
  problem: { label: 'Problem', tone: 'danger', icon: CircleAlert },
}
