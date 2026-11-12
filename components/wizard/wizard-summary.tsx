'use client'

import { useState } from 'react'
import { CircleHelp, Loader, Zap } from 'lucide-react'
import { fastTrackReasonText, useWizard } from '@/lib/wizard'
import { formatDate } from '@/lib/format'
import { DocumentViewerDialog } from '@/components/document-viewer'
import { SourceDocuments } from './source-documents'
import type { Document } from '@/lib/types'

// Persistent right-hand summary of what has been captured so far. It reports
// progress only; submission blockers are listed on the review step.
export function WizardSummary({ processing }: { processing?: boolean }) {
  const { step, documents, fields, draft, course, plan, agentRef, fastTrack, fastTrackReason, fastTrackDetail } =
    useWizard()
  const fastTrackLabel = fastTrackReasonText(fastTrackReason, fastTrackDetail)
  const [viewing, setViewing] = useState<Document | null>(null)
  const named = draft.studentName !== 'New student'
  const extraBlocks = plan.blocks.length - 1
  const checked = documents.filter((d) => d.status === 'checked').length

  return (
    <aside aria-label="Application summary" className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</h2>

      <SummaryItem label="Student">
        {named ? draft.studentName : <span className="text-muted-foreground">Not entered yet</span>}
        {agentRef && <span className="block font-mono text-xs text-muted-foreground">{agentRef}</span>}
      </SummaryItem>

      <SummaryItem label="Course">
        {course ? (
          <>
            <span className="block text-pretty">{course.programmeName}</span>
            <span className="block text-xs text-muted-foreground">
              {course.delivery === 'online' ? 'Online' : course.campus} · starts {formatDate(course.intakeDate)}
            </span>
            {extraBlocks > 0 && (
              <span className="block text-xs text-muted-foreground">
                + {extraBlocks} more in the study plan
              </span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">Not chosen yet</span>
        )}
      </SummaryItem>

      {fastTrack && (
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Zap className="size-3.5 text-primary" aria-hidden />
          Fast track requested
          {fastTrackLabel && (
            <span className="font-normal text-muted-foreground">· {fastTrackLabel}</span>
          )}
        </p>
      )}

      <SummaryItem label="Documents">
        {processing ? (
          <span className="flex items-center gap-1.5 text-info">
            <Loader className="size-3.5 animate-spin" aria-hidden /> Reading documents
          </span>
        ) : documents.length > 0 ? (
          `${checked} of ${documents.length} checked`
        ) : (
          <span className="text-muted-foreground">None uploaded yet</span>
        )}
      </SummaryItem>

      {step >= 3 && <SourceDocuments documents={documents} fields={fields} onView={setViewing} />}

      <a
        href={`/rules?step=${step}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground hover:text-primary"
      >
        <CircleHelp className="size-3.5" aria-hidden />
        How this step is decided
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      <DocumentViewerDialog
        doc={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </aside>
  )
}

function SummaryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  )
}
