import { Check, FileSignature, GraduationCap, Lock, Minus, Power } from 'lucide-react'
import { AGENT_STATUSES, SCHOLARSHIPS, type AgentProfile, type AgentStatus } from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'

export function AgentStatusControl({ profile }: { profile: AgentProfile }) {
  const current = AGENT_STATUSES.find((s) => s.value === profile.status)

  return (
    <Panel icon={Power} title="Account status" id="status-heading">
      <div className="flex flex-col gap-2">
        <p className="flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium">
          <StatusDot status={profile.status} />
          {profile.status}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">{current?.description}</p>
      </div>
    </Panel>
  )
}

export function AgentRightsControl({ profile }: { profile: AgentProfile }) {
  const canIssue = profile.canIssueConditionalLoo
  const granted = profile.scholarships

  return (
    <>
      <Panel icon={FileSignature} title="Conditional offers" id="loo-heading">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
              canIssue ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
            )}
            aria-hidden
          >
            {canIssue ? <Check className="size-3.5" /> : <Minus className="size-3.5" />}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {canIssue ? 'You can issue conditional offers' : 'UP issues conditional offers for you'}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {canIssue
                ? 'Applications on the auto pathway get an instant conditional offer when you submit.'
                : 'Every application goes to UP admissions, who issue the conditional offer.'}
            </span>
          </span>
        </div>
      </Panel>

      <Panel
        icon={GraduationCap}
        title="Discounts you can request"
        id="scholarships-heading"
        aside={`${granted.length} of ${SCHOLARSHIPS.length}`}
      >
        <ul className="flex flex-col divide-y divide-border">
          {SCHOLARSHIPS.map((s) => {
            const on = granted.includes(s.id)
            return (
              <li key={s.id} className="flex items-start gap-2.5 py-2 first:pt-0 last:pb-0">
                <span
                  className={cn(
                    'mt-0.5 grid size-4 shrink-0 place-items-center rounded-full',
                    on ? 'text-success' : 'text-muted-foreground/50',
                  )}
                  aria-hidden
                >
                  {on ? <Check className="size-3.5" /> : <Minus className="size-3" />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className={cn('text-sm', on ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                    {s.name}
                  </span>
                  {on && (
                    <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                      {s.detail}
                    </span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </Panel>
    </>
  )
}

export function StatusDot({ status }: { status: AgentStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-full',
        status === 'Active' && 'bg-success',
        status === 'Probation' && 'bg-warning',
        status === 'Suspended' && 'bg-destructive',
        status === 'Disabled' && 'bg-muted-foreground',
      )}
    />
  )
}

function Panel({
  icon: Icon,
  title,
  id,
  aside,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  id: string
  aside?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <h2 id={id} className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </h2>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
          {aside}
          <Lock className="size-3" aria-label="Set by UP" />
        </span>
      </header>
      {children}
    </section>
  )
}
