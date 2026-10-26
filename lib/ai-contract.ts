// What the real document AI must return. lib/simulate.ts returns these shapes
// so the UI is already wired to the integration contract.

export interface ExtractedField {
  key: string // matches a key in lib/blank-fields.ts
  value: string
  confidence: number // 0..1
  page: number // 1-based page the value was read from
}

export interface DocumentReadResult {
  classifiedType: string // e.g. "Passport", "Transcript", "EnglishTest"
  language: string // detected source language
  translated: boolean // an English translation was produced
  pages: number
  problem?: string // set when the document cannot be used
  fields: ExtractedField[]
  satisfiesRequirement?: string // requirement category the document evidences
}

export interface EnglishVerifyResult {
  provider: string // e.g. "Pearson PTE — Score Verification"
  candidateId: string
  verified: boolean
  scores: {
    testType: string
    overall: string
    bands: { label: string; value: string }[]
    testDate: string
    expiry: string
  }
  note: string // provider reference, e.g. score report code
}
