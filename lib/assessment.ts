// Step 3 business rules. Takes what Step 2 read and verified and turns it into
// a traffic-light assessment: can this application proceed, with what
// conditions, and what will admissions or INZ ask for.
import type { Audience, Course, Document, Requirement } from './types'
import { isTeachingCourse } from './derive'
import { describeEnglishRule, englishRuleFor, type EntryIssues } from './entry-rules'
import { COURSE_TYPE_LABEL, RISK_COACHING, visaRiskFor, type VisaRisk } from './eligibility'

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
  // Amber only because of the visa band: show coaching, not a problem.
  visaCoachingOnly: boolean
  // Medium or high visa band: UP admissions reviews with the agent before the offer.
  visaReviewFirst: boolean
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

function upperFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
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
  // Students applying direct get no agent-account check, never self-issue an
  // offer, and read the result in their own voice.
  audience?: Audience
}

export function assessApplication(input: AssessmentInput): Assessment {
  const result = assessForAgent(input)
  return input.audience === 'student' ? toStudentVoice(result) : result
}

// Rewrites the agent-facing result for a student applying themselves. The
// rules and outcome are unchanged; only who it speaks to.
function toStudentVoice(a: Assessment): Assessment {
  const voice = (s: string) =>
    s
      .replace(/Talk to the student about/g, 'Consider')
      .replace(/ask the student to/gi, 'please')
      .replace(/the student's|the student’s/gi, 'your')
      .replace(/the student is/gi, 'you are')
      .replace(/the student has/gi, 'you have')
      .replace(/the student/gi, 'you')
      .replace(/you cannot apply for this student/g, "you can't apply for this course")
      .replace(/Student is linked to another agent — cannot continue/g, 'You already have an application with an agent')
  const checks = a.checks
    .filter((c) => c.kind !== 'agent')
    .map((c) =>
      c.kind === 'student' && c.tone === 'red'
        ? {
            ...c,
            title: 'You already have an application with an agent',
            detail:
              'Your passport matches a student already on file with an education agent. Contact your agent, or ask UP to move your application to you.',
            actions: ['Contact UP admissions to transfer your application'],
          }
        : c.kind === 'student' && c.tone === 'green'
          ? { ...c, title: 'No existing application found', detail: 'Your passport does not match another application on file.' }
          : { ...c, title: voice(c.title), detail: voice(c.detail), actions: c.actions.map(voice) },
    )
  return {
    ...a,
    headline: voice(a.headline)
      .replace('Ready for a conditional offer', 'Looking good — you can apply')
      .replace('Ready to apply', 'Looking good — you can apply'),
    summary: voice(a.summary),
    checks,
    // UP admissions issues every offer for a direct application.
    conditionalOfferAllowed: false,
    admissionsReviewRequired: true,
  }
}

function assessForAgent(input: AssessmentInput): Assessment {
  const { course, documentRequirements, entryIssues, documents, nationality, englishRead, duplicate, agent } =
    input
  const isStudent = input.audience === 'student'
  const checks: AssessmentCheck[] = []
  const courseName = course?.programmeName ?? 'this course'
  const teaching = course ? isTeachingCourse(course) : false

  // 0. Agent account — can this agent submit at all?
  const permission = offerPermissionFor(agent)
  const agentBlocked = !isStudent && !permission.canSubmit
  if (isStudent) {
    // No agent account on a direct application.
  } else if (agentBlocked) {
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
        'Add RPL or work-experience evidence under Special admissions in Student details',
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

  // 4. Immigration risk — online study is done from home, so no NZ visa applies.
  const online = course?.delivery === 'online'
  const risk = online ? null : visaRiskFor(nationality, course?.levelGroup)
  if (online) {
    checks.push({
      kind: 'immigration',
      tone: 'green',
      title: 'Online study — no NZ student visa needed',
      detail:
        'The student studies from their home country, so INZ refusal risk and visa evidence do not apply. If they later move to a campus, the visa check runs then.',
      actions: [],
    })
  }
  if (risk) {
    const label = COURSE_TYPE_LABEL[risk.courseType]
    if (risk.level === 'low') {
      checks.push({
        kind: 'immigration',
        tone: 'green',
        title: `Low visa risk — ${RISK_COACHING.low.headline.toLowerCase()}`,
        detail: `Based on what we know, ${risk.nationality} students applying for ${label} study usually get their student visa. Nothing extra is needed for INZ.`,
        actions: [],
      })
    } else if (risk.level === 'medium') {
      checks.push({
        kind: 'immigration',
        tone: 'amber',
        title: `Medium visa risk — ${RISK_COACHING.medium.headline.toLowerCase()}`,
        detail: `INZ looks a little more closely at ${risk.nationality} students applying for ${label} study. Carry on as normal; Review shows what helps and why, so your student can gather the right documents from the start.`,
        actions: [
          'A clear reason for study: why this course, why New Zealand, why now',
          'Financial documents: bank statements, sponsor declaration, loan or scholarship letter',
          'A short note on any study gap or earlier visa refusal',
        ],
      })
    } else {
      checks.push({
        kind: 'immigration',
        tone: 'red',
        title: `High visa risk — ${RISK_COACHING.high.headline.toLowerCase()}`,
        detail: `INZ looks closely at ${risk.nationality} students applying for ${label} study, so a well-prepared file makes a real difference. Review walks through what INZ usually looks for, and UP admissions works through it with you before the offer.`,
        actions: [
          'A clear reason for study and how it fits the student’s plans',
          'Funds for first-year tuition plus NZD 20,000 living costs, with traceable documents',
          'Context for study gaps, home-country ties and any visa history',
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

  // S3-06: a qualification gap on top of high INZ refusal risk is a hard stop —
  // the agent cannot apply for this course on the student's behalf.
  const ineligible = highRisk && entryGap
  const blocked = agentBlocked || duplicateHold || ineligible

  let overall = worst(checks.filter((c) => c.kind !== 'agent' && c.kind !== 'student').map((c) => c.tone))
  // A single red (immigration) stays a strong amber warning.
  if (highRisk && !entryGap) overall = 'amber'
  // Probation / pending duplicate check are at least amber; hard stops are red.
  if (agent?.status === 'Probation' || duplicate !== 'clear') overall = worst([overall, 'amber'])
  if (blocked) overall = 'red'
  // When the visa band is the only reason for amber, the result is coaching,
  // not a problem: say so.
  const visaOnlyAmber =
    overall === 'amber' &&
    !entryGap &&
    immigrationTone !== 'green' &&
    worst(checks.filter((c) => c.kind !== 'immigration' && c.kind !== 'agent').map((c) => c.tone)) === 'green' &&
    agent?.status !== 'Probation' &&
    duplicate === 'clear'

  const headline = blocked
    ? duplicateHold
      ? 'Student is linked to another agent — cannot continue'
      : agentBlocked
        ? 'Your account cannot submit applications'
        : 'Not eligible — you cannot apply for this student'
    : overall === 'green'
      ? missing.length > 0
        ? 'Ready for a conditional offer'
        : 'Ready to apply'
      : overall === 'amber'
        ? entryGap
          ? 'Entry requirement not met — action needed'
          : visaOnlyAmber
            ? highRisk
              ? 'Good to go — let’s build the visa case together'
              : 'Good to go — a few visa tips to prepare'
            : 'More information needed'
        : 'Qualification gap and high immigration risk'

  const summary = blocked
    ? duplicateHold
      ? 'The documents may well meet the requirements, but the student is already on file with a different agent. Arrange a change of agent through your regional manager before applying.'
      : agentBlocked
        ? (permission.reason ?? 'Contact your regional manager.')
        : `The qualification does not meet the entry level for ${courseName}, and ${nationality} students applying for this level of study are high visa risk. Together that makes a visa very unlikely, so this application cannot be submitted. A pathway or one of the alternative courses below gives the student a stronger route.`
    : overall === 'green'
      ? missing.length > 0
        ? `Documents read so far meet the requirements for ${courseName}. ${upperFirst(joinAnd(missing.map((r) => lowerFirst(r.label))))} can follow as offer conditions.`
        : `All documents meet the requirements for ${courseName}, and applications like this usually get their visa. Submit with confidence.`
      : overall === 'amber'
        ? entryGap
          ? `The documents are in order but the qualification falls short for ${courseName}. Continue only with RPL or a special admission request, or choose an alternative.`
          : visaOnlyAmber
            ? highRisk
              ? `Documents and entry are in order for ${courseName}. INZ looks closely at applications like this, so we will help you prepare a strong visa case. Review shows what INZ looks for and why.`
              : `Documents and entry are in order for ${courseName}. INZ looks a little more closely at applications like this; Review shows the documents worth gathering from the start.`
            : `The application can continue. The items listed below are optional but will strengthen the file with admissions and INZ.`
        : `${courseName} is unlikely to proceed as it stands: the qualification does not meet the entry level and the INZ refusal rate is high. Talk to the student about a pathway or alternative course.`

  return {
    overall,
    headline,
    summary,
    checks,
    missingDocs: missing,
    risk,
    // Only low visa risk can carry an agent-issued offer (medium and high are reviewed first).
    conditionalOfferAllowed:
      !blocked && overall !== 'red' && !entryGap && permission.canIssueLoo && immigrationTone === 'green',
    visaCoachingOnly: visaOnlyAmber,
    visaReviewFirst: immigrationTone !== 'green',
    admissionsReviewRequired:
      highRisk || entryGap || entryTone === 'amber' || teaching || agent?.status === 'Probation',
    blocked,
  }
}
