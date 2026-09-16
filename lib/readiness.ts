import type {
  Application,
  Field,
  Readiness,
  Requirement,
  RequirementCategory,
  Route,
} from './types'

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
  if (f.status === 'confirmed' || f.status === 'verified') return true
  return f.source === 'agent' && f.value.trim() !== ''
}

export function computeReadiness(app: Application): Readiness {
  const requiredFields = app.fields.filter((f) => f.required)
  const fieldsTotal = requiredFields.length
  const fieldsDone = requiredFields.filter(isFieldDone).length

  const identity = categorySatisfied(app.requirements, 'identity')
  const academic = categorySatisfied(app.requirements, 'academic')
  const course = categorySatisfied(app.requirements, 'course')
  const english = categorySatisfied(app.requirements, 'english') || hasEnglishCondition(app)

  const evidenceMet = identity && academic && course && english
  const looReady = evidenceMet && fieldsTotal > 0 && fieldsDone === fieldsTotal

  return { evidenceMet, looReady, fieldsDone, fieldsTotal }
}

// Route is computed at submit: auto unless the agent attached a discount,
// special-admission request, or a free-text note to admissions.
export function computeRoute(app: Application): Route {
  const triggers = app.requests.some(
    (r) => r.type === 'discount' || r.type === 'special-admission',
  )
  const hasNote = !!app.notesToAdmissions && app.notesToAdmissions.trim() !== ''
  return triggers || hasNote ? 'review' : 'auto'
}

export function routeReasons(app: Application): string[] {
  const reasons: string[] = []
  if (app.requests.some((r) => r.type === 'discount')) reasons.push('discount requested')
  if (app.requests.some((r) => r.type === 'special-admission'))
    reasons.push('special admission')
  if (app.notesToAdmissions && app.notesToAdmissions.trim() !== '')
    reasons.push('note to admissions')
  return reasons
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
