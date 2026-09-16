import { cn } from '@/lib/utils'
import { toneBadge, type Tone } from '@/lib/status'
import type { CardBadge } from '@/lib/format'

export function PipelineBadge({ badge }: { badge: CardBadge }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none',
        toneBadge[badge.tone as Tone],
      )}
    >
      {badge.label}
    </span>
  )
}
