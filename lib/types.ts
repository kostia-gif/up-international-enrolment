// Domain model for the Agent POC. All data is mock; screens share these typed
// objects through the client store in lib/store.tsx.
import type { CrmApplicationPayload } from './crm'

export type Stage = 'Draft' | 'Submitted' | 'Conditional offer' | 'Unconditional'

export const STAGES: Stage[] = ['Draft', 'Submitted', 'Conditional offer', 'Unconditional']

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

export type FieldSection = 'Personal' | 'Contact' | 'Education history' | 'Course'

export type FieldSource = 'ai' | 'agent' | 'up'
export type FieldStatus = 'ai' | 'confirmed' | 'verified' | 'missing' | 'conflict'

export interface Field {
  key: string
  label: string
  section: FieldSection
  value: string
  required: boolean
  source: FieldSource
  sourceDoc?: string
  sourcePage?: number
  confidence?: number // 0..1
  status: FieldStatus
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
  duplicateHold?: boolean
  // Set when the record is pushed to Dynamics 365 (auto LoO or admissions approve).
  crmPushedAt?: string
  crmPayload?: CrmApplicationPayload
  // Set when admissions puts the review on hold.
  crmHold?: CrmHold
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
