import type {
  Application,
  Field,
  Readiness,
  Requirement,
  RequirementCategory,
  Route,
} from './types'
import { fieldError, isApplicable } from './field-specs'

// A category is satisfied when every applicable requirement in it is "met".
// "expiring", "missing" and "problem" all block it — an expiring English test
// is a gap, not a pass.
function categorySatisfied(reqs: Requirement[], cat: RequirementCategory): boolean {
  const items = reqs.filter((r) => r.category === cat && r.status !== 'not-applicable')
  if (items.length === 0) return true
  return items.every((r) => r.status === 'met')
}

function hasEnglishCondition(app: Application): boolean {
  return app.conditions.some((c) => /english|ielts|toefl|pte/i.test(c.label))
}

export function isFieldDone(f: Field): boolean {
  if (f.value.trim() === '') return false
  if (f.status === 'confirmed' || f.status === 'verified') return true
  return f.source === 'agent'
}

// Required, applicable, non-derived fields. Conditional fields only count
// when their parent answer applies.
export function requiredFields(fields: Field[]): Field[] {
  return fields.filter((f) => f.required && f.kind !== 'derived' && isApplicable(f, fields))
}

export function isFieldComplete(f: Field, fields: Field[]): boolean {
  return isFieldDone(f) && fieldError(f, fields) === null
}

export function computeReadiness(app: Application): Readiness {
  const required = requiredFields(app.fields)
  const fieldsTotal = required.length
  const fieldsDone = required.filter((f) => isFieldComplete(f, app.fields)).length
  const answersOutstanding = required.filter(
    (f) => f.kind === 'manual' && !isFieldComplete(f, app.fields),
  ).length

  const identity = categorySatisfied(app.requirements, 'identity')
  const academic = categorySatisfied(app.requirements, 'academic')
  const course = categorySatisfied(app.requirements, 'course')
  const english = categorySatisfied(app.requirements, 'english') || hasEnglishCondition(app)

  const evidenceMet = identity && academic && course && english
  const looReady = evidenceMet && fieldsTotal > 0 && fieldsDone === fieldsTotal

  return { evidenceMet, looReady, fieldsDone, fieldsTotal, answersOutstanding }
}

// Why an application goes to admissions review instead of auto-issuing.
export function reviewReasons(app: Application): string[] {
  const reasons: string[] = []
  if (app.notesToAdmissions && app.notesToAdmissions.trim() !== '') reasons.push('note to admissions')
  if (app.fields.some((f) => f.key === 'visa_refused' && f.value === 'Yes')) {
    reasons.push('previous visa refusal')
  }
  return reasons
}

export function computeRoute(app: Application): Route {
  return reviewReasons(app).length > 0 ? 'review' : 'auto'
}

// What still blocks a conditional LoO, in plain labels.
export function blockingItems(app: Application): string[] {
  const items: string[] = []
  for (const r of app.requirements) {
    if (r.category === 'english' || r.status === 'met' || r.status === 'not-applicable') continue
    items.push(`${r.label}${r.status === 'missing' ? '' : ` (${r.status})`}`)
  }
  const { conflicts, toConfirm, missing } = answerCounts(app)
  if (conflicts > 0) items.push(`${conflicts} conflict${conflicts === 1 ? '' : 's'} to resolve`)
  if (toConfirm > 0) items.push(`${toConfirm} AI-read answer${toConfirm === 1 ? '' : 's'} to confirm`)
  if (missing > 0) items.push(`${missing} answer${missing === 1 ? '' : 's'} to complete`)
  return items
}

export interface AnswerCounts {
  conflicts: number
  toConfirm: number
  missing: number
  total: number
}

// The exact required answers still to complete by hand: not a conflict and
// not an AI read awaiting confirmation. Drives the "N answers to complete"
// blocker so the agent is shown which fields, not just how many.
export function openAnswerFields(app: Application): Field[] {
  return requiredFields(app.fields).filter(
    (f) =>
      !isFieldComplete(f, app.fields) &&
      f.status !== 'conflict' &&
      !(f.source === 'ai' && f.status === 'ai'),
  )
}

export function answerCounts(app: Application): AnswerCounts {
  const open = requiredFields(app.fields).filter((f) => !isFieldComplete(f, app.fields))
  const conflicts = open.filter((f) => f.status === 'conflict').length
  const toConfirm = open.filter((f) => f.source === 'ai' && f.status === 'ai').length
  return {
    conflicts,
    toConfirm,
    missing: open.length - conflicts - toConfirm,
    total: open.length,
  }
}

export interface ReadinessSummary {
  // `conditioned` items are not met but do not block: they become a
  // condition on the offer (e.g. an English test still to come).
  requirements: { met: number; total: number; outstanding: string[]; conditioned: string[] }
  answers: AnswerCounts
  ready: boolean
}

// The single agent-facing readiness view: requirements, answers, and whether
// the application can be submitted.
export function readinessSummary(app: Application): ReadinessSummary {
  const items = app.requirements.filter((r) => r.status !== 'not-applicable')
  const englishCovered = hasEnglishCondition(app)
  const outstanding: string[] = []
  const conditioned: string[] = []
  let met = 0
  for (const r of items) {
    if (r.status === 'met') {
      met += 1
      continue
    }
    if (r.category === 'english' && englishCovered) {
      conditioned.push(r.label)
      continue
    }
    outstanding.push(
      r.status === 'missing' ? r.label : `${r.label} (${r.status === 'problem' ? 'not met' : r.status})`,
    )
  }
  const readiness = computeReadiness(app)
  return {
    requirements: { met, total: items.length, outstanding, conditioned },
    answers: answerCounts(app),
    ready: readiness.looReady,
  }
}
