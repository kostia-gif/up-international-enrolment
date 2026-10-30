'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Download, Languages, FileText, ShieldCheck, Sparkles } from 'lucide-react'
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

function PagePane({
  pane,
  accent,
  focusPage,
}: {
  pane: PreviewPane
  accent?: boolean
  focusPage?: number
}) {
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
        {pane.pages.map((page, i) => {
          const focused = focusPage != null && focusPage === i + 1
          return (
          <div
            key={i}
            dir={pane.dir}
            data-focus-page={focused && !accent ? 'true' : undefined}
            className={cn(
              'relative rounded-md border bg-card p-4 shadow-xs transition-shadow',
              focused
                ? 'border-ai/60 ring-2 ring-ai/20'
                : 'border-border',
            )}
          >
            {focused && (
              <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-ai px-2 py-0.5 text-[10px] font-semibold text-ai-foreground shadow-sm">
                <Sparkles className="size-3" aria-hidden /> Read from here
              </span>
            )}
            <span className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <span>Page {i + 1}</span>
              <span>{pane.pages.length > 1 ? `of ${pane.pages.length}` : ''}</span>
            </span>
            {page.title && (
              <p className="mb-2 border-b border-dashed border-border pb-2 text-[13px] font-semibold text-foreground">
                {page.title}
              </p>
            )}
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
              {page.lines.join('\n')}
            </pre>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export interface ViewerFocus {
  page?: number
  // Human label of the field whose value was read from this document.
  fieldLabel?: string
}

export function DocumentViewerDialog({
  doc,
  open,
  onOpenChange,
  focus,
}: {
  doc: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
  focus?: ViewerFocus
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const focusPage = focus?.page

  useEffect(() => {
    if (!open || focusPage == null) return
    const timer = setTimeout(() => {
      scrollRef.current
        ?.querySelector('[data-focus-page="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
    return () => clearTimeout(timer)
  }, [open, focusPage, doc?.id])

  if (!doc) return null
  const preview = getDocPreview(doc)
  const hasTranslation = !!preview.translated

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="gap-2 border-b border-border p-4">
          {focus?.fieldLabel && (
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ai/10 px-2.5 py-0.5 text-xs font-medium text-ai">
              <Sparkles className="size-3.5" aria-hidden />
              Source for “{focus.fieldLabel}”
              {focusPage ? ` · page ${focusPage}` : ''}
            </p>
          )}
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="min-w-0">
              <DialogTitle className="truncate">{doc.fileName || doc.originalName}</DialogTitle>
              <DialogDescription className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span>{doc.type}</span>
                {doc.pages != null && <span>{doc.pages} {doc.pages === 1 ? "page" : "pages"}</span>}
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

        <div ref={scrollRef} className="overflow-y-auto bg-muted/30 p-4">
          <div className={cn('grid gap-5', hasTranslation && 'md:grid-cols-2')}>
            <PagePane pane={preview.original} focusPage={focusPage} />
            {preview.translated && (
              <PagePane pane={preview.translated} accent focusPage={focusPage} />
            )}
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
