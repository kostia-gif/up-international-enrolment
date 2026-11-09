'use client'

import { useState } from 'react'
import type { Application } from '@/lib/types'
import { formatDate } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function AcceptOfferDialog({
  app,
  open,
  onOpenChange,
  onAccept,
}: {
  app: Application
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
}) {
  const [agreed, setAgreed] = useState(false)
  const [signature, setSignature] = useState('')
  const canAccept = agreed && signature.trim().length > 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Accept your offer</DialogTitle>
          <DialogDescription>
            Accepting confirms your place. UP then sends your fee invoice so you can apply for your
            student visa.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border border-border bg-muted/50 p-4 text-sm">
          <dt className="text-muted-foreground">Programme</dt>
          <dd className="font-medium text-pretty">{app.course.programmeName}</dd>
          <dt className="text-muted-foreground">Starts</dt>
          <dd className="font-medium">{formatDate(app.course.intakeDate)}</dd>
          <dt className="text-muted-foreground">Campus</dt>
          <dd className="font-medium">{app.course.delivery === 'online' ? 'Online' : app.course.campus}</dd>
          <dt className="text-muted-foreground">Tuition</dt>
          <dd className="font-medium">{app.course.priceBundle}</dd>
        </dl>

        <form
          id="accept-offer"
          onSubmit={(e) => {
            e.preventDefault()
            if (canAccept) onAccept()
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex items-start gap-2.5 text-sm leading-relaxed">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-primary"
            />
            <span className="text-pretty">
              I accept this offer and the UP Education international student terms and conditions,
              including the refund policy.
            </span>
          </label>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="signature">Type your full name to sign</Label>
            <Input
              id="signature"
              autoComplete="name"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={app.studentName}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Not yet
          </Button>
          <Button type="submit" form="accept-offer" disabled={!canAccept}>
            Accept offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
