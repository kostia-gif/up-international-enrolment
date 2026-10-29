'use client'

import { useState } from 'react'
import { AlertTriangle, FileText, Loader, Trash2 } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatusBadge } from '@/components/status-badge'
import { EvidenceUpload } from './evidence-upload'

const EVIDENCE_KINDS = [
  'Work experience (employer reference)',
  'Prior learning certificate',
  'Portfolio of work',
  'Statement of purpose',
  'Other evidence',
]

export function SpecialAdmissions() {
  const { documents, requirements, removeDocument } = useWizard()
  const [kind, setKind] = useState(EVIDENCE_KINDS[0])
  const evidence = documents.filter((d) => d.type === 'RPL')
  const academic = requirements.filter((r) => r.category === 'academic')
  const academicShort = academic.some((r) => r.status === 'problem')
  const academicMissing = !academicShort && academic.some((r) => r.status === 'missing')

  return (
    <section aria-labelledby="rpl-heading" className="flex flex-col gap-3">
      <div>
        <h3
          id="rpl-heading"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Special admissions &amp; RPL
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground text-pretty">
          If the student doesn&apos;t hold the standard entry qualification, UP can consider them
          through special admission or recognition of prior learning (RPL). Add any evidence that
          supports this.
        </p>
      </div>

      {(academicShort || academicMissing) && (
        <div
          className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 p-3"
          role="note"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
          <p className="text-sm leading-relaxed text-pretty">
            {academicShort
              ? 'The academic requirement isn’t met yet. RPL evidence or a special admission condition may be needed for this offer.'
              : 'No academic transcript has been checked yet. If the student can’t provide one, add RPL evidence here.'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor="rpl-kind" className="text-xs">
            Evidence type
          </Label>
          <Select value={kind} onValueChange={(v) => v && setKind(v)}>
            <SelectTrigger id="rpl-kind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVIDENCE_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <EvidenceUpload type="RPL" evidenceKind={kind}>
          Upload evidence
        </EvidenceUpload>
      </div>

      {evidence.length > 0 ? (
        <ul className="divide-y divide-border rounded-md border border-border">
          {evidence.map((d) => (
            <li key={d.id} className="flex items-center gap-3 px-3 py-2.5">
              <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.originalName}</p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {d.status === 'reviewing' && (
                    <Loader className="size-3 animate-spin text-info" aria-hidden />
                  )}
                  {d.evidenceKind}
                </p>
              </div>
              <StatusBadge kind="document" status={d.status} />
              <button
                type="button"
                onClick={() => removeDocument(d.id)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label={`Remove ${d.originalName}`}
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No evidence added. This is optional.</p>
      )}
    </section>
  )
}
