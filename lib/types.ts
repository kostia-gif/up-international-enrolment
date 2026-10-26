// Domain model for the Agent POC. All data is mock; screens share these typed
// objects through the client store in lib/store.tsx.
import type { CrmApplicationPayload } from './crm'

export type Stage = 'Draft' | 'Submitted' | 'Conditional offer' | 'Unconditional' | 'Payment & visa'

export const STAGES: Stage[] = [
  'Draft',
  'Submitted',
  'Conditional offer',
  'Unconditional',
  'Payment & visa',
]

// Who issued the Letter of Offer: the agent instantly via the platform, or UP admissions.
export type LooIssuer = 'agent' | 'up'

export type PaymentState = 'outstanding' | 'part-paid' | 'paid'

export interface PaymentStatus {
  state: PaymentState
  totalDue: number // NZD
  paid: number // NZD
  updatedAt: string
}

export type VisaState = 'not-lodged' | 'lodged' | 'approved'

export interface VisaStatus {
  state: VisaState
  updatedAt?: string
  approvalDoc?: string // docId of the uploaded visa approval
}

export type Route = 'auto' | 'review'

export type Brand = 'NZMA' | 'Yoobee' | 'UPIC' | 'NZTC'
export type CourseLevel = 'Pathway' | 'Vocational' | 'Degree' | 'Postgraduate'

export interface Course {
  brand: Brand
  programmeName: string // NZQA-approved name
  level: string // e.g. "Level 4"
  levelGroup: CourseLevel
  campus: string
  intakeDate: string // ISO date of the selected intake start
  priceBundle: string // display string, e.g. "NZD 24,500"
  durationMonths: number
}

export type DocStatus = 'queued' | 'reviewing' | 'checked' | 'problem'

export interface Document {
  id: string
  type: string // DocType used for auto-rename, e.g. "Passport"
  fileName: string // renamed: DocType_PreID.pdf
  originalName: string
  language: string
  translatedPdf?: boolean
  status: DocStatus
  problem?: string
  pages?: number
  // Set when a document's authenticity was checked against an external
  // verification service (e.g. Pearson score verification for English tests).
  verifiedBy?: string
  verifiedNote?: string
}

export type FieldSection =
  | 'Personal'
  | 'Contact'
  | 'Home address'
  | 'Secondary education'
  | 'Tertiary education'
  | 'English'
  | 'Study record'
  | 'Study gap'
  | 'Immigration'
  | 'Emergency contact'
  | 'Health'
  | 'Insurance'
  | 'Funding'
  | 'Agent'
  | 'Course'

export type FieldSource = 'ai' | 'agent' | 'up'
export type FieldStatus = 'ai' | 'confirmed' | 'verified' | 'missing' | 'conflict'

// document: read from an uploaded file. manual: asked of the student (AI may
// pre-fill some). derived: computed from other answers, read-only.
export type FieldKind = 'document' | 'manual' | 'derived'

export interface Field {
  key: string
  label: string
  section: FieldSection
  kind: FieldKind
  value: string
  required: boolean
  source: FieldSource
  // Grey tag for a pre-answered value the agent can override,
  // e.g. "suggested from transcript".
  hint?: string
  sourceDoc?: string
  sourcePage?: number
  confidence?: number // 0..1
  status: FieldStatus
  conflictNote?: string
}

export type RequirementCategory = 'identity' | 'academic' | 'english' | 'course' | 'other'

export type RequirementStatus = 'met' | 'missing' | 'problem' | 'expiring' | 'not-applicable'

export interface Requirement {
  id: string
  label: string
  category: RequirementCategory
  status: RequirementStatus
  evidence?: string // docId
  note?: string
}

export type ConditionOwner = 'agent' | 'student' | 'up'
export type ConditionStatus = 'open' | 'submitted' | 'cleared'

export interface Condition {
  id: string
  label: string
  owner: ConditionOwner
  status: ConditionStatus
  dueBy?: string
  evidence?: string
  createdFrom: 'system' | 'up'
}

export type EventActor = 'ai' | 'agent' | 'up'

// 'system' covers internal platform/AI actions.
export type EventChannel = 'agent-tool' | 'system'

// A file that arrived with an event and was added to the application.
export interface EventAttachment {
  name: string
  addedTo: string
}

export interface AppEvent {
  ts: string // ISO datetime
  actor: EventActor
  label: string
  detail?: string
  channel?: EventChannel
  attachments?: EventAttachment[]
}

export interface Readiness {
  evidenceMet: boolean
  looReady: boolean
  fieldsDone: number
  fieldsTotal: number
  // Required student answers (manual fields) still outstanding.
  answersOutstanding: number
}

export type DeclarationKey = 'terms' | 'consultant'

export interface Declaration {
  key: DeclarationKey
  label: string
  acceptedBy: string
  acceptedAt: string // ISO datetime
  version: string
}

export type HoldReason = 'documents' | 'manager' | 'other'

export interface CrmHold {
  reason: HoldReason
  note: string
  savedAt: string
  savedBy: string
}

export interface Application {
  id: string
  preId: string
  studentName: string
  agentRef?: string
  agentId: string
  agencyId: string
  course: Course
  stage: Stage
  route: Route
  documents: Document[]
  fields: Field[]
  requirements: Requirement[]
  conditions: Condition[]
  events: AppEvent[]
  notesToAdmissions?: string
  declarations?: Declaration[]
  duplicateHold?: boolean
  // Set when the record is pushed to Dynamics 365 (auto LoO or admissions approve).
  crmPushedAt?: string
  crmPayload?: CrmApplicationPayload
  // Set when admissions puts the review on hold.
  crmHold?: CrmHold
  looIssuedBy?: LooIssuer
  // Latest UP-side update the agent has not opened yet (cleared on view).
  unseenUpdate?: string
  payment?: PaymentStatus
  visa?: VisaStatus
  daysInStage: number
  createdAt: string
}

export interface Counsellor {
  id: string
  name: string
  role: 'owner' | 'counsellor'
}

export interface Agency {
  id: string
  name: string
  counsellors: Counsellor[]
}
