// Internal Control audit domain. Self-contained mock data for the audit team
// that independently verifies ~20% of confirmed unconditional international
// applications against the student's final post-arrival compliance evidence.
//
// This is a new operational lens over the same student/application data —
// it deliberately reuses the Apply status vocabulary, tones and card styles.
import {
  CircleDashed,
  Clock,
  Plane,
  Building2,
  ClipboardCheck,
  Search,
  MessageCircleQuestion,
  CircleCheck,
  type LucideIcon,
} from 'lucide-react'
import type { Tone } from './status'

export type ICStatus =
  | 'selected'
  | 'awaiting-visa'
  | 'awaiting-arrival'
  | 'waiting-school'
  | 'ready'
  | 'in-review'
  | 'query'
  | 'complete'

interface ICStatusMeta {
  label: string
  tone: Tone
  icon: LucideIcon
  description: string
}

export const icStatusMeta: Record<ICStatus, ICStatusMeta> = {
  selected: {
    label: 'Selected',
    tone: 'neutral',
    icon: CircleDashed,
    description: 'Application has been selected for Internal Control audit.',
  },
  'awaiting-visa': {
    label: 'Awaiting visa',
    tone: 'warning',
    icon: Clock,
    description: 'Student has not yet supplied final visa evidence.',
  },
  'awaiting-arrival': {
    label: 'Awaiting arrival',
    tone: 'info',
    icon: Plane,
    description: 'Visa may exist, but final school / SMS evidence is not yet expected.',
  },
  'waiting-school': {
    label: 'Waiting on school',
    tone: 'warning',
    icon: Building2,
    description: 'Internal Control needs information from the school.',
  },
  ready: {
    label: 'Ready for audit',
    tone: 'info',
    icon: ClipboardCheck,
    description: 'All required evidence is available.',
  },
  'in-review': {
    label: 'In review',
    tone: 'ai',
    icon: Search,
    description: 'An Internal Control auditor is reviewing the record.',
  },
  query: {
    label: 'Query raised',
    tone: 'danger',
    icon: MessageCircleQuestion,
    description: 'Something requires clarification or correction.',
  },
  complete: {
    label: 'Complete',
    tone: 'success',
    icon: CircleCheck,
    description: 'Internal Control audit has been completed.',
  },
}

// Priority ordering for the queue — what needs action today comes first.
export const IC_STATUS_PRIORITY: ICStatus[] = [
  'query',
  'ready',
  'in-review',
  'waiting-school',
  'awaiting-visa',
  'awaiting-arrival',
  'selected',
  'complete',
]

export type EvidenceState = 'available' | 'missing' | 'different'

export interface EvidenceItem {
  label: string
  state: EvidenceState
  value?: string
  note?: string
}

export type CompareResult = 'confirmed' | 'review' | 'mismatch' | 'pending'

export const compareMeta: Record<CompareResult, { label: string; tone: Tone }> = {
  confirmed: { label: 'Confirmed', tone: 'success' },
  review: { label: 'Review', tone: 'warning' },
  mismatch: { label: 'Mismatch', tone: 'danger' },
  pending: { label: 'Pending', tone: 'neutral' },
}

export interface CompareRow {
  field: string
  admissions: string
  final: string
  result: CompareResult
}

export type SmsState = 'present' | 'missing' | 'different'

export const smsMeta: Record<SmsState, { label: string; tone: Tone }> = {
  present: { label: 'Present', tone: 'success' },
  missing: { label: 'Missing', tone: 'danger' },
  different: { label: 'Different', tone: 'warning' },
}

export interface SmsItem {
  label: string
  value?: string
  state: SmsState
}

export type ExceptionType =
  | 'missing-evidence'
  | 'data-mismatch'
  | 'coverage-issue'
  | 'sms-missing'
  | 'date-discrepancy'
  | 'visa-condition'

export const exceptionMeta: Record<ExceptionType, { label: string; tone: Tone }> = {
  'missing-evidence': { label: 'Missing evidence', tone: 'warning' },
  'data-mismatch': { label: 'Data mismatch', tone: 'danger' },
  'coverage-issue': { label: 'Coverage issue', tone: 'danger' },
  'sms-missing': { label: 'SMS data missing', tone: 'warning' },
  'date-discrepancy': { label: 'Date discrepancy', tone: 'warning' },
  'visa-condition': { label: 'Visa condition review', tone: 'info' },
}

export interface AuditException {
  type: ExceptionType
  detail: string
}

export type ActionOwner = 'school' | 'internal-control'
export type ActionStatus = 'outstanding' | 'pending' | 'complete'

export interface AuditAction {
  owner: ActionOwner
  party: string // e.g. "NZTC" or "Internal Control"
  label: string
  requested?: string
  due?: string
  status: ActionStatus
}

export interface TimelineEvent {
  date: string // ISO
  label: string
}

export interface SchoolRequest {
  requested: string // ISO
  requestedFrom: string
  items: string[]
  contact: string
}

export type Decision =
  | 'confirmed'
  | 'confirmed-follow-up'
  | 'investigate'
  | 'compliance-issue'

export const decisionMeta: Record<Decision, { label: string; tone: Tone; description: string }> = {
  confirmed: {
    label: 'Audit confirmed',
    tone: 'success',
    description: 'No further action required.',
  },
  'confirmed-follow-up': {
    label: 'Confirmed with follow-up',
    tone: 'info',
    description: 'The student record is acceptable but the school needs to update information.',
  },
  investigate: {
    label: 'Further investigation required',
    tone: 'warning',
    description: 'Internal Control needs clarification before closing the audit.',
  },
  'compliance-issue': {
    label: 'Compliance issue identified',
    tone: 'danger',
    description: 'A material issue requires escalation.',
  },
}

export interface DateRange {
  start: string // ISO
  end: string // ISO
}

export interface AuditRecord {
  id: string
  applicationId: string
  studentId?: string
  studentName: string
  dob: string
  nationality: string
  passport: string
  school: string
  programme: string
  campus: string
  intake: string
  programmeStart: string // ISO
  offerStatus: string
  visaStatus: EvidenceState
  insuranceStatus: EvidenceState
  status: ICStatus
  daysOutstanding: number
  auditor: string
  sampled: boolean
  missing: string[] // for priority indicators on the queue
  evidenceStatus: { label: string; available: boolean }[]
  originalEvidence: EvidenceItem[]
  finalEvidence: EvidenceItem[]
  comparison: CompareRow[]
  smsRecord: SmsItem[]
  study: DateRange
  visa?: DateRange
  insurance?: DateRange
  exceptions: AuditException[]
  actions: AuditAction[]
  timeline: TimelineEvent[]
  schoolRequest?: SchoolRequest
  decision?: Decision
}

// ── Records ─────────────────────────────────────────────────────────────
// Five representative students spanning the audit lifecycle, per the brief.

export const AUDIT_RECORDS: AuditRecord[] = [
  // Student 1 — everything aligns → Audit confirmed
  {
    id: 'ic-108429',
    applicationId: 'APP-108429',
    studentId: 'STU-48291',
    studentName: 'Li Wei',
    dob: '2001-05-04',
    nationality: 'China',
    passport: 'EJ123456',
    school: 'Yoobee Colleges',
    programme: 'Diploma of Software Engineering',
    campus: 'Auckland',
    intake: 'February 2027',
    programmeStart: '2027-02-16',
    offerStatus: 'Unconditional',
    visaStatus: 'available',
    insuranceStatus: 'available',
    status: 'complete',
    daysOutstanding: 0,
    auditor: 'Priya Nair',
    sampled: true,
    missing: [],
    evidenceStatus: [
      { label: 'Passport', available: true },
      { label: 'Offer of Place', available: true },
      { label: 'Final student visa', available: true },
      { label: 'Insurance', available: true },
      { label: 'School SMS confirmation', available: true },
    ],
    originalEvidence: [
      { label: 'Passport', state: 'available', value: 'EJ123456 · China' },
      { label: 'Application information', state: 'available' },
      { label: 'Offer of Place', state: 'available', value: 'Unconditional · 31 May 2026' },
      { label: 'Programme', state: 'available', value: 'Diploma of Software Engineering' },
      { label: 'Campus', state: 'available', value: 'Auckland' },
      { label: 'Study start date', state: 'available', value: '16 Feb 2027' },
      { label: 'Study end date', state: 'available', value: '18 Dec 2027' },
      { label: 'Admissions conditions', state: 'available', value: 'None outstanding' },
    ],
    finalEvidence: [
      { label: 'Final NZ student visa', state: 'available', value: 'Fee-paying student · 30 Mar 2028' },
      { label: 'Visa expiry date', state: 'available', value: '30 Mar 2028' },
      { label: 'Visa conditions', state: 'available', value: 'Study at Yoobee Colleges only' },
      { label: 'Final passport', state: 'available', value: 'EJ123456 (unchanged)' },
      { label: 'Insurance evidence', state: 'available', value: 'StudentSafe · POL-9931' },
      { label: 'Insurance start date', state: 'available', value: '10 Feb 2027' },
      { label: 'Insurance end date', state: 'available', value: '31 Mar 2028' },
      { label: 'Confirmed programme start', state: 'available', value: '16 Feb 2027' },
      { label: 'Confirmed school enrolment', state: 'available', value: 'Enrolled · active' },
      { label: 'Student Management System', state: 'available', value: 'Fully recorded' },
    ],
    comparison: [
      { field: 'Student name', admissions: 'Li Wei', final: 'Li Wei', result: 'confirmed' },
      { field: 'DOB', admissions: '04 May 2001', final: '04 May 2001', result: 'confirmed' },
      { field: 'Passport', admissions: 'EJ123456', final: 'EJ123456', result: 'confirmed' },
      { field: 'School', admissions: 'Yoobee', final: 'Yoobee', result: 'confirmed' },
      {
        field: 'Programme',
        admissions: 'Diploma Software Engineering',
        final: 'Diploma Software Engineering',
        result: 'confirmed',
      },
      { field: 'Start date', admissions: '16 Feb 2027', final: '16 Feb 2027', result: 'confirmed' },
      { field: 'Visa expiry', admissions: '—', final: '30 Mar 2028', result: 'confirmed' },
      { field: 'Insurance start', admissions: '—', final: '10 Feb 2027', result: 'confirmed' },
      { field: 'Insurance expiry', admissions: '—', final: '31 Mar 2028', result: 'confirmed' },
    ],
    smsRecord: [
      { label: 'Student ID', value: 'STU-48291', state: 'present' },
      { label: 'School', value: 'Yoobee Colleges', state: 'present' },
      { label: 'Programme', value: 'Diploma of Software Engineering', state: 'present' },
      { label: 'Campus', value: 'Auckland', state: 'present' },
      { label: 'Actual start date', value: '16 Feb 2027', state: 'present' },
      { label: 'Current enrolment status', value: 'Enrolled', state: 'present' },
      { label: 'Visa expiry recorded in SMS', value: '30 Mar 2028', state: 'present' },
      { label: 'Passport recorded in SMS', value: 'EJ123456', state: 'present' },
      { label: 'Insurance recorded in SMS', value: 'StudentSafe · POL-9931', state: 'present' },
    ],
    study: { start: '2027-02-16', end: '2027-12-18' },
    visa: { start: '2027-02-01', end: '2028-03-30' },
    insurance: { start: '2027-02-10', end: '2028-03-31' },
    exceptions: [],
    actions: [],
    timeline: [
      { date: '2026-05-12', label: 'Application submitted' },
      { date: '2026-05-29', label: 'Admissions approved' },
      { date: '2026-05-31', label: 'Unconditional Offer issued' },
      { date: '2026-05-31', label: 'Selected for Internal Control audit' },
      { date: '2026-07-18', label: 'Visa issued' },
      { date: '2026-08-06', label: 'Student arrived in NZ' },
      { date: '2026-08-06', label: 'School requested to provide final visa details' },
      { date: '2026-08-08', label: 'Visa uploaded' },
      { date: '2026-08-08', label: 'Audit ready' },
      { date: '2026-08-11', label: 'Internal Control audit completed' },
    ],
    decision: 'confirmed',
  },

  // Student 2 — school SMS missing visa expiry → Confirmed with follow-up
  {
    id: 'ic-108530',
    applicationId: 'APP-108530',
    studentId: 'STU-48512',
    studentName: 'Aarav Sharma',
    dob: '2002-11-21',
    nationality: 'India',
    passport: 'M8841203',
    school: 'NZTC',
    programme: 'Diploma in Early Childhood Education',
    campus: 'Auckland',
    intake: 'February 2027',
    programmeStart: '2027-02-16',
    offerStatus: 'Unconditional',
    visaStatus: 'available',
    insuranceStatus: 'available',
    status: 'query',
    daysOutstanding: 6,
    auditor: 'Priya Nair',
    sampled: true,
    missing: ['SMS visa expiry'],
    evidenceStatus: [
      { label: 'Passport', available: true },
      { label: 'Offer of Place', available: true },
      { label: 'Final student visa', available: true },
      { label: 'Insurance', available: true },
      { label: 'School SMS confirmation', available: false },
    ],
    originalEvidence: [
      { label: 'Passport', state: 'available', value: 'M8841203 · India' },
      { label: 'Application information', state: 'available' },
      { label: 'Offer of Place', state: 'available', value: 'Unconditional · 12 Jun 2026' },
      { label: 'Programme', state: 'available', value: 'Diploma in Early Childhood Education' },
      { label: 'Campus', state: 'available', value: 'Auckland' },
      { label: 'Study start date', state: 'available', value: '16 Feb 2027' },
      { label: 'Study end date', state: 'available', value: '10 Dec 2027' },
      { label: 'Admissions conditions', state: 'available', value: 'None outstanding' },
    ],
    finalEvidence: [
      { label: 'Final NZ student visa', state: 'available', value: 'Fee-paying student · 15 Apr 2028' },
      { label: 'Visa expiry date', state: 'available', value: '15 Apr 2028' },
      { label: 'Visa conditions', state: 'available', value: 'Study at NZTC only' },
      { label: 'Final passport', state: 'available', value: 'M8841203 (unchanged)' },
      { label: 'Insurance evidence', state: 'available', value: 'Uni-Care · UC-4420' },
      { label: 'Insurance start date', state: 'available', value: '08 Feb 2027' },
      { label: 'Insurance end date', state: 'available', value: '20 Apr 2028' },
      { label: 'Confirmed programme start', state: 'available', value: '16 Feb 2027' },
      { label: 'Confirmed school enrolment', state: 'available', value: 'Enrolled · active' },
      { label: 'Student Management System', state: 'different', value: 'Visa expiry not recorded' },
    ],
    comparison: [
      { field: 'Student name', admissions: 'Aarav Sharma', final: 'Aarav Sharma', result: 'confirmed' },
      { field: 'DOB', admissions: '21 Nov 2002', final: '21 Nov 2002', result: 'confirmed' },
      { field: 'Passport', admissions: 'M8841203', final: 'M8841203', result: 'confirmed' },
      { field: 'School', admissions: 'NZTC', final: 'NZTC', result: 'confirmed' },
      {
        field: 'Programme',
        admissions: 'Dip. Early Childhood Ed.',
        final: 'Dip. Early Childhood Ed.',
        result: 'confirmed',
      },
      { field: 'Start date', admissions: '16 Feb 2027', final: '16 Feb 2027', result: 'confirmed' },
      { field: 'Visa expiry', admissions: '—', final: '15 Apr 2028', result: 'confirmed' },
      { field: 'Insurance start', admissions: '—', final: '08 Feb 2027', result: 'confirmed' },
      { field: 'Insurance expiry', admissions: '—', final: '20 Apr 2028', result: 'confirmed' },
    ],
    smsRecord: [
      { label: 'Student ID', value: 'STU-48512', state: 'present' },
      { label: 'School', value: 'NZTC', state: 'present' },
      { label: 'Programme', value: 'Diploma in Early Childhood Education', state: 'present' },
      { label: 'Campus', value: 'Auckland', state: 'present' },
      { label: 'Actual start date', value: '16 Feb 2027', state: 'present' },
      { label: 'Current enrolment status', value: 'Enrolled', state: 'present' },
      { label: 'Visa expiry recorded in SMS', state: 'missing' },
      { label: 'Passport recorded in SMS', value: 'M8841203', state: 'present' },
      { label: 'Insurance recorded in SMS', value: 'Uni-Care · UC-4420', state: 'present' },
    ],
    study: { start: '2027-02-16', end: '2027-12-10' },
    visa: { start: '2027-02-01', end: '2028-04-15' },
    insurance: { start: '2027-02-08', end: '2028-04-20' },
    exceptions: [
      {
        type: 'sms-missing',
        detail:
          'Visa expiry (30 Mar 2028 held by Internal Control) has not been entered into the NZTC SMS.',
      },
    ],
    actions: [
      {
        owner: 'school',
        party: 'NZTC',
        label: 'Add final visa expiry to SMS',
        requested: '2026-09-24',
        due: '2026-09-29',
        status: 'outstanding',
      },
      {
        owner: 'internal-control',
        party: 'Internal Control',
        label: 'Verify updated SMS record',
        status: 'pending',
      },
    ],
    timeline: [
      { date: '2026-05-20', label: 'Application submitted' },
      { date: '2026-06-10', label: 'Admissions approved' },
      { date: '2026-06-12', label: 'Unconditional Offer issued' },
      { date: '2026-06-12', label: 'Selected for Internal Control audit' },
      { date: '2026-08-01', label: 'Visa issued' },
      { date: '2026-08-14', label: 'Student arrived in NZ' },
      { date: '2026-09-20', label: 'Audit ready' },
      { date: '2026-09-24', label: 'SMS update requested from NZTC' },
    ],
    decision: 'confirmed-follow-up',
  },

  // Student 3 — insurance starts after programme → Review required
  {
    id: 'ic-108671',
    applicationId: 'APP-108671',
    studentId: 'STU-48733',
    studentName: 'Maria Santos',
    dob: '2000-03-09',
    nationality: 'Philippines',
    passport: 'P2298471',
    school: 'NZMA',
    programme: 'New Zealand Diploma in Business',
    campus: 'Auckland',
    intake: 'February 2027',
    programmeStart: '2027-02-16',
    offerStatus: 'Unconditional',
    visaStatus: 'available',
    insuranceStatus: 'available',
    status: 'in-review',
    daysOutstanding: 3,
    auditor: 'Daniel Cho',
    sampled: true,
    missing: [],
    evidenceStatus: [
      { label: 'Passport', available: true },
      { label: 'Offer of Place', available: true },
      { label: 'Final student visa', available: true },
      { label: 'Insurance', available: true },
      { label: 'School SMS confirmation', available: true },
    ],
    originalEvidence: [
      { label: 'Passport', state: 'available', value: 'P2298471 · Philippines' },
      { label: 'Application information', state: 'available' },
      { label: 'Offer of Place', state: 'available', value: 'Unconditional · 04 Jun 2026' },
      { label: 'Programme', state: 'available', value: 'NZ Diploma in Business' },
      { label: 'Campus', state: 'available', value: 'Auckland' },
      { label: 'Study start date', state: 'available', value: '16 Feb 2027' },
      { label: 'Study end date', state: 'available', value: '05 Dec 2027' },
      { label: 'Admissions conditions', state: 'available', value: 'None outstanding' },
    ],
    finalEvidence: [
      { label: 'Final NZ student visa', state: 'available', value: 'Fee-paying student · 28 Feb 2028' },
      { label: 'Visa expiry date', state: 'available', value: '28 Feb 2028' },
      { label: 'Visa conditions', state: 'available', value: 'Study at NZMA only' },
      { label: 'Final passport', state: 'available', value: 'P2298471 (unchanged)' },
      { label: 'Insurance evidence', state: 'different', value: 'StudentSafe · POL-7781' },
      { label: 'Insurance start date', state: 'different', value: '21 Feb 2027 (after start)' },
      { label: 'Insurance end date', state: 'available', value: '28 Feb 2028' },
      { label: 'Confirmed programme start', state: 'available', value: '16 Feb 2027' },
      { label: 'Confirmed school enrolment', state: 'available', value: 'Enrolled · active' },
      { label: 'Student Management System', state: 'available', value: 'Fully recorded' },
    ],
    comparison: [
      { field: 'Student name', admissions: 'Maria Santos', final: 'Maria Santos', result: 'confirmed' },
      { field: 'DOB', admissions: '09 Mar 2000', final: '09 Mar 2000', result: 'confirmed' },
      { field: 'Passport', admissions: 'P2298471', final: 'P2298471', result: 'confirmed' },
      { field: 'School', admissions: 'NZMA', final: 'NZMA', result: 'confirmed' },
      {
        field: 'Programme',
        admissions: 'NZ Diploma in Business',
        final: 'NZ Diploma in Business',
        result: 'confirmed',
      },
      { field: 'Start date', admissions: '16 Feb 2027', final: '16 Feb 2027', result: 'confirmed' },
      { field: 'Visa expiry', admissions: '—', final: '28 Feb 2028', result: 'confirmed' },
      { field: 'Insurance start', admissions: '—', final: '21 Feb 2027', result: 'review' },
      { field: 'Insurance expiry', admissions: '—', final: '28 Feb 2028', result: 'confirmed' },
    ],
    smsRecord: [
      { label: 'Student ID', value: 'STU-48733', state: 'present' },
      { label: 'School', value: 'NZMA', state: 'present' },
      { label: 'Programme', value: 'NZ Diploma in Business', state: 'present' },
      { label: 'Campus', value: 'Auckland', state: 'present' },
      { label: 'Actual start date', value: '16 Feb 2027', state: 'present' },
      { label: 'Current enrolment status', value: 'Enrolled', state: 'present' },
      { label: 'Visa expiry recorded in SMS', value: '28 Feb 2028', state: 'present' },
      { label: 'Passport recorded in SMS', value: 'P2298471', state: 'present' },
      { label: 'Insurance recorded in SMS', value: 'StudentSafe · POL-7781', state: 'present' },
    ],
    study: { start: '2027-02-16', end: '2027-12-05' },
    visa: { start: '2027-02-01', end: '2028-02-28' },
    insurance: { start: '2027-02-21', end: '2028-02-28' },
    exceptions: [
      {
        type: 'coverage-issue',
        detail: 'Insurance begins 5 days after the programme start date (16 Feb → 21 Feb 2027).',
      },
    ],
    actions: [
      {
        owner: 'school',
        party: 'NZMA',
        label: 'Request corrected insurance covering 16 Feb 2027 start',
        requested: '2026-09-22',
        due: '2026-09-27',
        status: 'outstanding',
      },
    ],
    timeline: [
      { date: '2026-05-14', label: 'Application submitted' },
      { date: '2026-06-02', label: 'Admissions approved' },
      { date: '2026-06-04', label: 'Unconditional Offer issued' },
      { date: '2026-06-04', label: 'Selected for Internal Control audit' },
      { date: '2026-07-28', label: 'Visa issued' },
      { date: '2026-08-19', label: 'Student arrived in NZ' },
      { date: '2026-09-19', label: 'Audit ready' },
      { date: '2026-09-21', label: 'Insurance coverage gap flagged for review' },
    ],
    decision: undefined,
  },

  // Student 4 — waiting on school for final evidence
  {
    id: 'ic-108744',
    applicationId: 'APP-108744',
    studentId: 'STU-48810',
    studentName: 'Chen Yu',
    dob: '2003-07-30',
    nationality: 'China',
    passport: 'EK774120',
    school: 'Yoobee Colleges',
    programme: 'Bachelor of Creative Technologies',
    campus: 'Wellington',
    intake: 'February 2027',
    programmeStart: '2027-02-16',
    offerStatus: 'Unconditional',
    visaStatus: 'missing',
    insuranceStatus: 'missing',
    status: 'waiting-school',
    daysOutstanding: 9,
    auditor: 'Daniel Cho',
    sampled: true,
    missing: ['Visa', 'Insurance confirmation'],
    evidenceStatus: [
      { label: 'Passport', available: true },
      { label: 'Offer of Place', available: true },
      { label: 'Final student visa', available: false },
      { label: 'Insurance', available: false },
      { label: 'School SMS confirmation', available: false },
    ],
    originalEvidence: [
      { label: 'Passport', state: 'available', value: 'EK774120 · China' },
      { label: 'Application information', state: 'available' },
      { label: 'Offer of Place', state: 'available', value: 'Unconditional · 30 Jun 2026' },
      { label: 'Programme', state: 'available', value: 'Bachelor of Creative Technologies' },
      { label: 'Campus', state: 'available', value: 'Wellington' },
      { label: 'Study start date', state: 'available', value: '16 Feb 2027' },
      { label: 'Study end date', state: 'available', value: '20 Nov 2029' },
      { label: 'Admissions conditions', state: 'available', value: 'None outstanding' },
    ],
    finalEvidence: [
      { label: 'Final NZ student visa', state: 'missing', note: 'Requested from school' },
      { label: 'Visa expiry date', state: 'missing' },
      { label: 'Visa conditions', state: 'missing' },
      { label: 'Final passport', state: 'available', value: 'EK774120 (unchanged)' },
      { label: 'Insurance evidence', state: 'missing', note: 'Requested from school' },
      { label: 'Insurance start date', state: 'missing' },
      { label: 'Insurance end date', state: 'missing' },
      { label: 'Confirmed programme start', state: 'missing', note: 'Requested from school' },
      { label: 'Confirmed school enrolment', state: 'missing' },
      { label: 'Student Management System', state: 'missing' },
    ],
    comparison: [
      { field: 'Student name', admissions: 'Chen Yu', final: 'Chen Yu', result: 'confirmed' },
      { field: 'DOB', admissions: '30 Jul 2003', final: '30 Jul 2003', result: 'confirmed' },
      { field: 'Passport', admissions: 'EK774120', final: 'EK774120', result: 'confirmed' },
      { field: 'School', admissions: 'Yoobee', final: 'Yoobee', result: 'confirmed' },
      {
        field: 'Programme',
        admissions: 'Bachelor Creative Tech.',
        final: '—',
        result: 'pending',
      },
      { field: 'Start date', admissions: '16 Feb 2027', final: '—', result: 'pending' },
      { field: 'Visa expiry', admissions: '—', final: '—', result: 'pending' },
      { field: 'Insurance start', admissions: '—', final: '—', result: 'pending' },
      { field: 'Insurance expiry', admissions: '—', final: '—', result: 'pending' },
    ],
    smsRecord: [
      { label: 'Student ID', value: 'STU-48810', state: 'present' },
      { label: 'School', value: 'Yoobee Colleges', state: 'present' },
      { label: 'Programme', value: 'Bachelor of Creative Technologies', state: 'present' },
      { label: 'Campus', value: 'Wellington', state: 'present' },
      { label: 'Actual start date', state: 'missing' },
      { label: 'Current enrolment status', state: 'missing' },
      { label: 'Visa expiry recorded in SMS', state: 'missing' },
      { label: 'Passport recorded in SMS', value: 'EK774120', state: 'present' },
      { label: 'Insurance recorded in SMS', state: 'missing' },
    ],
    study: { start: '2027-02-16', end: '2029-11-20' },
    visa: undefined,
    insurance: undefined,
    exceptions: [
      { type: 'missing-evidence', detail: 'Final student visa has not been supplied.' },
      { type: 'missing-evidence', detail: 'Insurance evidence has not been supplied.' },
      { type: 'sms-missing', detail: 'Actual start date has not been entered into the school SMS.' },
    ],
    actions: [
      {
        owner: 'school',
        party: 'Yoobee Colleges',
        label: 'Provide final visa, insurance and actual start date',
        requested: '2026-09-15',
        due: '2026-09-22',
        status: 'outstanding',
      },
    ],
    timeline: [
      { date: '2026-06-04', label: 'Application submitted' },
      { date: '2026-06-28', label: 'Admissions approved' },
      { date: '2026-06-30', label: 'Unconditional Offer issued' },
      { date: '2026-06-30', label: 'Selected for Internal Control audit' },
      { date: '2026-09-15', label: 'School requested to provide final evidence' },
    ],
    schoolRequest: {
      requested: '2026-09-15',
      requestedFrom: 'Yoobee Student Services',
      items: ['Student visa', 'Insurance', 'Programme start confirmation'],
      contact: 'Daniel Cho',
    },
    decision: undefined,
  },

  // Student 5 — SMS start date differs from offer → Review required
  {
    id: 'ic-108802',
    applicationId: 'APP-108802',
    studentId: 'STU-48944',
    studentName: 'Thanh Nguyen',
    dob: '2001-12-02',
    nationality: 'Vietnam',
    passport: 'C4471982',
    school: 'UPIC',
    programme: 'Foundation Certificate (Standard)',
    campus: 'Auckland',
    intake: 'February 2027',
    programmeStart: '2027-02-16',
    offerStatus: 'Unconditional',
    visaStatus: 'available',
    insuranceStatus: 'available',
    status: 'query',
    daysOutstanding: 4,
    auditor: 'Priya Nair',
    sampled: true,
    missing: ['Start date mismatch'],
    evidenceStatus: [
      { label: 'Passport', available: true },
      { label: 'Offer of Place', available: true },
      { label: 'Final student visa', available: true },
      { label: 'Insurance', available: true },
      { label: 'School SMS confirmation', available: true },
    ],
    originalEvidence: [
      { label: 'Passport', state: 'available', value: 'C4471982 · Vietnam' },
      { label: 'Application information', state: 'available' },
      { label: 'Offer of Place', state: 'available', value: 'Unconditional · 18 Jun 2026' },
      { label: 'Programme', state: 'available', value: 'Foundation Certificate (Standard)' },
      { label: 'Campus', state: 'available', value: 'Auckland' },
      { label: 'Study start date', state: 'available', value: '16 Feb 2027' },
      { label: 'Study end date', state: 'available', value: '27 Nov 2027' },
      { label: 'Admissions conditions', state: 'available', value: 'None outstanding' },
    ],
    finalEvidence: [
      { label: 'Final NZ student visa', state: 'available', value: 'Fee-paying student · 31 Mar 2028' },
      { label: 'Visa expiry date', state: 'available', value: '31 Mar 2028' },
      { label: 'Visa conditions', state: 'available', value: 'Study at UPIC only' },
      { label: 'Final passport', state: 'available', value: 'C4471982 (unchanged)' },
      { label: 'Insurance evidence', state: 'available', value: 'Uni-Care · UC-8890' },
      { label: 'Insurance start date', state: 'available', value: '12 Feb 2027' },
      { label: 'Insurance end date', state: 'available', value: '31 Mar 2028' },
      { label: 'Confirmed programme start', state: 'different', value: '23 Feb 2027 (SMS)' },
      { label: 'Confirmed school enrolment', state: 'available', value: 'Enrolled · active' },
      { label: 'Student Management System', state: 'available', value: 'Recorded (start differs)' },
    ],
    comparison: [
      { field: 'Student name', admissions: 'Thanh Nguyen', final: 'Thanh Nguyen', result: 'confirmed' },
      { field: 'DOB', admissions: '02 Dec 2001', final: '02 Dec 2001', result: 'confirmed' },
      { field: 'Passport', admissions: 'C4471982', final: 'C4471982', result: 'confirmed' },
      { field: 'School', admissions: 'UPIC', final: 'UPIC', result: 'confirmed' },
      {
        field: 'Programme',
        admissions: 'Foundation Certificate',
        final: 'Foundation Certificate',
        result: 'confirmed',
      },
      { field: 'Start date', admissions: '16 Feb 2027', final: '23 Feb 2027', result: 'review' },
      { field: 'Visa expiry', admissions: '—', final: '31 Mar 2028', result: 'confirmed' },
      { field: 'Insurance start', admissions: '—', final: '12 Feb 2027', result: 'confirmed' },
      { field: 'Insurance expiry', admissions: '—', final: '31 Mar 2028', result: 'confirmed' },
    ],
    smsRecord: [
      { label: 'Student ID', value: 'STU-48944', state: 'present' },
      { label: 'School', value: 'UPIC', state: 'present' },
      { label: 'Programme', value: 'Foundation Certificate (Standard)', state: 'present' },
      { label: 'Campus', value: 'Auckland', state: 'present' },
      { label: 'Actual start date', value: '23 Feb 2027', state: 'different' },
      { label: 'Current enrolment status', value: 'Enrolled', state: 'present' },
      { label: 'Visa expiry recorded in SMS', value: '31 Mar 2028', state: 'present' },
      { label: 'Passport recorded in SMS', value: 'C4471982', state: 'present' },
      { label: 'Insurance recorded in SMS', value: 'Uni-Care · UC-8890', state: 'present' },
    ],
    study: { start: '2027-02-16', end: '2027-11-27' },
    visa: { start: '2027-02-01', end: '2028-03-31' },
    insurance: { start: '2027-02-12', end: '2028-03-31' },
    exceptions: [
      {
        type: 'date-discrepancy',
        detail:
          'Confirmed school start date is 7 days later than the admissions record (Apply 16 Feb → SMS 23 Feb 2027).',
      },
    ],
    actions: [
      {
        owner: 'school',
        party: 'UPIC',
        label: 'Confirm reason for revised start date',
        requested: '2026-09-21',
        due: '2026-09-26',
        status: 'outstanding',
      },
    ],
    timeline: [
      { date: '2026-05-30', label: 'Application submitted' },
      { date: '2026-06-16', label: 'Admissions approved' },
      { date: '2026-06-18', label: 'Unconditional Offer issued' },
      { date: '2026-06-18', label: 'Selected for Internal Control audit' },
      { date: '2026-08-04', label: 'Visa issued' },
      { date: '2026-08-22', label: 'Student arrived in NZ' },
      { date: '2026-09-18', label: 'Audit ready' },
      { date: '2026-09-20', label: 'Start-date discrepancy flagged for review' },
    ],
    decision: undefined,
  },
]

export function getAuditRecord(id: string): AuditRecord | undefined {
  return AUDIT_RECORDS.find((r) => r.id === id)
}

// ── Dashboard aggregates ────────────────────────────────────────────────
// The summary cards reflect the whole audit population; the queue below shows
// a representative working set of records.

export const IC_SUMMARY = {
  population: 420,
  selected: 84,
  awaitingArrival: 31,
  waitingSchool: 18,
  ready: 21,
  underReview: 8,
  completed: 6,
}

export const IC_METRICS = {
  avgDaysWaitingSchool: 6.2,
  missingVisaRecords: 14,
  missingInsuranceRecords: 7,
  smsUpdatesOutstanding: 11,
}

export interface SchoolFollowUp {
  school: string
  outstanding: number
  oldestDays: number
  studentsImpacted: number
}

export const SCHOOL_FOLLOW_UPS: SchoolFollowUp[] = [
  { school: 'NZTC', outstanding: 12, oldestDays: 11, studentsImpacted: 9 },
  { school: 'Yoobee Colleges', outstanding: 8, oldestDays: 6, studentsImpacted: 7 },
  { school: 'Acknowledge Education', outstanding: 3, oldestDays: 2, studentsImpacted: 3 },
]

// ── Queue helpers ───────────────────────────────────────────────────────

export type QueueTab =
  | 'all'
  | 'selected'
  | 'awaiting-visa'
  | 'waiting-school'
  | 'ready'
  | 'queries'
  | 'complete'

export const QUEUE_TABS: { id: QueueTab; label: string; match: (s: ICStatus) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'selected', label: 'Selected', match: (s) => s === 'selected' },
  { id: 'awaiting-visa', label: 'Awaiting visa', match: (s) => s === 'awaiting-visa' },
  { id: 'waiting-school', label: 'Waiting on school', match: (s) => s === 'waiting-school' },
  { id: 'ready', label: 'Ready for audit', match: (s) => s === 'ready' },
  { id: 'queries', label: 'Queries', match: (s) => s === 'query' || s === 'in-review' },
  { id: 'complete', label: 'Complete', match: (s) => s === 'complete' },
]

export function sortedQueue(records: AuditRecord[]): AuditRecord[] {
  return [...records].sort((a, b) => {
    const pa = IC_STATUS_PRIORITY.indexOf(a.status)
    const pb = IC_STATUS_PRIORITY.indexOf(b.status)
    if (pa !== pb) return pa - pb
    return b.daysOutstanding - a.daysOutstanding
  })
}

export function evidenceAvailableCount(r: AuditRecord): { available: number; total: number } {
  const total = r.evidenceStatus.length
  const available = r.evidenceStatus.filter((e) => e.available).length
  return { available, total }
}

// Coverage assessment for the date timeline: is the study period fully covered
// by both the visa and insurance windows?
export interface CoverageAssessment {
  ok: boolean
  issues: string[]
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000)
}

export function assessCoverage(r: AuditRecord): CoverageAssessment {
  const issues: string[] = []
  if (!r.visa) issues.push('Visa evidence not yet supplied.')
  if (!r.insurance) issues.push('Insurance evidence not yet supplied.')
  if (r.insurance) {
    const gap = daysBetween(r.study.start, r.insurance.start)
    if (gap > 0) issues.push(`Insurance begins ${gap} day${gap === 1 ? '' : 's'} after the programme start date.`)
    if (new Date(r.insurance.end) < new Date(r.study.end))
      issues.push('Insurance expires before the study period ends.')
  }
  if (r.visa && new Date(r.visa.end) < new Date(r.study.end))
    issues.push('Visa expires before the study period ends.')
  return { ok: issues.length === 0, issues }
}
