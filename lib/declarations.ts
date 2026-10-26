import type { Declaration, DeclarationKey } from './types'

export const DECLARATION_VERSION = '2026.1'

export const DECLARATION_LABELS: Record<DeclarationKey, string> = {
  terms:
    'The student has read and agreed to the UP Education international student terms and conditions, including the refund policy.',
  consultant:
    'I confirm I am the education consultant for this student, and the information in this application is true and complete to the best of my knowledge.',
}

export const PRIVACY_NOTE =
  'Personal information is collected under the Privacy Act 2020 and is used to assess the application, administer enrolment, and report to the Ministry of Education and Immigration New Zealand.'

// Placeholder summary. Replace with the current published terms before go-live.
export const TERMS_SUMMARY = [
  'Tuition fees are payable before the visa application is lodged, unless an instalment plan is approved.',
  'Refunds follow the UP Education refund policy and the Education (Pastoral Care of Tertiary and International Learners) Code of Practice 2021.',
  'Students must hold a valid visa and approved medical and travel insurance for the full period of study.',
  'Attendance and academic progress are monitored and may be reported to Immigration New Zealand.',
  'Students under 18 must live in approved accommodation for the duration of their study.',
]

export function buildDeclarations(acceptedBy: string, acceptedAt: string): Declaration[] {
  return (Object.keys(DECLARATION_LABELS) as DeclarationKey[]).map((key) => ({
    key,
    label: DECLARATION_LABELS[key],
    acceptedBy,
    acceptedAt,
    version: DECLARATION_VERSION,
  }))
}
