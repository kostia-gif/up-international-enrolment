import type { Brand, Course, CourseLevel } from './types'
import type { PathwayUniversity } from './destinations'

export interface CatalogProgramme {
  id: string
  brand: Brand
  levelGroup: CourseLevel
  programmeName: string // NZQA-approved
  level: string
  campus: string
  durationMonths: number
  priceBundle: string
  intakes: string[] // ISO start dates
  neurodiverseSupport?: boolean
  // Drives what Step 1 asks next: pathway → destination degree, english → a 'before' block.
  kind: ProgrammeKind
  pathwayUniversity?: PathwayUniversity
}

export type ProgrammeKind = 'standard' | 'pathway' | 'english'

export const UNIVERSITY_NAME: Record<PathwayUniversity, string> = {
  UoA: 'University of Auckland',
  AUT: 'Auckland University of Technology',
  VUW: 'Victoria University of Wellington',
}

// Only these NZTC programmes lead to NZ teacher registration.
const TEACHER_REGISTRATION = ['Bachelor of Teaching', 'Graduate Diploma in Teaching', 'Master of Teaching and Learning']

export function leadsToTeacherRegistration(p: CatalogProgramme): boolean {
  return p.brand === 'NZTC' && TEACHER_REGISTRATION.some((n) => p.programmeName.includes(n))
}

function addMonths(iso: string, months: number): Date {
  const d = new Date(`${iso}T00:00:00`)
  d.setMonth(d.getMonth() + months)
  return d
}

// First 1 Feb or 1 Jul on or after the block ends (intake + duration).
// University semesters only start in those months.
export function earliestStartAfter(p: Pick<CatalogProgramme, 'durationMonths'>, intakeISO: string): string {
  const end = addMonths(intakeISO, p.durationMonths)
  const y = end.getFullYear()
  const candidates = [new Date(y, 1, 1), new Date(y, 6, 1), new Date(y + 1, 1, 1)]
  const start = candidates.find((c) => c >= end) ?? candidates[2]
  const mm = String(start.getMonth() + 1).padStart(2, '0')
  return `${start.getFullYear()}-${mm}-01`
}

export function blockEndsBefore(p: CatalogProgramme, intakeISO: string, beforeISO: string): boolean {
  return addMonths(intakeISO, p.durationMonths) <= new Date(`${beforeISO}T00:00:00`)
}

export function supportsNeurodiverse(programmeName?: string): boolean {
  return !!CATALOG.find((p) => p.programmeName === programmeName)?.neurodiverseSupport
}

// Next intakes relative to the prototype "today" (10 Sep 2026). Some are close
// (within 14 days shows a warning); a past one is closed and not selectable.
export const CATALOG: CatalogProgramme[] = ([
  {
    id: 'nzma-cookery-4',
    brand: 'NZMA',
    levelGroup: 'Vocational',
    programmeName: 'New Zealand Certificate in Cookery (Level 4)',
    level: 'Level 4',
    campus: 'Auckland',
    durationMonths: 9,
    priceBundle: 'NZD 24,500',
    intakes: ['2026-09-21', '2026-11-02', '2027-02-15'],
    neurodiverseSupport: true,
  },
  {
    id: 'nzma-hospo-5',
    brand: 'NZMA',
    levelGroup: 'Vocational',
    programmeName: 'New Zealand Diploma in Hospitality Management (Level 5)',
    level: 'Level 5',
    campus: 'Auckland',
    durationMonths: 12,
    priceBundle: 'NZD 25,600',
    intakes: ['2026-10-12', '2027-02-15', '2027-07-19'],
  },
  {
    id: 'yoobee-software-7',
    brand: 'Yoobee',
    levelGroup: 'Degree',
    programmeName: 'New Zealand Diploma in Software Development (Level 7)',
    level: 'Level 7',
    campus: 'Wellington',
    durationMonths: 12,
    priceBundle: 'NZD 27,900',
    intakes: ['2026-11-09', '2027-02-22', '2027-07-12'],
    neurodiverseSupport: true,
  },
  {
    id: 'yoobee-design-6',
    brand: 'Yoobee',
    levelGroup: 'Vocational',
    programmeName: 'New Zealand Diploma in Digital Media and Design (Level 6)',
    level: 'Level 6',
    campus: 'Auckland',
    durationMonths: 12,
    priceBundle: 'NZD 26,400',
    intakes: ['2026-10-05', '2027-03-01'],
    neurodiverseSupport: true,
  },
  {
    // New flagship programme — promoted on the homepage news rail.
    id: 'yoobee-applied-ai-9',
    brand: 'Yoobee',
    levelGroup: 'Postgraduate',
    programmeName: 'Master of Applied Artificial Intelligence (Level 9)',
    level: 'Level 9',
    campus: 'Auckland',
    durationMonths: 18,
    priceBundle: 'NZD 39,900',
    intakes: ['2026-09-28', '2027-02-15', '2027-07-19'],
  },
  {
    id: 'upic-foundation',
    brand: 'UPIC',
    levelGroup: 'Pathway',
    programmeName: 'UP International College Foundation',
    level: 'Foundation',
    campus: 'Auckland',
    durationMonths: 9,
    priceBundle: 'NZD 22,800',
    intakes: ['2027-03-01', '2027-06-01'],
    neurodiverseSupport: true,
    kind: 'pathway',
    pathwayUniversity: 'UoA',
  },
  {
    id: 'upic-foundation-fast',
    brand: 'UPIC',
    levelGroup: 'Pathway',
    programmeName: 'UP International College Foundation (Fast-track)',
    level: 'Foundation',
    campus: 'Auckland',
    durationMonths: 6,
    priceBundle: 'NZD 22,800',
    intakes: ['2027-03-01', '2027-06-01'],
    kind: 'pathway',
    pathwayUniversity: 'UoA',
  },
  {
    id: 'upic-foundation-aut',
    brand: 'UPIC',
    levelGroup: 'Pathway',
    programmeName: 'AUT University Certificate in Foundation Studies',
    level: 'Foundation',
    campus: 'Auckland',
    durationMonths: 9,
    priceBundle: 'NZD 21,500',
    intakes: ['2027-03-01', '2027-07-19'],
    kind: 'pathway',
    pathwayUniversity: 'AUT',
  },
  {
    id: 'upic-english',
    brand: 'UPIC',
    levelGroup: 'Pathway',
    programmeName: 'General English (pre-Foundation)',
    level: 'English',
    campus: 'Auckland',
    durationMonths: 3,
    priceBundle: 'NZD 8,400',
    intakes: ['2026-09-14', '2026-12-01', '2027-03-01'],
    kind: 'english',
  },
  {
    id: 'nztc-ece-7',
    brand: 'NZTC',
    levelGroup: 'Degree',
    programmeName: 'Bachelor of Education (Early Childhood Education)',
    level: 'Level 7',
    campus: 'Auckland',
    durationMonths: 36,
    priceBundle: 'NZD 23,800',
    intakes: ['2027-02-22'],
  },
  {
    id: 'nztc-teaching-pg',
    brand: 'NZTC',
    levelGroup: 'Postgraduate',
    programmeName: 'Postgraduate Diploma in Teaching (Early Years)',
    level: 'Level 8',
    campus: 'Auckland',
    durationMonths: 12,
    priceBundle: 'NZD 24,900',
    intakes: ['2026-08-24', '2027-02-22'],
  },
  {
    id: 'nztc-bteach-primary',
    brand: 'NZTC',
    levelGroup: 'Degree',
    programmeName: 'Bachelor of Teaching (Primary)',
    level: 'Level 7',
    campus: 'Auckland',
    durationMonths: 36,
    priceBundle: 'NZD 24,200',
    intakes: ['2027-02-22', '2027-07-12'],
  },
  {
    id: 'nztc-gdt-secondary',
    brand: 'NZTC',
    levelGroup: 'Postgraduate',
    programmeName: 'Graduate Diploma in Teaching (Secondary)',
    level: 'Level 7',
    campus: 'Auckland',
    durationMonths: 12,
    priceBundle: 'NZD 23,600',
    intakes: ['2027-02-22'],
  },
] satisfies (Omit<CatalogProgramme, 'kind'> & { kind?: ProgrammeKind })[]).map(
  (p): CatalogProgramme => ({ ...p, kind: p.kind ?? 'standard' }),
)

export const BRANDS: Brand[] = ['NZMA', 'Yoobee', 'UPIC', 'NZTC']
export const LEVEL_GROUPS: CourseLevel[] = [
  'Pathway',
  'Vocational',
  'Degree',
  'Postgraduate',
]

export function programmeToCourse(p: CatalogProgramme, intakeDate: string): Course {
  return {
    brand: p.brand,
    programmeName: p.programmeName,
    level: p.level,
    levelGroup: p.levelGroup,
    campus: p.campus,
    intakeDate,
    priceBundle: p.priceBundle,
    durationMonths: p.durationMonths,
  }
}

const REFERENCE_NOW = new Date('2026-09-10T00:00:00+12:00')

export type IntakeState = 'open' | 'closing-soon' | 'closed'

export function intakeState(intakeDate: string): IntakeState {
  const d = new Date(intakeDate)
  const days = Math.round((d.getTime() - REFERENCE_NOW.getTime()) / 86400000)
  if (days < 0) return 'closed'
  if (days <= 14) return 'closing-soon'
  return 'open'
}
