'use client'

import { toast } from 'sonner'
import { Download, Languages, FileText, ShieldCheck } from 'lucide-react'
import type { Document } from '@/lib/types'
import { getDocPreview, type PreviewPane } from '@/lib/doc-preview'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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

export function DocumentViewerDialog({
  doc,
  open,
  onOpenChange,
}: {
  doc: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!doc) return null
  const preview = getDocPreview(doc)
  const hasTranslation = !!preview.translated

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="gap-2 border-b border-border p-4">
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="min-w-0">
              <DialogTitle className="truncate">{doc.fileName || doc.originalName}</DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span>{doc.type}</span>
                {doc.pages != null && <span>{doc.pages} pages</span>}
                <span className="inline-flex items-center gap-1">
                  <Languages className="size-3" /> {doc.language}
                </span>
                {hasTranslation && <span className="text-primary">Translation attached</span>}
              </DialogDescription>
            </div>
            <StatusBadge kind="document" status={doc.status} className="shrink-0" />
          </div>
          {doc.verifiedBy && (
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success/25 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <ShieldCheck className="size-3.5" />
              {doc.verifiedNote ?? `Authenticity verified · ${doc.verifiedBy}`}
            </p>
          )}
        </DialogHeader>

        <div className="overflow-y-auto p-4">
          <div className={cn('grid gap-5', hasTranslation && 'md:grid-cols-2')}>
            <PagePane pane={preview.original} />
            {preview.translated && <PagePane pane={preview.translated} accent />}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground text-pretty">
            Facsimile preview for the prototype. Original scans and machine translations are
            rendered representatively.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 p-4">
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
      </DialogContent>
    </Dialog>
  )
}
