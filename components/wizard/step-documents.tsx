'use client'

import { useCallback, useRef, useState } from 'react'
import {
  Upload,
  FileText,
  Languages,
  Loader,
  CircleAlert,
  Eye,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import {
  simulateDuplicateCheck,
  simulateScoreReview,
  delay,
  type EnglishScore,
} from '@/lib/simulate'
import { DEMO_DROP_FILES } from '@/lib/fixtures'
import { newIdSync } from '@/lib/id'
import { FIELD_TOTAL } from '@/lib/blank-fields'
import { StatusBadge } from '@/components/status-badge'
import { DocumentViewerDialog } from '@/components/document-viewer'
import { ChecklistPanel } from './checklist-panel'
import { EnglishVerifyInline } from './english-verify-inline'
import { cn } from '@/lib/utils'
import type { Document } from '@/lib/types'

export function StepDocuments({
  onProcessingChange,
}: {
  onProcessingChange?: (processing: boolean) => void
}) {
  const {
    documents,
    requirements,
    addDocumentRow,
    updateDocumentRow,
    applyExtraction,
    fieldsExtracted,
    duplicate,
    setDuplicate,
  } = useWizard()
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [viewing, setViewing] = useState<Document | null>(null)
  // Transient per-row status text ("Classifying…", "Translating…") shown while
  // a document is being read.
  const [phaseById, setPhaseById] = useState<Record<string, string>>({})
  // The English test hand-off: once a score is read, the inline verifier takes
  // over until the agent confirms or skips.
  const [englishVerify, setEnglishVerify] = useState<{
    docId: string
    fileName: string
    score: EnglishScore
  } | null>(null)
  // How many of the demo files have been dropped so far (POC advances through
  // the set one drop at a time).
  const [dropped, setDropped] = useState(0)
  const droppedRef = useRef(0)
  const busyRef = useRef(false)

  const remaining = DEMO_DROP_FILES.length - dropped
  const blocked = busyRef.current || englishVerify !== null || remaining <= 0

  const setProc = useCallback(
    (v: boolean) => {
      setProcessing(v)
      onProcessingChange?.(v)
    },
    [onProcessingChange],
  )

  const setPhase = useCallback((id: string, text: string) => {
    setPhaseById((p) => ({ ...p, [id]: text }))
  }, [])
  const clearPhase = useCallback((id: string) => {
    setPhaseById((p) => {
      const next = { ...p }
      delete next[id]
      return next
    })
  }, [])

  // Process the next demo file: add it as a queued row, walk it through the
  // read phases (classify -> verify -> translate) so the agent can see the AI
  // work through it, then tick it off. English tests branch into the provider
  // verification flow instead of being marked met immediately.
  const processNext = useCallback(async () => {
    if (busyRef.current || englishVerify) return
    const file = DEMO_DROP_FILES[droppedRef.current]
    if (!file) return
    droppedRef.current += 1
    setDropped(droppedRef.current)
    busyRef.current = true
    setProc(true)

    const id = newIdSync('doc')
    const doc: Document = {
      id,
      type: file.type,
      fileName: '',
      originalName: file.originalName,
      language: file.language,
      translatedPdf: file.translated,
      status: 'queued',
      pages: file.pages,
    }
    addDocumentRow(doc)

    try {
      updateDocumentRow(id, { status: 'reviewing' })
      setPhase(id, 'Classifying document…')
      await delay(550)
      setPhase(
        id,
        file.type === 'EnglishTest' ? 'Reading score report…' : 'Verifying authenticity…',
      )
      await delay(650)
      if (file.translated) {
        setPhase(id, 'Translating to English…')
        await delay(700)
      }

      if (file.problem) {
        updateDocumentRow(id, { status: 'problem', problem: file.problem })
        clearPhase(id)
        return
      }

      const renamed = `${file.type}_${file.originalName.split('.')[0].slice(0, 8)}.pdf`

      if (file.type === 'EnglishTest') {
        setPhase(id, 'Checking score against entry requirement…')
        const score = await simulateScoreReview()
        updateDocumentRow(id, { status: 'checked', fileName: renamed })
        clearPhase(id)
        // Hand off to the inline verifier; the requirement is only marked met
        // once the provider confirms authenticity.
        setEnglishVerify({ docId: id, fileName: file.originalName, score })
        return
      }

      updateDocumentRow(id, {
        status: 'checked',
        fileName: renamed,
        translatedPdf: file.translated,
      })
      applyExtraction(file.satisfiesRequirement, file.fields, id)
      clearPhase(id)

      // Silent duplicate check off the passport the AI just read.
      if (file.type === 'Passport') {
        const passportNo = file.fields.find((x) => x.key === 'passport_number')?.value
        if (passportNo) {
          setDuplicate({ state: 'checking' })
          const dup = await simulateDuplicateCheck(passportNo)
          setDuplicate(dup.hold ? { state: 'hold', message: dup.message } : { state: 'clear' })
        }
      }
    } finally {
      busyRef.current = false
      setProc(false)
    }
  }, [
    englishVerify,
    addDocumentRow,
    updateDocumentRow,
    applyExtraction,
    setProc,
    setDuplicate,
    setPhase,
    clearPhase,
  ])

  // File the verified English score: attach the provider note and backfill the
  // score fields, which flips the English requirement to met.
  const commitEnglish = useCallback(
    (provider: string, scoreReportCode: string) => {
      if (!englishVerify) return
      const { docId, score } = englishVerify
      updateDocumentRow(docId, {
        verifiedBy: provider,
        verifiedNote: `${score.testType} ${score.overall} — verified authentic via Pearson (${scoreReportCode})`,
      })
      applyExtraction(
        'english',
        [
          { key: 'english_test_type', value: score.testType, confidence: 0.99 },
          { key: 'english_test_score', value: score.overall, confidence: 0.99 },
          { key: 'english_test_date', value: score.testDate, confidence: 0.98 },
          { key: 'english_test_expiry', value: score.expiry, confidence: 0.98 },
        ],
        docId,
      )
      setEnglishVerify(null)
    },
    [englishVerify, updateDocumentRow, applyExtraction],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (!blocked) void processNext()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!blocked) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!blocked) void processNext()
          }}
          role="button"
          tabIndex={0}
          aria-disabled={blocked}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !blocked) void processNext()
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors',
            blocked
              ? 'cursor-not-allowed border-border opacity-60'
              : 'cursor-pointer',
            dragOver && !blocked
              ? 'border-primary bg-primary/5'
              : !blocked && 'border-border hover:border-primary/40',
          )}
        >
          <div className="grid size-11 place-items-center rounded-full bg-muted">
            {processing ? (
              <Loader className="size-5 animate-spin text-info" />
            ) : (
              <Upload className="size-5 text-muted-foreground" />
            )}
          </div>
          {remaining > 0 ? (
            <>
              <p className="text-sm font-medium">
                {processing ? 'Working through the document…' : 'Drop a document — one at a time'}
              </p>
              <p className="text-xs text-muted-foreground text-pretty">
                We classify, verify identity and translate each file as it lands, then tick off what
                it satisfies. {remaining} of {DEMO_DROP_FILES.length} demo files left.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">All demo documents added</p>
              <p className="text-xs text-muted-foreground text-pretty">
                Every file has been read and checked. Continue to review and complete.
              </p>
            </>
          )}
        </div>

        {duplicate.state === 'hold' && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Possible duplicate — placed on hold</p>
              <p className="text-pretty">{duplicate.message}</p>
            </div>
          </div>
        )}

        {englishVerify && (
          <EnglishVerifyInline
            fileName={englishVerify.fileName}
            score={englishVerify.score}
            onDone={(v) => commitEnglish(v.provider, v.scoreReportCode)}
            onSkip={() => setEnglishVerify(null)}
          />
        )}

        {documents.length > 0 && (
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-sm font-medium">Documents</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {(processing || duplicate.state === 'checking') && (
                  <Loader className="size-3.5 animate-spin text-info" />
                )}
                Extracted {fieldsExtracted} of {FIELD_TOTAL} fields
              </span>
            </div>
            <ul className="divide-y divide-border">
              {documents.map((d) => {
                const openable = d.status === 'checked'
                const phase = phaseById[d.id]
                return (
                  <li key={d.id} className="group flex items-start gap-3 px-4 py-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        {openable ? (
                          <button
                            type="button"
                            onClick={() => setViewing(d)}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {d.fileName || d.originalName}
                          </button>
                        ) : (
                          <span>{d.fileName || d.originalName}</span>
                        )}
                        {d.fileName && d.fileName !== d.originalName && (
                          <span className="ml-1.5 text-xs text-muted-foreground line-through">
                            {d.originalName}
                          </span>
                        )}
                      </p>
                      {phase && (
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-info">
                          <Loader className="size-3 animate-spin" />
                          {phase}
                        </span>
                      )}
                      {d.problem && (
                        <p className="mt-0.5 text-xs text-destructive text-pretty">{d.problem}</p>
                      )}
                      {d.verifiedBy && d.status === 'checked' && (
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-success">
                          <Sparkles className="size-3" /> Verified authentic · {d.verifiedBy}
                        </span>
                      )}
                      {d.translatedPdf && d.status === 'checked' && (
                        <button
                          type="button"
                          onClick={() => setViewing(d)}
                          className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                        >
                          <Languages className="size-3 text-success" /> Translated to English
                          <span className="text-primary">· view original & translation</span>
                        </button>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {openable && (
                        <button
                          type="button"
                          onClick={() => setViewing(d)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
                        >
                          <Eye className="size-3.5" /> View
                        </button>
                      )}
                      <StatusBadge kind="document" status={d.status} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {documents.length > 0 &&
          !processing &&
          !englishVerify &&
          !documents.some((d) => d.type === 'EnglishTest') && (
            <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-warning" />
              <div>
                <p className="font-medium text-warning">English test — awaiting upload</p>
                <p className="text-muted-foreground text-pretty">
                  No English evidence detected yet. You can still generate a conditional offer now —
                  it carries English as an outstanding condition, and the test can be uploaded later
                  for authenticity validation.
                </p>
              </div>
            </div>
          )}

        <p className="text-xs text-muted-foreground text-pretty">
          You can leave this step while processing continues — the readiness panel keeps a spinner.
        </p>
      </div>

      <ChecklistPanel requirements={requirements} />

      <DocumentViewerDialog
        doc={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </div>
  )
}
