import { Check, FileSignature, GraduationCap, Lock, Minus, Zap } from 'lucide-react'
import { hasTrustedRights, SCHOLARSHIPS, type AgentProfile, type AgentStatus } from '@/lib/agent-profiles'
import type { Agency } from '@/lib/types'
import { cn } from '@/lib/utils'

export function AgentRightsPanel({ profile, agency }: { profile: AgentProfile; agency: Agency }) {
  const on = hasTrustedRights(profile, agency)

  return (
    <>
      <Panel icon={FileSignature} title="Conditional offers" id="loo-heading">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
              on ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
            )}
            aria-hidden
          >
            {on ? <Check className="size-3.5" /> : <Minus className="size-3.5" />}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {on ? 'You can issue conditional offers' : 'UP issues conditional offers for you'}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {on
                ? 'Eligible applications get an instant conditional offer when you submit.'
                : 'Every application goes to UP admissions, who issue the conditional offer.'}
            </span>
          </span>
        </div>
      </Panel>

      <Panel icon={Zap} title="Fast track" id="fast-track-heading">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
              on ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
            )}
            aria-hidden
          >
            {on ? <Check className="size-3.5" /> : <Minus className="size-3.5" />}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {on ? 'You can flag an application as fast track' : 'Fast track requests go to UP for review'}
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
              {on
                ? 'Pick a reason (ready to commit, visa expiring, or other) and UP admissions prioritises it in their queue.'
                : 'UP admissions and sales review fast-track requests from your agency before prioritising them.'}
            </span>
          </span>
        </div>
      </Panel>

      <Panel
        icon={GraduationCap}
        title="Discounts and scholarships"
        id="scholarships-heading"
        aside={on ? 'Applied upfront' : 'Requested only'}
      >
        <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
          {on
            ? 'You can select any of these for a student and apply it upfront when you submit.'
            : 'You can select any of these for a student. UP admissions approves it and applies it to their offer.'}
        </p>
        <ul className="flex flex-col divide-y divide-border">
          {SCHOLARSHIPS.map((s) => (
            <li key={s.id} className="flex items-start gap-2.5 py-2 first:pt-2 last:pb-0">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center text-muted-foreground" aria-hidden>
                <GraduationCap className="size-3.5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <span className="text-xs leading-relaxed text-muted-foreground text-pretty">{s.detail}</span>
              </span>
            </li>
          ))}
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
