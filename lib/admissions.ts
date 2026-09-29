// Admissions-side derivations. Where the agent board (lib/dashboard.ts) frames
// the funnel from the agent's point of view, this frames the same applications
// as an admissions officer's review workload: what has left the agent's hands,
// what to prioritise, and the step-by-step review of a single file.
import type { Application, Document, Field, Requirement } from './types'
import type { Tone } from './status'
import { computeReadiness } from './readiness'
import { columnFor } from './dashboard'

// ---------------------------------------------------------------------------
// Queue: everything that has left the agent's hands, bucketed by what the
// admissions team still owes on it.
// ---------------------------------------------------------------------------

export type AdmissionsBucket = 'awaiting' | 'conditional' | 'decided'

export interface BucketDef {
  key: AdmissionsBucket
  label: string
  description: string
  tone: Tone
}

export const ADMISSIONS_BUCKETS: BucketDef[] = [
  { key: 'awaiting', label: 'Awaiting review', description: 'Submitted by agents — needs a decision', tone: 'info' },
  { key: 'conditional', label: 'Conditional — tracking', description: 'Offer issued, conditions outstanding', tone: 'ai' },
  { key: 'decided', label: 'Decided', description: 'Unconditional, accepted or enrolled', tone: 'success' },
]

// Anything past the agent's draft column has been submitted to admissions.
export function admissionsQueue(apps: Application[]): Application[] {
  return apps.filter((a) => columnFor(a) !== 'draft')
}

export function admissionsBucket(app: Application): AdmissionsBucket {
  const col = columnFor(app)
  if (col === 'unconditional') return 'decided'
  if (col === 'conditional') return 'conditional'
  return 'awaiting'
}

// Whether an agent already generated a conditional offer at submit time.
export function agentOfferGenerated(app: Application): boolean {
  return admissionsBucket(app) === 'awaiting' && app.route !== 'review'
    ? true
    : app.events.some((e) => /conditional letter of offer generated/i.test(e.detail ?? ''))
}

// An unconditional decision is available only when every evidence category is
// met, all required data is in, and no conditions remain open.
export function canGoUnconditional(app: Application): boolean {
  const r = computeReadiness(app)
  const openConditions = app.conditions.some((c) => c.status !== 'cleared')
  return r.evidenceMet && r.looReady && !openConditions
}

export interface Callout {
  label: string
  tone: Tone
}

// The badges an officer scans the queue for. Fast-track and special cases
// surface first so they can be triaged before routine submissions.
export function admissionsCallouts(app: Application): Callout[] {
  const out: Callout[] = []
  if (app.fastTrack) out.push({ label: 'Fast track', tone: 'danger' })
  if (app.requests.some((r) => r.type === 'special-admission'))
    out.push({ label: 'Special admission', tone: 'warning' })
  if (app.requests.some((r) => r.type === 'discount' && r.status === 'pending'))
    out.push({ label: 'Discount requested', tone: 'warning' })
  if (app.notesToAdmissions && app.notesToAdmissions.trim() !== '')
    out.push({ label: 'Agent note', tone: 'info' })
  if (admissionsBucket(app) === 'awaiting' && canGoUnconditional(app))
    out.push({ label: 'Unconditional ready', tone: 'success' })
  return out
}

// Sort key for the awaiting queue: fast-track first, then special cases, then
// oldest submissions (longest-waiting) ahead of newer ones.
export function priorityRank(app: Application): number {
  let rank = 0
  if (app.fastTrack) rank -= 1000
  if (app.requests.some((r) => r.type === 'special-admission')) rank -= 100
  if (app.requests.some((r) => r.type === 'discount' && r.status === 'pending')) rank -= 50
  // Older files (smaller time) should come first — add elapsed days as a
  // negative contribution so longer waits rank higher.
  const ageDays = (Date.now() - new Date(app.createdAt).getTime()) / 86_400_000
  rank -= ageDays
  return rank
}

export function sortedAwaiting(apps: Application[]): Application[] {
  return [...apps].sort((a, b) => priorityRank(a) - priorityRank(b))
}

// ---------------------------------------------------------------------------
// Review wizard: the ordered steps an officer walks for a single application.
// ---------------------------------------------------------------------------

export type ReviewStepKind =
  | 'checks'
  | 'identity'
  | 'academic'
  | 'english'
  | 'other'
  | 'personal'
  | 'course'
  | 'special'
  | 'decision'

export interface ReviewStep {
  kind: ReviewStepKind
  title: string
  short: string
  docs: Document[]
  fieldKeys: string[]
  // Steps that carry no blocking evidence can be approved even when empty.
  optional: boolean
  // Where this part of the assessment is recorded in CRM.
  crm: string[]
}

const IDENTITY_KEYS = [
  'given_name',
  'family_name',
  'preferred_name',
  'dob',
  'gender',
  'nationality',
  'country_of_birth',
  'passport_number',
  'passport_expiry',
  'first_language',
]
const ACADEMIC_KEYS = [
  'highest_qual',
  'institution',
  'institution_country',
  'study_start',
  'study_end',
  'field_of_study',
  'grade_gpa',
  'qual_completed',
  'prev_study_nz',
]
const ENGLISH_KEYS = [
  'english_test_type',
  'english_test_score',
  'english_test_date',
  'english_test_expiry',
]
const PERSONAL_EXTRA_KEYS = ['marital_status', 'ethnicity', 'iwi', 'visa_status']

const OTHER_DOC_TYPES = [
  'CV',
  'Reference',
  'FinancialEvidence',
  'InsuranceEvidence',
  'Other',
  'Supporting',
]

function docsOfType(app: Application, types: string[]): Document[] {
  return app.documents.filter((d) => types.includes(d.type))
}

function keysInSections(app: Application, sections: string[]): string[] {
  return app.fields.filter((f) => sections.includes(f.section)).map((f) => f.key)
}

export function buildReviewSteps(app: Application): ReviewStep[] {
  const personalKeys = [
    ...PERSONAL_EXTRA_KEYS,
    ...keysInSections(app, ['Contact', 'Emergency contact', 'Health']),
  ]
  return [
    {
      kind: 'checks',
      title: 'Three initial checks',
      short: 'Initial checks',
      docs: [],
      fieldKeys: [],
      optional: false,
      crm: ['My Unprocessed Application Opportunities'],
    },
    {
      kind: 'identity',
      title: 'Verify passport & identity',
      short: 'Passport',
      docs: docsOfType(app, ['Passport']),
      fieldKeys: IDENTITY_KEYS,
      optional: false,
      crm: ['Files', 'Verification'],
    },
    {
      kind: 'academic',
      title: 'Academic documents & NZQA entry requirements',
      short: 'Academic',
      docs: docsOfType(app, ['Transcript']),
      fieldKeys: ACADEMIC_KEYS,
      optional: false,
      crm: ['Files', 'NZQA approval letter', 'Opportunity'],
    },
    {
      kind: 'english',
      title: 'English assessment',
      short: 'English',
      docs: docsOfType(app, ['EnglishTest']),
      fieldKeys: ENGLISH_KEYS,
      optional: true,
      crm: ['Workflow'],
    },
    {
      kind: 'other',
      title: 'Interview, portfolio & other evidence',
      short: 'Other',
      docs: docsOfType(app, OTHER_DOC_TYPES),
      fieldKeys: keysInSections(app, ['Insurance']),
      optional: true,
      crm: ['Files', 'Workflow'],
    },
    {
      kind: 'personal',
      title: 'Contact: personal details, address, stakeholder & residency',
      short: 'Contact',
      docs: [],
      fieldKeys: personalKeys,
      optional: false,
      crm: ['Contact'],
    },
    {
      kind: 'course',
      title: 'Price Bundle: programme, scholarship & insurance period',
      short: 'Price Bundle',
      docs: [],
      fieldKeys: keysInSections(app, ['Course']),
      optional: false,
      crm: ['Price Bundle'],
    },
    {
      kind: 'special',
      title: 'Special admission',
      short: 'Special',
      docs: [],
      fieldKeys: [],
      optional: true,
      crm: ['Workflow'],
    },
    {
      kind: 'decision',
      title: 'Create & review offer',
      short: 'Offer',
      docs: [],
      fieldKeys: [],
      optional: false,
      crm: ['Enroller'],
    },
  ]
}

// The document type an extracted field was read from, for provenance chips.
export function fieldProvenance(app: Application, field: Field): string | null {
  if (!field.sourceDoc) return null
  return app.documents.find((d) => d.id === field.sourceDoc)?.type ?? null
}

// ---------------------------------------------------------------------------
// Academic transcript: does the entered record satisfy the course entry
// criteria, and the full list of achievements captured on the data form.
// ---------------------------------------------------------------------------

export interface AcademicStatus {
  met: boolean
  total: number
  metCount: number
  items: { label: string; status: Requirement['status']; note?: string }[]
}

export function academicRequirementStatus(app: Application): AcademicStatus {
  const items = app.requirements.filter((r) => r.category === 'academic')
  const isMet = (s: Requirement['status']) => s === 'met' || s === 'not-applicable'
  const metCount = items.filter((r) => isMet(r.status)).length
  return {
    met: items.length > 0 && items.every((r) => isMet(r.status)),
    total: items.length,
    metCount,
    items: items.map((r) => ({ label: r.label, status: r.status, note: r.note })),
  }
}

// The academic achievements entered into the applicant's data form — every
// education-history field that carries a value, for the transcript dropdown.
export function academicAchievements(app: Application): Field[] {
  return app.fields.filter(
    (f) => f.section === 'Education history' && f.value.trim() !== '',
  )
}

// ---------------------------------------------------------------------------
// Engagement: the communications (email / WhatsApp) captured against an
// applicant, surfaced on the queue so officers see recent contact at a glance.
// ---------------------------------------------------------------------------

export interface EngagementSummary {
  commsCount: number
  docCount: number
  lastTs: string | null
  lastChannel: 'email' | 'whatsapp'
  lastLabel: string | null
}

function isComms(e: Application['events'][number]): boolean {
  return e.channel === 'email' || e.channel === 'whatsapp' || e.actor === 'email'
}

export function engagementSummary(app: Application): EngagementSummary {
  const comms = app.events.filter(isComms)
  const docCount = comms.reduce((n, e) => n + (e.attachments?.length ?? 0), 0)
  const last = comms.length
    ? comms.reduce((m, e) => (new Date(e.ts).getTime() > new Date(m.ts).getTime() ? e : m))
    : null
  return {
    commsCount: comms.length,
    docCount,
    lastTs: last?.ts ?? null,
    lastChannel: last?.channel === 'whatsapp' ? 'whatsapp' : 'email',
    lastLabel: last?.label ?? null,
  }
}

// Documents that arrived by email, grouped by applicant. Powers the dashboard
// "docs emailed" module and the communications digest so officers can see, at a
// glance, which students have new evidence waiting from an email.
export interface EmailedDocsApplicant {
  app: Application
  docCount: number
  lastTs: string
}

export interface EmailedDocsSummary {
  totalDocs: number
  applicants: EmailedDocsApplicant[]
}

export function emailedDocsSummary(applications: Application[]): EmailedDocsSummary {
  const applicants: EmailedDocsApplicant[] = []
  let totalDocs = 0
  for (const app of applications) {
    const emailed = app.events.filter(
      (e) => (e.channel === 'email' || e.actor === 'email') && (e.attachments?.length ?? 0) > 0,
    )
    const docCount = emailed.reduce((n, e) => n + (e.attachments?.length ?? 0), 0)
    if (docCount === 0) continue
    const lastTs = emailed.reduce(
      (m, e) => (new Date(e.ts).getTime() > new Date(m).getTime() ? e.ts : m),
      emailed[0].ts,
    )
    applicants.push({ app, docCount, lastTs })
    totalDocs += docCount
  }
  applicants.sort((a, b) => new Date(b.lastTs).getTime() - new Date(a.lastTs).getTime())
  return { totalDocs, applicants }
}

// The last time this record was reconciled with Dynamics CRM. A pushed file
// carries an explicit timestamp; otherwise the most recent activity stands in
// as the last sync point so the queue reads as continuously in sync.
export function lastCrmSync(app: Application): string {
  if (app.crmPushedAt) return app.crmPushedAt
  const latest = app.events.reduce<string | null>(
    (m, e) => (m === null || new Date(e.ts).getTime() > new Date(m).getTime() ? e.ts : m),
    null,
  )
  return latest ?? app.createdAt
}
