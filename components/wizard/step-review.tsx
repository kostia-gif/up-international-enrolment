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
import {
  ADMISSIONS_REVIEW_CONDITION,
  fastTrackReasonText as resolveFastTrackReason,
  useWizard,
} from '@/lib/wizard'
import { useStore } from '@/lib/store'
import { answerCounts, blockingItems, computeRoute, openAnswerFields } from '@/lib/readiness'
import { declarationLabels, PRIVACY_NOTE, TERMS_SUMMARY } from '@/lib/declarations'
import { ACCOMMODATION_KEY, accommodationMissing, isUnder18 } from '@/lib/field-specs'
import { STUDENT_AGENCY_ID, STUDENT_AGENT_ID } from '@/lib/student'
import { counsellorName, issuingAgentFor } from '@/lib/fixtures'
import { withCrmPush } from '@/lib/crm'
import {
  RISK_META,
  nationalityOf,
  offerOutcomeFor,
  UP_VERIFICATION_CONDITION,
  visaRiskFor,
  type OfferOutcome,
} from '@/lib/eligibility'
import {
  RiskAssessment,
  VisaSubmitterQuestion,
  visaSubmissionComplete,
  visaSubmitterLabel,
} from './visa-guidance'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { LetterOfOfferPanel, LetterOfOfferPreviewDialog } from '@/components/letter-of-offer'
import { PlanStrip } from '@/components/wizard/plan-strip'
import { alternativeBlocks, pathwayLine } from '@/lib/study-plan'
import { ScholarshipRequest } from '@/components/wizard/scholarship-request'
import { getAgentProfile, grantedScholarships, offerPermissionFor } from '@/lib/agent-profiles'
import { cn } from '@/lib/utils'
import type { Application, Condition, IssuingAgent, VisaSubmission } from '@/lib/types'

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
    title: 'Reviewed with UP first',
    detail:
      'Medium and high visa risk: UP admissions reviews the application before the offer is created.',
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
    fastTrackReason,
    fastTrackDetail,
    declarations,
    setDeclaration,
    riskEvidence,
    setRiskEvidence,
    addFundsProof,
    documents,
    goToStep,
    focusField,
    isStudent,
  } = wizard
  const { addApplication, activeUserId, signInStudent } = useStore()
  const declarationText = declarationLabels(wizard.audience)
  const [phase, setPhase] = useState<Phase>('review')
  const [created, setCreated] = useState<Application | null>(null)
  const [agent, setAgent] = useState<IssuingAgent>(() => issuingAgentFor(activeUserId))
  // Default: UP emails the offer to the student on submit; the agent can opt out.
  const [emailOnSubmit, setEmailOnSubmit] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const studentEmail = draft.fields.find((f) => f.key === 'email')?.value.trim() || undefined
  // A direct application has no issuing agent, no agent permissions and no
  // agent scholarship grants; it always goes to UP admissions to make the offer.
  const agentReady = isStudent || AGENT_FIELDS.every((f) => agent[f.key].trim() !== '')
  const profile = isStudent ? undefined : getAgentProfile(activeUserId)
  const permission = offerPermissionFor(profile)
  const available = isStudent ? [] : grantedScholarships(profile)
  const [requested, setRequested] = useState<string[]>([])
  const [scholarshipReason, setScholarshipReason] = useState('')

  const risk = visaRiskFor(nationalityOf(draft), wizard.course?.levelGroup)
  const level = risk?.level ?? 'medium'
  // Medium and high show coaching on what INZ looks for; nothing blocks.
  const showCoaching = risk !== null && risk.level !== 'low'
  const evidenceAdded = Boolean(riskEvidence.purpose.trim() || riskEvidence.fundsDocId)
  // Online study needs no NZ visa, and a student applying direct lodges their own.
  const visaApplies = wizard.course?.delivery !== 'online'
  const askVisaSubmitter = !isStudent && visaApplies
  const [visaSubmission, setVisaSubmission] = useState<VisaSubmission | null>(null)
  const visaAnswered = !askVisaSubmitter || visaSubmissionComplete(visaSubmission)

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
      : draft.conditions

  const noteRoute = computeRoute(draft) === 'review'
  const permissionRoute = !permission.canIssueLoo
  // A qualification or grade shortfall never carries an agent-issued offer: UP
  // admissions decides, and only with RPL evidence or a special admission note.
  const { entryIssues } = wizard
  const entryGapText = [entryIssues.qualification, entryIssues.grade].filter(Boolean).join(' ')
  const entryGap = entryGapText !== ''
  const gapSupported = documents.some((d) => d.type === 'RPL') || notes.trim() !== ''
  // Mandatory for a student under 18, whichever route the application takes.
  const under18 = isUnder18(draft.fields)
  const accommodationPlan = draft.fields.find((f) => f.key === ACCOMMODATION_KEY)?.value.trim() ?? ''
  const needsAccommodation = accommodationMissing(draft.fields)
  const toReview = isStudent || outcome === 'withheld' || noteRoute || permissionRoute || entryGap
  const blocking = blockingItems(draft)
  const counts = answerCounts(draft)
  const requirementBlockers = blocking.length - [counts.conflicts, counts.toConfirm, counts.missing].filter((n) => n > 0).length
  const declared = declarations.terms && declarations.consultant
  const fastTrackReasonLabel = resolveFastTrackReason(fastTrackReason, fastTrackDetail)
  const fastTrackReasonComplete = !fastTrack || Boolean(fastTrackReasonLabel)
  const canSubmit =
    !wizard.assessment.blocked &&
    permission.canSubmit &&
    declared &&
    agentReady &&
    visaAnswered &&
    !needsAccommodation &&
    fastTrackReasonComplete &&
    (!entryGap || gapSupported) &&
    (toReview || readiness.looReady)
  const fundsDoc = documents.find((d) => d.id === riskEvidence.fundsDocId)
  // Optional evidence travels with the application whenever the agent added any.
  const riskEvidenceForApp =
    showCoaching && risk && evidenceAdded
      ? { ...riskEvidence, level: risk.level, approvalRate: risk.approvalRate }
      : undefined

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

  const submitLabel = isStudent
    ? 'Submit my application'
    : toReview
    ? 'Submit to UP for review'
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
    if (entryGap && !gapSupported) {
      items.push('Add RPL evidence or a special admission note for the entry requirement')
    }
    if (needsAccommodation) items.push('Choose the planned accommodation (under 18 at course start)')
    if (!fastTrackReasonComplete) items.push('Choose a reason for fast tracking')
    if (!visaAnswered) items.push('Tell us who will submit the student visa')
    if (!agentReady) items.push('Complete your issuing agent details')
    if (!declared) items.push(isStudent ? 'Agree to both declarations' : 'Accept both declarations')
    return items
  })()

  function submitDirect() {
    const base = wizard.buildApplication(STUDENT_AGENT_ID, STUDENT_AGENCY_ID, draft.studentName)
    const ts = new Date().toISOString()
    const submitted: Application = {
      ...base,
      channel: 'direct',
      stage: 'Submitted',
      route: 'review',
      conditions: offerConditions.map((c, i) => ({ ...c, id: `${base.id}-c${i}` })),
      riskEvidence: riskEvidenceForApp,
      visaSubmission: visaApplies ? { by: 'student' } : undefined,
      events: [
        {
          ts,
          actor: 'student',
          label: 'Application submitted by the student',
          detail: 'Applied directly through the student portal',
          channel: 'student-portal',
        },
      ],
    }
    addApplication(submitted)
    if (studentEmail) signInStudent({ email: studentEmail.toLowerCase(), appId: submitted.id })
    setCreated(submitted)
    setPhase('done')
  }

  function submit() {
    if (!canSubmit) return
    if (isStudent) {
      submitDirect()
      return
    }
    const base = wizard.buildApplication(activeUserId, 'psl', counsellorName(activeUserId))
    const ts = new Date().toISOString()
    const fastTrackEvent = fastTrack
      ? [
          {
            ts,
            actor: 'agent' as const,
            label: 'Marked fast track',
            ...(fastTrackReasonLabel ? { detail: fastTrackReasonLabel } : {}),
          },
        ]
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
    const visaEvent =
      askVisaSubmitter && visaSubmission
        ? [{ ts, actor: 'agent' as const, label: visaSubmitterLabel(visaSubmission) }]
        : []
    const app: Application = {
      ...base,
      issuingAgent: { ...agent, confirmedAt: ts },
      conditions: offerConditions.map((c, i) => ({ ...c, id: `${base.id}-c${i}` })),
      riskEvidence: riskEvidenceForApp,
      visaSubmission: askVisaSubmitter && visaSubmission ? visaSubmission : undefined,
      fastTrackReason: fastTrack ? fastTrackReasonLabel : undefined,
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
                ? 'Sent to UP admissions for visa review'
                : entryGap
                  ? 'Sent to UP for special admission review — entry requirement not met'
                : permissionRoute && !noteRoute
                  ? 'Sent to UP — agent cannot issue a conditional offer'
                  : 'Sent to UP for review',
          },
          ...visaEvent,
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
          ...visaEvent,
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

  if (phase === 'done' && created && isStudent) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 border border-success/30 bg-success/5 p-5">
          <CircleCheck className="mt-0.5 size-6 shrink-0 text-success" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">Application sent to UP Education</p>
            <p className="text-sm text-muted-foreground">
              {created.course.programmeName} · Reference{' '}
              <span className="font-mono text-foreground">{created.preId}</span>
            </p>
            <p className="mt-1 text-sm leading-relaxed text-pretty">
              UP admissions reviews your application and emails your Letter of Offer
              {studentEmail ? ` to ${studentEmail}` : ''}. Sign in with your email any time to see
              what&apos;s outstanding, download your offer and accept it online.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/student/application" />} nativeButton={false} className="gap-1.5">
            View my application <ArrowRight className="size-4" aria-hidden />
          </Button>
          <Button variant="outline" render={<Link href="/student" />} nativeButton={false}>
            Student portal
          </Button>
        </div>
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
                  ? 'Sent to UP admissions for visa review'
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

      {entryGap && (
        <section
          aria-labelledby="entry-gap-heading"
          className="overflow-hidden rounded-lg border-2 border-warning"
        >
          <div className="flex items-center gap-3 bg-warning px-4 py-3 text-warning-foreground">
            <TriangleAlert className="size-6 shrink-0" aria-hidden />
            <h3 id="entry-gap-heading" className="text-base font-bold leading-tight text-balance">
              Entry requirement not met
            </h3>
          </div>
          <div className="flex flex-col items-start gap-3 bg-warning/8 p-4">
            <p className="text-sm leading-relaxed text-pretty">{entryGapText}</p>
            <p className="text-sm leading-relaxed text-pretty">
              {gapSupported
                ? 'RPL evidence or a note is attached. No offer is issued on submit: UP admissions decides whether to admit through special admission.'
                : 'To submit, add RPL or work-experience evidence, or a note asking for special admission. UP admissions then decides. Otherwise switch to a course that fits the qualification.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-1.5" onClick={() => goToStep(4)}>
                {gapSupported ? 'Review evidence and note' : 'Add evidence or note'}
                <ArrowRight className="size-3.5" aria-hidden />
              </Button>
              <Button variant="outline" size="sm" onClick={() => goToStep(3)}>
                See alternative courses
              </Button>
            </div>
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
            title="Visa and immigration"
            summary={
              askVisaSubmitter && !visaAnswered
                ? `${riskLabel} · who submits the visa?`
                : visaApplies
                  ? riskLabel
                  : 'Online study · no NZ visa needed'
            }
            status={
              !risk || !visaAnswered ? 'attention' : risk.level === 'low' ? 'ok' : 'risk'
            }
            defaultOpen={!risk || !visaAnswered || showCoaching}
          >
            <div className="flex flex-col gap-4">
              <RiskAssessment
                risk={risk}
                outcomeNote={
                  outcome === 'withheld'
                    ? OUTCOME_COPY.withheld.detail
                    : toReview
                      ? 'UP admissions creates the offer after review.'
                      : 'You can issue the conditional offer when you submit.'
                }
              />
              {askVisaSubmitter && (
                <VisaSubmitterQuestion value={visaSubmission} onChange={setVisaSubmission} />
              )}
            </div>
          </ReviewSection>

          {under18 && (
            <ReviewSection
              title="Accommodation (under 18)"
              summary={accommodationPlan || 'Planned accommodation not chosen'}
              status={needsAccommodation ? 'attention' : 'ok'}
              defaultOpen={needsAccommodation}
            >
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm leading-relaxed text-pretty">
                  {isStudent ? 'You are' : 'The student is'} under 18 at course start. Under the
                  Code of Practice they must live with a parent or legal guardian, or in
                  accommodation UP has approved.{' '}
                  {needsAccommodation
                    ? 'Choose the planned accommodation to submit.'
                    : 'UP confirms the arrangement as a condition of the offer, with parent or guardian consent.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => jumpToField(ACCOMMODATION_KEY)}
                >
                  {needsAccommodation ? 'Choose accommodation' : 'Change'}
                  <ArrowRight className="size-3.5" aria-hidden />
                </Button>
              </div>
            </ReviewSection>
          )}

          {!isStudent && (
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
          )}
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
            title={isStudent ? 'Message to admissions' : 'Note to admissions'}
            summary={
              notes.trim()
                ? isStudent
                  ? 'Message added'
                  : 'Note added · sends the application to review'
                : 'Not added'
            }
            status={notes.trim() ? 'requested' : 'empty'}
            defaultOpen={notes.trim() !== ''}
          >
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              aria-label={isStudent ? 'Message to admissions' : 'Note to admissions'}
              placeholder={isStudent ? 'Anything you would like admissions to know, e.g. a preferred start date' : undefined}
            />
            {!isStudent && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Adding a note sends the application to UP admissions review instead of issuing an offer.
              </p>
            )}
          </ReviewSection>

          {!isStudent && (
            <ScholarshipRequest
              available={available}
              selected={requested}
              onToggle={(id, on) => setRequested((r) => (on ? [...r, id] : r.filter((x) => x !== id)))}
              reason={scholarshipReason}
              onReason={setScholarshipReason}
            />
          )}
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
              <span className="text-pretty">{declarationText[key]}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground text-pretty">{PRIVACY_NOTE}</p>
      </section>

      {isStudent ? (
        <section aria-labelledby="next-heading" className="flex items-start gap-3 border border-border bg-card p-4">
          <Users className="mt-0.5 size-5 shrink-0 text-info" aria-hidden />
          <div className="flex flex-col gap-1">
            <h3 id="next-heading" className="text-sm font-semibold">
              What happens next
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              UP admissions reviews your application and emails your Letter of Offer. If anything
              else is needed, it shows in your student portal, where you can upload it, download
              your offer and accept it online.
            </p>
          </div>
        </section>
      ) : (
      <OutcomeCard
        outcome={outcome}
        toReview={toReview}
        permissionRoute={permissionRoute}
        entryGap={entryGap}
        conditions={offerConditions}
        emailOnSubmit={emailOnSubmit}
        onEmailChange={setEmailOnSubmit}
        studentEmail={studentEmail}
        onPreview={() => setPreviewOpen(true)}
        onDownload={() => toast.success('Draft Letter of Offer downloaded (PDF)')}
      />
      )}

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
  entryGap,
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
  entryGap: boolean
  conditions: Condition[]
  emailOnSubmit: boolean
  onEmailChange: (v: boolean) => void
  studentEmail?: string
  onPreview: () => void
  onDownload: () => void
}) {
  if (outcome === 'withheld') {
    return (
      <section className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Users className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">UP admissions reviews before the offer</h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            Medium and high visa risk applications are reviewed by UP admissions before an offer is
            created. Updates appear in this application.
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
          <h3 className="text-sm font-semibold">
            {entryGap ? 'UP admissions decides on entry' : 'UP admissions creates the offer'}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            {entryGap
              ? 'The entry requirement is not met, so no offer is generated on submit. UP admissions assesses the RPL evidence or special admission request and decides.'
              : permissionRoute
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
