'use client'

import { useState } from 'react'
import { FileSignature, GraduationCap, Power } from 'lucide-react'
import { toast } from 'sonner'
import {
  AGENT_STATUSES,
  SCHOLARSHIPS,
  type AgentProfile,
  type AgentStatus,
} from '@/lib/agent-profiles'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export function AgentStatusControl({ profile }: { profile: AgentProfile }) {
  const [status, setStatus] = useState<AgentStatus>(profile.status)
  const current = AGENT_STATUSES.find((s) => s.value === status)

  return (
    <Panel icon={Power} title="Account status" id="status-heading">
      <div className="flex flex-col gap-2">
        <Label htmlFor="agent-status" className="sr-only">
          Account status
        </Label>
        <Select
          value={status}
          onValueChange={(v) => {
            if (!v) return
            setStatus(v as AgentStatus)
            toast.success(`${profile.name} set to ${v}`)
          }}
        >
          <SelectTrigger id="agent-status" className="w-full bg-card">
            <span className="flex items-center gap-2">
              <StatusDot status={status} />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {AGENT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs leading-relaxed text-muted-foreground">{current?.description}</p>
      </div>
    </Panel>
  )
}

export function AgentRightsControl({ profile }: { profile: AgentProfile }) {
  const [canIssue, setCanIssue] = useState(profile.canIssueConditionalLoo)
  const [granted, setGranted] = useState<string[]>(profile.scholarships)

  return (
    <>
      <Panel icon={FileSignature} title="Conditional Letter of Offer" id="loo-heading">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[[data-checked]]:border-primary/40 has-[[data-checked]]:bg-primary/5">
          <Checkbox
            checked={canIssue}
            onCheckedChange={(v) => {
              setCanIssue(!!v)
              toast.success(v ? 'Agent can now issue conditional offers' : 'Conditional offers will be issued by UP')
            }}
            className="mt-0.5"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">Can issue conditional LoO</span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              {canIssue
                ? 'Auto-pathway applications get an instant conditional offer from the agent.'
                : 'Every application goes to UP admissions, who issue the conditional offer.'}
            </span>
          </span>
        </label>
      </Panel>

      <Panel
        icon={GraduationCap}
        title="Discount rights"
        id="scholarships-heading"
        aside={`${granted.length} of ${SCHOLARSHIPS.length}`}
      >
        <ul className="flex flex-col gap-2">
          {SCHOLARSHIPS.map((s) => {
            const on = granted.includes(s.id)
            return (
              <li key={s.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 has-[[data-checked]]:border-primary/40 has-[[data-checked]]:bg-primary/5">
                  <Checkbox
                    checked={on}
                    onCheckedChange={(v) =>
                      setGranted((g) => (v ? [...g, s.id] : g.filter((x) => x !== s.id)))
                    }
                    className="mt-0.5"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{s.detail}</span>
                  </span>
                </label>
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
    <section aria-labelledby={id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      <header className="flex items-center justify-between gap-2">
        <h2 id={id} className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </h2>
        {aside && <span className="text-xs text-muted-foreground tabular-nums">{aside}</span>}
      </header>
      {children}
    </section>
  )
}
