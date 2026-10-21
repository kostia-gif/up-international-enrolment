'use client'

import { useRef } from 'react'
import { BadgeCheck, Upload, Lock } from 'lucide-react'
import type { Application } from '@/lib/types'
import { useStore } from '@/lib/store'
import { newIdSync } from '@/lib/id'
import { Button } from '@/components/ui/button'

const VISA_READY_STAGES = ['Unconditional', 'Accepted', 'Paid']

export function VisaUpload({ app }: { app: Application }) {
  const { updateApplication } = useStore()
  const input = useRef<HTMLInputElement>(null)
  const visaDoc = app.documents.find((d) => d.type === 'Visa')
  const approved = app.stage === 'Visa approved'
  const ready = VISA_READY_STAGES.includes(app.stage)

  function onFile(file: File) {
    const ext = file.name.split('.').pop() || 'pdf'
    updateApplication(app.id, (a) => ({
      ...a,
      stage: 'Visa approved',
      documents: [
        ...a.documents.filter((d) => d.type !== 'Visa'),
        {
          id: newIdSync('doc'),
          type: 'Visa',
          fileName: `Visa_${a.id}.${ext}`,
          originalName: file.name,
          language: 'English',
          status: 'checked',
        },
      ],
      events: [
        ...a.events,
        {
          ts: new Date().toISOString(),
          actor: 'agent',
          label: 'Approved visa uploaded',
          detail: file.name,
        },
      ],
    }))
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Approved visa</h2>
        {approved && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <BadgeCheck className="size-3.5" /> Visa approved
          </span>
        )}
      </div>

      {approved && visaDoc ? (
        <p className="text-sm text-pretty">
          <span className="font-medium">{visaDoc.fileName}</span>
          <span className="text-muted-foreground"> · from {visaDoc.originalName}</span>
        </p>
      ) : ready ? (
        <>
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground text-pretty">
            When INZ grants the student visa, upload the approval letter here. This moves the
            application to the final stage.
          </p>
          <input
            ref={input}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            aria-label="Upload approved visa"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onFile(f)
              e.target.value = ''
            }}
          />
          <Button size="sm" className="gap-1.5" onClick={() => input.current?.click()}>
            <Upload className="size-3.5" /> Upload approved visa
          </Button>
        </>
      ) : (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground text-pretty">
          <Lock className="mt-px size-3.5 shrink-0" />
          Opens once the student holds an unconditional offer.
        </p>
      )}
    </section>
  )
}
