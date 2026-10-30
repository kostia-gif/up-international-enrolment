'use client'

import { Eye, FileText, Languages } from 'lucide-react'
import type { Document, Field } from '@/lib/types'
import { cn } from '@/lib/utils'

// Compact strip of the captured documents feeding Step 3, so the agent can
// open the scan and its English translation while confirming answers.
export function SourceDocuments({
  documents,
  fields,
  onView,
}: {
  documents: Document[]
  fields: Field[]
  onView: (doc: Document) => void
}) {
  const docs = documents.filter((d) => d.status === 'checked' || d.status === 'problem')
  if (docs.length === 0) return null

  const readsFrom = (doc: Document) => fields.filter((f) => f.sourceDoc === doc.id).length

  return (
    <section aria-labelledby="sources-heading" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id="sources-heading" className="flex items-center gap-1.5 text-sm font-semibold">
          <FileText className="size-4 text-muted-foreground" aria-hidden />
          Source documents
        </h3>
        <p className="text-xs text-muted-foreground">
          Open any to see the scan beside its English translation
        </p>
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-1">
        {docs.map((doc) => {
          const n = readsFrom(doc)
          const translated = !!doc.translatedPdf && doc.language !== 'English'
          return (
            <li key={doc.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onView(doc)}
                className={cn(
                  'group flex w-52 flex-col gap-2 rounded-lg border border-border bg-card p-3 text-left shadow-xs transition-all',
                  'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
                )}
                aria-label={`View ${doc.type}${translated ? ' with translation' : ''}`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-muted/40 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <Eye
                    className="size-4 text-muted-foreground/50 transition-colors group-hover:text-primary"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{doc.type}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {doc.originalName || doc.fileName}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                    <Languages className="size-3" aria-hidden /> {doc.language}
                  </span>
                  {translated && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                      + English
                    </span>
                  )}
                  {n > 0 && (
                    <span className="rounded bg-ai/10 px-1.5 py-0.5 text-ai">
                      {n} read{n === 1 ? '' : 's'}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
