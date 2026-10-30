'use client'

import { Eye, FileText, Languages } from 'lucide-react'
import type { Document, Field } from '@/lib/types'

// Compact list of the captured documents, shown in the wizard rail from the
// assessment step on, so the agent can open any scan (and its English
// translation) while working through the later steps.
export function SourceDocuments({
  documents,
  fields,
  onView,
}: {
  documents: Document[]
  fields: Field[]
  onView: (doc: Document) => void
}) {
  const docs = documents.filter((d) => d.status === 'checked')
  if (docs.length === 0) return null

  const readsFrom = (doc: Document) => fields.filter((f) => f.sourceDoc === doc.id).length

  return (
    <section aria-labelledby="sources-heading" className="flex flex-col gap-2">
      <h3
        id="sources-heading"
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        <FileText className="size-3.5" aria-hidden />
        Source documents
      </h3>
      <ul className="flex flex-col gap-1">
        {docs.map((doc) => {
          const n = readsFrom(doc)
          const translated = !!doc.translatedPdf && doc.language !== 'English'
          return (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => onView(doc)}
                className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-card"
                aria-label={`View ${doc.type}${translated ? ' with translation' : ''}`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm">{doc.type}</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Languages className="size-3" aria-hidden />
                    {doc.language}
                    {translated && <span className="text-primary">+ English</span>}
                    {n > 0 && (
                      <span className="text-ai">
                        · {n} read{n === 1 ? '' : 's'}
                      </span>
                    )}
                  </span>
                </span>
                <Eye
                  className="size-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary"
                  aria-hidden
                />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
