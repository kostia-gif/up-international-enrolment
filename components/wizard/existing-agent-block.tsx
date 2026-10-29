'use client'

import { toast } from 'sonner'
import { Download, Phone, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const REGIONAL_MANAGER = {
  name: 'Hannah Lee',
  role: 'Regional Manager, South-East Asia',
  phone: '+64 9 555 0142',
  email: 'hannah.lee@up.education',
}

const SWITCH_STEPS = [
  'Download the change-of-agent form.',
  'Ask the student to sign it.',
  `Send the signed form to ${REGIONAL_MANAGER.name}, your regional manager.`,
]

export function ExistingAgentBlock({ message }: { message?: string }) {
  return (
    <section
      role="alert"
      aria-labelledby="existing-agent-heading"
      className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
    >
      <div className="flex items-start gap-2.5">
        <UserX className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-1">
          <h2 id="existing-agent-heading" className="text-sm font-semibold text-destructive">
            This student already exists with another agent
          </h2>
          <p className="text-sm leading-relaxed text-pretty text-foreground">
            {message ??
              'You can’t apply for this student while they are linked to another agent.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          To switch the student to you
        </p>
        <ol className="flex list-decimal flex-col gap-1 pl-4 text-sm leading-relaxed">
          {SWITCH_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => toast.success('Change-of-agent form downloaded (PDF)')}
        >
          <Download className="size-3.5" /> Download change-of-agent form
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          render={<a href={`tel:${REGIONAL_MANAGER.phone.replace(/\s/g, '')}`} />}
          nativeButton={false}
        >
          <Phone className="size-3.5" /> Call regional manager
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {REGIONAL_MANAGER.name} · {REGIONAL_MANAGER.role} · {REGIONAL_MANAGER.phone} ·{' '}
        {REGIONAL_MANAGER.email}
      </p>
    </section>
  )
}
