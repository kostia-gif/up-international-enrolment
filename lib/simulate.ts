// Simulated AI. No network, no models — timed promises that return the shapes
// in lib/ai-contract.ts, so the real document AI can drop in behind them.
import type { Field } from './types'
import type { DocumentReadResult, EnglishVerifyResult } from './ai-contract'
import { englishShortfall, type EnglishRule } from './entry-rules'

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
        'This student may already have an application with UP. Placed on hold — UP will contact you.',
    }
  }
  return { hold: false }
}

// A demo file the agent can drop in Step 2. The outcome is predetermined so the
// prototype can demonstrate both clean and problem paths.
export interface DropFile {
  originalName: string
  type: string
  language: string
  translated?: boolean
  problem?: string
  pages: number
  satisfiesRequirement?: string
  fields: Array<Pick<Field, 'key' | 'value' | 'confidence'>>
}

export async function simulateReview(file: DropFile, ms = REVIEW_MS): Promise<DocumentReadResult> {
  await delay(ms)
  return {
    classifiedType: file.type,
    language: file.language,
    translated: !!file.translated,
    pages: file.pages,
    problem: file.problem,
    fields: file.problem
      ? []
      : file.fields.map((f) => ({
          key: f.key,
          value: f.value,
          confidence: f.confidence ?? 0.9,
          page: 1,
        })),
    satisfiesRequirement: file.problem ? undefined : file.satisfiesRequirement,
  }
}

// English-test verification is a two-step flow:
//   1. AI reads the uploaded report and checks the score against the course's
//      minimum entry requirement.
//   2. The score is confirmed with the test provider's verification API using
//      the candidate's registration ID.
export const SCORE_REVIEW_MS = 1600
export const PEARSON_MS = 2400

// What the AI reads from the uploaded score report in step 1.
export interface EnglishScore {
  testType: string
  overall: string
  bands: { label: string; value: string }[]
  candidateId: string
  testDate: string
  expiry: string
  meetsRequirement: boolean
  minRequired: string
  shortfall?: string
}

export async function simulateScoreReview(rule: EnglishRule): Promise<EnglishScore> {
  await delay(SCORE_REVIEW_MS)
  const read = {
    testType: 'PTE Academic',
    overall: '65',
    bands: [
      { label: 'Listening', value: '66' },
      { label: 'Reading', value: '63' },
      { label: 'Speaking', value: '68' },
      { label: 'Writing', value: '64' },
    ],
  }
  const shortfall = englishShortfall(read, rule)
  return {
    ...read,
    candidateId: 'PTE-88213045',
    testDate: '2026-08-28',
    expiry: '2028-08-28',
    meetsRequirement: shortfall === null,
    minRequired: `PTE ${rule.pte}, no band below ${rule.pteBand} (IELTS ${rule.ielts.toFixed(1)} equivalent)`,
    shortfall: shortfall ?? undefined,
  }
}

export async function simulateProviderConfirm(score: EnglishScore): Promise<EnglishVerifyResult> {
  await delay(PEARSON_MS)
  return {
    provider: 'Pearson PTE — Score Verification',
    candidateId: score.candidateId,
    verified: true,
    scores: {
      testType: score.testType,
      overall: score.overall,
      bands: score.bands,
      testDate: score.testDate,
      expiry: score.expiry,
    },
    note: 'SRC-4F9A21C7',
  }
}
