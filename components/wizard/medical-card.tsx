'use client'

import { CircleCheck, HeartPulse, Loader } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { EvidenceUpload } from './evidence-upload'

export function MedicalCard() {
  const { documents } = useWizard()
  const medical = documents.filter((d) => d.type === 'Medical')
  const received = medical.filter((d) => d.status === 'checked')
  const reading = medical.some((d) => d.status === 'reviewing' || d.status === 'queued')

  return (
    <section
      aria-labelledby="medical-heading"
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-3">
        <div className="min-w-0">
          <h2 id="medical-heading" className="text-sm font-semibold">
            Supporting documents
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Optional now. Usually needed before an unconditional offer.
          </p>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">Optional</span>
      </div>

      <div className="flex items-start gap-3 px-5 py-4">
        {received.length > 0 ? (
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        ) : reading ? (
          <Loader className="mt-0.5 size-5 shrink-0 animate-spin text-info" aria-hidden />
        ) : (
          <HeartPulse className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div role="status" aria-live="polite">
            <p className="text-sm font-medium">Medical certificate</p>
            {received.length > 0 ? (
              <p className="mt-0.5 text-sm leading-relaxed text-success text-pretty">
                Received
                {received.length === 1
                  ? ` — ${received[0].originalName}`
                  : ` — ${received.length} files`}
                . AI recognised it, so you won&apos;t be asked for it later.
              </p>
            ) : reading ? (
              <p className="mt-0.5 text-sm text-info">Reading…</p>
            ) : (
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">
                Not required yet. If you already have it, upload it here or drop it with the other
                documents and AI will pick it up.
              </p>
            )}
          </div>
          <div>
            <EvidenceUpload type="Medical" disabled={reading}>
              {received.length > 0 ? 'Add another file' : 'Upload medical certificate'}
            </EvidenceUpload>
          </div>
        </div>
      </div>
    </section>
  )
}
