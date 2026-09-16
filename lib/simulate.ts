// Simulated AI. No network, no models — just timed promises so the prototype
// shows AI *state* (a row moving reviewing -> checked, a field gaining a source
// marker) rather than AI personality.
import type { Field } from './types'

export const REVIEW_MS = 1200
export const DUPLICATE_MS = 1500

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Passport numbers that collide with an existing application under another
// agent. Entering one puts the new application on hold.
export const DUPLICATE_PASSPORTS = new Set(['P4417820', 'PH8842019'])

export interface DuplicateResult {
  hold: boolean
  message?: string
}

export async function simulateDuplicateCheck(passportNo: string): Promise<DuplicateResult> {
  await delay(DUPLICATE_MS)
  if (DUPLICATE_PASSPORTS.has(passportNo.trim().toUpperCase())) {
    return {
      hold: true,
      message:
        "This student may already have an application with UP. We've placed this on hold and the sales team will contact you.",
    }
  }
  return { hold: false }
}

// A file the agent can drop in Step 2. The outcome is predetermined so the
// prototype can demonstrate both clean and problem paths.
export interface DropFile {
  originalName: string
  type: string
  language: string
  translated?: boolean
  problem?: string
  pages: number
  // fields this document contributes, and the requirement it satisfies
  satisfiesRequirement?: string
  fields: Array<Pick<Field, 'key' | 'value' | 'confidence'>>
}

export interface ReviewResult {
  classifiedType: string
  problem?: string
  fields: DropFile['fields']
  satisfiesRequirement?: string
  translated?: boolean
}

export async function simulateReview(file: DropFile): Promise<ReviewResult> {
  await delay(REVIEW_MS)
  return {
    classifiedType: file.type,
    problem: file.problem,
    fields: file.problem ? [] : file.fields,
    satisfiesRequirement: file.problem ? undefined : file.satisfiesRequirement,
    translated: file.translated,
  }
}

export const EMAIL_CAPTURE_DELAY = 900

// English-test verification is a two-step flow:
//   1. AI reads the uploaded report and checks the score against the course's
//      minimum entry requirement (fast, local).
//   2. The score is confirmed with the test provider's verification API
//      (Pearson for PTE, the IELTS TRF service, etc.) using the candidate's
//      registration ID, to prove the report is authentic and unaltered.
export const SCORE_REVIEW_MS = 1600
export const PEARSON_MS = 2400

// What the AI extracts from the uploaded score report in step 1.
export interface EnglishScore {
  testType: string
  overall: string
  bands: { label: string; value: string }[]
  candidateId: string // the student's provider registration ID
  testDate: string
  expiry: string
  meetsRequirement: boolean
  minRequired: string // course minimum, e.g. "PTE 50 (IELTS 6.0 equivalent)"
}

// What the provider's API returns in step 2.
export interface ProviderVerification {
  provider: string
  scoreReportCode: string
  verifiedAt: string
}

export async function simulateScoreReview(): Promise<EnglishScore> {
  await delay(SCORE_REVIEW_MS)
  return {
    testType: 'PTE Academic',
    overall: '65',
    bands: [
      { label: 'Listening', value: '66' },
      { label: 'Reading', value: '63' },
      { label: 'Speaking', value: '68' },
      { label: 'Writing', value: '64' },
    ],
    candidateId: 'PTE-88213045',
    testDate: '2026-08-28',
    expiry: '2028-08-28',
    meetsRequirement: true,
    minRequired: 'PTE 50 (IELTS 6.0 equivalent)',
  }
}

export async function simulateProviderConfirm(): Promise<ProviderVerification> {
  await delay(PEARSON_MS)
  return {
    provider: 'Pearson PTE — Score Verification',
    scoreReportCode: 'SRC-4F9A21C7',
    verifiedAt: new Date().toISOString(),
  }
}
