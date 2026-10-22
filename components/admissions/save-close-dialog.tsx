'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PauseCircle, FileWarning, UserCog, CircleEllipsis } from 'lucide-react'
import type { Application, HoldReason } from '@/lib/types'
import { useStore } from '@/lib/store'
import { HOLD_REASONS } from '@/lib/holds'
import { ADMISSIONS_OFFICER } from '@/components/admissions/admissions-header'
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
  manager: UserCog,
  other: CircleEllipsis,
}

export function HoldDialog({
  app,
  open,
  onOpenChange,
}: {
  app: Application
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { hold } = useStore()
  const router = useRouter()
  const [reason, setReason] = useState<HoldReason>('documents')
  const [note, setNote] = useState('')

  function confirm() {
    hold(app.id, { reason, note: note.trim(), savedBy: ADMISSIONS_OFFICER.name })
    toast.success('Hold saved to Dynamics 365', { description: app.studentName })
    onOpenChange(false)
    router.push('/admissions')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hold</DialogTitle>
          <DialogDescription>Saved to crmHold on the record.</DialogDescription>
        </DialogHeader>

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
                  'flex items-center gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-colors',
                  active ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/60',
                )}
              >
                <Icon className={cn('size-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
                {r.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hold-note">Note</Label>
          <Textarea id="hold-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-1.5" onClick={confirm}>
            <PauseCircle className="size-4" /> Save hold
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
