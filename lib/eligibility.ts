import type { Application, CourseLevel } from './types'
import { isUnconditional, outstandingDocs, waitingOn } from './dashboard'

// Illustrative student visa approval rates (%) by country of citizenship and
// course type. POC data only — replace with the INZ Student Visa decision
// dataset before production use.
export const INZ_DATA_LABEL = 'Guidance based on INZ student visa outcomes for similar applications'

const APPROVAL_RATES: Record<string, Partial<Record<CourseLevel, number>>> = {
  India: { Pathway: 42, Vocational: 38, Degree: 71, Postgraduate: 76 },
  Pakistan: { Pathway: 50, Vocational: 44, Degree: 63, Postgraduate: 69 },
  Bangladesh: { Pathway: 55, Vocational: 49, Degree: 66, Postgraduate: 72 },
  Nepal: { Pathway: 57, Vocational: 51, Degree: 68, Postgraduate: 73 },
  'Sri Lanka': { Pathway: 64, Vocational: 60, Degree: 58, Postgraduate: 79 },
  Nigeria: { Pathway: 48, Vocational: 45, Degree: 60, Postgraduate: 66 },
  Ghana: { Pathway: 30, Vocational: 26, Degree: 34, Postgraduate: 18 },
  Vietnam: { Pathway: 80, Vocational: 78, Degree: 86, Postgraduate: 88 },
  Philippines: { Pathway: 79, Vocational: 74, Degree: 84, Postgraduate: 87 },
  'Saudi Arabia': { Pathway: 88, Vocational: 86, Degree: 91, Postgraduate: 92 },
  China: { Pathway: 93, Vocational: 90, Degree: 95, Postgraduate: 96 },
  Japan: { Pathway: 97, Vocational: 96, Degree: 98, Postgraduate: 98 },
  Italy: { Pathway: 98, Vocational: 97, Degree: 98, Postgraduate: 99 },
}

const DEFAULT_RATE = 85

export type RiskLevel = 'high' | 'medium' | 'low'

// Bands come from INZ refusal rates (100 − approval). The rates drive the band
// only; agents see the band and coaching, never the percentages.
//   high   ≥ 60% refused — evidence strongly recommended, admissions reviews first
//   medium ≥ 40% refused — evidence recommended, admissions reviews first
//   low    < 40% refused — the only band where an agent may issue a (conditional) offer
// Visa evidence never blocks submission: UP coaches, it doesn't gatekeep.
export const RISK_THRESHOLDS = { high: 60, medium: 40 } as const

export type RiskEvidenceLevel = 'recommended' | 'optional' | 'none'

export const RISK_META: Record<RiskLevel, { label: string; short: string; evidence: RiskEvidenceLevel }> = {
  high: { label: 'High visa risk', short: 'High risk', evidence: 'recommended' },
  medium: { label: 'Medium visa risk', short: 'Medium risk', evidence: 'optional' },
  low: { label: 'Low visa risk', short: 'Low risk', evidence: 'none' },
}

// What each band means for the agent, written as partnership not policing.
export const RISK_COACHING: Record<RiskLevel, { headline: string; message: string }> = {
  low: {
    headline: 'Looking good for the visa',
    message:
      'Based on what we know, students from this country applying for this kind of study usually get their visa. Nothing extra is needed from you. Submit with confidence.',
  },
  medium: {
    headline: 'A few things worth preparing together',
    message:
      'Immigration New Zealand looks a little more closely at applications like this one. We are in this with you. Gathering the documents below from the start gives your student the best chance, and UP admissions reviews the application with you before the offer.',
  },
  high: {
    headline: 'Let’s build a strong visa case together',
    message:
      'Immigration New Zealand looks closely at applications like this one, so a well-prepared file makes a real difference. Here is what INZ usually looks for and why. UP admissions will work through it with you before the offer is made.',
  },
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

// Visa evidence is guidance at every band; nothing blocks submission. Kept as
// a function so callers read the policy rather than hard-code it.
export function evidenceRequired(_level: RiskLevel): boolean {
  return false
}

export function nationalityOf(app: Pick<Application, 'fields'>): string {
  return app.fields.find((f) => f.key === 'nationality')?.value ?? ''
}

export function visaRisk(app: Pick<Application, 'fields' | 'course'>): VisaRisk | null {
  return visaRiskFor(nationalityOf(app), app.course.levelGroup)
}

// Coaching shown when the band is medium or high: what INZ looks for, why,
// and what to gather. Order matters; the Review step reads by index.
export const RISK_TIPS: { title: string; detail: string; why: string }[] = [
  {
    title: 'A clear reason for study',
    detail:
      'Help your student explain why this course, why New Zealand, why now, and how it fits their study history and career plans at home.',
    why: 'INZ wants to see a genuine student with a plan. A clear story answers most questions before they are asked.',
  },
  {
    title: 'Context for anything unusual',
    detail:
      'A short note on any study gap, a course at a lower level than previous study, or an earlier visa refusal, with evidence such as employment letters.',
    why: 'Gaps and step-downs are common and usually fine. Explaining them up front stops them becoming a reason to query.',
  },
  {
    title: 'Funds for tuition and living costs',
    detail:
      'Enough to cover first-year tuition plus NZD 20,000 for living costs, from a source that is easy to trace.',
    why: 'Being able to support themselves is one of the main things INZ checks for every student visa.',
  },
  {
    title: 'Financial documents INZ accepts',
    detail:
      'Any of: 3–6 months of bank statements in the student’s or sponsor’s name; a sponsor declaration with the sponsor’s income evidence; an education loan approval letter; a scholarship award letter.',
    why: 'Gathering the right documents from the start avoids delays once the visa is lodged.',
  },
]

export const FINANCIAL_DOCUMENT_TYPES = [
  'Bank statements (last 3–6 months)',
  'Sponsor declaration with income evidence',
  'Education loan approval letter',
  'Scholarship award letter',
]

// Agents never issue an unconditional offer — only UP admissions does, after
// verifying the conditions. What the review step can produce:
// - low: conditional offer (if the agent holds the right)
// - medium / high: no offer from the platform; UP admissions reviews first
export type OfferOutcome = 'conditional' | 'withheld'

export const RISK_REVIEW_CONDITION = 'Visa risk evidence verified by UP admissions'
// Every agent-issued offer stays conditional on UP's final check, even when
// the student has nothing outstanding.
export const UP_VERIFICATION_CONDITION = 'Final verification of documents by UP admissions'
export const PURPOSE_MIN_CHARS = 40

export function offerOutcomeFor(level: RiskLevel): OfferOutcome {
  return level === 'low' ? 'conditional' : 'withheld'
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
          ? 'INZ looks closely at applications like this. A clear reason for study and solid financial documents make a real difference.'
          : 'INZ looks a little more closely at applications like this. Financial documents and a clear reason for study help.',
    })
  } else {
    checks.push({
      severity: 'ok',
      label: `${RISK_META.low.label}: ${risk.nationality} × ${COURSE_TYPE_LABEL[risk.courseType]}`,
    })
  }

  const funds = hasFinancialEvidence(app)
  if (!funds) {
    checks.push({
      severity: risk?.level === 'high' ? 'danger' : 'warning',
      label: 'No financial documents yet',
      detail: 'Bank statements, a sponsor declaration, a loan letter or a scholarship letter all work.',
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
  conditional: 'Agent can issue a conditional offer',
  withheld: 'UP admissions reviews it with you before the offer',
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
    label: `${RISK_META[risk.level].label}: ${risk.nationality} × ${COURSE_TYPE_LABEL[risk.courseType]}`,
    detail: risk.known
      ? RISK_COACHING[risk.level].headline
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

  // A previous refusal always routes to admissions review (S5-01).
  const outcome: OfferOutcome = profile.previousRefusal ? 'withheld' : offerOutcomeFor(risk.level)

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
