import { cn } from '@/lib/utils'
import {
  requirementMeta,
  conditionMeta,
  fieldMeta,
  docMeta,
  toneBadge,
} from '@/lib/status'
import type {
  RequirementStatus,
  ConditionStatus,
  FieldStatus,
  DocStatus,
} from '@/lib/types'

type Kind = 'requirement' | 'condition' | 'field' | 'document'

const registry = {
  requirement: requirementMeta,
  condition: conditionMeta,
  field: fieldMeta,
  document: docMeta,
} as const

interface StatusBadgeProps {
  kind: Kind
  status: RequirementStatus | ConditionStatus | FieldStatus | DocStatus
  className?: string
  iconOnly?: boolean
}

export function StatusBadge({ kind, status, className, iconOnly }: StatusBadgeProps) {
  const meta = (registry[kind] as Record<string, (typeof requirementMeta)[RequirementStatus]>)[
    status
  ]
  if (!meta) return null
  const Icon = meta.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium',
        toneBadge[meta.tone],
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {!iconOnly && meta.label}
    </span>
  )
}
