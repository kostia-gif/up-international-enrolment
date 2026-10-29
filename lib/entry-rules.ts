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

export const MIN_GRADE: Partial<Record<Course['levelGroup'], number>> = {
  Degree: 0.6,
  Postgraduate: 0.65,
}

const BACHELOR_RE = /bachelor|degree|b\.?sc|b\.?a\b|b\.?eng|b\.?com|licenciatura|đại học/i

function value(fields: Field[], key: string): string {
  return fields.find((f) => f.key === key)?.value.trim() ?? ''
}

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
    issues.qualification = 'Secondary school must be completed before degree-level study.'
  }

  const minGrade = MIN_GRADE[course.levelGroup]
  const grade = value(fields, 'grade_gpa')
  const ratio = grade ? gradeRatio(grade) : null
  if (minGrade != null && ratio != null && ratio < minGrade) {
    issues.grade = `Transcript average ${grade} is below the ${Math.round(minGrade * 100)}% minimum for this course.`
  }

  if (english) {
    const short = englishShortfall(english, englishRuleFor(course))
    if (short) issues.english = short
  }
  return issues
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

// Alternative programmes for a student who falls short of a degree or
// postgraduate entry requirement.
export function suggestAlternatives(
  course: Course | null | undefined,
  issues: EntryIssues,
): CourseSuggestion[] {
  if (!course) return []
  const out: CourseSuggestion[] = []
  const push = (p: CatalogProgramme | undefined, reason: string) => {
    if (!p || p.programmeName === course.programmeName) return
    if (out.some((s) => s.programme.id === p.id)) return
    const intake = nextOpenIntake(p)
    if (intake) out.push({ programme: p, intake, reason })
  }
  const byName = (re: RegExp) => CATALOG.find((p) => re.test(p.programmeName))

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
    push(byName(/foundation$/i), 'Academic pathway with guaranteed progression to degree study')
  }
  if (issues.english && course.levelGroup !== 'Pathway') {
    push(byName(/foundation$/i), 'Includes academic English to reach the required score')
    push(byName(/general english/i), 'Builds English before starting the programme')
  }
  return out.slice(0, 3)
}
