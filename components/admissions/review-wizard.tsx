'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileWarning,
  Sparkles,
  ShieldCheck,
  CircleCheck,
  CircleDashed,
  Tag,
  UserCheck,
  StickyNote,
  Send,
  Layers,
  PartyPopper,
  GraduationCap,
  ChevronDown,
  Globe,
  Loader2,
  BadgeCheck,
} from 'lucide-react'
import type { Application, Document } from '@/lib/types'
import { useStore, newId } from '@/lib/store'
import {
  buildReviewSteps,
  canGoUnconditional,
  academicRequirementStatus,
  academicAchievements,
  type ReviewStep,
  type ReviewStepKind,
} from '@/lib/admissions'
import { StatusBadge } from '@/components/status-badge'
import { computeReadiness } from '@/lib/readiness'
import { formatDate } from '@/lib/format'
import { DocPanes } from '@/components/doc-panes'
import { DataBar } from '@/components/admissions/data-bar'
import { ReadinessGauges } from '@/components/readiness-gauge'
import { LetterOfOfferPanel } from '@/components/letter-of-offer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PreReviewStatus } from '@/components/admissions/pre-review-status'
import { PaymentEnrolment } from '@/components/admissions/payment-enrolment'
import { SaveCloseDialog } from '@/components/admissions/save-close-dialog'
import { holdReasonDef } from '@/lib/holds'
import { PauseCircle, History } from 'lucide-react'

const REQUIRED_STEPS: ReviewStepKind[] = [
  'identity',
  'academic',
  'personal',
  'opportunity',
  'course',
]
const SALES_REVIEWERS = [
  'Priya Kaur — Sales',
  'Tom Nguyen — Sales Lead',
  'Sarah Cole — Partnerships',
]
const UPLOAD_TYPE: Partial<Record<ReviewStepKind, string>> = {
  identity: 'Passport',
  academic: 'Transcript',
  english: 'EnglishTest',
  other: 'Supporting',
}

export function ReviewWizard({ app }: { app: Application }) {
  const { addDocument, submitToCrm, confirmField } = useStore()
  const steps = useMemo(() => buildReviewSteps(app), [app])
  // A review saved & closed earlier resumes at the step it stopped on.
  const [resumedFrom] = useState(() => app.crmHold)
  const [current, setCurrent] = useState(() =>
    app.crmHold ? Math.min(app.crmHold.stepIndex, steps.length - 1) : 0,
  )
  const [approved, setApproved] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((app.crmHold?.approvedSteps ?? []).map((k) => [k, true])),
  )
  const [holdOpen, setHoldOpen] = useState(false)
  const [courseReviewer, setCourseReviewer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<null | 'conditional' | 'unconditional'>(null)
  const step = steps[current]
  const isDecision = step.kind === 'decision'
  const requiredApproved = REQUIRED_STEPS.every((k) => approved[k])

  function markApprovedAndNext() {
    // Approving a step confirms the data reviewed on it: every AI-extracted or
    // conflicting field with a value is signed off in one action.
    for (const key of step.fieldKeys) {
      const f = app.fields.find((fld) => fld.key === key)
      if (f && (f.status === 'ai' || f.status === 'conflict') && f.value.trim() !== '') {
        confirmField(app.id, key)
      }
    }
    setApproved((p) => ({ ...p, [step.kind]: true }))
    if (current < steps.length - 1) setCurrent(current + 1)
  }

  function canContinue(): boolean {
    if (step.kind === 'course') {
      const d = app.requests.find((r) => r.type === 'discount')
      if (d && d.status === 'pending' && !courseReviewer) return false
    }
    return true
  }

  function handleUpload() {
    const type = UPLOAD_TYPE[step.kind]
    if (!type) return
    addDocument(app.id, {
      id: newId('doc'),
      type,
      fileName: `${type}_${app.preId}_manual.pdf`,
      originalName: 'manual_upload.pdf',
      language: 'English',
      status: 'checked',
      pages: 1,
    })
    toast.success('Document uploaded and attached to the file')
  }

  function handleSubmit(level: 'conditional' | 'unconditional') {
    submitToCrm(app.id, level)
    setSubmitted(level)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (submitted) {
    return <Confirmation app={app} level={submitted} />
  }

  return (
    <div>
      <Stepper steps={steps} current={current} approved={approved} onSelect={setCurrent} />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {resumedFrom && (
          <div className="mb-4 flex flex-wrap items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            <History className="mt-0.5 size-4 shrink-0 text-warning" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">
                Resumed from CRM — {holdReasonDef(resumedFrom.reason).label}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {resumedFrom.savedBy} saved & closed this review at &ldquo;{resumedFrom.stepTitle}&rdquo; on{' '}
                {formatDate(resumedFrom.savedAt)}.
                {resumedFrom.note ? ` Note: ${resumedFrom.note}` : ''}
              </p>
            </div>
          </div>
        )}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {app.studentName} · {app.preId} · Step {current + 1} of {steps.length}
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-balance">{step.title}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Record in
              </span>
              {step.crm.map((area) => (
                <span
                  key={area}
                  className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setHoldOpen(true)}>
            <PauseCircle className="size-4" /> Save & close
          </Button>
          {app.notesToAdmissions && !isDecision && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-warning"
              title={app.notesToAdmissions}
            >
              <StickyNote className="size-3.5" /> Agent note on file
            </span>
          )}
          </div>
        </div>

        <SaveCloseDialog
          app={app}
          open={holdOpen}
          onOpenChange={setHoldOpen}
          stepIndex={current}
          stepTitle={step.title}
          approvedSteps={Object.keys(approved).filter((k) => approved[k])}
          suggested={
            step.kind === 'course'
                ? 'campus-manager'
                : 'documents'
          }
        />

        {current === 0 && <PreReviewStatus app={app} />}

        {isDecision ? (
          <DecisionStep
            app={app}
            steps={steps}
            approved={approved}
            requiredApproved={requiredApproved}
            onSubmit={handleSubmit}
          />
        ) : (
          <StepBody
            app={app}
            step={step}
            courseReviewer={courseReviewer}
            setCourseReviewer={setCourseReviewer}
            onUpload={handleUpload}
          />
        )}

        {!isDecision && (
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
            <Button
              variant="ghost"
              className="gap-1.5"
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            >
              <ArrowLeft className="size-4" /> Back
            </Button>
            <div className="flex items-center gap-2">
              {!canContinue() && (
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Assign a sales reviewer, or save & close while you check
                </span>
              )}
              <Button variant="outline" className="gap-1.5" onClick={() => setHoldOpen(true)}>
                <PauseCircle className="size-4" /> Save & close
              </Button>
              <Button className="gap-1.5" disabled={!canContinue()} onClick={markApprovedAndNext}>
                <Check className="size-4" />
                {approved[step.kind] ? 'Approved — continue' : 'Approve & continue'}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function Stepper({
  steps,
  current,
  approved,
  onSelect,
}: {
  steps: ReviewStep[]
  current: number
  approved: Record<string, boolean>
  onSelect: (i: number) => void
}) {
  return (
    <div className="sticky top-16 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-3 md:px-6">
        {steps.map((s, i) => {
          const done = approved[s.kind]
          const active = i === current
          return (
            <button
              key={s.kind}
              type="button"
              onClick={() => onSelect(i)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : done
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'grid size-4 place-items-center rounded-full text-[10px] tabular-nums',
                  active ? 'bg-primary-foreground/20' : done ? 'bg-success/20' : 'bg-muted',
                )}
              >
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              {s.short}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepBody({
  app,
  step,
  courseReviewer,
  setCourseReviewer,
  onUpload,
}: {
  app: Application
  step: ReviewStep
  courseReviewer: string | null
  setCourseReviewer: (v: string) => void
  onUpload: () => void
}) {
  // Document-backed steps: evidence on the left, extracted data on the right.
  if (step.kind === 'identity' || step.kind === 'academic' || step.kind === 'english') {
    return (
      <div className="grid gap-5 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <PanelHeading title="Evidence" action={<UploadButton onUpload={onUpload} />} />
          {step.docs.length > 0 ? (
            <div className="flex flex-col gap-6">
              {step.docs.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <DocPanes doc={d} />
                </div>
              ))}
            </div>
          ) : (
            <AwaitingEvidence kind={step.kind} />
          )}
        </section>
        <section className="lg:col-span-2 flex flex-col gap-5">
          {step.kind === 'academic' && <AcademicRequirements app={app} />}
          {step.kind === 'english' && <EnglishVerification docs={step.docs} />}
          <div>
            <PanelHeading title="Student details" hint="Verified against the evidence" />
            <DataBar app={app} fieldKeys={step.fieldKeys} />
          </div>
        </section>
      </div>
    )
  }

  if (step.kind === 'other') {
    return (
      <div className="grid gap-5 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <PanelHeading
            title="Additional documents"
            action={<UploadButton onUpload={onUpload} />}
          />
          {step.docs.length > 0 ? (
            <div className="flex flex-col gap-6">
              {step.docs.map((d) => (
                <div key={d.id} className="rounded-lg border border-border bg-muted/20 p-4">
                  <DocPanes doc={d} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
              No additional documents on this application.
            </p>
          )}
        </section>
        <section className="lg:col-span-2">
          <PanelHeading title="Related data" />
          <DataBar app={app} fieldKeys={step.fieldKeys} />
        </section>
      </div>
    )
  }

  if (step.kind === 'personal') {
    return (
      <div>
        <PanelHeading
          title="Personal, contact & health"
          hint="Captured by the agent — edit or approve as needed"
        />
        <DataBar app={app} fieldKeys={step.fieldKeys} columns={2} />
      </div>
    )
  }

  if (step.kind === 'course') {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <section>
          <PanelHeading title="Confirmed course" />
          <DataBar app={app} fieldKeys={step.fieldKeys} />
        </section>
        <section>
          <PanelHeading title="Fees & discount" />
          <CourseFees
            app={app}
            reviewer={courseReviewer}
            onAssign={setCourseReviewer}
          />
        </section>
      </div>
    )
  }

  if (step.kind === 'special') {
    return <SpecialPanel app={app} />
  }

  if (step.kind === 'files') {
    return (
      <div>
        <PanelHeading title="Files on the Opportunity" hint="Document Name + Student ID" />
        {step.docs.length > 0 ? (
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {step.docs.map((d) => {
              const ok = d.fileName.includes(app.preId)
              return (
                <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{d.fileName}</p>
                    <p className="truncate text-xs text-muted-foreground">Submitted as {d.originalName}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                      ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning',
                    )}
                  >
                    {ok ? 'Named correctly' : `Rename to ${d.type}_${app.preId}`}
                  </span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
            No documents on this application yet.
          </p>
        )}
      </div>
    )
  }

  if (step.kind === 'opportunity') {
    return (
      <div>
        <PanelHeading
          title="Education, health, English & insurance"
          hint="Recorded on the Opportunity and Workflow"
        />
        <DataBar app={app} fieldKeys={step.fieldKeys} columns={2} />
      </div>
    )
  }

  return null
}

function PanelHeading({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

function UploadButton({ onUpload }: { onUpload: () => void }) {
  return (
    <Button variant="outline" size="sm" className="gap-1.5" onClick={onUpload}>
      <Upload className="size-3.5" /> Upload manually
    </Button>
  )
}

function AwaitingEvidence({ kind }: { kind: ReviewStepKind }) {
  const label = kind === 'english' ? 'English test evidence' : 'evidence'
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-warning/40 bg-warning/5 px-4 py-12 text-center">
      <FileWarning className="size-6 text-warning" />
      <p className="text-sm font-medium text-warning">Awaiting {label}</p>
      <p className="max-w-sm text-pretty text-xs text-muted-foreground">
        No document has been received yet. This can be carried as a condition on a conditional
        offer, or you can upload it manually if it arrives by another channel.
      </p>
    </div>
  )
}

// Academic transcript: whether the entered record clears the course entry
// criteria, plus a dropdown of every achievement captured on the data form.
function AcademicRequirements({ app }: { app: Application }) {
  const status = academicRequirementStatus(app)
  const achievements = academicAchievements(app)

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'flex items-start gap-2 rounded-lg border p-3',
          status.met
            ? 'border-success/30 bg-success/10 text-success'
            : 'border-warning/40 bg-warning/10 text-warning',
        )}
      >
        {status.met ? (
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        ) : (
          <FileWarning className="mt-0.5 size-4 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {status.met ? 'Meets course requirements' : 'Course requirements need review'}
          </p>
          <p className="text-pretty text-[11px] opacity-90">
            {status.total > 0
              ? `${status.metCount} of ${status.total} academic ${
                  status.total === 1 ? 'requirement' : 'requirements'
                } met against the confirmed course.`
              : 'No academic entry criteria recorded for this course.'}
          </p>
        </div>
      </div>

      {status.items.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
          {status.items.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div className="min-w-0">
                <span className="text-pretty">{r.label}</span>
                {r.note && <p className="text-[11px] text-muted-foreground text-pretty">{r.note}</p>}
              </div>
              <StatusBadge kind="requirement" status={r.status} className="shrink-0" />
            </li>
          ))}
        </ul>
      )}

      {achievements.length > 0 && (
        <details className="group rounded-lg border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-4 text-muted-foreground" />
              Full achievements entered ({achievements.length})
            </span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <dl className="grid gap-x-4 gap-y-2 border-t border-border px-3 py-3 text-sm sm:grid-cols-2">
            {achievements.map((f) => (
              <div key={f.key}>
                <dt className="text-[11px] text-muted-foreground">{f.label}</dt>
                <dd className="font-medium text-pretty">{f.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </div>
  )
}

// The automated provider-verification run for English evidence. In the POC,
// when admissions uploads a test manually the same score-verification API the
// platform runs is played back step-by-step so the officer can see it clear.
const ENGLISH_API_STEPS = [
  { label: 'Connecting to test provider verification API', done: 'Secure channel established' },
  { label: 'Matching candidate name & date of birth', done: 'Identity matched to booking record' },
  { label: 'Confirming the reported test score', done: 'Score confirmed against provider record' },
  { label: 'Validating certificate authenticity', done: 'Certificate authentic — no tampering found' },
]

function EnglishVerification({ docs }: { docs: Document[] }) {
  const hasDoc = docs.length > 0
  const [completed, setCompleted] = useState(0)
  const [running, setRunning] = useState(false)
  // Bumped to replay the verification on demand ("Re-run").
  const [runKey, setRunKey] = useState(0)

  // Play the provider-verification steps whenever an English document is
  // present (including a manual upload) or a re-run is requested. The effect is
  // self-contained so its own cleanup — including React's strict-mode
  // double-invoke — cannot leave the run half-scheduled.
  useEffect(() => {
    if (docs.length === 0) return
    setCompleted(0)
    setRunning(true)
    const timers = ENGLISH_API_STEPS.map((_, i) =>
      setTimeout(() => {
        setCompleted(i + 1)
        if (i + 1 === ENGLISH_API_STEPS.length) setRunning(false)
      }, (i + 1) * 750),
    )
    return () => timers.forEach(clearTimeout)
  }, [docs.length, runKey])

  const allDone = completed === ENGLISH_API_STEPS.length

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold">
          <Globe className="size-4 text-info" /> Provider score verification
        </h3>
        {hasDoc && !running && (
          <button
            type="button"
            onClick={() => setRunKey((k) => k + 1)}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            Re-run
          </button>
        )}
      </div>

      {!hasDoc ? (
        <p className="text-pretty text-xs text-muted-foreground">
          Upload the English test to run automated provider verification. The API confirms the score
          and certificate authenticity directly with the test provider.
        </p>
      ) : (
        <>
          <ol className="flex flex-col gap-2">
            {ENGLISH_API_STEPS.map((s, i) => {
              const done = i < completed
              const active = i === completed && running
              return (
                <li key={s.label} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5 shrink-0">
                    {done ? (
                      <CircleCheck className="size-3.5 text-success" />
                    ) : active ? (
                      <Loader2 className="size-3.5 animate-spin text-info" />
                    ) : (
                      <CircleDashed className="size-3.5 text-muted-foreground" />
                    )}
                  </span>
                  <span className={cn('text-pretty', done ? 'text-foreground/90' : 'text-muted-foreground')}>
                    {done ? s.done : s.label}
                  </span>
                </li>
              )
            })}
          </ol>
          {allDone && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1.5 text-[11px] font-medium text-success">
              <BadgeCheck className="size-3.5" /> Verified via provider API
            </p>
          )}
        </>
      )}
    </div>
  )
}

function CourseFees({
  app,
  reviewer,
  onAssign,
}: {
  app: Application
  reviewer: string | null
  onAssign: (v: string) => void
}) {
  const discount = app.requests.find((r) => r.type === 'discount')
  const bundle = app.bundle && app.bundle.length > 1 ? app.bundle : null

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Tuition</span>
          <span className="text-lg font-semibold tabular-nums">{app.course.priceBundle}</span>
        </div>
        {bundle && (
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-ai">
            <Layers className="size-3" /> Bundle price across {bundle.length} programmes
          </p>
        )}
      </div>

      {!discount ? (
        <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          <CircleCheck className="mt-0.5 size-4 shrink-0" />
          <p className="text-pretty">No discount requested — standard fee applies. Clear to approve.</p>
        </div>
      ) : discount.status === 'approved' ? (
        <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Discount verified</p>
            <p className="text-pretty text-success/90">{discount.detail}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
          <p className="flex items-center gap-1.5 text-sm font-medium text-warning">
            <Tag className="size-4" /> Discount requested — review needed
          </p>
          <p className="mt-1 text-pretty text-sm text-foreground/90">{discount.detail}</p>
          <div className="mt-3 border-t border-warning/30 pt-3">
            {reviewer ? (
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <UserCheck className="size-4" /> Sent to {reviewer} — notified
              </p>
            ) : (
              <>
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Assign a sales reviewer to approve this exception
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SALES_REVIEWERS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        onAssign(r)
                        toast.success(`Sales notified — ${r}`)
                      }}
                      className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SpecialPanel({ app }: { app: Application }) {
  const special = app.requests.find((r) => r.type === 'special-admission')
  if (!special) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-4 py-12 text-center">
        <CircleDashed className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">No special admission request</p>
        <p className="text-xs text-muted-foreground">
          This application follows the standard entry criteria.
        </p>
      </div>
    )
  }
  const cf = special.caseFile
  return (
    <div className="max-w-3xl rounded-lg border border-warning/40 bg-warning/5 p-4">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-4 text-warning" />
        <h2 className="text-sm font-semibold text-warning">Special admission case</h2>
      </div>
      <p className="mt-2 text-pretty text-sm text-foreground/90">{special.detail}</p>
      {cf && (
        <dl className="mt-4 grid gap-3 border-t border-warning/30 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Relevant experience</dt>
            <dd className="font-medium">{cf.experienceYears} years</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Role level</dt>
            <dd className="font-medium text-pretty">{cf.roleLevel}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">References</dt>
            <dd>
              <ul className="mt-0.5 flex flex-col gap-0.5">
                {cf.references.map((r) => (
                  <li key={r} className="flex items-center gap-1.5 text-pretty">
                    <Check className="size-3.5 shrink-0 text-success" /> {r}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Assessment</dt>
            <dd className="text-pretty">{cf.summary}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}

function DecisionStep({
  app,
  steps,
  approved,
  requiredApproved,
  onSubmit,
}: {
  app: Application
  steps: ReviewStep[]
  approved: Record<string, boolean>
  requiredApproved: boolean
  onSubmit: (level: 'conditional' | 'unconditional') => void
}) {
  const readiness = computeReadiness(app)
  const unconditional = canGoUnconditional(app)
  const reviewSteps = steps.filter((s) => s.kind !== 'decision')

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold">Review checklist</h2>
          <ul className="flex flex-col divide-y divide-border">
            {reviewSteps.map((s) => {
              const done = approved[s.kind]
              return (
                <li key={s.kind} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="text-pretty">{s.title}</span>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                      <CircleCheck className="size-4" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <CircleDashed className="size-4" />
                      {REQUIRED_STEPS.includes(s.kind) ? 'Not yet approved' : 'Optional'}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-1 text-sm font-semibold">Create & send offer</h2>
          <p className="mb-4 text-pretty text-xs text-muted-foreground">
            The verified record is written to CRM and the offer is sent through Enroller. A
            Conditional Offer is issued first; the Unconditional Offer and Enrolment Pack follow once
            the student meets every outstanding condition.
          </p>
          {!requiredApproved && (
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs font-medium text-warning">
              <CircleDashed className="size-3.5" /> Approve all required steps to enable submission
            </p>
          )}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              className="flex-1 gap-1.5"
              disabled={!requiredApproved}
              onClick={() => onSubmit('conditional')}
            >
              <Send className="size-4" /> Send Conditional Offer via Enroller
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              disabled={!requiredApproved || !unconditional}
              onClick={() => onSubmit('unconditional')}
            >
              <ShieldCheck className="size-4" /> Issue Unconditional Offer & Enrolment Pack
            </Button>
          </div>
          {!unconditional && (
            <p className="mt-2 text-[11px] text-muted-foreground text-pretty">
              Unconditional is unavailable while evidence or data is outstanding. Conditional offer
              carries the open items as conditions, reviewed by UP.
            </p>
          )}
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-4 text-sm font-semibold">Readiness</h2>
          <ReadinessGauges app={app} />
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            {readiness.fieldsDone} of {readiness.fieldsTotal} required fields confirmed.
          </p>
        </section>
      </div>
    </div>
  )
}

function Confirmation({
  app,
  level,
}: {
  app: Application
  level: 'conditional' | 'unconditional'
  }) {
  const openConds = app.conditions.filter((c) => c.status !== 'cleared').map((c) => c.label)
  const looConditions =
    level === 'unconditional'
      ? []
      : openConds.length > 0
        ? openConds
        : ['Application reviewed and approved by UP admissions']

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-success/12 text-success">
          <PartyPopper className="size-7" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-balance">
          {level === 'unconditional' ? 'Unconditional' : 'Conditional'} Offer issued
        </h1>
        <p className="mt-2 max-w-lg text-pretty text-sm text-muted-foreground">
          {app.studentName}&apos;s verified record has been written to Dynamics CRM. The{' '}
          {level === 'unconditional' ? 'unconditional' : 'conditional'} Letter of Offer has been
          generated and is ready to send{level === 'conditional' ? ', with conditions tracked to completion' : ''}.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-4">
        <ul className="flex flex-col gap-2 text-sm">
          <ConfirmRow label="Three initial checks passed" />
          <ConfirmRow label="Files, Contact, Opportunity, Workflow and Price Bundle recorded in CRM" />
          <ConfirmRow
            label={
              level === 'unconditional'
                ? 'Unconditional Offer and Enrolment Pack issued'
                : 'Conditional Offer sent through Enroller'
            }
          />
          <ConfirmRow label={`Intake: ${formatDate(app.course.intakeDate)} · ${app.course.brand}`} />
        </ul>
        {level === 'conditional' && (
          <p className="mt-3 border-t border-border pt-3 text-pretty text-xs text-muted-foreground">
            Next: wait for the student to meet the outstanding conditions, then issue the
            Unconditional Offer and Enrolment Pack.
          </p>
        )}
      </div>

      {level === 'unconditional' && (
        <div className="mt-6">
  <PaymentEnrolment app={app} />
  </div>
  )}

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">Letter of Offer</h2>
        <LetterOfOfferPanel
          data={{
            studentName: app.studentName,
            preId: app.preId,
            course: app.course,
            conditions: looConditions,
            bundle: app.bundle,
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button render={<Link href="/admissions" />} nativeButton={false} className="gap-1.5">
          <ArrowLeft className="size-4" /> Back to review queue
        </Button>
        <Button
          render={<Link href={`/admissions/${app.id}`} />}
          nativeButton={false}
          variant="outline"
          className="gap-1.5"
        >
          View application <ArrowRight className="size-4" />
        </Button>
      </div>
    </main>
  )
}

function ConfirmRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2">
      <CircleCheck className="size-4 shrink-0 text-success" />
      <span className="text-pretty">{label}</span>
    </li>
  )
}
