// Business rules the AI applies after reading the evidence: does the English
// score, qualification level and transcript grade meet the selected course's
// entry requirement? Mock thresholds modelled on typical UP entry criteria.
import type { Course, Field, Requirement } from './types'
import { CATALOG, intakeState, type CatalogProgramme } from './catalog'

export interface EnglishRule {
  ielts: number
  ieltsBand: number
  pte: number
  pteBand: number
}

export interface EnglishBand {
  label: string
  value: string
}

export interface EnglishResult {
  testType: string
  overall: string
  bands: EnglishBand[]
}

export const ENGLISH_BY_LEVEL: Record<Course['levelGroup'], EnglishRule> = {
  Pathway: { ielts: 5.0, ieltsBand: 4.5, pte: 36, pteBand: 30 },
  Vocational: { ielts: 5.5, ieltsBand: 5.0, pte: 42, pteBand: 36 },
  Degree: { ielts: 6.0, ieltsBand: 5.5, pte: 50, pteBand: 42 },
  Postgraduate: { ielts: 6.5, ieltsBand: 6.0, pte: 58, pteBand: 50 },
}

// Teaching programmes carry the Teaching Council's higher English standard.
export const TEACHING_RULE: EnglishRule = { ielts: 7.0, ieltsBand: 7.0, pte: 65, pteBand: 65 }

export function englishRuleFor(course: Course | null | undefined): EnglishRule {
  if (!course) return ENGLISH_BY_LEVEL.Vocational
  if (/teaching|education/i.test(course.programmeName)) return TEACHING_RULE
  return ENGLISH_BY_LEVEL[course.levelGroup]
}

export function describeEnglishRule(rule: EnglishRule): string {
  return `IELTS ${rule.ielts.toFixed(1)} (no band below ${rule.ieltsBand.toFixed(1)}) or PTE ${rule.pte} (no band below ${rule.pteBand})`
}

// Returns the shortfall as a plain sentence, or null when the score meets the rule.
export function englishShortfall(result: EnglishResult, rule: EnglishRule): string | null {
  const isPte = /pte/i.test(result.testType)
  const min = isPte ? rule.pte : rule.ielts
  const bandMin = isPte ? rule.pteBand : rule.ieltsBand
  const fmt = (n: number) => (isPte ? String(n) : n.toFixed(1))
  const overall = Number.parseFloat(result.overall)
  const problems: string[] = []
  if (Number.isFinite(overall) && overall < min) {
    problems.push(`overall ${result.overall} is below the ${fmt(min)} minimum`)
  }
  const low = result.bands.filter((b) => Number.parseFloat(b.value) < bandMin)
  if (low.length > 0) {
    problems.push(
      `${low.map((b) => `${b.label} ${b.value}`).join(' and ')} ${low.length === 1 ? 'is' : 'are'} below the ${fmt(bandMin)} band minimum`,
    )
  }
  if (problems.length === 0) return null
  return `English score does not meet requirements: ${problems.join('; ')}.`
}

// "8.6 / 10", "3.2/4", "78%" → 0..1. Unknown formats return null (not assessed).
function gradeRatio(raw: string): number | null {
  const pct = raw.match(/(\d+(?:\.\d+)?)\s*%/)
  if (pct) return Number.parseFloat(pct[1]) / 100
  const frac = raw.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
  if (frac) return Number.parseFloat(frac[1]) / Number.parseFloat(frac[2])
  return null
}

// Level defaults, used when a course doesn't publish its own minimum.
export const MIN_GRADE: Partial<Record<Course['levelGroup'], number>> = {
  Vocational: 0.5,
  Pathway: 0.5,
  Degree: 0.6,
  Postgraduate: 0.65,
}

export const pct = (ratio: number) => Math.round(ratio * 100)

function programmeFor(course: Pick<Course, 'programmeName'>): CatalogProgramme | undefined {
  return CATALOG.find((p) => p.programmeName === course.programmeName)
}

// The course's own published minimum, else its level default. General English
// and other courses with no grade bar return null.
export function requiredGradeFor(course: Course | null | undefined): number | null {
  if (!course?.programmeName) return null
  const p = programmeFor(course)
  if (p) return p.minGrade ?? null
  return MIN_GRADE[course.levelGroup] ?? null
}

export type GradeStanding = 'exceeds' | 'meets' | 'below'

export interface GradeCheck {
  required: number
  // As read from the transcript, e.g. "7.1 / 10" or "71%".
  raw: string
  // Converted to a share of the top mark; null when the format isn't known.
  achieved: number | null
  standing: GradeStanding | null
}

// 10 points or more above the minimum counts as exceeding it.
const EXCEEDS_MARGIN = 0.1

export function gradeCheckFor(course: Course | null | undefined, fields: Field[]): GradeCheck | null {
  const required = requiredGradeFor(course)
  const raw = value(fields, 'grade_gpa')
  if (required == null || !raw) return null
  const achieved = gradeRatio(raw)
  const standing: GradeStanding | null =
    achieved == null
      ? null
      : achieved < required
        ? 'below'
        : achieved - required >= EXCEEDS_MARGIN
          ? 'exceeds'
          : 'meets'
  return { required, raw, achieved, standing }
}

// "7.1 / 10 (71%)", or just "71%" when the transcript already uses percent.
export function describeGrade(raw: string, achieved: number): string {
  return /%/.test(raw) ? `${pct(achieved)}%` : `${raw} (${pct(achieved)}%)`
}

const BACHELOR_RE = /bachelor|degree|b\.?sc|b\.?a\b|b\.?eng|b\.?com|licenciatura|đại học/i

function value(fields: Field[], key: string): string {
  return fields.find((f) => f.key === key)?.value.trim() ?? ''
}

const SECONDARY_INCOMPLETE = 'Secondary school must be completed before degree-level study.'

export interface EntryIssues {
  qualification?: string
  grade?: string
  english?: string
}

export function assessEntry(
  course: Course | null | undefined,
  fields: Field[],
  english: EnglishResult | null,
): EntryIssues {
  const issues: EntryIssues = {}
  if (!course || !course.programmeName) return issues

  const qual = value(fields, 'highest_qual')
  const tertQual = value(fields, 'tert_qual')
  if (course.levelGroup === 'Postgraduate' && qual) {
    const hasBachelor = BACHELOR_RE.test(qual) || BACHELOR_RE.test(tertQual)
    if (!hasBachelor) {
      issues.qualification = `A bachelor degree is required for postgraduate study. The transcript shows ${qual}.`
    }
  }
  if (course.levelGroup === 'Degree' && value(fields, 'qual_completed') === 'No') {
    issues.qualification = SECONDARY_INCOMPLETE
  }

  const grade = gradeCheckFor(course, fields)
  if (grade?.standing === 'below' && grade.achieved != null) {
    const short = pct(grade.required) - pct(grade.achieved)
    issues.grade = `Transcript average ${describeGrade(grade.raw, grade.achieved)} is ${short} point${short === 1 ? '' : 's'} below the ${pct(grade.required)}% minimum for this course.`
  }

  if (english) {
    const short = englishShortfall(english, englishRuleFor(course))
    if (short) issues.english = short
  }
  return issues
}

// Which extracted answer an entry issue traces back to, so the confirm table
// can flag the exact row the agent is about to confirm.
const ISSUE_FIELDS: Record<keyof EntryIssues, string[]> = {
  qualification: ['highest_qual', 'tert_qual', 'qual_completed'],
  grade: ['grade_gpa'],
  english: ['english_test_score'],
}

export function issueForField(key: string, issues: EntryIssues): string | undefined {
  // "Completed? Yes" is only the problem when completion itself is the issue,
  // not when the qualification is at the wrong level.
  if (key === 'qual_completed' && issues.qualification !== SECONDARY_INCOMPLETE) return undefined
  for (const [kind, keys] of Object.entries(ISSUE_FIELDS) as [keyof EntryIssues, string[]][]) {
    if (keys.includes(key) && issues[kind]) return issues[kind]
  }
  return undefined
}

// The extracted answer behind an issue, so the agent can open the document it
// came from rather than guess which value tripped the rule.
export function fieldForIssue(kind: keyof EntryIssues, fields: Field[]): Field | undefined {
  return ISSUE_FIELDS[kind]
    .map((k) => fields.find((f) => f.key === k))
    .find((f) => f && f.sourceDoc)
}

export const ISSUE_LABEL: Record<keyof EntryIssues, string> = {
  qualification: 'Qualification',
  grade: 'Grades',
  english: 'English',
}

export function hasEntryIssues(issues: EntryIssues): boolean {
  return Boolean(issues.qualification || issues.grade || issues.english)
}

// Overlay the AI's assessment on the checklist: evidence that was read but
// falls short flips from met to problem and carries the reason.
export function applyEntryRules(reqs: Requirement[], issues: EntryIssues): Requirement[] {
  return reqs.map((r) => {
    let issue: string | undefined
    if (r.category === 'academic') {
      issue = /minimum entry/i.test(r.label) ? issues.grade : issues.qualification
    } else if (r.category === 'english') {
      issue = issues.english
    }
    if (!issue || r.status !== 'met') return { ...r, issue: undefined }
    return { ...r, status: 'problem', issue }
  })
}

export interface CourseSuggestion {
  programme: CatalogProgramme
  intake: string
  reason: string
}

function nextOpenIntake(p: CatalogProgramme): string | null {
  return p.intakes.find((d) => intakeState(d) !== 'closed') ?? null
}

const levelNumber = (p: Pick<CatalogProgramme, 'level'>) => Number(p.level.match(/\d+/)?.[0] ?? 0)

// Alternative programmes for a student who falls short of a degree or
// postgraduate entry requirement. `achievedGrade` is the transcript average
// as a share of the top mark, used to offer courses whose minimum it meets.
export function suggestAlternatives(
  course: Course | null | undefined,
  issues: EntryIssues,
  achievedGrade?: number | null,
): CourseSuggestion[] {
  if (!course) return []
  const out: CourseSuggestion[] = []
  const push = (p: CatalogProgramme | undefined, reason: string) => {
    if (!p || p.programmeName === course.programmeName) return
    if (out.some((s) => s.programme.id === p.id)) return
    // A grade shortfall can only be fixed by a course whose own minimum is met.
    if (issues.grade && achievedGrade != null && p.minGrade != null && achievedGrade < p.minGrade) return
    const intake = nextOpenIntake(p)
    if (intake) out.push({ programme: p, intake, reason })
  }
  const byName = (re: RegExp) => CATALOG.find((p) => re.test(p.programmeName))

  if (issues.grade && achievedGrade != null) {
    const current = programmeFor(course)
    const currentLevel = current ? levelNumber(current) : 99
    const fits = CATALOG.filter(
      (p) =>
        p.kind === 'standard' &&
        (p.levelGroup === 'Vocational' || p.levelGroup === 'Degree') &&
        p.minGrade != null &&
        p.minGrade <= achievedGrade &&
        levelNumber(p) < currentLevel,
    ).sort(
      (a, b) =>
        Number(b.brand === course.brand) - Number(a.brand === course.brand) || levelNumber(b) - levelNumber(a),
    )
    for (const p of fits.slice(0, 2)) {
      push(p, `Needs ${pct(p.minGrade!)}% — the transcript's ${pct(achievedGrade)}% meets it`)
    }
  }

  if (issues.qualification && course.levelGroup === 'Postgraduate') {
    const degrees = CATALOG.filter((p) => p.levelGroup === 'Degree').sort(
      (a, b) => Number(b.brand === course.brand) - Number(a.brand === course.brand),
    )
    for (const d of degrees.slice(0, 2)) {
      push(d, 'Degree-level study that leads into postgraduate entry')
    }
  }
  if (
    (issues.qualification || issues.grade) &&
    (course.levelGroup === 'Degree' || course.levelGroup === 'Postgraduate')
  ) {
    const foundation = byName(/foundation$/i)
    push(
      foundation,
      issues.grade && achievedGrade != null && foundation?.minGrade != null
        ? `Academic pathway into degree study. Needs ${pct(foundation.minGrade)}% — the transcript's ${pct(achievedGrade)}% meets it`
        : 'Academic pathway with guaranteed progression to degree study',
    )
  }
  if (issues.english && course.levelGroup !== 'Pathway') {
    push(byName(/foundation$/i), 'Includes academic English to reach the required score')
    push(byName(/general english/i), 'Builds English before starting the programme')
  }
  return out.slice(0, 3)
}
