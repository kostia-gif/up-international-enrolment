// Admissions-side derivations: the review queue and the three-step review of
// a single application.
import type { Application, Document, Field } from './types'
import { ADMISSIONS_REVIEW_CONDITION } from './fixtures'

export type QueueGroup = 'fast-track' | 'review'

// Anything submitted that still carries an open admissions sign-off.
export function needsSignOff(app: Application): boolean {
  if (app.stage === 'Draft') return false
  return app.conditions.some(
    (c) => c.label === ADMISSIONS_REVIEW_CONDITION && c.status !== 'cleared',
  )
}

export function admissionsQueue(apps: Application[]): Application[] {
  return apps.filter(needsSignOff)
}

// Fast-track: auto-routed, LoO already issued. Review: routed by an agent note.
export function queueGroup(app: Application): QueueGroup {
  return app.route === 'auto' && app.stage === 'Conditional offer' ? 'fast-track' : 'review'
}

export function sortedByAge(apps: Application[]): Application[] {
  return [...apps].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

export type ReviewStepKind = 'documents' | 'fields' | 'decision'

export interface ReviewStep {
  kind: ReviewStepKind
  title: string
  short: string
}

export const REVIEW_STEPS: ReviewStep[] = [
  { kind: 'documents', title: 'Documents', short: 'Documents' },
  { kind: 'fields', title: 'Fields', short: 'Fields' },
  { kind: 'decision', title: 'Decision', short: 'Decision' },
]

export function sourceDocument(app: Application, field: Field): Document | undefined {
  if (!field.sourceDoc) return undefined
  return app.documents.find((d) => d.id === field.sourceDoc)
}
