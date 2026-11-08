'use client'

import { useId, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Download,
  Eye,
  FileCheck2,
  FileSignature,
  Loader,
  Send,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  Upload,
  Users,
} from 'lucide-react'
import { RequestStatusIcon } from './request-status-icon'
import { ADMISSIONS_REVIEW_CONDITION, useWizard } from '@/lib/wizard'
import { useStore } from '@/lib/store'
import { answerCounts, blockingItems, computeRoute, openAnswerFields } from '@/lib/readiness'
import { DECLARATION_LABELS, PRIVACY_NOTE, TERMS_SUMMARY } from '@/lib/declarations'
import { counsellorName, issuingAgentFor } from '@/lib/fixtures'
import { withCrmPush } from '@/lib/crm'
import {
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  PURPOSE_MIN_CHARS,
  RISK_META,
  RISK_REVIEW_CONDITION,
  RISK_TIPS,
  nationalityOf,
  offerOutcomeFor,
  UP_VERIFICATION_CONDITION,
  evidenceRequired,
  riskEvidenceGaps,
  visaRiskFor,
  type OfferOutcome,
  type VisaRisk,
} from '@/lib/eligibility'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { LetterOfOfferPanel, LetterOfOfferPreviewDialog } from '@/components/letter-of-offer'
import { PlanStrip } from '@/components/wizard/plan-strip'
import { alternativeBlocks, pathwayLine } from '@/lib/study-plan'
import { ScholarshipRequest } from '@/components/wizard/scholarship-request'
import { getAgentProfile, grantedScholarships, offerPermissionFor } from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'
import type { Application, Condition, IssuingAgent } from '@/lib/types'

const AGENT_FIELDS: { key: keyof Omit<IssuingAgent, 'confirmedAt'>; label: string; type?: string }[] = [
  { key: 'name', label: 'Agent name' },
  { key: 'agency', label: 'Agency' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'agentCode', label: 'Agent code' },
]

type Phase = 'review' | 'generating' | 'done'

const OUTCOME_COPY: Record<OfferOutcome, { title: string; detail: string }> = {
  conditional: {
    title: 'Conditional offer',
    detail:
      'Generated on submit with the conditions below and emailed to the student by default. Only UP admissions can make it unconditional, once the conditions are verified.',
  },
  withheld: {
    title: 'No offer yet',
    detail:
      'Refusal risk is 40% or higher: UP admissions reviews the application before any offer is created. They may issue a conditional offer, ask for more, or decline.',
  },
}

export function StepReview() {
  const wizard = useWizard()
  const {
    draft,
    readiness,
    notes,
    setNotes,
    fastTrack,
    declarations,
    setDeclaration,
    riskEvidence,
    setRiskEvidence,
    addFundsProof,
    documents,
    goToStep,
    focusField,
  } = wizard
  const { addApplication, activeUserId } = useStore()
  const [phase, setPhase] = useState<Phase>('review')
  const [created, setCreated] = useState<Application | null>(null)
  const [agent, setAgent] = useState<IssuingAgent>(() => issuingAgentFor(activeUserId))
  // Default: UP emails the offer to the student on submit; the agent can opt out.
  const [emailOnSubmit, setEmailOnSubmit] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const studentEmail = draft.fields.find((f) => f.key === 'email')?.value.trim() || undefined
  const agentReady = AGENT_FIELDS.every((f) => agent[f.key].trim() !== '')
  const profile = getAgentProfile(activeUserId)
  const permission = offerPermissionFor(profile)
  const available = grantedScholarships(profile)
  const [requested, setRequested] = useState<string[]>([])
  const [scholarshipReason, setScholarshipReason] = useState('')

  const risk = visaRiskFor(nationalityOf(draft), wizard.course?.levelGroup)
  const level = risk?.level ?? 'medium'
  // Medium shows the evidence section but never blocks; high must complete it.
  const showEvidence = risk !== null && risk.level !== 'low'
  const needsEvidence = risk !== null && evidenceRequired(risk.level)
  const evidenceGaps = needsEvidence ? riskEvidenceGaps(riskEvidence) : []
  const evidenceProvided = 4 - riskEvidenceGaps(riskEvidence).length
  const purposeLength = riskEvidence.purpose.trim().length

  const studentConditions = draft.conditions.filter((c) => c.label !== ADMISSIONS_REVIEW_CONDITION)
  const outcome: OfferOutcome = risk ? offerOutcomeFor(level) : 'conditional'
  const offerConditions: Condition[] =
    outcome === 'conditional'
      ? studentConditions.length > 0
        ? studentConditions
        : [
            {
              id: 'draft-cond-verify',
              label: UP_VERIFICATION_CONDITION,
              owner: 'up',
              status: 'open',
              createdFrom: 'system',
            },
          ]
      : [
            ...draft.conditions,
            ...(needsEvidence
              ? [
                  {
                    id: 'draft-cond-risk',
                    label: RISK_REVIEW_CONDITION,
                    owner: 'up' as const,
                    status: 'open' as const,
                    createdFrom: 'system' as const,
                  },
                ]
              : []),
          ]

  const noteRoute = computeRoute(draft) === 'review'
  const permissionRoute = !permission.canIssueLoo
  const toReview = outcome === 'withheld' || noteRoute || permissionRoute
  const blocking = blockingItems(draft)
  const counts = answerCounts(draft)
  const requirementBlockers = blocking.length - [counts.conflicts, counts.toConfirm, counts.missing].filter((n) => n > 0).length
  const declared = declarations.terms && declarations.consultant
  const canSubmit =
    !wizard.assessment.blocked &&
    permission.canSubmit &&
    declared &&
    agentReady &&
    evidenceGaps.length === 0 &&
    (toReview || readiness.looReady)
  const fundsDoc = documents.find((d) => d.id === riskEvidence.fundsDocId)

  const jumpToAnswers = (anchor: string) => {
    goToStep(4)
    setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const jumpToField = (key: string) => {
    focusField(key)
    goToStep(4)
  }

  const submitLabel = toReview
    ? outcome === 'withheld'
      ? 'Submit for visa risk review'
      : 'Submit to UP for review'
    : 'Submit and issue conditional offer'

  const todo: string[] = (() => {
    if (!permission.canSubmit) return [permission.reason ?? 'You cannot submit this application.']
    const items: string[] = []
    const n = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
    if (!toReview && !readiness.looReady) {
      if (counts.conflicts > 0) items.push(`Resolve ${n(counts.conflicts, 'conflicting answer')}`)
      if (counts.toConfirm > 0) items.push(`Confirm ${n(counts.toConfirm, 'answer')} read from documents`)
      if (counts.missing > 0) items.push(`Complete ${n(counts.missing, 'missing answer')}`)
      if (requirementBlockers > 0) items.push(`Upload ${n(requirementBlockers, 'missing document')}`)
    }
    if (evidenceGaps.length > 0) items.push(`Provide visa risk evidence: ${evidenceGaps.join(', ').toLowerCase()}`)
    if (!agentReady) items.push('Complete your issuing agent details')
    if (!declared) items.push('Accept both declarations')
    return items
  })()

  function submit() {
    if (!canSubmit) return
    const base = wizard.buildApplication(activeUserId, 'psl', counsellorName(activeUserId))
    const ts = new Date().toISOString()
    const fastTrackEvent = fastTrack
      ? [{ ts, actor: 'agent' as const, label: 'Marked fast track' }]
      : []
    const scholarshipEvent = requested.length
      ? [
          {
            ts,
            actor: 'agent' as const,
            label: `Scholarship requested: ${available
              .filter((s) => requested.includes(s.id))
              .map((s) => s.name)
              .join(', ')}`,
            ...(scholarshipReason.trim() ? { detail: scholarshipReason.trim() } : {}),
          },
        ]
      : []
    const app: Application = {
      ...base,
      issuingAgent: { ...agent, confirmedAt: ts },
      conditions: offerConditions.map((c, i) => ({ ...c, id: `${base.id}-c${i}` })),
      riskEvidence:
        needsEvidence && risk
          ? { ...riskEvidence, level: risk.level, approvalRate: risk.approvalRate }
          : undefined,
    }

    if (toReview) {
      const submitted: Application = {
        ...app,
        stage: 'Submitted',
        route: 'review',
        events: [
          {
            ts,
            actor: 'agent',
            label:
              outcome === 'withheld'
                ? 'Submitted for visa risk review — no offer issued'
                : permissionRoute && !noteRoute
                  ? 'Sent to UP — agent cannot issue a conditional offer'
                  : 'Sent to UP for review',
          },
          ...fastTrackEvent,
          ...scholarshipEvent,
        ],
      }
      addApplication(submitted)
      setCreated(submitted)
      setPhase('done')
      return
    }

    setPhase('generating')
    setTimeout(() => {
      const issued = withCrmPush({
        ...app,
        stage: 'Conditional offer',
        route: 'auto',
        events: [
          { ts, actor: 'agent', label: 'Application submitted' },
          ...fastTrackEvent,
          ...scholarshipEvent,
          {
            ts,
            actor: 'up',
            label: 'Conditional offer issued',
          },
          { ts, actor: 'up', label: 'Pushed to Dynamics 365' },
          ...(emailOnSubmit
            ? [{ ts, actor: 'up' as const, label: 'Letter of Offer emailed to the student (agent copied)' }]
            : []),
        ],
      })
      addApplication(issued)
      setCreated(issued)
      setPhase('done')
    }, 1500)
  }

  if (phase === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-16 text-center">
        <Loader className="size-6 animate-spin text-ai" />
        <p className="text-sm font-medium">Generating {OUTCOME_COPY[outcome].title}…</p>
      </div>
    )
  }

  if (phase === 'done' && created) {
    const issued = created.stage !== 'Submitted'
    return (
      <div className="flex flex-col gap-4">
        <div
          className={cn(
            'flex items-start gap-2 rounded-md border p-4',
            issued ? 'border-success/30 bg-success/5' : 'border-info/30 bg-info/5',
          )}
        >
          {issued ? (
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" />
          ) : (
            <Users className="mt-0.5 size-5 shrink-0 text-info" />
          )}
          <div>
            <p className="font-medium">
              {issued
                ? 'Conditional offer issued'
                : outcome === 'withheld'
                  ? 'Sent to admissions for visa risk review'
                  : 'Sent to admissions review'}
            </p>
            <p className="text-sm text-muted-foreground">
              {created.studentName} · {created.course.programmeName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {issued
                ? emailOnSubmit
                  ? `Emailed to ${studentEmail ?? 'the student'} with you in copy, and pushed to Dynamics 365.`
                  : 'Not emailed to the student. Download it or copy the secure link below. It is also pushed to Dynamics 365.'
                : 'UP admissions will come back to you in this application. Nothing goes to the student yet.'}
            </p>
          </div>
        </div>

        {issued && created.conditions.filter((c) => c.owner === 'student').length > 0 && (
          <section className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">To go unconditional, the student needs to</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {created.conditions
                .filter((c) => c.owner === 'student')
                .map((c) => (
                  <li key={c.id} className="flex items-start gap-1.5">
                    <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden />
                    <span className="text-pretty">{c.label}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {issued && (
          <LetterOfOfferPanel
            defaultEmail={emailOnSubmit}
            data={{
              studentName: created.studentName,
              preId: created.preId,
              course: created.course,
              conditions: created.conditions.map((c) => c.label),
              hideCosts: true,
              agent: created.issuingAgent,
              studentEmail,
              pathway: pathwayLine(wizard.plan) ?? undefined,
              alternatives: alternativeBlocks(wizard.plan).map((b) => b.programme.programmeName),
            }}
          />
        )}

        <div className="flex gap-2">
          <Button
            render={<Link href={`/applications/${created.id}`} />}
            nativeButton={false}
            className="gap-1.5"
          >
            Complete &amp; Send application <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/" />} nativeButton={false}>
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const primaryProgramme = wizard.course?.programmeName ?? 'No course chosen'
  const riskLabel = risk ? (risk.level === 'low' ? 'Low risk' : RISK_META[risk.level].label) : 'Not assessed'
  const docBlockers = blocking.filter((b) => !/to resolve$|to confirm$|to complete$/.test(b))
  const missingBySection = Array.from(
    openAnswerFields(draft).reduce((groups, f) => {
      groups.set(f.section, [...(groups.get(f.section) ?? []), f])
      return groups
    }, new Map<string, ReturnType<typeof openAnswerFields>>()),
  )
  const attentionCount =
    (counts.conflicts > 0 ? 1 : 0) + (counts.toConfirm > 0 ? 1 : 0) + missingBySection.length + docBlockers.length

  return (
    <div className="flex flex-col gap-6">
      {permission.reason && (
        <section
          role={permission.canSubmit ? 'status' : 'alert'}
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4',
            permission.canSubmit
              ? 'border-info/30 bg-info/5'
              : 'border-destructive/30 bg-destructive/5',
          )}
        >
          {permission.canSubmit ? (
            <Users className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
          ) : (
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
          )}
          <div>
            <h3 className="text-sm font-semibold">
              {permission.canSubmit ? 'Goes to UP admissions review' : 'You cannot submit'}
            </h3>
            <p className="text-sm text-pretty">{permission.reason}</p>
          </div>
        </section>
      )}

      {blocking.length > 0 && !toReview && (
        <section aria-labelledby="attention-heading" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 id="attention-heading" className="flex items-center gap-2 text-base font-semibold">
              <CircleAlert className="size-4 text-warning" aria-hidden />
              Needs your attention
            </h3>
            <span className="text-sm text-muted-foreground tabular-nums">
              {attentionCount} item{attentionCount === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-warning/40 bg-card">
            {counts.conflicts > 0 && (
              <AttentionRow
                title={`${counts.conflicts} conflicting answer${counts.conflicts === 1 ? '' : 's'}`}
                detail="Documents disagree with each other. Choose the correct value."
                action="Resolve"
                onClick={() => jumpToAnswers('triage-conflicts')}
              />
            )}
            {counts.toConfirm > 0 && (
              <AttentionRow
                title={`${counts.toConfirm} answer${counts.toConfirm === 1 ? '' : 's'} read from documents`}
                detail="Check each value matches the source document."
                action="Confirm"
                onClick={() => jumpToAnswers('triage-confirm')}
              />
            )}
            {missingBySection.map(([section, fields]) => (
              <AttentionRow
                key={section}
                title={`${section}: ${fields.length} missing answer${fields.length === 1 ? '' : 's'}`}
                detail={fields.map((f) => f.label).join(', ')}
                action={fields.length === 1 ? 'Add answer' : 'Add answers'}
                onClick={() => jumpToField(fields[0].key)}
              />
            ))}
            {docBlockers.map((b) => (
              <AttentionRow
                key={b}
                title={b}
                detail="Required document"
                action="Upload"
                onClick={() => goToStep(2)}
              />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="review-heading" className="flex flex-col gap-3">
        <h3 id="review-heading" className="text-base font-semibold">
          Review the application
        </h3>
        <div className="flex flex-col gap-2">
          <ReviewSection title="Study plan" summary={primaryProgramme}>
            <PlanStrip plan={wizard.plan} />
          </ReviewSection>

          <ReviewSection
            title="Visa risk"
            summary={showEvidence ? `${riskLabel} · evidence ${evidenceProvided} of 4` : riskLabel}
            status={
              evidenceGaps.length > 0 || !risk ? 'attention' : risk.level === 'low' ? 'ok' : 'risk'
            }
            defaultOpen={needsEvidence || !risk}
          >
            <div className="flex flex-col gap-4">
              <RiskAssessment risk={risk} outcome={outcome} />
              {showEvidence && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium">
                    Visa risk evidence{' '}
                    <span className="font-normal text-muted-foreground">
                      {needsEvidence
                        ? '(required)'
                        : '(optional — gives INZ fewer reasons to query later)'}
                    </span>
                  </p>
                  <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
                    <EvidenceItem
                      done={purposeLength >= PURPOSE_MIN_CHARS}
                      inProgress={purposeLength > 0}
                      title={RISK_TIPS[0].title}
                      hint={RISK_TIPS[0].detail}
                    >
                      <Textarea
                        value={riskEvidence.purpose}
                        onChange={(e) => setRiskEvidence({ purpose: e.target.value })}
                        rows={4}
                        aria-label="Purpose of travel statement"
                        placeholder="Why this course, why New Zealand, why now, and how it leads to the student’s career plan at home…"
                      />
                      <p
                        className={cn(
                          'mt-1 text-xs tabular-nums',
                          purposeLength >= PURPOSE_MIN_CHARS ? 'text-success' : 'text-muted-foreground',
                        )}
                      >
                        {purposeLength >= PURPOSE_MIN_CHARS
                          ? 'Statement added'
                          : purposeLength === 0
                            ? `At least ${PURPOSE_MIN_CHARS} characters`
                            : `${PURPOSE_MIN_CHARS - purposeLength} more characters needed`}
                      </p>
                    </EvidenceItem>

                    <EvidenceItem
                      done={riskEvidence.refusalsAddressed}
                      title={RISK_TIPS[1].title}
                      hint={RISK_TIPS[1].detail}
                    >
                      <label className="flex items-start gap-2 text-sm leading-relaxed">
                        <input
                          type="checkbox"
                          checked={riskEvidence.refusalsAddressed}
                          onChange={(e) => setRiskEvidence({ refusalsAddressed: e.target.checked })}
                          className="mt-1 size-4 shrink-0 accent-primary"
                        />
                        <span className="text-pretty">
                          I have explained any study gaps, course step-down, home-country ties and
                          earlier refusals in the statement above.
                        </span>
                      </label>
                    </EvidenceItem>

                    <EvidenceItem
                      done={Boolean(fundsDoc)}
                      title={RISK_TIPS[3].title}
                      hint={RISK_TIPS[3].detail}
                    >
                      {fundsDoc ? (
                        <p className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                          <FileCheck2 className="size-4 shrink-0 text-success" aria-hidden />
                          <span className="truncate">{fundsDoc.fileName}</span>
                          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                            {fundsDoc.pages} pages · checked
                          </span>
                        </p>
                      ) : (
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={addFundsProof}>
                          <Upload className="size-3.5" aria-hidden /> Add bank statement (demo)
                        </Button>
                      )}
                    </EvidenceItem>

                    <EvidenceItem
                      done={riskEvidence.fundsConfirmed}
                      title={RISK_TIPS[2].title}
                      hint={RISK_TIPS[2].detail}
                    >
                      <label className="flex items-start gap-2 text-sm leading-relaxed">
                        <input
                          type="checkbox"
                          checked={riskEvidence.fundsConfirmed}
                          onChange={(e) => setRiskEvidence({ fundsConfirmed: e.target.checked })}
                          className="mt-1 size-4 shrink-0 accent-primary"
                        />
                        <span className="text-pretty">
                          I have checked the funds cover first-year tuition plus NZD 20,000 living
                          costs, and the source of funds is genuine.
                        </span>
                      </label>
                    </EvidenceItem>
                  </div>
                </div>
              )}
            </div>
          </ReviewSection>

          <ReviewSection
            title="Issuing agent"
            summary={agentReady ? `${agent.name} · ${agent.agency}` : 'Details needed'}
            status={agentReady ? 'ok' : 'attention'}
            defaultOpen={!agentReady}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {AGENT_FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label htmlFor={`agent-${f.key}`} className="text-xs font-medium text-muted-foreground">
                    {f.label}
                  </label>
                  <Input
                    id={`agent-${f.key}`}
                    type={f.type ?? 'text'}
                    value={agent[f.key]}
                    onChange={(e) => setAgent((a) => ({ ...a, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground sm:col-span-2">Printed on the Letter of Offer.</p>
            </div>
          </ReviewSection>
        </div>
      </section>

      <section aria-labelledby="requests-heading" className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h3 id="requests-heading" className="text-base font-semibold">
            Requests to UP admissions{' '}
            <span className="text-sm font-normal text-muted-foreground">(optional)</span>
          </h3>
          <p className="text-sm text-muted-foreground text-pretty">
            Anything added here goes to UP admissions with the application.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <ReviewSection
            title="Note to admissions"
            summary={notes.trim() ? 'Note added · sends the application to review' : 'Not added'}
            status={notes.trim() ? 'requested' : 'empty'}
            defaultOpen={notes.trim() !== ''}
          >
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              aria-label="Note to admissions"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Adding a note sends the application to UP admissions review instead of issuing an offer.
            </p>
          </ReviewSection>

          <ScholarshipRequest
            available={available}
            selected={requested}
            onToggle={(id, on) => setRequested((r) => (on ? [...r, id] : r.filter((x) => x !== id)))}
            reason={scholarshipReason}
            onReason={setScholarshipReason}
          />
        </div>
      </section>

      <section aria-labelledby="declarations-heading" className="rounded-lg border border-border bg-card p-4">
        <h3 id="declarations-heading" className="mb-3 text-base font-semibold">
          Declarations
        </h3>
        <details className="mb-3 rounded-md bg-muted/50 px-3 py-2 text-sm">
          <summary className="cursor-pointer font-medium">Terms and conditions summary</summary>
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
            {TERMS_SUMMARY.map((t) => (
              <li key={t} className="text-pretty">
                {t}
              </li>
            ))}
          </ul>
        </details>
        <div className="flex flex-col gap-2.5">
          {(['terms', 'consultant'] as const).map((key) => (
            <label key={key} className="flex items-start gap-2 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={declarations[key]}
                onChange={(e) => setDeclaration(key, e.target.checked)}
                className="mt-1 size-4 shrink-0 accent-primary"
              />
              <span className="text-pretty">{DECLARATION_LABELS[key]}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-pretty">{PRIVACY_NOTE}</p>
      </section>

      <OutcomeCard
        outcome={outcome}
        toReview={toReview}
        permissionRoute={permissionRoute}
        conditions={offerConditions}
        emailOnSubmit={emailOnSubmit}
        onEmailChange={setEmailOnSubmit}
        studentEmail={studentEmail}
        onPreview={() => setPreviewOpen(true)}
        onDownload={() => toast.success('Draft Letter of Offer downloaded (PDF)')}
      />

      <div
        className={cn(
          'flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
          canSubmit ? 'border-success/40 bg-success/5' : 'border-border bg-card',
        )}
      >
        {canSubmit ? (
          <p className="flex items-start gap-2 text-sm text-pretty">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
            {toReview
              ? 'Everything UP needs is here.'
              : emailOnSubmit
                ? 'Ready. The offer is created and emailed to the student when you submit.'
                : 'Ready. The offer is created when you submit, for you to send.'}
          </p>
        ) : (
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-sm font-medium">Before you can submit</p>
            <ul className="flex flex-col gap-1">
              {todo.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden />
                  <span className="text-pretty">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button size="lg" className="w-fit shrink-0" disabled={!canSubmit} onClick={submit}>
          {submitLabel}
        </Button>
      </div>

      {!toReview && (
        <LetterOfOfferPreviewDialog
          draft
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          data={{
            studentName: draft.studentName,
            preId: draft.preId,
            course: wizard.course ?? undefined,
            conditions: offerConditions.map((c) => c.label),
            hideCosts: true,
            agent,
            studentEmail,
            pathway: pathwayLine(wizard.plan) ?? undefined,
            alternatives: alternativeBlocks(wizard.plan).map((b) => b.programme.programmeName),
          }}
        />
      )}
    </div>
  )
}

const CONDITION_OWNER: Record<Condition['owner'], string> = {
  student: 'Student provides',
  agent: 'You provide',
  up: 'UP verifies',
}

function OutcomeCard({
  outcome,
  toReview,
  permissionRoute,
  conditions,
  emailOnSubmit,
  onEmailChange,
  studentEmail,
  onPreview,
  onDownload,
}: {
  outcome: OfferOutcome
  toReview: boolean
  permissionRoute: boolean
  conditions: Condition[]
  emailOnSubmit: boolean
  onEmailChange: (v: boolean) => void
  studentEmail?: string
  onPreview: () => void
  onDownload: () => void
}) {
  if (outcome === 'withheld') {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">No offer is created yet</h3>
          <p className="text-sm leading-relaxed text-pretty">
            Agents can only issue an offer when the INZ refusal risk is under 40%. UP admissions
            reviews this application first and will contact you with a decision.
          </p>
        </div>
      </section>
    )
  }

  if (toReview) {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Users className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">UP admissions creates the offer</h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {permissionRoute
              ? 'No offer is generated from your account. UP creates it after review, including pricing and any approved scholarship.'
              : 'Your note sends this to admissions review. UP creates the offer after reading it.'}
          </p>
        </div>
      </section>
    )
  }

  const title = 'Conditional Letter of Offer'

  return (
    <section
      aria-labelledby="outcome-heading"
      className="overflow-hidden rounded-lg border-2 border-primary/50 bg-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-primary/5 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
            <FileSignature className="size-5" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-xs font-medium text-muted-foreground">Created when you submit</p>
            <h3 id="outcome-heading" className="text-base font-semibold">
              {title}
            </h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onPreview}>
            <Eye className="size-3.5" aria-hidden /> View letter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onDownload}>
            <Download className="size-3.5" aria-hidden /> Download draft
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {conditions.length > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {conditions.length} condition{conditions.length === 1 ? '' : 's'} to go unconditional
            </p>
            <ol className="flex flex-col gap-1.5">
              {conditions.map((c, i) => (
                <li key={c.id} className="flex items-start gap-3 text-sm">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-pretty">{c.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{CONDITION_OWNER[c.owner]}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-sm text-pretty">No conditions. The student can accept straight away.</p>
        )}

        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
            emailOnSubmit ? 'border-primary/40 bg-primary/5' : 'border-border',
          )}
        >
          <input
            type="checkbox"
            checked={emailOnSubmit}
            onChange={(e) => onEmailChange(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Send className="size-3.5 text-primary" aria-hidden />
              Email the letter to the student when I submit
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {emailOnSubmit
                ? `UP admissions sends it to ${studentEmail || 'the student’s email on file'} and copies you.`
                : 'Nothing is sent. You download the letter or share a secure link yourself.'}
            </span>
          </span>
        </label>

        <p className="text-xs text-muted-foreground text-pretty">
          Agent-issued conditional offers don&apos;t include fees. Only UP admissions issues the
          unconditional offer, with pricing. The letter is also pushed to Dynamics 365.
        </p>
      </div>
    </section>
  )
}

function ReviewSection({
  title,
  summary,
  status,
  defaultOpen = false,
  children,
}: {
  title: string
  summary: string
  status?: 'ok' | 'attention' | 'risk' | 'requested' | 'empty'
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <section className="rounded-lg border border-border bg-card">
      <h4>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={id}
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          {status === 'attention' ? (
            <CircleAlert className="size-4 shrink-0 text-warning" aria-label="Needs attention" />
          ) : status === 'risk' ? (
            <TriangleAlert className="size-4 shrink-0 text-warning" aria-label="Risk identified" />
          ) : status === 'ok' ? (
            <CircleCheck className="size-4 shrink-0 text-success" aria-label="Complete" />
          ) : status === 'requested' || status === 'empty' ? (
            <RequestStatusIcon requested={status === 'requested'} />
          ) : (
            <span className="size-4 shrink-0" aria-hidden />
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="shrink-0 text-sm font-semibold">{title}</span>
            <span className="truncate text-sm text-muted-foreground">{summary}</span>
          </span>
          <ChevronDown
            className={cn('size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>
      </h4>
      {open && (
        <div id={id} className="border-t border-border p-4">
          {children}
        </div>
      )}
    </section>
  )
}

function AttentionRow({
  title,
  detail,
  action,
  onClick,
}: {
  title: string
  detail: string
  action: string
  onClick: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-pretty">{title}</span>
        <span className="text-xs text-muted-foreground text-pretty">{detail}</span>
      </span>
      <Button variant="outline" size="sm" className="shrink-0 gap-1" onClick={onClick}>
        {action}
        <ArrowRight className="size-3.5" aria-hidden />
      </Button>
    </li>
  )
}

function RiskAssessment({ risk, outcome }: { risk: VisaRisk | null; outcome: OfferOutcome }) {
  if (!risk) {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/6 p-4">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        <div>
          <h3 className="text-sm font-semibold text-warning">Risk can&apos;t be assessed yet</h3>
          <p className="text-sm text-pretty">
            Country of citizenship is missing. Upload the passport or add it in Student details.
          </p>
        </div>
      </section>
    )
  }

  const tone =
    risk.level === 'high'
      ? { box: 'border-destructive/30 bg-destructive/6', text: 'text-destructive', bar: 'bg-destructive' }
      : risk.level === 'medium'
        ? { box: 'border-warning/30 bg-warning/6', text: 'text-warning', bar: 'bg-warning' }
        : { box: 'border-success/30 bg-success/6', text: 'text-success', bar: 'bg-success' }
  const Icon = risk.level === 'low' ? ShieldCheck : ShieldAlert
  const headline =
    risk.level === 'low' ? 'Healthy application' : RISK_META[risk.level].label

  return (
    <section aria-label="Visa risk assessment" className={cn('rounded-lg border p-4', tone.box)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('mt-0.5 size-6 shrink-0', tone.text)} aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className={cn('text-base font-semibold', tone.text)}>{headline}</h3>
            <span className="text-xs font-medium text-muted-foreground">
              Outcome: {OUTCOME_COPY[outcome].title}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-pretty">
            {risk.nationality} × {COURSE_TYPE_LABEL[risk.courseType]}: about{' '}
            <strong className="tabular-nums">{risk.refusalRate}%</strong> of comparable student
            visa applications are refused by INZ.
            {risk.level === 'low'
              ? ' This country and course combination has a low refusal rate.'
              : risk.level === 'medium'
                ? ' UP admissions reviews it before any offer is created. The evidence below is optional, but adding it strengthens the application.'
                : ' The evidence below is required. UP reviews it before any offer is created.'}
          </p>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={risk.refusalRate}
            aria-label="Refusal rate"
          >
            <div className={cn('h-full rounded-full', tone.bar)} style={{ width: `${risk.refusalRate}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
        </div>
      </div>
    </section>
  )
}

function EvidenceItem({
  done,
  inProgress = false,
  title,
  hint,
  children,
  }: {
  done: boolean
  inProgress?: boolean
  title: string
  hint: string
  children: React.ReactNode
  }) {
  return (
  <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
  <div className="flex items-start gap-2">
  {done ? (
  <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-label="Provided" />
  ) : inProgress ? (
  <span
  className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-warning border-r-transparent"
  aria-label="In progress"
  />
  ) : (
          <span className="mt-0.5 size-4 shrink-0 rounded-full border border-border" aria-label="Not provided" />
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground text-pretty">{hint}</p>
        </div>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
