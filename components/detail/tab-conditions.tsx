'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Send,
  CircleCheck,
  ShieldCheck,
  FileUp,
  Sparkles,
  Clock,
} from 'lucide-react'
import type { Application, Condition } from '@/lib/types'
import { useStore, newId } from '@/lib/store'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { EnglishValidationDialog } from './english-validation-dialog'
import { ConditionDropzone } from './condition-dropzone'

const ownerLabel: Record<Condition['owner'], string> = {
  agent: 'Agent',
  student: 'Student',
  up: 'UP',
}

const isEnglishCondition = (c: Condition) => /english|ielts|pte|toefl/i.test(c.label)

// Conditions owned by UP (e.g. "reviewed by admissions") are not something the
// agent can action with a document — they resolve on UP's side.
const isUpAction = (c: Condition) => c.owner === 'up'

export function TabConditions({ app }: { app: Application }) {
  const { updateCondition, addDocument, addEvent } = useStore()
  const [validating, setValidating] = useState<Condition | null>(null)

  function attachDocument(c: Condition, fileName: string) {
    const docId = newId('doc')
    addDocument(app.id, {
      id: docId,
      type: 'Supporting',
      fileName: `Evidence_${app.preId}.pdf`,
      originalName: fileName || 'condition_evidence.pdf',
      language: 'English',
      status: 'checked',
      pages: 1,
    })
    updateCondition(app.id, c.id, { status: 'cleared', evidence: docId })
    addEvent(app.id, {
      ts: new Date().toISOString(),
      actor: 'agent',
      label: `Condition cleared: ${c.label}`,
      detail: `${fileName || 'Document'} added to the applicant file`,
      channel: 'agent-tool',
      attachments: [{ name: fileName || 'condition_evidence.pdf', addedTo: 'Applicant file' }],
    })
    toast.success(`Document added — condition "${c.label}" cleared`)
  }

  function markSent(c: Condition) {
    updateCondition(app.id, c.id, { status: 'submitted' })
    addEvent(app.id, {
      ts: new Date().toISOString(),
      actor: 'agent',
      label: `Condition marked as sent: ${c.label}`,
    })
    toast('Marked as sent to UP')
  }

  if (app.conditions.length === 0) {
    return (
      <p className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border p-8 text-center text-sm text-success">
        <CircleCheck className="size-4" /> No conditions on this application.
      </p>
    )
  }

  const open = app.conditions.filter((c) => c.status !== 'cleared')
  const cleared = app.conditions.filter((c) => c.status === 'cleared')

  return (
    <>
      <div className="flex flex-col gap-3">
        {open.map((c) => (
          <ConditionCard
            key={c.id}
            condition={c}
            english={isEnglishCondition(c)}
            upAction={isUpAction(c)}
            onValidate={() => setValidating(c)}
            onAttach={(name) => attachDocument(c, name)}
            onMarkSent={() => markSent(c)}
          />
        ))}

        {cleared.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
          >
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-pretty">
                <CircleCheck className="size-4 shrink-0 text-success" />
                {c.label}
              </p>
              <p className="mt-0.5 pl-6 text-xs text-muted-foreground">
                Owner: {ownerLabel[c.owner]}
                {isEnglishCondition(c) ? ' · Verified with the test provider' : ''}
              </p>
            </div>
            <StatusBadge kind="condition" status={c.status} />
          </div>
        ))}
      </div>

      <EnglishValidationDialog
        app={app}
        condition={validating}
        open={!!validating}
        onOpenChange={(o) => !o && setValidating(null)}
      />
    </>
  )
}

function ConditionCard({
  condition: c,
  english,
  upAction,
  onValidate,
  onAttach,
  onMarkSent,
}: {
  condition: Condition
  english: boolean
  upAction: boolean
  onValidate: () => void
  onAttach: (fileName: string) => void
  onMarkSent: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-pretty">{c.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Owner: {ownerLabel[c.owner]}
            {c.dueBy ? ` · Due ${formatDate(c.dueBy)}` : ''}
            {c.createdFrom === 'up' ? ' · Set by UP' : ''}
          </p>
        </div>
        <StatusBadge kind="condition" status={c.status} />
      </div>

      {/* Actionable area, per condition type. */}
      {english ? (
        <div className="mt-3">
          <ConditionDropzone
            onFile={onValidate}
            title="Drop the English score report to validate"
            hint="AI checks the score, then it's confirmed with the test provider"
            icon={<Sparkles className="size-5" />}
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground text-pretty">
            <ShieldCheck className="size-3.5 shrink-0" />
            Two steps: validate the score meets requirements, then verify authenticity with Pearson
            / IELTS.
          </p>
        </div>
      ) : upAction ? (
        <div className="mt-3 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground text-pretty">
          <Clock className="size-3.5 shrink-0" />
          This is with UP admissions — no action needed from you. It clears when admissions completes
          their review.
        </div>
      ) : (
        <div className="mt-3">
          <ConditionDropzone
            onFile={onAttach}
            title="Drag &amp; drop the document to add it"
            hint="Attaches to the applicant file and clears this condition"
            icon={<FileUp className="size-5" />}
          />
          {c.status === 'open' && (
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" onClick={onMarkSent}>
                <Send className="size-3.5" /> Or mark as sent to UP
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
