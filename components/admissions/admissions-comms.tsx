'use client'

import { Mail, ChevronRight, Paperclip } from 'lucide-react'
import type { Application } from '@/lib/types'
import { ActivityTimeline } from '@/components/dashboard/activity-timeline'
import { RelativeTime } from '@/components/relative-time'
import { emailedDocsSummary } from '@/lib/admissions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

// The same chat-style communications flow agents use, embedded for admissions
// as a controlled dialog. Opened from the "docs emailed" module it leads with a
// digest of which applicants have new emailed documents; opened focused on one
// applicant it jumps straight into that thread.
export function AdmissionsComms({
  applications,
  open,
  onOpenChange,
  focusId,
  onFocus,
}: {
  applications: Application[]
  open: boolean
  onOpenChange: (open: boolean) => void
  focusId: string | null
  onFocus: (id: string | null) => void
}) {
  const summary = emailedDocsSummary(applications)
  const showDigest = focusId === null && summary.applicants.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[80vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">Communications</DialogTitle>
        <DialogDescription className="sr-only">
          Emails, WhatsApp messages, documents and updates across applicants.
        </DialogDescription>

        {showDigest && (
          <div className="shrink-0 border-b border-border bg-info/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-info/12 text-info">
                <Mail className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {summary.totalDocs} document{summary.totalDocs === 1 ? '' : 's'} emailed
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Across {summary.applicants.length} applicant
                  {summary.applicants.length === 1 ? '' : 's'} · newest first
                </p>
              </div>
            </div>
            <ul className="mt-2.5 flex flex-col gap-1">
              {summary.applicants.map(({ app, docCount, lastTs }) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => onFocus(app.id)}
                    className="flex w-full items-center gap-3 rounded-md border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-card"
                  >
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                      <Paperclip className="size-3" />
                      {docCount} doc{docCount === 1 ? '' : 's'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{app.studentName}</span>
                      <RelativeTime
                        className="text-[10px] text-muted-foreground"
                        iso={lastTs}
                      />
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Remount on focus change so the thread opens on the right applicant. */}
        <div className="min-h-0 flex-1">
          <ActivityTimeline
            key={focusId ?? 'all'}
            applications={applications}
            focusId={focusId}
            onFocus={onFocus}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
