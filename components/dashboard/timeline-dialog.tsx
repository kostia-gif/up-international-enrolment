'use client'

import { MessagesSquare } from 'lucide-react'
import type { Application } from '@/lib/types'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function TimelineDialog({
  applications,
  focusId,
  onFocus,
}: {
  applications: Application[]
  focusId: string | null
  onFocus: (id: string | null) => void
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <MessagesSquare className="size-3.5" />
        <span className="hidden sm:inline">Timeline</span>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex h-[80vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">Activity timeline</DialogTitle>
        <DialogDescription className="sr-only">
          Emails, documents and updates across applications, newest at the bottom.
        </DialogDescription>
        <ActivityTimeline applications={applications} focusId={focusId} onFocus={onFocus} />
      </DialogContent>
    </Dialog>
  )
}
