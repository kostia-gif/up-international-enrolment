import type { Application, CourseLevel, Field } from './types'
import {
  CATALOG,
  intakeState,
  offeringsFor,
  programmeToCourse,
  withOffering,
  type CatalogProgramme,
} from './catalog'
import { assessEntry, type EnglishResult } from './entry-rules'
import { visaRiskFor, type RiskLevel } from './eligibility'

// How a student starts a direct application. 'linked' means they arrived
// from a course page, so the course is already chosen.
export type EntryMode = 'course' | 'discover' | 'linked'

// Seed students a demo can sign in as, one per stage of the student view.
export const DEMO_STUDENT_LOGINS = [
  { email: 'rahul.sharma@example.com', name: 'Rahul Sharma', state: 'Submitted, with UP admissions' },
  { email: 'priya.menon@example.com', name: 'Priya Menon', state: 'Conditional offer, documents to upload' },
  { email: 'sofia.rossi@example.com', name: 'Sofia Rossi', state: 'Unconditional offer to accept' },
]

export const STUDENT_AGENT_ID = 'student-direct'
export const STUDENT_AGENCY_ID = 'direct'

export interface CourseMatch {
  programme: CatalogProgramme
  intake: string
  // Set when the English result read so far falls short; the course is still
  // open to the student with English study first.
  englishShort?: string
  riskLevel?: RiskLevel
}

const LEVEL_RANK: Record<CourseLevel, number> = {
  Postgraduate: 4,
  Degree: 3,
  Vocational: 2,
  Pathway: 1,
}

export const LEVEL_HEADING: Record<CourseLevel, string> = {
  Postgraduate: 'Postgraduate',
  Degree: 'Degree level',
  Vocational: 'Certificates and diplomas',
  Pathway: 'Foundation and English pathways',
}

function value(fields: Field[], key: string): string {
  return fields.find((f) => f.key === key)?.value.trim() ?? ''
}

function firstOpenOffering(p: CatalogProgramme): { programme: CatalogProgramme; intake: string } | null {
  for (const o of offeringsFor(p)) {
    if (o.comingSoon) continue
    const intake = o.intakes.find((d) => intakeState(d) !== 'closed')
    if (intake) return { programme: withOffering(p, o), intake }
  }
  return null
}

// A course page links to /student/apply?course=<id>; this resolves it to the
// next open intake so the wizard starts with the course already chosen.
export function linkedCourse(programmeId: string | null | undefined) {
  const p = CATALOG.find((x) => x.id === programmeId)
  return p ? firstOpenOffering(p) : null
}

// Courses the student meets the academic entry for, based on what the AI read
// from their documents. Runs the same entry rules the eligibility check uses.
export function matchCourses(fields: Field[], english: EnglishResult | null): CourseMatch[] {
  if (!value(fields, 'highest_qual')) return []
  const nationality = value(fields, 'nationality')
  const out: CourseMatch[] = []
  for (const p of CATALOG) {
    const open = firstOpenOffering(p)
    if (!open) continue
    const course = programmeToCourse(open.programme, open.intake)
    const issues = assessEntry(course, fields, english)
    if (issues.qualification || issues.grade) continue
    out.push({
      programme: open.programme,
      intake: open.intake,
      englishShort: issues.english,
      riskLevel: visaRiskFor(nationality, course.levelGroup)?.level,
    })
  }
  return out.sort(
    (a, b) =>
      LEVEL_RANK[b.programme.levelGroup] - LEVEL_RANK[a.programme.levelGroup] ||
      Number(Boolean(a.englishShort)) - Number(Boolean(b.englishShort)),
  )
}

export function studentEmailOf(app: Application): string {
  return value(app.fields, 'email').toLowerCase()
}

export function studentMobileOf(app: Application): string {
  return value(app.fields, 'mobile')
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s/g, '')
  return digits.length > 4 ? `•••• ${digits.slice(-4)}` : phone
}

export function newOneTimeCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function firstName(app: Application): string {
  return value(app.fields, 'preferred_name') || value(app.fields, 'given_name') || app.studentName.split(' ')[0]
}
