'use client'

import { useRef } from 'react'
import { BadgeCheck, Upload } from 'lucide-react'
import type { Application } from '@/lib/types'
import { useStore } from '@/lib/store'
import { newIdSync } from '@/lib/id'
import { hasApprovedVisa } from '@/lib/dashboard'

// Compact approved-visa upload on board cards. A visa can arrive at any point
// after the unconditional offer, so it never forces a stage change on its own
// except to mark the file "Visa approved" once the student has paid.
export function CardVisaUpload({ app }: { app: Application }) {
  const { updateApplication } = useStore()
  const input = useRef<HTMLInputElement>(null)
  const visaDoc = app.documents.find((d) => d.type === 'Visa')

  if (hasApprovedVisa(app)) {
    return (
      <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-success">
        <BadgeCheck className="size-3" aria-hidden />
        {visaDoc ? visaDoc.fileName : 'Visa on file'}
      </p>
    )
  }

  function onFile(file: File) {
    const ext = file.name.split('.').pop() || 'pdf'
    updateApplication(app.id, (a) => ({
      ...a,
      stage: a.stage === 'Paid' ? 'Visa approved' : a.stage,
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
        } as (typeof a.events)[number],
      ],
    }))
  }

  return (
    <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
      <input
        ref={input}
        type="file"
        accept=".pdf,image/*"
        className="sr-only"
        aria-label={`Upload approved visa for ${app.studentName}`}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-background px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
      >
        <Upload className="size-3" aria-hidden />
        Upload approved visa
      </button>
    </div>
  )
}
