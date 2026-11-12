'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, TriangleAlert } from 'lucide-react'
import { useStore } from '@/lib/store'
import { AssistantPanel } from '@/components/dashboard/assistant-panel'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function AskAi() {
  const [open, setOpen] = useState(false)
  const { visibleApplications, getApplication } = useStore()
  const pathname = usePathname()
  // On an application page the assistant scopes eligibility checks to that student.
  const focusId = pathname.match(/^\/applications\/([^/]+)/)?.[1]
  const focusApp = focusId ? getApplication(focusId) : undefined

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-primary/40 bg-card px-4 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-secondary"
      >
        <Sparkles className="size-4" aria-hidden />
        <span className="hidden sm:inline">Ask AI</span>
        <span className="sr-only sm:hidden">Ask AI</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-0 right-0 left-auto flex h-dvh max-h-dvh w-full max-w-full translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 data-open:slide-in-from-right sm:max-w-md">
          <DialogHeader className="shrink-0 gap-1 border-b border-border px-5 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="size-4.5 text-primary" aria-hidden />
              Ask AI
            </DialogTitle>
            <DialogDescription>
              {focusApp
                ? `Working on ${focusApp.studentName}'s application`
                : `Across your ${visibleApplications.length} applications`}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <AssistantPanel
              applications={visibleApplications}
              focusApp={focusApp}
              className="border-0 p-0 shadow-none"
            />
          </div>
          <p className="flex shrink-0 items-start gap-1.5 border-t border-border px-5 py-3 text-xs leading-relaxed text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            This is AI and can make mistakes. Please confirm anything important with UP admissions
            before acting on it.
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
