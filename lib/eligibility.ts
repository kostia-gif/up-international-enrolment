import type { Application, CourseLevel } from './types'
import { isUnconditional, outstandingDocs, waitingOn } from './dashboard'

// Illustrative student visa approval rates (%) by country of citizenship and
// course type. POC data only — replace with the INZ Student Visa decision
// dataset before production use.
export const INZ_DATA_LABEL = 'Based on INZ student visa refusal rates'

const APPROVAL_RATES: Record<string, Partial<Record<CourseLevel, number>>> = {
  India: { Pathway: 42, Vocational: 38, Degree: 71, Postgraduate: 76 },
  Pakistan: { Pathway: 50, Vocational: 44, Degree: 63, Postgraduate: 69 },
  Bangladesh: { Pathway: 55, Vocational: 49, Degree: 66, Postgraduate: 72 },
  Nepal: { Pathway: 57, Vocational: 51, Degree: 68, Postgraduate: 73 },
  'Sri Lanka': { Pathway: 64, Vocational: 60, Degree: 74, Postgraduate: 79 },
  Nigeria: { Pathway: 48, Vocational: 45, Degree: 60, Postgraduate: 66 },
  Vietnam: { Pathway: 80, Vocational: 78, Degree: 86, Postgraduate: 88 },
  Philippines: { Pathway: 79, Vocational: 74, Degree: 84, Postgraduate: 87 },
  'Saudi Arabia': { Pathway: 88, Vocational: 86, Degree: 91, Postgraduate: 92 },
  China: { Pathway: 93, Vocational: 90, Degree: 95, Postgraduate: 96 },
  Japan: { Pathway: 97, Vocational: 96, Degree: 98, Postgraduate: 98 },
  Italy: { Pathway: 98, Vocational: 97, Degree: 98, Postgraduate: 99 },
}

const DEFAULT_RATE = 85

export type RiskLevel = 'high' | 'medium' | 'low'

// Bands are expressed as INZ refusal rate (100 − approval):
//   high   ≥ 60% refused — visa evidence is mandatory, admissions reviews first
//   medium ≥ 20% refused — "potential refusal risk", evidence optional but advised
//   low    < 20% refused
export const RISK_THRESHOLDS = { high: 60, medium: 20 } as const

export const RISK_META: Record<
  RiskLevel,
  { label: string; short: string; evidence: 'mandatory' | 'optional' | 'none' }
> = {
  high: { label: 'High INZ refusal risk', short: 'High risk', evidence: 'mandatory' },
  medium: { label: 'Potential INZ refusal risk', short: 'Potential risk', evidence: 'optional' },
  low: { label: 'Low INZ refusal risk', short: 'Low risk', evidence: 'none' },
}

export const COURSE_TYPE_LABEL: Record<CourseLevel, string> = {
  Pathway: 'pathway',
  Vocational: 'vocational diploma/certificate',
  Degree: 'degree-level',
  Postgraduate: 'postgraduate',
}

export function riskFromRefusal(refusalRate: number): RiskLevel {
  if (refusalRate >= RISK_THRESHOLDS.high) return 'high'
  if (refusalRate >= RISK_THRESHOLDS.medium) return 'medium'
  return 'low'
}

export function riskFromRate(approvalRate: number): RiskLevel {
  return riskFromRefusal(100 - approvalRate)
}

export interface VisaRisk {
  nationality: string
  courseType: CourseLevel
  approvalRate: number
  refusalRate: number
  known: boolean
  level: RiskLevel
}

export function visaRiskFor(nationality: string, courseType: CourseLevel | undefined): VisaRisk | null {
  const country = nationality.trim()
  if (!country || !courseType) return null
  const row = APPROVAL_RATES[country]
  const rate = row?.[courseType] ?? DEFAULT_RATE
  return {
    nationality: country,
    courseType,
    approvalRate: rate,
    refusalRate: 100 - rate,
    known: Boolean(row?.[courseType]),
    level: riskFromRate(rate),
  }
}

// Whether visa-risk evidence must be collected before the file can proceed.
export function evidenceRequired(level: RiskLevel): boolean {
  return RISK_META[level].evidence === 'mandatory'
}

export function nationalityOf(app: Pick<Application, 'fields'>): string {
  return app.fields.find((f) => f.key === 'nationality')?.value ?? ''
}

export function visaRisk(app: Pick<Application, 'fields' | 'course'>): VisaRisk | null {
  return visaRiskFor(nationalityOf(app), app.course.levelGroup)
}

// Guidance shown whenever refusal risk is medium or high.
export const RISK_TIPS: { title: string; detail: string }[] = [
  {
    title: 'Confirm purpose of travel',
    detail:
      'Write a clear statement of purpose: why this course, why New Zealand, why now, and how it fits the student’s study history and career plan.',
  },
  {
    title: 'Address common refusal reasons',
    detail:
      'Explain any study gaps, a course that steps down from previous study, weak ties to the home country, or earlier visa refusals before INZ asks.',
  },
  {
    title: 'Check financial viability',
    detail:
      'Confirm funds cover first-year tuition plus INZ living costs (NZD 20,000 per year) and that the source of funds is genuine and traceable.',
  },
  {
    title: 'Add proof of funds to the application',
    detail:
      'Upload 3–6 months of bank statements, a sponsor declaration with the sponsor’s income evidence, or an education loan sanction letter.',
  },
]

// What the review step can issue for each risk level:
// - low: healthy file, unconditional offer (or conditional if student
//   conditions such as an expiring English test are still open)
// - medium: same as low — evidence is offered but optional
// - high: no offer from the platform; admissions reviews the evidence first
export type OfferOutcome = 'unconditional' | 'conditional' | 'withheld'

export const RISK_REVIEW_CONDITION = 'Visa risk evidence verified by UP admissions'
export const PURPOSE_MIN_CHARS = 40

export function offerOutcomeFor(level: RiskLevel, hasStudentConditions: boolean): OfferOutcome {
  if (level === 'high') return 'withheld'
  return hasStudentConditions ? 'conditional' : 'unconditional'
}

export interface RiskEvidenceInput {
  purpose: string
  refusalsAddressed: boolean
  fundsConfirmed: boolean
  fundsDocId?: string
}

export function riskEvidenceGaps(e: RiskEvidenceInput): string[] {
  const gaps: string[] = []
  if (e.purpose.trim().length < PURPOSE_MIN_CHARS) gaps.push('Purpose of travel statement')
  if (!e.refusalsAddressed) gaps.push('Common refusal reasons addressed')
  if (!e.fundsDocId) gaps.push('Proof of funds uploaded')
  if (!e.fundsConfirmed) gaps.push('Financial viability confirmed')
  return gaps
}

export type CheckSeverity = 'danger' | 'warning' | 'ok'

export interface EligibilityCheck {
  severity: CheckSeverity
  label: string
  detail?: string
}

export interface EligibilityResult {
  appId: string
  studentName: string
  programme: string
  risk: VisaRisk | null
  checks: EligibilityCheck[]
}

function hasFinancialEvidence(app: Application): boolean {
  const req = app.requirements.find((r) => /financ|bank|fund/i.test(r.label))
  if (req) return req.status === 'met'
  return app.documents.some(
    (d) => d.status === 'checked' && /financ|bank|fund/i.test(`${d.type} ${d.originalName}`),
  )
}

function fieldValue(app: Application, key: string): string {
  return app.fields.find((f) => f.key === key)?.value ?? ''
}

export function checkEligibility(app: Application): EligibilityResult {
  const risk = visaRisk(app)
  const checks: EligibilityCheck[] = []

  if (!risk) {
    checks.push({
      severity: 'warning',
      label: 'Country of citizenship not captured yet',
      detail: 'Upload the passport so refusal risk can be assessed.',
    })
  } else if (risk.level !== 'low') {
    checks.push({
      severity: risk.level === 'high' ? 'danger' : 'warning',
      label: `${RISK_META[risk.level].label}: ${risk.nationality} × ${COURSE_TYPE_LABEL[risk.courseType]}`,
      detail:
        risk.level === 'high'
          ? `About ${risk.refusalRate}% of comparable applications are refused. Visa evidence is required.`
          : `About ${risk.refusalRate}% of comparable applications are refused. Visa evidence is optional but strengthens the file.`,
    })
  } else {
    checks.push({
      severity: 'ok',
      label: `${risk.nationality} × ${COURSE_TYPE_LABEL[risk.courseType]}: about ${risk.refusalRate}% refused`,
    })
  }

  const funds = hasFinancialEvidence(app)
  if (!funds) {
    checks.push({
      severity: risk?.level === 'high' ? 'danger' : 'warning',
      label: 'No proof of funds on file',
      detail: 'Add bank statements, a sponsor declaration or a loan letter.',
    })
  }

  if (fieldValue(app, 'gap_reason') || fieldValue(app, 'gap_start')) {
    checks.push({
      severity: 'warning',
      label: 'Study gap declared',
      detail: 'Make sure the gap is explained with evidence (employment letters, payslips).',
    })
  }

  if (fieldValue(app, 'visa_refused') === 'Yes') {
    checks.push({
      severity: 'danger',
      label: 'Previous visa refusal',
      detail: 'INZ will expect the earlier refusal reasons to be addressed directly.',
    })
  }

  const english = app.requirements.find((r) => r.category === 'english')
  if (english && english.status !== 'met' && english.status !== 'not-applicable') {
    checks.push({
      severity: 'warning',
      label: 'English requirement not met yet',
      detail: english.note,
    })
  }

  if (checks.every((c) => c.severity === 'ok')) {
    checks.push({ severity: 'ok', label: 'No eligibility warnings' })
  }

  return {
    appId: app.id,
    studentName: app.studentName,
    programme: app.course.programmeName,
    risk,
    checks,
  }
}

const SEVERITY_RANK: Record<CheckSeverity, number> = { danger: 0, warning: 1, ok: 2 }

export function worstSeverity(result: EligibilityResult): CheckSeverity {
  return result.checks.reduce<CheckSeverity>(
    (worst, c) => (SEVERITY_RANK[c.severity] < SEVERITY_RANK[worst] ? c.severity : worst),
    'ok',
  )
}

export function checkEligibilityAll(apps: Application[]): EligibilityResult[] {
  return apps
    .filter((a) => !isUnconditional(a))
    .map(checkEligibility)
    .sort((a, b) => SEVERITY_RANK[worstSeverity(a)] - SEVERITY_RANK[worstSeverity(b)])
}

export const KNOWN_COUNTRIES = Object.keys(APPROVAL_RATES)

export const OFFER_OUTCOME_LABEL: Record<OfferOutcome, string> = {
  unconditional: 'Unconditional offer can be issued',
  conditional: 'Conditional offer only, once risk evidence is provided',
  withheld: 'No offer from the platform, UP admissions must review first',
}

export interface ProspectProfile {
  nationality: string
  courseType: CourseLevel
  programme?: string
  proofOfFunds?: boolean
  studyGapYears?: number
  previousRefusal?: boolean
  englishMet?: boolean
}

export interface ProspectResult {
  profile: ProspectProfile
  risk: VisaRisk
  checks: EligibilityCheck[]
  outcome: OfferOutcome
}

export function testProspect(profile: ProspectProfile): ProspectResult {
  const risk = visaRiskFor(profile.nationality, profile.courseType) as VisaRisk
  const elevated = risk.level !== 'low'
  const checks: EligibilityCheck[] = []

  checks.push({
    severity: risk.level === 'high' ? 'danger' : elevated ? 'warning' : 'ok',
    label: `${risk.nationality} × ${COURSE_TYPE_LABEL[risk.courseType]}: about ${risk.refusalRate}% refused`,
    detail: risk.known
      ? RISK_META[risk.level].label
      : 'No country-specific data, so the overall average is used.',
  })

  if (profile.proofOfFunds === false) {
    checks.push({
      severity: risk.level === 'high' ? 'danger' : 'warning',
      label: 'No proof of funds yet',
      detail: 'Needs first-year tuition plus NZD 20,000 living costs, with traceable bank statements or a sponsor declaration.',
    })
  } else if (profile.proofOfFunds === true) {
    checks.push({ severity: 'ok', label: 'Proof of funds available' })
  }

  if (profile.studyGapYears && profile.studyGapYears > 0) {
    checks.push({
      severity: profile.studyGapYears >= 2 || elevated ? 'warning' : 'ok',
      label: `Study gap of ${profile.studyGapYears} year${profile.studyGapYears === 1 ? '' : 's'}`,
      detail: 'Explain the gap with employment letters, payslips or other evidence.',
    })
  }

  if (profile.previousRefusal) {
    checks.push({
      severity: 'danger',
      label: 'Previous visa refusal',
      detail: 'Address the earlier refusal reasons directly in the purpose-of-travel statement.',
    })
  }

  if (profile.englishMet === false) {
    checks.push({
      severity: 'warning',
      label: 'English requirement not met yet',
      detail: 'The offer will carry an English condition until a valid test result is provided.',
    })
  }

  const hasStudentConditions = profile.englishMet === false || profile.proofOfFunds === false
  let outcome = offerOutcomeFor(risk.level, hasStudentConditions)
  if (profile.previousRefusal && outcome === 'unconditional') outcome = 'conditional'

  return { profile, risk, checks, outcome }
}

export interface TopTask {
  appId: string
  studentName: string
  label: string
  priority: number // lower first
}

export function summariseTopTasks(apps: Application[], limit = 5): TopTask[] {
  const tasks: TopTask[] = []
  for (const app of apps) {
    if (app.stage === 'Payment & visa') continue
    const name = app.studentName
    if (app.unseenUpdate) {
      tasks.push({ appId: app.id, studentName: name, label: `Review update: ${app.unseenUpdate}`, priority: 1 })
    }
    const risk = visaRisk(app)
    if (risk?.level === 'high' && !hasFinancialEvidence(app)) {
      tasks.push({
        appId: app.id,
        studentName: name,
        label: 'High refusal risk — add proof of funds and a purpose-of-travel statement',
        priority: 0,
      })
    }
    if (waitingOn(app) !== 'you') continue
    if (app.stage === 'Draft') {
      tasks.push({ appId: app.id, studentName: name, label: 'Finish and submit draft', priority: 3 })
      continue
    }
    const docs = outstandingDocs(app)
    if (docs.length > 0) {
      tasks.push({
        appId: app.id,
        studentName: name,
        label: `Upload ${docs[0].label.toLowerCase()}${docs.length > 1 ? ` (+${docs.length - 1} more)` : ''}`,
        priority: 2,
      })
    }
    const open = app.conditions.filter((c) => c.status === 'open' && c.owner !== 'up')
    if (open.length > 0) {
      tasks.push({
        appId: app.id,
        studentName: name,
        label: `Clear condition: ${open[0].label}${open.length > 1 ? ` (+${open.length - 1} more)` : ''}`,
        priority: 2,
      })
    }
    if (app.stage === 'Unconditional') {
      tasks.push({ appId: app.id, studentName: name, label: 'Send unconditional offer to student', priority: 2 })
    }
  }
  return tasks.sort((a, b) => a.priority - b.priority).slice(0, limit)
}
