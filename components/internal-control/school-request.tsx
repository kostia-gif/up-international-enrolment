'use client'

import { useState } from 'react'
import { Building2, Send, Clock, CircleCheck, Plus, Mail } from 'lucide-react'
import { toast } from 'sonner'
import type { AuditRecord, AuditAction } from '@/lib/internal-control'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

const REQUESTABLE = [
  'Final student visa',
  'Insurance evidence',
  'Confirmed programme start date',
  'Updated SMS record',
  'Passport (final)',
  'Enrolment confirmation',
]

function actionStatusStyle(status: AuditAction['status']) {
  if (status === 'complete') return { icon: CircleCheck, tone: 'text-success', label: 'Complete' }
  if (status === 'pending') return { icon: Clock, tone: 'text-info', label: 'Pending' }
  return { icon: Clock, tone: 'text-warning', label: 'Outstanding' }
}

export function SchoolRequestPanel({ record }: { record: AuditRecord }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [sent, setSent] = useState(false)

  function toggle(item: string) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    )
  }

  function submit() {
    setSent(true)
    setOpen(false)
    toast.success(`Request sent to ${record.school}`, {
      description:
        selected.length > 0
          ? `${selected.length} item${selected.length === 1 ? '' : 's'} requested`
          : 'Follow-up logged',
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold leading-tight">Requests &amp; actions</h2>
          <p className="text-[11px] text-muted-foreground">
            Ask {record.school} for missing information without leaving the audit
          </p>
        </div>
      </div>

      {/* Existing / logged actions */}
      <ul className="mt-3 flex flex-col gap-2">
        {record.actions.map((action, i) => {
          const s = actionStatusStyle(action.status)
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-lg border border-border bg-secondary/30 p-2.5"
            >
              <s.icon className={cn('mt-0.5 size-4 shrink-0', s.tone)} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium leading-tight text-pretty">{action.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {action.owner === 'school' ? `To ${action.party}` : action.party}
                  {action.requested ? ` · Requested ${formatDate(action.requested)}` : ''}
                  {action.due ? ` · Due ${formatDate(action.due)}` : ''}
                </p>
              </div>
              <span className={cn('shrink-0 text-[10px] font-medium', s.tone)}>{s.label}</span>
            </li>
          )
        })}

        {sent && (
          <li className="flex items-start gap-2.5 rounded-lg border border-info/25 bg-info/[0.06] p-2.5">
            <Send className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium leading-tight">
                New request sent to {record.school}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {selected.length > 0 ? selected.join(', ') : 'General follow-up'} · Just now
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-medium text-info">Sent</span>
          </li>
        )}

        {record.actions.length === 0 && !sent && (
          <li className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
            No outstanding requests.
          </li>
        )}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button variant="outline" size="sm" className="mt-3 w-full gap-1.5" />
          }
        >
          <Plus className="size-3.5" />
          Request information from school
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Mail className="size-4 text-primary" />
              Request from {record.school}
            </DialogTitle>
            <DialogDescription>
              Select what Internal Control needs. The request is tracked against{' '}
              {record.applicationId}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2 py-1">
            {REQUESTABLE.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 text-sm transition-colors hover:bg-secondary/40"
              >
                <Checkbox
                  checked={selected.includes(item)}
                  onCheckedChange={() => toggle(item)}
                />
                {item}
              </label>
            ))}
            <div className="mt-1">
              <Label htmlFor="request-note" className="text-xs text-muted-foreground">
                Note to school (optional)
              </Label>
              <Textarea
                id="request-note"
                placeholder="Add any context for the school team…"
                className="mt-1 min-h-[64px] resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="gap-1.5" onClick={submit}>
              <Send className="size-3.5" />
              Send request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
