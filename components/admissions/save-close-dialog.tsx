'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CloudUpload, FileWarning, MapPin, Building2, CircleEllipsis } from 'lucide-react'
import type { Application, HoldReason } from '@/lib/types'
import { useStore } from '@/lib/store'
import { HOLD_REASONS } from '@/lib/holds'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const ICONS: Record<HoldReason, typeof FileWarning> = {
  documents: FileWarning,
  'regional-manager': MapPin,
  'campus-manager': Building2,
  other: CircleEllipsis,
}

export const ADMISSIONS_OFFICER = 'Mel Hart'

export function SaveCloseDialog({
  app,
  open,
  onOpenChange,
  stepIndex,
  stepTitle,
  approvedSteps,
  suggested,
}: {
  app: Application
  open: boolean
  onOpenChange: (open: boolean) => void
  stepIndex: number
  stepTitle: string
  approvedSteps: string[]
  suggested?: HoldReason
}) {
  const { saveAndClose } = useStore()
  const router = useRouter()
  const [reason, setReason] = useState<HoldReason>(suggested ?? 'documents')
  const [note, setNote] = useState('')

  function confirm() {
    saveAndClose(app.id, {
      reason,
      note: note.trim(),
      stepIndex,
      stepTitle,
      approvedSteps,
      savedBy: ADMISSIONS_OFFICER,
    })
    toast.success('Review saved to Dynamics CRM', {
      description: `${app.studentName} is on hold at "${stepTitle}". Sales and the agent can see where it is sitting.`,
    })
    onOpenChange(false)
    router.push('/admissions')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Save & close this review</DialogTitle>
          <DialogDescription>
            Progress is saved back to Dynamics CRM with {approvedSteps.length} approved{' '}
            {approvedSteps.length === 1 ? 'step' : 'steps'}. The file reopens at &ldquo;{stepTitle}&rdquo;.
          </DialogDescription>
        </DialogHeader>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-medium text-muted-foreground">Why are you stopping?</legend>
          <div role="radiogroup" aria-label="Hold reason" className="flex flex-col gap-2">
            {HOLD_REASONS.map((r) => {
              const Icon = ICONS[r.key]
              const active = reason === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setReason(r.key)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                    active ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/60',
                  )}
                >
                  <Icon className={cn('mt-0.5 size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {r.label}
                      <span className="text-[11px] font-normal text-muted-foreground">Waiting on {r.waitingOn}</span>
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{r.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hold-note">Internal note (optional)</Label>
          <Textarea
            id="hold-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Asked Campus Manager about intake capacity for Feb."
            rows={3}
          />
          <p className="text-[11px] text-muted-foreground">
            Internal only. Agents and external stakeholders see a status, not this note.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Keep reviewing
          </Button>
          <Button className="gap-1.5" onClick={confirm}>
            <CloudUpload className="size-4" /> Save to CRM & close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
