import { FileSignature, GraduationCap } from 'lucide-react'
import { hasTrustedRights, type AgentProfile, type AgentStatus } from '@/lib/agent-profiles'
import type { Agency } from '@/lib/types'
import { cn } from '@/lib/utils'

const RIGHTS = [
  {
    icon: FileSignature,
    name: 'Instant offers',
    on: 'Eligible applications get an offer the moment you submit.',
    off: 'UP admissions issues the offer after review.',
  },
  {
    icon: GraduationCap,
    name: 'Upfront discounts',
    on: 'You can apply available discounts when you submit.',
    off: 'You can request a discount. UP approves it.',
  },
]

export function AgentRights({ profile, agency }: { profile: AgentProfile; agency: Agency }) {
  const on = hasTrustedRights(profile, agency)

  return (
    <section
      aria-labelledby="rights-heading"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <h2 id="rights-heading" className="text-sm font-semibold text-foreground">
        What you can do
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {RIGHTS.map((r) => (
          <div key={r.name} className="flex items-start gap-3 rounded-lg border border-border p-3">
            <span
              className={cn(
                'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full',
                on ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
              )}
              aria-hidden
            >
              <r.icon className="size-4" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                {r.name}
                <span className={cn('text-xs font-semibold', on ? 'text-success' : 'text-muted-foreground')}>
                  {on ? 'On' : 'Off'}
                </span>
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {on ? r.on : r.off}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-full',
        status === 'Active' && 'bg-success',
        status === 'Suspended' && 'bg-destructive',
        status === 'Disabled' && 'bg-muted-foreground',
      )}
    />
  )
}
