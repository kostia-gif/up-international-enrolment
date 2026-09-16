'use client'

import { toast } from 'sonner'
import { Download, Languages, FileText, ShieldCheck } from 'lucide-react'
import type { Document } from '@/lib/types'
import { getDocPreview, type PreviewPane } from '@/lib/doc-preview'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function PagePane({ pane, accent }: { pane: PreviewPane; accent?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium',
          accent ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {accent ? <Languages className="size-3.5" /> : <FileText className="size-3.5" />}
        {pane.heading}
      </p>
      <div className="flex flex-col gap-3">
        {pane.pages.map((page, i) => (
          <div
            key={i}
            dir={pane.dir}
            className="rounded-md border border-border bg-card p-4 shadow-xs"
          >
            {page.title && (
              <p className="mb-2 border-b border-dashed border-border pb-2 text-[13px] font-semibold text-foreground">
                {page.title}
              </p>
            )}
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
              {page.lines.join('\n')}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}

// Inline evidence viewer used by the admissions review wizard: the original
// scan (and its English translation, when present) rendered side by side.
export function DocPanes({ doc }: { doc: Document }) {
  const preview = getDocPreview(doc)
  const hasTranslation = !!preview.translated

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{doc.fileName || doc.originalName}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground">
            <span>{doc.type}</span>
            {doc.pages != null && <span>{doc.pages} pages</span>}
            <span className="inline-flex items-center gap-1">
              <Languages className="size-3" /> {doc.language}
            </span>
          </p>
        </div>
        <StatusBadge kind="document" status={doc.status} className="shrink-0" />
      </div>

      {doc.verifiedBy && (
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
          <ShieldCheck className="size-3.5" />
          {doc.verifiedNote ?? `Authenticity verified · ${doc.verifiedBy}`}
        </p>
      )}

      <div className={cn('grid gap-4', hasTranslation && 'lg:grid-cols-2')}>
        <PagePane pane={preview.original} />
        {preview.translated && <PagePane pane={preview.translated} accent />}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => toast.success('Original document downloaded (PDF)')}
        >
          <Download className="size-3.5" /> Original
        </Button>
        {hasTranslation && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => toast.success('English translation downloaded (PDF)')}
          >
            <Download className="size-3.5" /> Translation
          </Button>
        )}
      </div>
    </div>
  )
}
