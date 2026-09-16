'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Sparkles,
  Loader,
  ShieldCheck,
  BadgeCheck,
  CircleCheck,
  IdCard,
  ArrowRight,
  Building2,
} from 'lucide-react'
import type { Application, Condition, Document } from '@/lib/types'
import { useStore, newId } from '@/lib/store'
import {
  simulateScoreReview,
  simulateProviderConfirm,
  type EnglishScore,
  type ProviderVerification,
} from '@/lib/simulate'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ConditionDropzone } from './condition-dropzone'
import { cn } from '@/lib/utils'

// Steps mirror the real-world flow:
//  1. drop      — agent drops the score report
//  2. reviewing — AI reads it and checks it against the entry requirement
//  3. validated — AI confirms the score meets requirements; prompt to verify
//  4. confirm   — show the candidate ID that will be used; agent confirms
//  5. verifying — provider API confirms authenticity
//  6. verified  — all evidence in; application moves to admissions review
type Step = 'drop' | 'reviewing' | 'validated' | 'confirm' | 'verifying' | 'verified'

const STEP_INDEX: Record<Step, number> = {
  drop: 0,
  reviewing: 0,
  validated: 0,
  confirm: 1,
  verifying: 1,
  verified: 2,
}

const STEP_LABELS = ['Validate score', 'Verify with provider', 'Complete']

export function EnglishValidationDialog({
  app,
  condition,
  open,
  onOpenChange,
}: {
  app: Application
  condition: Condition | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { updateApplication } = useStore()
  const [step, setStep] = useState<Step>('drop')
  const [fileName, setFileName] = useState<string>('')
  const [score, setScore] = useState<EnglishScore | null>(null)
  const [verification, setVerification] = useState<ProviderVerification | null>(null)

  useEffect(() => {
    if (open) {
      setStep('drop')
      setFileName('')
      setScore(null)
      setVerification(null)
    }
  }, [open])

  async function handleFile(name: string) {
    setFileName(name)
    setStep('reviewing')
    const res = await simulateScoreReview()
    setScore(res)
    setStep('validated')
  }

  async function runProviderConfirm() {
    setStep('verifying')
    const res = await simulateProviderConfirm()
    setVerification(res)
    setStep('verified')
    commit(res)
  }

  // Apply everything once the provider confirms: file the verified report,
  // clear the condition, mark the English requirement met, backfill the score
  // fields, route the application to admissions, and log the trail.
  function commit(v: ProviderVerification) {
    if (!score || !condition) return
    const ts = new Date().toISOString()
    const docId = newId('doc')
    const verifiedDoc: Document = {
      id: docId,
      type: 'EnglishTest',
      fileName: `EnglishTest_${app.preId}.pdf`,
      originalName: fileName || 'pte_score_report.pdf',
      language: 'English',
      status: 'checked',
      pages: 1,
      verifiedBy: v.provider,
      verifiedNote: `${score.testType} ${score.overall} — verified authentic via Pearson (${v.scoreReportCode})`,
    }
    const fieldMap: Record<string, string> = {
      english_test_type: score.testType,
      english_test_score: score.overall,
      english_test_date: score.testDate,
      english_test_expiry: score.expiry,
    }
    updateApplication(app.id, (a) => {
      const conditions = a.conditions.map((c) =>
        c.id === condition.id ? { ...c, status: 'cleared' as const, evidence: docId } : c,
      )
      return {
        ...a,
        route: 'review',
        documents: [...a.documents, verifiedDoc],
        conditions,
        requirements: a.requirements.map((r) =>
          r.category === 'english'
            ? {
                ...r,
                status: 'met' as const,
                evidence: docId,
                note: `${score.testType} ${score.overall} — verified via Pearson`,
              }
            : r,
        ),
        fields: a.fields.map((f) =>
          fieldMap[f.key] !== undefined
            ? { ...f, value: fieldMap[f.key], source: 'up' as const, status: 'verified' as const, sourceDoc: docId }
            : f,
        ),
        events: [
          ...a.events,
          {
            ts,
            actor: 'agent' as const,
            label: 'English score uploaded & validated',
            detail: `${score.testType} ${score.overall} — AI confirmed it meets the ${score.minRequired} entry requirement`,
            channel: 'agent-tool' as const,
            attachments: [{ name: verifiedDoc.originalName, addedTo: 'IELTS — English evidence' }],
          },
          {
            ts,
            actor: 'up' as const,
            label: 'English score verified with provider',
            detail: `Pearson confirmed candidate ${score.candidateId} · ${score.testType} ${score.overall} · ${v.scoreReportCode}`,
          },
          {
            ts,
            actor: 'up' as const,
            label: 'All evidence received — now with admissions to review',
            detail: 'The final condition cleared. The application has moved to UP admissions for the unconditional decision.',
          },
        ],
      }
    })
    toast.success('Score verified — application now with admissions to review')
  }

  const meets = score?.meetsRequirement ?? false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify English score</DialogTitle>
          <DialogDescription className="text-pretty">
            {condition?.label ?? 'English evidence'} — validate the score with AI, then confirm it
            is authentic with the test provider.
          </DialogDescription>
        </DialogHeader>

        <Stepper current={STEP_INDEX[step]} />

        {step === 'drop' && (
          <ConditionDropzone
            onFile={handleFile}
            title="Drop the PTE or IELTS score report"
            hint="PDF — the AI reads it and checks it against the entry requirement"
            icon={<Sparkles className="size-5" />}
          />
        )}

        {step === 'reviewing' && (
          <Centered
            icon={<Loader className="size-6 animate-spin text-ai" />}
            title="Reading the score report…"
            body="Extracting the test type, bands and overall score, then checking it against the course entry requirement."
          />
        )}

        {step === 'validated' && score && (
          <div className="flex flex-col gap-3">
            <div
              className={cn(
                'flex items-center gap-2 rounded-md border p-3',
                meets
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-destructive/30 bg-destructive/10 text-destructive',
              )}
            >
              <CircleCheck className="size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  {meets ? 'Validated — score meets requirements' : 'Score below the requirement'}
                </p>
                <p className="text-xs">
                  {score.testType} overall {score.overall} · minimum {score.minRequired}
                </p>
              </div>
            </div>

            <ScoreTable score={score} />

            {meets ? (
              <div className="rounded-md border border-border bg-muted/40 p-3">
                <p className="text-sm font-medium">Do you want to verify the score now?</p>
                <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                  We&apos;ll confirm authenticity directly with the test provider before the
                  condition clears.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1 gap-1.5" onClick={() => setStep('confirm')}>
                    Yes, verify now <ArrowRight className="size-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Not now
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setStep('drop')}>
                Upload a different report
              </Button>
            )}
          </div>
        )}

        {step === 'confirm' && score && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-pretty">
              We&apos;ll confirm this score with{' '}
              <span className="font-medium text-foreground">Pearson Score Verification</span> using
              the candidate&apos;s registration ID.
            </p>
            <div className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
              <span className="grid size-9 place-items-center rounded-full bg-muted">
                <IdCard className="size-5 text-muted-foreground" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Candidate ID / registration number</p>
                <p className="font-mono text-sm font-semibold">{score.candidateId}</p>
              </div>
            </div>
            <Button className="gap-1.5" onClick={runProviderConfirm}>
              <ShieldCheck className="size-4" /> Confirm with Pearson
            </Button>
          </div>
        )}

        {step === 'verifying' && (
          <Centered
            icon={<Loader className="size-6 animate-spin text-info" />}
            title="Confirming with Pearson Score Verification…"
            body="Checking the report against the provider's record to confirm it is authentic and unaltered."
          />
        )}

        {step === 'verified' && score && verification && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-success">
              <ShieldCheck className="size-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Verified authentic</p>
                <p className="text-xs">
                  {verification.provider} · {verification.scoreReportCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info/5 p-3">
              <Building2 className="mt-0.5 size-4 shrink-0 text-info" />
              <p className="text-sm text-pretty">
                All evidence has now been received. The application has moved to{' '}
                <span className="font-medium text-foreground">UP admissions</span> to review for the
                unconditional decision.
              </p>
            </div>

            <Button className="gap-1.5" onClick={() => onOpenChange(false)}>
              <BadgeCheck className="size-4" /> Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5" aria-label="Verification progress">
      {STEP_LABELS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
                done && 'bg-success text-success-foreground',
                active && 'bg-primary text-primary-foreground',
                !done && !active && 'bg-muted text-muted-foreground',
              )}
            >
              {done ? <CircleCheck className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                'truncate text-[11px]',
                active ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function Centered({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      {icon}
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground text-pretty">{body}</p>
    </div>
  )
}

function ScoreTable({ score }: { score: EnglishScore }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-md border border-border bg-card p-3 text-sm">
      <div className="col-span-2 flex items-center justify-between border-b border-dashed border-border pb-2">
        <dt className="text-muted-foreground">Test</dt>
        <dd className="font-medium">{score.testType}</dd>
      </div>
      {score.bands.map((b) => (
        <div key={b.label} className="flex items-center justify-between">
          <dt className="text-muted-foreground">{b.label}</dt>
          <dd className="font-medium">{b.value}</dd>
        </div>
      ))}
      <div className="col-span-2 mt-1 flex items-center justify-between border-t border-dashed border-border pt-2">
        <dt className="text-muted-foreground">Overall</dt>
        <dd className="text-base font-semibold text-foreground">{score.overall}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Candidate</dt>
        <dd className="font-mono text-xs">{score.candidateId}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-muted-foreground">Valid until</dt>
        <dd className="font-mono text-xs">{score.expiry}</dd>
      </div>
    </dl>
  )
}
