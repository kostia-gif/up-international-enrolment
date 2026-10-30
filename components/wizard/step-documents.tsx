'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, Languages, Loader, CircleAlert, Eye, Sparkles } from 'lucide-react'
import { useWizard } from '@/lib/wizard'
import {
  simulateDuplicateCheck,
  simulateReview,
  simulateScoreReview,
  delay,
  type EnglishScore,
} from '@/lib/simulate'
import type { EnglishVerifyResult } from '@/lib/ai-contract'
import { DEMO_DROP_FILES } from '@/lib/fixtures'
import { newIdSync } from '@/lib/id'
import { StatusBadge } from '@/components/status-badge'
import { DocumentViewerDialog } from '@/components/document-viewer'
import { ChecklistPanel } from './checklist-panel'
import { MedicalCard } from './medical-card'
import { ExistingAgentBlock } from './existing-agent-block'
import { EnglishVerifyInline } from './english-verify-inline'
import { cn } from '@/lib/utils'
import type { Document } from '@/lib/types'
import { describeEnglishRule, englishRuleFor } from '@/lib/entry-rules'

interface EnglishPending {
  docId: string
  fileName: string
  score: EnglishScore
}

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
    course,
    setEnglishResult,
  } = useWizard()
  const courseRef = useRef(course)
  courseRef.current = course
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [viewing, setViewing] = useState<Document | null>(null)
  const [phaseById, setPhaseById] = useState<Record<string, string>>({})
  const [englishVerify, setEnglishVerify] = useState<EnglishPending | null>(null)
  const [dropped, setDropped] = useState(0)
  const droppedRef = useRef(0)
  // Files dropped but not yet read. A multi-file drop is read one at a time, in order.
  const queuedRef = useRef(0)
  const busyRef = useRef(false)
  const pausedRef = useRef(false)

  const remaining = DEMO_DROP_FILES.length - dropped
  const blocked = remaining <= 0

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

  // Returns true when the queue must pause (English test awaiting provider verification).
  const readOne = useCallback(async (): Promise<boolean> => {
    const file = DEMO_DROP_FILES[droppedRef.current]
    if (!file) return false
    droppedRef.current += 1
    setDropped(droppedRef.current)

    const id = newIdSync('doc')
    addDocumentRow({
      id,
      type: file.type,
      fileName: '',
      originalName: file.originalName,
      language: file.language,
      translatedPdf: file.translated,
      status: 'reviewing',
      pages: file.pages,
    })

    setPhase(id, 'Classifying…')
    await delay(450)
    if (file.translated) {
      setPhase(id, 'Translating to English…')
      await delay(550)
    }
    setPhase(id, file.type === 'EnglishTest' ? 'Reading score report…' : 'Reading fields…')
    const result = await simulateReview(file, 500)

    if (result.problem) {
      updateDocumentRow(id, { status: 'problem', problem: result.problem })
      clearPhase(id)
      return false
    }

    const renamed = `${result.classifiedType}_${file.originalName.split('.')[0].slice(0, 8)}.pdf`

    if (result.classifiedType === 'EnglishTest') {
      setPhase(id, 'Checking score against entry requirement…')
      const score = await simulateScoreReview(englishRuleFor(courseRef.current))
      updateDocumentRow(id, { status: 'checked', fileName: renamed })
      clearPhase(id)
      setEnglishVerify({ docId: id, fileName: file.originalName, score })
      return true
    }

    updateDocumentRow(id, { status: 'checked', fileName: renamed })
    applyExtraction(result.satisfiesRequirement, result.fields, id)
    clearPhase(id)

    if (result.classifiedType === 'Passport') {
      const passportNo = result.fields.find((x) => x.key === 'passport_number')?.value
      if (passportNo) {
        setDuplicate({ state: 'checking' })
        const dup = await simulateDuplicateCheck(passportNo)
        setDuplicate(dup.hold ? { state: 'hold', message: dup.message } : { state: 'clear' })
      }
    }
    return false
  }, [addDocumentRow, updateDocumentRow, applyExtraction, setDuplicate, setPhase, clearPhase])

  const drain = useCallback(async () => {
    if (busyRef.current || pausedRef.current) return
    busyRef.current = true
    setProc(true)
    try {
      while (queuedRef.current > 0 && droppedRef.current < DEMO_DROP_FILES.length) {
        queuedRef.current -= 1
        const pause = await readOne()
        if (pause) {
          pausedRef.current = true
          break
        }
      }
      if (droppedRef.current >= DEMO_DROP_FILES.length) queuedRef.current = 0
    } finally {
      busyRef.current = false
      setProc(false)
    }
  }, [readOne, setProc])

  const enqueue = useCallback(
    (count: number) => {
      const room = DEMO_DROP_FILES.length - droppedRef.current - queuedRef.current
      queuedRef.current += Math.max(0, Math.min(count, room))
      void drain()
    },
    [drain],
  )

  const resume = useCallback(() => {
    setEnglishVerify(null)
    pausedRef.current = false
    void drain()
  }, [drain])

  const commitEnglish = useCallback(
    (v: EnglishVerifyResult) => {
      if (!englishVerify) return
      const { docId } = englishVerify
      updateDocumentRow(docId, {
        verifiedBy: v.provider,
        verifiedNote: `${v.scores.testType} ${v.scores.overall} — verified authentic (${v.note})`,
      })
      applyExtraction(
        'english',
        [
          { key: 'english_test_type', value: v.scores.testType, confidence: 0.99, page: 1 },
          { key: 'english_test_score', value: v.scores.overall, confidence: 0.99, page: 1 },
          { key: 'english_test_date', value: v.scores.testDate, confidence: 0.98, page: 1 },
          { key: 'english_test_expiry', value: v.scores.expiry, confidence: 0.98, page: 1 },
        ],
        docId,
      )
      setEnglishResult({
        testType: v.scores.testType,
        overall: v.scores.overall,
        bands: v.scores.bands,
      })
      resume()
    },
    [englishVerify, updateDocumentRow, applyExtraction, setEnglishResult, resume],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (!blocked) enqueue(Math.max(1, e.dataTransfer.files.length))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="flex flex-col gap-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            if (!blocked) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !blocked && enqueue(DEMO_DROP_FILES.length)}
          role="button"
          tabIndex={0}
          aria-disabled={blocked}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !blocked) {
              e.preventDefault()
              enqueue(1)
            }
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
            blocked ? 'cursor-not-allowed border-border opacity-60' : 'cursor-pointer',
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
              <p className="text-sm font-medium">Drop documents</p>
              <p className="text-xs text-muted-foreground">
                {remaining} of {DEMO_DROP_FILES.length} demo files left
              </p>
            </>
          ) : (
            <p className="text-sm font-medium">All demo documents added</p>
          )}
        </div>

        {duplicate.state === 'hold' && <ExistingAgentBlock message={duplicate.message} />}

        {englishVerify && (
          <EnglishVerifyInline
            fileName={englishVerify.fileName}
            score={englishVerify.score}
            onDone={commitEnglish}
            onSkip={resume}
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
                {fieldsExtracted > 0
                  ? `${fieldsExtracted} answer${fieldsExtracted === 1 ? '' : 's'} filled`
                  : `${documents.length} document${documents.length === 1 ? '' : 's'}`}
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
                          <Sparkles className="size-3" /> Verified · {d.verifiedBy}
                        </span>
                      )}
                      {d.translatedPdf && d.status === 'checked' && (
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Languages className="size-3 text-success" /> Translated to English
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {openable && (
                        <button
                          type="button"
                          onClick={() => setViewing(d)}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-primary focus-visible:opacity-100 group-hover:opacity-100"
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
      </div>

      <div className="flex flex-col gap-4">
        <ChecklistPanel
          requirements={requirements}
          title={course?.programmeName ? `Requirements for ${course.programmeName}` : undefined}
          courseName={course?.programmeName}
          englishRule={course?.programmeName ? describeEnglishRule(englishRuleFor(course)) : undefined}
        />
        <MedicalCard />
      </div>

      <DocumentViewerDialog
        doc={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </div>
  )
}
