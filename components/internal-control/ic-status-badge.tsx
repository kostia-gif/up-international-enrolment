import { cn } from '@/lib/utils'
import { toneBadge } from '@/lib/status'
import { icStatusMeta, type ICStatus } from '@/lib/internal-control'

export function IcStatusBadge({
  status,
  className,
}: {
  status: ICStatus
  className?: string
}) {
  const meta = icStatusMeta[status]
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
      {meta.label}
    </span>
  )
}
