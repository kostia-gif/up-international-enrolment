'use client'

import { useState } from 'react'
import { FileText, Languages, TriangleAlert, ShieldCheck, Eye } from 'lucide-react'
import type { Application, Document } from '@/lib/types'
import { StatusBadge } from '@/components/status-badge'
import { DocumentViewerDialog } from '@/components/document-viewer'

export function TabDocuments({ app }: { app: Application }) {
  const [viewing, setViewing] = useState<Document | null>(null)

  if (app.documents.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No documents attached yet.
      </p>
    )
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {app.documents.map((d) => (
          <li
            key={d.id}
            className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
          >
            <button
              type="button"
              onClick={() => setViewing(d)}
              className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              aria-label={`Open ${d.fileName || d.originalName}`}
            >
              <FileText className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <button
                  type="button"
                  onClick={() => setViewing(d)}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {d.fileName}
                </button>
                <span className="text-xs text-muted-foreground line-through">{d.originalName}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{d.type}</span>
                {d.pages != null && <span>{d.pages} pages</span>}
                <span className="inline-flex items-center gap-1">
                  <Languages className="size-3" />
                  {d.language}
                  {d.translatedPdf && ' · translation attached'}
                </span>
              </div>
              {d.verifiedBy && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-success text-pretty">
                  <ShieldCheck className="size-3.5 shrink-0" />
                  {d.verifiedNote ?? `Authenticity verified · ${d.verifiedBy}`}
                </p>
              )}
              {d.problem && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-destructive text-pretty">
                  <TriangleAlert className="size-3.5 shrink-0" />
                  {d.problem}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setViewing(d)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
              >
                <Eye className="size-3.5" /> View
              </button>
              <StatusBadge kind="document" status={d.status} />
            </div>
          </li>
        ))}
      </ul>
      <DocumentViewerDialog
        doc={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </>
  )
}
