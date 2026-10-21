import type { CourseLevel, Document, Field } from './types'

// Live INZ student-visa outcomes for UP applicants, by nationality and course
// level. Mock data for the POC — in production this is refreshed nightly from
// INZ decision letters lodged against UP offers.

export const ELIGIBILITY_UPDATED = '21 Oct 2026'

export const LEVEL_GROUPS: CourseLevel[] = ['Pathway', 'Vocational', 'Degree', 'Postgraduate']

export type Risk = 'low' | 'medium' | 'high'

export interface CorridorStat {
  country: string
  level: CourseLevel
  approvalRate: number // 0..100, rolling 90 days
  trend: number // percentage-point change vs previous 90 days
  decisions: number // decisions in the window
  declineReasons: string[]
  guidance: string[]
}

interface CountryProfile {
  rates: Record<CourseLevel, number>
  trend: Record<CourseLevel, number>
  decisions: number
  declineReasons: string[]
  guidance: string[]
  // Level-specific notes layered on top of the country guidance.
  levelNotes?: Partial<Record<CourseLevel, string>>
  sponsorship?: string
}

const COUNTRIES: Record<string, CountryProfile> = {
  India: {
    rates: { Pathway: 78, Vocational: 31, Degree: 64, Postgraduate: 46 },
    trend: { Pathway: 2, Vocational: -18, Degree: -4, Postgraduate: -11 },
    decisions: 412,
    declineReasons: [
      'Not a genuine student — study plan does not follow prior qualifications',
      'Funds source not evidenced (large recent deposits, no 6-month history)',
      'Course seen as a step down from existing degree',
    ],
    guidance: [
      'Show a clear progression: the new course must build on, not repeat, prior study',
      'Provide 6 months of bank history; explain any deposit over NZD 5,000',
      'Attach a sponsor affidavit and income evidence for each financial sponsor',
    ],
    levelNotes: {
      Vocational:
        'Level 5–7 diplomas for degree holders are declined ~70% of the time. Prefer Level 7+ or a postgraduate pathway.',
      Postgraduate: 'Gaps over 2 years since last study need a CV and employer references.',
    },
  },
  Nepal: {
    rates: { Pathway: 72, Vocational: 29, Degree: 58, Postgraduate: 51 },
    trend: { Pathway: 0, Vocational: -14, Degree: -6, Postgraduate: -3 },
    decisions: 188,
    declineReasons: [
      'Financial documents could not be verified with the issuing bank',
      'Weak ties to home country',
      'Study plan unclear on career outcome',
    ],
    guidance: [
      'Use bank statements from A-class commercial banks only; INZ verifies directly',
      'Include education loan sanction letters with the loan account history',
      'Spell out the career outcome and the employer type in Nepal',
    ],
    levelNotes: {
      Vocational: 'Level 5–6 vocational courses are currently ~70% declined at INZ for this corridor.',
    },
  },
  'Sri Lanka': {
    rates: { Pathway: 81, Vocational: 52, Degree: 70, Postgraduate: 63 },
    trend: { Pathway: 1, Vocational: -7, Degree: 0, Postgraduate: -2 },
    decisions: 96,
    declineReasons: ['Funds not held for 6 months', 'Previous visa refusal not disclosed'],
    guidance: [
      'Disclose any prior refusal from any country — non-disclosure is an automatic decline',
      'Hold funds for 6 months before lodging',
    ],
  },
  Philippines: {
    rates: { Pathway: 88, Vocational: 74, Degree: 83, Postgraduate: 79 },
    trend: { Pathway: 3, Vocational: 2, Degree: 1, Postgraduate: 4 },
    decisions: 231,
    declineReasons: ['Employment history inconsistent with CV', 'Insufficient living funds'],
    guidance: [
      'Make CV dates match employment certificates exactly',
      'Show NZD 20,000 per year of study in living costs on top of tuition',
    ],
  },
  Vietnam: {
    rates: { Pathway: 86, Vocational: 77, Degree: 85, Postgraduate: 80 },
    trend: { Pathway: 0, Vocational: 1, Degree: 2, Postgraduate: 0 },
    decisions: 142,
    declineReasons: ['Sponsor income not evidenced with tax records'],
    guidance: ['Provide sponsor tax returns alongside payslips'],
  },
  China: {
    rates: { Pathway: 93, Vocational: 85, Degree: 91, Postgraduate: 89 },
    trend: { Pathway: 1, Vocational: 0, Degree: 1, Postgraduate: 1 },
    decisions: 305,
    declineReasons: ['Translated documents not certified'],
    guidance: ['Use certified translations for all non-English documents'],
  },
  'United Arab Emirates': {
    rates: { Pathway: 96, Vocational: 92, Degree: 95, Postgraduate: 94 },
    trend: { Pathway: 0, Vocational: 0, Degree: 0, Postgraduate: 1 },
    decisions: 38,
    declineReasons: ['Sponsorship letter missing study period dates'],
    guidance: ['Attach the government sponsorship letter covering the full study period'],
    sponsorship: 'Government-sponsored students are approved at 98% when the sponsor letter is attached.',
  },
  Oman: {
    rates: { Pathway: 95, Vocational: 90, Degree: 94, Postgraduate: 93 },
    trend: { Pathway: 0, Vocational: 1, Degree: 0, Postgraduate: 0 },
    decisions: 27,
    declineReasons: ['Sponsorship letter missing study period dates'],
    guidance: ['Attach the Ministry of Higher Education sponsorship letter'],
    sponsorship: 'MoHERI-sponsored students are approved at 97% with the sponsor letter attached.',
  },
  'Saudi Arabia': {
    rates: { Pathway: 94, Vocational: 88, Degree: 93, Postgraduate: 92 },
    trend: { Pathway: 0, Vocational: 0, Degree: 1, Postgraduate: 0 },
    decisions: 44,
    declineReasons: ['SACM financial guarantee not provided'],
    guidance: ['Include the SACM financial guarantee letter'],
    sponsorship: 'SACM-sponsored students are approved at 97% with the financial guarantee attached.',
  },
  Pakistan: {
    rates: { Pathway: 70, Vocational: 38, Degree: 61, Postgraduate: 55 },
    trend: { Pathway: -2, Vocational: -9, Degree: -3, Postgraduate: -5 },
    decisions: 74,
    declineReasons: [
      'Funds source not evidenced',
      'Study plan does not explain why New Zealand',
    ],
    guidance: [
      'Explain why New Zealand and why UP over home-country options',
      'Provide 6 months of statements with source-of-funds evidence',
    ],
  },
}

export const ELIGIBILITY_COUNTRIES = Object.keys(COUNTRIES).sort()

export function getCorridor(country: string, level: CourseLevel): CorridorStat | null {
  const p = COUNTRIES[country]
  if (!p) return null
  const levelNote = p.levelNotes?.[level]
  return {
    country,
    level,
    approvalRate: p.rates[level],
    trend: p.trend[level],
    decisions: Math.round(p.decisions * (level === 'Vocational' ? 0.4 : level === 'Degree' ? 0.3 : 0.15)),
    declineReasons: p.declineReasons,
    guidance: [...(levelNote ? [levelNote] : []), ...p.guidance, ...(p.sponsorship ? [p.sponsorship] : [])],
  }
}

export function riskOf(rate: number): Risk {
  if (rate < 50) return 'high'
  if (rate < 75) return 'medium'
  return 'low'
}

// Corridors with the steepest INZ decline rates — the headline watchlist.
export function watchlist(limit = 4): CorridorStat[] {
  const all: CorridorStat[] = []
  for (const c of Object.keys(COUNTRIES)) {
    for (const l of LEVEL_GROUPS) {
      const s = getCorridor(c, l)
      if (s) all.push(s)
    }
  }
  return all.sort((a, b) => a.approvalRate - b.approvalRate).slice(0, limit)
}

// Corridors for which a government sponsorship option is commonly offered.
export const SPONSOR_BODIES: Record<string, string[]> = {
  'United Arab Emirates': ['UAE Ministry of Education', 'ADEK (Abu Dhabi)', 'Emirates Scholarship Programme'],
  Oman: ['Ministry of Higher Education, Research & Innovation (MoHERI)'],
  'Saudi Arabia': ['Saudi Arabian Cultural Mission (SACM)'],
  Kuwait: ['Kuwait Cultural Office'],
  Qatar: ['Qatar Ministry of Education & Higher Education'],
}

export interface LiveComment {
  tone: 'good' | 'warn' | 'info'
  text: string
}

// Live comments as documents are uploaded: what INZ will look for next on this
// corridor, given what's already in the file.
export function liveComments(
  stat: CorridorStat | null,
  documents: Document[],
  fields: Field[],
  sponsored: boolean,
): LiveComment[] {
  const out: LiveComment[] = []
  const has = (re: RegExp) => documents.some((d) => re.test(`${d.type} ${d.originalName}`))
  const field = (k: string) => fields.find((f) => f.key === k)?.value ?? ''

  if (documents.length === 0) {
    out.push({ tone: 'info', text: 'Drop documents to get live INZ-readiness comments.' })
    return out
  }

  if (has(/passport/i)) out.push({ tone: 'good', text: 'Passport read — nationality confirmed for the visa corridor.' })

  const risky = stat ? riskOf(stat.approvalRate) !== 'low' : false
  if (sponsored) {
    out.push({
      tone: has(/sponsor/i) ? 'good' : 'warn',
      text: has(/sponsor/i)
        ? 'Sponsorship letter attached — strongest single factor for approval.'
        : 'Sponsored student: attach the sponsor letter covering the full study period.',
    })
  } else if (!has(/bank|fund|financ|statement|sponsor/i)) {
    out.push({
      tone: risky ? 'warn' : 'info',
      text: risky
        ? 'No financial evidence yet — funds is a top decline reason for this corridor. Add 6 months of statements.'
        : 'Add financial evidence before lodging the visa (tuition + NZD 20,000/yr living).',
    })
  } else {
    out.push({ tone: 'good', text: 'Financial evidence attached — check it shows 6 months of history.' })
  }

  const end = parseInt(field('study_end'), 10)
  if (!Number.isNaN(end) && new Date().getFullYear() - end >= 2 && !has(/cv|resume|employ|reference/i)) {
    out.push({
      tone: 'warn',
      text: `Study gap since ${end}. Add a CV and employment references to explain it.`,
    })
  }

  if (stat && stat.level === 'Vocational' && riskOf(stat.approvalRate) === 'high' && /bachelor|degree/i.test(field('highest_qual'))) {
    out.push({
      tone: 'warn',
      text: 'Degree holder applying for a lower-level diploma — INZ often reads this as non-genuine. Justify the progression in the study plan.',
    })
  }

  if (!has(/study plan|statement of purpose|sop|cover letter/i) && risky) {
    out.push({ tone: 'info', text: 'A tailored study plan is recommended for this corridor.' })
  }

  return out
}

// Plain-text summary for the AI advisor's instructions.
export function formatEligibilityForPrompt(): string {
  return ELIGIBILITY_COUNTRIES.map((c) => {
    const levels = LEVEL_GROUPS.map((l) => {
      const s = getCorridor(c, l)!
      return `${l} ${s.approvalRate}% (${s.trend >= 0 ? '+' : ''}${s.trend}pp)`
    }).join(', ')
    const p = COUNTRIES[c]
    return `- ${c}: ${levels}. Top decline reasons: ${p.declineReasons.join('; ')}. Guidance: ${[
      ...Object.values(p.levelNotes ?? {}),
      ...p.guidance,
      ...(p.sponsorship ? [p.sponsorship] : []),
    ].join('; ')}`
  }).join('\n')
}
