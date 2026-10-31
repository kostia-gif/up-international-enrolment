// Step 3 business rules. Takes what Step 2 read and verified and turns it into
// a traffic-light assessment: can this application proceed, with what
// conditions, and what will admissions or INZ ask for.
import type { Course, Document, Requirement } from './types'
import { isTeachingCourse } from './derive'
import { describeEnglishRule, englishRuleFor, type EntryIssues } from './entry-rules'
import { COURSE_TYPE_LABEL, visaRiskFor, type VisaRisk } from './eligibility'

import { offerPermissionFor, type AgentProfile } from './agent-profiles'

export type Tone = 'green' | 'amber' | 'red'

export type CheckKind =
  | 'agent'
  | 'student'
  | 'documents'
  | 'entry'
  | 'english'
  | 'immigration'
  | 'course'

export type DuplicateState = 'idle' | 'checking' | 'clear' | 'hold'

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
  // A hard stop: the file cannot continue past Step 3 regardless of merit
  // (student linked to another agent, or the agent's account cannot submit).
  blocked: boolean
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
  // Result of the existing-student check run when the passport was read.
  duplicate: DuplicateState
  // The signed-in agent's account; undefined when no profile is known.
  agent: AgentProfile | undefined
}

export function assessApplication(input: AssessmentInput): Assessment {
  const { course, documentRequirements, entryIssues, documents, nationality, englishRead, duplicate, agent } =
    input
  const checks: AssessmentCheck[] = []
  const courseName = course?.programmeName ?? 'this course'
  const teaching = course ? isTeachingCourse(course) : false

  // 0. Agent account — can this agent submit at all?
  const permission = offerPermissionFor(agent)
  const agentBlocked = !permission.canSubmit
  if (agentBlocked) {
    checks.push({
      kind: 'agent',
      tone: 'red',
      title: `Your account is ${agent?.status.toLowerCase() ?? 'inactive'} — you cannot submit this application`,
      detail: permission.reason ?? 'Contact your regional manager to reinstate your account.',
      actions: ['Contact your regional manager', 'Existing applications continue to be processed'],
    })
  } else if (agent?.status === 'Probation') {
    checks.push({
      kind: 'agent',
      tone: 'amber',
      title: 'Your account is on probation — admissions reviews every application',
      detail: 'You can continue, but UP admissions will review this file before any offer is created.',
      actions: [],
    })
  } else {
    checks.push({
      kind: 'agent',
      tone: 'green',
      title: 'Your account is active',
      detail: agent?.canIssueConditionalLoo
        ? 'You can submit and create a conditional offer where the assessment allows it.'
        : 'You can submit. UP creates the offer, as your account does not hold the conditional-offer right.',
      actions: [],
    })
  }

  // 0b. Student identity — is this student already linked to another agent?
  const duplicateHold = duplicate === 'hold'
  if (duplicateHold) {
    checks.push({
      kind: 'student',
      tone: 'red',
      title: 'Student already linked to another agent',
      detail:
        'The passport matches a student on file with a different agent. This application cannot continue until the student transfers to you.',
      actions: [
        'Download the change-of-agent form and ask the student to sign it',
        'Send the signed form to your regional manager',
      ],
    })
  } else if (duplicate === 'clear') {
    checks.push({
      kind: 'student',
      tone: 'green',
      title: 'No existing record for this student',
      detail: 'The passport does not match a student linked to another agent.',
      actions: [],
    })
  } else {
    checks.push({
      kind: 'student',
      tone: 'amber',
      title: duplicate === 'checking' ? 'Checking for an existing student record' : 'Existing-student check not run yet',
      detail:
        duplicate === 'checking'
          ? 'Hold on — matching the passport against students already on file.'
          : 'Upload the passport in Step 2 so the student can be matched against existing records.',
      actions: duplicate === 'checking' ? [] : ['Upload the passport'],
    })
  }

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
        title: 'Low INZ refusal risk for applications like this',
        detail: `Only around ${risk.refusalRate}% of ${risk.nationality} students applying for ${label} study are refused a visa by INZ.`,
        actions: [],
      })
    } else if (risk.level === 'medium') {
      checks.push({
        kind: 'immigration',
        tone: 'amber',
        title: 'Potential INZ refusal risk — extra evidence is optional but recommended',
        detail: `Around ${risk.refusalRate}% of ${risk.nationality} students applying for ${label} study are refused a visa. You can continue as normal; adding the items below in Review strengthens the file.`,
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
        title: 'High INZ refusal risk — visa evidence is required',
        detail: `Around ${risk.refusalRate}% of ${risk.nationality} students applying for ${label} study are refused a visa. The evidence below must be provided, and admissions reviews it before any offer is issued.`,
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

  const blocked = agentBlocked || duplicateHold

  let overall = worst(checks.filter((c) => c.kind !== 'agent' && c.kind !== 'student').map((c) => c.tone))
  // A single red (immigration) stays a strong amber warning; it turns red when
  // the qualification gap compounds it.
  if (highRisk && !entryGap) overall = 'amber'
  if (highRisk && entryGap) overall = 'red'
  // Probation / pending duplicate check are at least amber; hard stops are red.
  if (agent?.status === 'Probation' || duplicate !== 'clear') overall = worst([overall, 'amber'])
  if (blocked) overall = 'red'

  const headline = blocked
    ? duplicateHold
      ? 'Student is linked to another agent — cannot continue'
      : 'Your account cannot submit applications'
    : overall === 'green'
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

  const summary = blocked
    ? duplicateHold
      ? 'The documents may well meet the requirements, but the student is already on file with a different agent. Arrange a change of agent through your regional manager before applying.'
      : (permission.reason ?? 'Contact your regional manager.')
    : overall === 'green'
      ? missing.length > 0
        ? `Documents read so far meet the requirements for ${courseName}. ${joinAnd(missing.map((r) => lowerFirst(r.label)))} can follow as offer conditions.`
        : `All documents meet the requirements for ${courseName}, and applications like this have a low INZ refusal rate.`
      : overall === 'amber'
        ? entryGap
          ? `The documents are in order but the qualification falls short for ${courseName}. Continue only with RPL or a special admission request, or choose an alternative.`
          : highRisk
            ? `Documents and entry are fine, but ${nationality} applicants for this level of study face a high INZ refusal rate. Visa evidence is required before submitting.`
            : `The application can continue. The items listed below are optional but will strengthen the file with admissions and INZ.`
        : `${courseName} is unlikely to proceed as it stands: the qualification does not meet the entry level and the INZ refusal rate is high. Talk to the student about a pathway or alternative course.`

  return {
    overall,
    headline,
    summary,
    checks,
    missingDocs: missing,
    risk,
    conditionalOfferAllowed: !blocked && overall !== 'red' && !entryGap && permission.canIssueLoo,
    admissionsReviewRequired:
      highRisk || entryGap || entryTone === 'amber' || teaching || agent?.status === 'Probation',
    blocked,
  }
}
