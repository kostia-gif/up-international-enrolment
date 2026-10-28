import { CircleCheck, Circle, Hourglass } from 'lucide-react'
import type { Application } from '@/lib/types'
import { unconditionalChecklist, type ChecklistItem } from '@/lib/documents'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const STATE_META: Record<ChecklistItem['state'], { icon: typeof Circle; className: string; label: string }> = {
  received: { icon: CircleCheck, className: 'text-success', label: 'Received' },
  'with-up': { icon: Hourglass, className: 'text-muted-foreground', label: 'Submitted' },
  outstanding: { icon: Circle, className: 'text-warning', label: 'Needed' },
}

export function UnconditionalChecklist({ app, compact = false }: { app: Application; compact?: boolean }) {
  const items = unconditionalChecklist(app)
  if (items.length === 0) return null
  const received = items.filter((i) => i.state === 'received').length

  return (
    <div className={cn(compact ? 'mt-2.5 border-t border-border/60 pt-2' : 'rounded-lg border border-border bg-card p-4')}>
      <div className="flex items-baseline justify-between gap-2">
        <p className={cn('font-semibold', compact ? 'text-[11px] text-muted-foreground' : 'text-sm')}>
          {compact ? 'Needed from you to go unconditional' : 'Documents needed from you for an unconditional offer'}
        </p>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {received}/{items.length}
        </span>
      </div>
      <ul className={cn('flex flex-col', compact ? 'mt-1.5 gap-1' : 'mt-3 gap-2')}>
        {items.map((i) => {
          const meta = STATE_META[i.state]
          const Icon = meta.icon
          return (
            <li key={i.id} className="flex items-start gap-2">
              <Icon className={cn('mt-0.5 shrink-0', compact ? 'size-3' : 'size-4', meta.className)} aria-hidden />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block text-pretty',
                    compact ? 'text-[11px] leading-snug' : 'text-sm font-medium',
                    i.state === 'received' && 'text-muted-foreground line-through decoration-muted-foreground/50',
                  )}
                >
                  {i.document}
                </span>
                {!compact && (
                  <span className="block text-xs text-muted-foreground text-pretty">
                    {i.detail}
                    {i.dueBy && i.state !== 'received' && ` · due ${formatDate(i.dueBy)}`}
                  </span>
                )}
              </span>
              <span className={cn('shrink-0 text-[10px] font-medium', meta.className)}>
                <span className={compact ? 'sr-only' : undefined}>{meta.label}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
