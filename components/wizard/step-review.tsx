'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  FileCheck2,
  Loader,
  ShieldAlert,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'
import { ADMISSIONS_REVIEW_CONDITION, useWizard } from '@/lib/wizard'
import { useStore } from '@/lib/store'
import { answerCounts, blockingItems, computeRoute } from '@/lib/readiness'
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
  riskEvidenceGaps,
  visaRiskFor,
  type OfferOutcome,
  type VisaRisk,
} from '@/lib/eligibility'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { LetterOfOfferPanel } from '@/components/letter-of-offer'
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
  unconditional: {
    title: 'Unconditional Letter of Offer',
    detail:
      'Generated on submit and pushed to Dynamics 365. You download it or choose to email it; nothing goes to the student automatically.',
  },
  conditional: {
    title: 'Conditional Letter of Offer',
    detail:
      'Generated on submit with the conditions below, for you to download or email. Admissions verifies the conditions before it becomes unconditional.',
  },
  withheld: {
    title: 'No Letter of Offer yet',
    detail:
      'High refusal risk: admissions reviews the evidence before any offer is created. They may issue a conditional offer, ask for more, or decline.',
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
    setFastTrack,
    declarations,
    setDeclaration,
    riskEvidence,
    setRiskEvidence,
    addFundsProof,
    documents,
    goToStep,
  } = wizard
  const { addApplication, activeUserId } = useStore()
  const [phase, setPhase] = useState<Phase>('review')
  const [created, setCreated] = useState<Application | null>(null)
  const [noteOpen, setNoteOpen] = useState(notes.trim() !== '')
  const [agent, setAgent] = useState<IssuingAgent>(() => issuingAgentFor(activeUserId))
  const [agentEditing, setAgentEditing] = useState(false)
  const agentReady = AGENT_FIELDS.every((f) => agent[f.key].trim() !== '')
  const profile = getAgentProfile(activeUserId)
  const permission = offerPermissionFor(profile)
  const available = grantedScholarships(profile)
  const [requested, setRequested] = useState<string[]>([])
  const [scholarshipReason, setScholarshipReason] = useState('')

  const risk = visaRiskFor(nationalityOf(draft), wizard.course?.levelGroup)
  const level = risk?.level ?? 'elevated'
  const needsEvidence = risk !== null && risk.level !== 'low'
  const evidenceGaps = needsEvidence ? riskEvidenceGaps(riskEvidence) : []
  const purposeLength = riskEvidence.purpose.trim().length

  const studentConditions = draft.conditions.filter((c) => c.label !== ADMISSIONS_REVIEW_CONDITION)
  const outcome: OfferOutcome = risk
    ? offerOutcomeFor(level, studentConditions.length > 0)
    : 'conditional'
  const offerConditions: Condition[] =
    outcome === 'unconditional'
      ? []
      : outcome === 'conditional' && risk?.level === 'low'
        ? studentConditions
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
    permission.canSubmit &&
    declared &&
    agentReady &&
    evidenceGaps.length === 0 &&
    (toReview || readiness.looReady)
  const fundsDoc = documents.find((d) => d.id === riskEvidence.fundsDocId)

  const jumpToAnswers = (anchor: string) => {
    goToStep(3)
    setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const submitLabel = toReview
    ? outcome === 'withheld'
      ? 'Submit for visa risk review'
      : 'Submit to UP for review'
    : outcome === 'unconditional'
      ? 'Issue unconditional offer'
      : 'Issue conditional offer'

  const whyDisabled = (() => {
    if (!permission.canSubmit) return permission.reason ?? 'You cannot submit this application.'
    const parts: string[] = []
    if (!toReview && !readiness.looReady) {
      if (counts.conflicts > 0) parts.push(`resolve ${counts.conflicts} conflict${counts.conflicts === 1 ? '' : 's'}`)
      if (counts.toConfirm > 0) parts.push(`confirm ${counts.toConfirm} answer${counts.toConfirm === 1 ? '' : 's'}`)
      if (counts.missing > 0) parts.push(`complete ${counts.missing} answer${counts.missing === 1 ? '' : 's'}`)
      if (requirementBlockers > 0) parts.push(`add ${requirementBlockers} missing document${requirementBlockers === 1 ? '' : 's'}`)
    }
    if (evidenceGaps.length > 0) parts.push(`provide ${evidenceGaps.join(', ').toLowerCase()}`)
    if (!agentReady) parts.push('complete your agent details')
    if (!declared) parts.push('accept both declarations')
    if (parts.length === 0) return null
    const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`
    const verb = toReview ? 'submit' : 'issue the offer'
    return `${list.charAt(0).toUpperCase()}${list.slice(1)} to ${verb}.`
  })()

  function submit() {
    if (!canSubmit) return
    const base = wizard.buildApplication(activeUserId, 'psl', counsellorName(activeUserId))
    const ts = new Date().toISOString()
    const fastTrackEvent = fastTrack
      ? [{ ts, actor: 'agent' as const, label: 'Marked fast track: student ready to commit' }]
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
                  ? 'Submitted to admissions review — agent cannot issue a LoO'
                  : 'Submitted to admissions review',
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
      const unconditional = outcome === 'unconditional'
      const issued = withCrmPush({
        ...app,
        stage: unconditional ? 'Unconditional' : 'Conditional offer',
        route: 'auto',
        events: [
          { ts, actor: 'agent', label: 'Application submitted' },
          ...fastTrackEvent,
          ...scholarshipEvent,
          {
            ts,
            actor: 'up',
            label: unconditional ? 'Unconditional offer issued' : 'Conditional offer issued',
          },
          { ts, actor: 'up', label: 'Pushed to Dynamics 365' },
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
                ? `${created.stage === 'Unconditional' ? 'Unconditional' : 'Conditional'} offer issued`
                : outcome === 'withheld'
                  ? 'Sent to admissions for visa risk review'
                  : 'Sent to admissions review'}
            </p>
            <p className="text-sm text-muted-foreground">
              {created.studentName} · {created.course.programmeName}
            </p>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              {issued
                ? 'UP emails the offer to the student and copies you. It is also pushed to Dynamics 365.'
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
            data={{
              studentName: created.studentName,
              preId: created.preId,
              course: created.course,
              conditions: created.conditions.map((c) => c.label),
              hideCosts: true,
              agent: created.issuingAgent,
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
            <h3
              className={cn(
                'text-sm font-semibold',
                permission.canSubmit ? 'text-info' : 'text-destructive',
              )}
            >
              {permission.canSubmit ? 'Goes to UP admissions review' : 'You cannot submit'}
            </h3>
            <p className="text-sm text-pretty">{permission.reason}</p>
          </div>
        </section>
      )}

      {blocking.length > 0 && !toReview && (
        <section
          aria-labelledby="blocking-heading"
          className="rounded-lg border border-warning/40 bg-card"
        >
          <div className="border-b border-warning/30 bg-warning/10 px-4 py-3">
            <h3 id="blocking-heading" className="flex items-center gap-1.5 text-sm font-semibold">
              <CircleAlert className="size-4 text-warning" aria-hidden />
              Before the offer can be issued
            </h3>
          </div>
          <ul className="divide-y divide-border text-sm">
            {counts.conflicts > 0 && (
              <BlockerLink
                label={`${counts.conflicts} conflict${counts.conflicts === 1 ? '' : 's'} to resolve`}
                onClick={() => jumpToAnswers('triage-conflicts')}
              />
            )}
            {counts.toConfirm > 0 && (
              <BlockerLink
                label={`${counts.toConfirm} AI-read answer${counts.toConfirm === 1 ? '' : 's'} to confirm`}
                onClick={() => jumpToAnswers('triage-confirm')}
              />
            )}
            {counts.missing > 0 && (
              <BlockerLink
                label={`${counts.missing} answer${counts.missing === 1 ? '' : 's'} to complete`}
                onClick={() => jumpToAnswers('triage-form')}
              />
            )}
            {blocking
              .filter((b) => !/to resolve$|to confirm$|to complete$/.test(b))
              .map((b) => (
                <BlockerLink key={b} label={b} onClick={() => goToStep(2)} />
              ))}
          </ul>
        </section>
      )}

      <RiskAssessment risk={risk} outcome={outcome} />

      {needsEvidence && (
        <section
          aria-labelledby="risk-evidence-heading"
          className="rounded-lg border border-border bg-card"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
            <h3 id="risk-evidence-heading" className="text-sm font-semibold">
              Visa risk evidence
            </h3>
            <span
              className={cn(
                'text-xs font-medium tabular-nums',
                evidenceGaps.length === 0 ? 'text-success' : 'text-muted-foreground',
              )}
            >
              {4 - evidenceGaps.length} of 4 provided
            </span>
          </div>

          <div className="flex flex-col divide-y divide-border">
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
                  I have explained any study gaps, course step-down, home-country ties and earlier
                  refusals in the statement above.
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
                  <FileCheck2 className="size-4 shrink-0 text-success" />
                  <span className="truncate">{fundsDoc.fileName}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {fundsDoc.pages} pages · checked
                  </span>
                </p>
              ) : (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={addFundsProof}>
                  <Upload className="size-3.5" /> Add bank statement (demo)
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
                  I have checked the funds cover first-year tuition plus NZD 20,000 living costs,
                  and the source of funds is genuine.
                </span>
              </label>
            </EvidenceItem>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        {permissionRoute && outcome !== 'withheld' ? (
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/40 p-4">
            <Users className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden />
            <p className="text-sm leading-relaxed text-pretty">
              No Letter of Offer is generated from your account. UP admissions creates the offer
              after review, including pricing and any approved scholarship.
            </p>
          </div>
        ) : outcome === 'withheld' ? (
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
            <p className="text-sm leading-relaxed text-pretty">
              The platform won&apos;t create a Letter of Offer for this country and course
              combination. Provide the evidence above and submit; admissions will contact you with
              a decision.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
            <FileCheck2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
            <div className="flex min-w-0 flex-col gap-1.5">
              <p className="text-sm font-semibold">
                {OUTCOME_COPY[outcome].title} is generated when you submit
              </p>
              <p className="text-sm text-muted-foreground text-pretty">
                {OUTCOME_COPY[outcome].detail}
              </p>
              {offerConditions.length > 0 && (
                <p className="text-xs text-muted-foreground text-pretty">
                  Conditions: {offerConditions.map((c) => c.label).join(' · ')}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      <ScholarshipRequest
        available={available}
        selected={requested}
        onToggle={(id, on) =>
          setRequested((r) => (on ? [...r, id] : r.filter((x) => x !== id)))
        }
        reason={scholarshipReason}
        onReason={setScholarshipReason}
      />

      <section className="rounded-lg border border-border bg-card">
        <button
          type="button"
          onClick={() => setNoteOpen((o) => !o)}
          aria-expanded={noteOpen}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium"
        >
          Note to admissions
          <span className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
            Optional
            <ChevronDown className={noteOpen ? 'size-4 rotate-180' : 'size-4'} />
          </span>
        </button>
        {noteOpen && (
          <div className="border-t border-border p-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              aria-label="Note to admissions"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              A note sends the application to admissions review.
            </p>
          </div>
        )}
        <label
          className={cn(
            'flex cursor-pointer items-start gap-3 border-t border-border px-4 py-3 transition-colors',
            fastTrack && 'bg-primary/5',
          )}
        >
          <input
            type="checkbox"
            checked={fastTrack}
            onChange={(e) => setFastTrack(e.target.checked)}
            className="mt-1 size-4 shrink-0 accent-primary"
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Zap
                className={cn('size-3.5', fastTrack ? 'text-primary' : 'text-muted-foreground')}
                aria-hidden
              />
              Fast track
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
              The student is ready to commit. Admissions prioritises this application.
            </span>
          </span>
        </label>
      </section>

      <section
        aria-labelledby="issuing-agent-heading"
        className="rounded-lg border border-border bg-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <p id="issuing-agent-heading" className="flex min-w-0 items-center gap-1.5 text-sm">
            <UserCheck className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="truncate">
              <span className="text-muted-foreground">Issued by</span>{' '}
              <span className="font-medium">{agent.name || 'Agent name needed'}</span>
              {agent.agency && <span className="text-muted-foreground"> · {agent.agency}</span>}
              {agent.agentCode && <span className="text-muted-foreground"> · {agent.agentCode}</span>}
            </span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAgentEditing((e) => !e)}
            aria-expanded={agentEditing}
          >
            {agentEditing ? 'Done' : 'Edit'}
          </Button>
        </div>
        {(agentEditing || !agentReady) && (
          <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
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
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Printed on the Letter of Offer.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Declarations</h3>
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

      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
          canSubmit ? 'border-success/40 bg-success/5' : 'border-border bg-muted/30',
        )}
      >
        <p className="text-sm text-pretty">
          {canSubmit
            ? toReview
              ? 'Everything UP needs is here.'
              : 'Everything is in place. The offer is generated as soon as you submit.'
            : whyDisabled}
        </p>
        <Button size="lg" className="w-fit shrink-0" disabled={!canSubmit} onClick={submit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}

function BlockerLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-muted/50"
      >
        <span className="text-pretty">{label}</span>
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
          Fix <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </button>
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
            Country of citizenship is missing. Upload the passport or complete it in Answers.
          </p>
        </div>
      </section>
    )
  }

  const tone =
    risk.level === 'high'
      ? { box: 'border-destructive/30 bg-destructive/6', text: 'text-destructive', bar: 'bg-destructive' }
      : risk.level === 'elevated'
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
            {risk.nationality} × {COURSE_TYPE_LABEL[risk.courseType]}:{' '}
            <strong className="tabular-nums">{risk.approvalRate}%</strong> of comparable student
            visa applications are approved.
            {risk.level === 'low'
              ? ' This country and course combination has a high success rate.'
              : risk.level === 'elevated'
                ? ' Provide the evidence below before a conditional offer can be created.'
                : ' Provide the evidence below. Admissions reviews it before any offer is created.'}
          </p>
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={risk.approvalRate}
            aria-label="Approval rate"
          >
            <div className={cn('h-full rounded-full', tone.bar)} style={{ width: `${risk.approvalRate}%` }} />
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
