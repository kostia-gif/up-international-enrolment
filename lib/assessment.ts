// Step 3 business rules. Takes what Step 2 read and verified and turns it into
// a traffic-light assessment: can this application proceed, with what
// conditions, and what will admissions or INZ ask for.
import type { Course, Document, Requirement } from './types'
import { isTeachingCourse } from './derive'
import { describeEnglishRule, englishRuleFor, type EntryIssues } from './entry-rules'
import { COURSE_TYPE_LABEL, visaRiskFor, type VisaRisk } from './eligibility'

export type Tone = 'green' | 'amber' | 'red'

export type CheckKind = 'documents' | 'entry' | 'english' | 'immigration' | 'course'

export interface AssessmentCheck {
  kind: CheckKind
  tone: Tone
  title: string
  detail: string
  // Concrete things the agent (or student) must do next.
  actions: string[]
}

export interface Assessment {
  overall: Tone
  headline: string
  summary: string
  checks: AssessmentCheck[]
  missingDocs: Requirement[]
  risk: VisaRisk | null
  // Whether the agent can create a conditional offer from here.
  conditionalOfferAllowed: boolean
  // Whether admissions must review before any offer (red paths).
  admissionsReviewRequired: boolean
}

const TONE_RANK: Record<Tone, number> = { green: 0, amber: 1, red: 2 }

function worst(tones: Tone[]): Tone {
  return tones.reduce<Tone>((acc, t) => (TONE_RANK[t] > TONE_RANK[acc] ? t : acc), 'green')
}

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export interface AssessmentInput {
  course: Course | null
  // Requirements as Step 2 left them: met / missing / expiring by document only.
  documentRequirements: Requirement[]
  entryIssues: EntryIssues
  documents: Document[]
  nationality: string
  englishRead: boolean
}

export function assessApplication(input: AssessmentInput): Assessment {
  const { course, documentRequirements, entryIssues, documents, nationality, englishRead } = input
  const checks: AssessmentCheck[] = []
  const courseName = course?.programmeName ?? 'this course'
  const teaching = course ? isTeachingCourse(course) : false

  // 1. Documents collected
  const evidence = documentRequirements.filter(
    (r) => r.category !== 'course' && r.status !== 'not-applicable',
  )
  const missing = evidence.filter((r) => r.status === 'missing')
  const expiring = evidence.filter((r) => r.status === 'expiring')
  const missingEnglishOnly = missing.length > 0 && missing.every((r) => r.category === 'english')
  const problemDocs = documents.filter((d) => d.status === 'problem')

  if (missing.length === 0 && expiring.length === 0) {
    checks.push({
      kind: 'documents',
      tone: 'green',
      title: 'All documents collected',
      detail: `Every document required for ${courseName} has been read, translated where needed and checked.`,
      actions: [],
    })
  } else {
    const labels = missing.map((r) => lowerFirst(r.label))
    checks.push({
      kind: 'documents',
      tone: 'green',
      title: `${missing.length + expiring.length} document${missing.length + expiring.length === 1 ? '' : 's'} still to collect`,
      detail: missingEnglishOnly
        ? 'Everything else is in place. The English result can follow — it becomes a condition on the offer.'
        : `Still needed before a Letter of Offer can be issued: ${joinAnd(labels)}.${expiring.length ? ' Some evidence also expires before the course ends.' : ''}`,
      actions: [
        ...missing.map((r) => `Upload ${lowerFirst(r.label)} when collected`),
        ...expiring.map((r) => `Renew: ${r.label}`),
        ...(problemDocs.length
          ? [`Replace ${problemDocs.length} rejected file${problemDocs.length === 1 ? '' : 's'} (see Step 2 for the fix)`]
          : []),
      ],
    })
  }

  // 2. Academic entry requirement
  const academicRead = evidence.some((r) => r.category === 'academic' && r.status !== 'missing')
  if (entryIssues.qualification || entryIssues.grade) {
    checks.push({
      kind: 'entry',
      tone: 'amber',
      title: 'Qualifications do not meet the entry requirement',
      detail: [entryIssues.qualification, entryIssues.grade].filter(Boolean).join(' '),
      actions: [
        'Add RPL or work-experience evidence under Special admissions in Answers',
        'Or submit a special admission request for admissions to consider',
        'Or switch to a suggested alternative course',
      ],
    })
  } else if (academicRead) {
    checks.push({
      kind: 'entry',
      tone: 'green',
      title: 'Academic entry requirement met',
      detail: `The transcript meets the published entry level for ${courseName}.`,
      actions: [],
    })
  } else {
    checks.push({
      kind: 'entry',
      tone: 'amber',
      title: 'Academic entry not yet assessed',
      detail: 'No transcript has been read, so the qualification level and grades cannot be checked yet.',
      actions: ['Upload academic transcripts'],
    })
  }

  // 3. English
  if (course) {
    const rule = describeEnglishRule(englishRuleFor(course))
    if (entryIssues.english) {
      checks.push({
        kind: 'english',
        tone: 'amber',
        title: 'English score below the requirement',
        detail: `${entryIssues.english} Required: ${rule}.`,
        actions: ['Re-sit the test, or consider a pathway course that includes academic English'],
      })
    } else if (englishRead) {
      checks.push({
        kind: 'english',
        tone: 'green',
        title: 'English requirement met',
        detail: `Verified score meets ${rule}.`,
        actions: [],
      })
    } else {
      checks.push({
        kind: 'english',
        tone: 'green',
        title: 'English result outstanding',
        detail: `Required: ${rule}. Carried as a condition on the offer until the result is uploaded.`,
        actions: ['Upload the English test result when available'],
      })
    }
  }

  // 4. Immigration risk
  const risk = visaRiskFor(nationality, course?.levelGroup)
  if (risk) {
    const label = COURSE_TYPE_LABEL[risk.courseType]
    if (risk.level === 'low') {
      checks.push({
        kind: 'immigration',
        tone: 'green',
        title: 'High visa acceptance for applications like this',
        detail: `Around ${risk.approvalRate}% of ${risk.nationality} students applying for ${label} study are approved by INZ.`,
        actions: [],
      })
    } else if (risk.level === 'elevated') {
      checks.push({
        kind: 'immigration',
        tone: 'amber',
        title: 'Immigration risk — more information will be requested',
        detail: `INZ approves around ${risk.approvalRate}% of ${risk.nationality} students for ${label} study. The application will ask for extra evidence.`,
        actions: [
          'Reason for study: why this course, why New Zealand, why now',
          'Financial evidence: bank statements or sponsor declaration covering tuition and living costs',
          'Explain any study gaps or previous visa refusals',
        ],
      })
    } else {
      checks.push({
        kind: 'immigration',
        tone: 'red',
        title: 'High immigration risk for this country and course',
        detail: `INZ approves only around ${risk.approvalRate}% of ${risk.nationality} students for ${label} study. Admissions will review the visa evidence before any offer is issued.`,
        actions: [
          'Statement of purpose and genuine-student evidence',
          'Proof of funds for first-year tuition plus NZD 20,000 living costs',
          'Evidence of ties to home country and any previous visa history',
        ],
      })
    }
  }

  // 5. Course-specific requirements (teaching)
  if (teaching) {
    const extras = documentRequirements.filter((r) => r.category === 'other')
    const outstanding = extras.filter((r) => r.status !== 'met')
    checks.push({
      kind: 'course',
      tone: 'amber',
      title: 'Teaching programme — additional checks and an interview',
      detail:
        'The Teaching Council requires police vetting and referee reports, and the school interviews every applicant before an offer.',
      actions: [
        ...outstanding
          .filter((r) => !/interview/i.test(r.label))
          .map((r) => `Provide ${lowerFirst(r.label)}`),
        'An admission interview will be scheduled once documents are complete',
      ],
    })
  }

  // Overall
  const entryTone = checks.find((c) => c.kind === 'entry')?.tone ?? 'green'
  const immigrationTone = checks.find((c) => c.kind === 'immigration')?.tone ?? 'green'
  const entryGap = Boolean(entryIssues.qualification || entryIssues.grade)
  const highRisk = immigrationTone === 'red'

  let overall = worst(checks.map((c) => c.tone))
  // A single red (immigration) stays a strong amber warning; it turns red when
  // the qualification gap compounds it.
  if (highRisk && !entryGap) overall = 'amber'
  if (highRisk && entryGap) overall = 'red'

  const headline =
    overall === 'green'
      ? missing.length > 0
        ? 'Ready for a conditional offer'
        : 'Ready to apply'
      : overall === 'amber'
        ? entryGap
          ? 'Entry requirement not met — action needed'
          : highRisk
            ? 'High immigration risk — proceed with evidence'
            : 'More information needed'
        : 'Qualification gap and high immigration risk'

  const summary =
    overall === 'green'
      ? missing.length > 0
        ? `Documents read so far meet the requirements for ${courseName}. ${joinAnd(missing.map((r) => lowerFirst(r.label)))} can follow as offer conditions.`
        : `All documents meet the requirements for ${courseName}, and applications like this have a high acceptance rate.`
      : overall === 'amber'
        ? entryGap
          ? `The documents are in order but the qualification falls short for ${courseName}. Continue only with RPL or a special admission request, or choose an alternative.`
          : highRisk
            ? `Documents and entry are fine, but ${nationality} applicants for this level of study face a low INZ approval rate. Prepare the visa evidence before submitting.`
            : `The application can continue, but admissions or INZ will ask for the items listed below before an offer or visa is granted.`
        : `${courseName} is unlikely to proceed as it stands: the qualification does not meet the entry level and the visa approval rate is low. Talk to the student about a pathway or alternative course.`

  return {
    overall,
    headline,
    summary,
    checks,
    missingDocs: missing,
    risk,
    conditionalOfferAllowed: overall !== 'red' && !entryGap,
    admissionsReviewRequired: highRisk || entryGap || entryTone === 'amber' || teaching,
  }
}
