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
  const open = requiredFields(app.fields).filter((f) => !isFieldComplete(f, app.fields))
  const docFields = open.filter((f) => f.kind !== 'manual').length
  const answers = open.length - docFields
  if (docFields > 0) items.push(`${docFields} document field${docFields === 1 ? '' : 's'} to confirm`)
  if (answers > 0) items.push(`${answers} answer${answers === 1 ? '' : 's'} still needed from the student`)
  return items
}

export function fieldsProgress(app: Application): number {
  const r = computeReadiness(app)
  return r.fieldsTotal === 0 ? 0 : Math.round((r.fieldsDone / r.fieldsTotal) * 100)
}

const EVIDENCE_CATEGORIES: RequirementCategory[] = [
  'identity',
  'academic',
  'english',
  'course',
]

// How many of the core evidence categories are satisfied, for the gauge arc.
export function evidenceProgress(app: Application): { done: number; total: number } {
  const present = EVIDENCE_CATEGORIES.filter((cat) =>
    app.requirements.some((r) => r.category === cat),
  )
  const total = present.length || EVIDENCE_CATEGORIES.length
  const done = present.filter((cat) => {
    if (cat === 'english') {
      return (
        categorySatisfied(app.requirements, 'english') || hasEnglishCondition(app)
      )
    }
    return categorySatisfied(app.requirements, cat)
  }).length
  return { done, total }
}
