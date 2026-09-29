// Domain model for the Apply prototype. All data is mock; screens share these
// typed objects through the client store in lib/store.tsx.

export type Stage =
  | 'Draft'
  | 'Reviewing'
  | 'Gaps'
  | 'Data'
  | 'Requests'
  | 'Submitted'
  | 'Conditional offer'
  | 'Conditions open'
  | 'Unconditional'
  | 'Accepted'
  | 'Paid'

export const STAGES: Stage[] = [
  'Draft',
  'Reviewing',
  'Gaps',
  'Data',
  'Requests',
  'Submitted',
  'Conditional offer',
  'Conditions open',
  'Unconditional',
  'Accepted',
  'Paid',
]

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
  | 'Emergency contact'
  | 'Education history'
  | 'Health'
  | 'Course'
  | 'Insurance'

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

export type RequirementCategory =
  | 'identity'
  | 'academic'
  | 'english'
  | 'course'
  | 'other'

export type RequirementStatus =
  | 'met'
  | 'missing'
  | 'problem'
  | 'expiring'
  | 'not-applicable'

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
  createdFrom: 'system' | 'up' | 'email'
}

export type RequestType =
  | 'discount'
  | 'ready-to-commit'
  | 'special-admission'
  | 'insurance'
export type RequestStatus = 'pending' | 'approved' | 'declined'

export interface CaseFile {
  experienceYears: number
  roleLevel: string
  references: string[]
  summary: string
}

export interface Request {
  type: RequestType
  detail: string
  status: RequestStatus
  caseFile?: CaseFile
}

export type EventActor = 'ai' | 'agent' | 'up' | 'email'

// The channel an engagement came through. 'system' covers internal
// platform/AI actions that did not arrive from an external channel.
export type EventChannel = 'agent-tool' | 'email' | 'whatsapp' | 'system'

// A file that arrived with an engagement and was auto-added to the platform.
export interface EventAttachment {
  name: string
  // Where the platform filed it, e.g. "Applicant file" or "IELTS — evidence".
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

// Why an admissions officer paused a review and sent it back to CRM.
export type HoldReason = 'documents' | 'regional-manager' | 'campus-manager' | 'other'

export interface CrmHold {
  reason: HoldReason
  note: string
  // The review step the officer was on, so the file reopens where it stopped.
  stepIndex: number
  stepTitle: string
  approvedSteps: string[]
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
  bundle?: Course[]
  stage: Stage
  route: Route
  documents: Document[]
  fields: Field[]
  requirements: Requirement[]
  conditions: Condition[]
  requests: Request[]
  events: AppEvent[]
  notesToAdmissions?: string
  // demo-only flags
  duplicateHold?: boolean
  // Admissions prioritises fast-tracked files at the top of the review queue.
  fastTrack?: boolean
  // Set once an admissions officer completes the review and pushes to CRM.
  crmPushedAt?: string
  // Set when admissions saves and closes a review part-way through.
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

export interface InboundEmail {
  id: string
  ts: string
  sender: string
  subject: string
  matchedApplicationId?: string
  extractedSummary?: string // "2 documents added, 1 condition cleared"
  documents?: string[] // original file names
}
