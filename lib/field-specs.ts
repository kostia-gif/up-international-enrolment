import type { Condition, Document, Field } from './types'

export type InputKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'year'
  | 'yesno'
  | 'segmented'
  | 'select'
  | 'checkbox'
  | 'derived'

type Get = (key: string) => string

export interface FieldSpec {
  input: InputKind
  options?: string[]
  // Field only applies (and is only required) when this returns true.
  when?: (get: Get) => boolean
  // Muted helper line under the control.
  note?: string
  placeholder?: string
}

export const ETHNICITIES = [
  'NZ European / Pākehā',
  'Māori',
  'Samoan',
  'Cook Islands Māori',
  'Tongan',
  'Niuean',
  'Fijian',
  'Other Pacific peoples',
  'Chinese',
  'Indian',
  'Southeast Asian',
  'Other Asian',
  'Middle Eastern',
  'Latin American',
  'African',
  'British and Irish',
  'Other European',
  'Other ethnicity',
]

export const NZ_VISA_TYPES = [
  'Visitor visa',
  'Student visa',
  'Work visa',
  'Partner of a worker / student',
  'Resident visa',
  'Other',
]

export const MAIN_ACTIVITIES = [
  '01 Secondary school student',
  '02 Non-employed or beneficiary',
  '03 Wage or salary worker',
  '04 Self-employed',
  '05 Tertiary student',
  '06 Home maker / retired',
  '09 Overseas',
]

export const RELATIONSHIPS = ['Mother', 'Father', 'Parent', 'Guardian', 'Spouse / partner', 'Sibling', 'Other relative', 'Other']

export const SPONSORS = ['None', 'Government scholarship', 'Employer', 'Embassy / ministry', 'Other']

const yes = (key: string) => (get: Get) => get(key) === 'Yes'

export const FIELD_SPECS: Record<string, FieldSpec> = {
  preferred_name: { input: 'text' },
  ethnicity: { input: 'select', options: ETHNICITIES },
  in_nz: { input: 'yesno' },
  nz_visa_type: { input: 'select', options: NZ_VISA_TYPES, when: yes('in_nz') },
  under_18: { input: 'derived' },
  onshore: { input: 'derived' },

  email: { input: 'email', placeholder: 'student@example.com' },
  mobile: { input: 'tel', placeholder: '+84 90 123 4567' },

  qual_completed: { input: 'yesno' },
  study_start: { input: 'year' },
  study_end: { input: 'year', when: yes('qual_completed') },
  sec_last_year: { input: 'year' },

  tertiary_studied: { input: 'yesno' },
  tert_qual: { input: 'text', when: yes('tertiary_studied') },
  tert_institution: { input: 'text', when: yes('tertiary_studied') },
  tert_start: { input: 'year', when: yes('tertiary_studied') },
  tert_status: {
    input: 'segmented',
    options: ['Completed', 'In progress'],
    when: yes('tertiary_studied'),
  },
  tert_end: {
    input: 'year',
    when: (get) => get('tertiary_studied') === 'Yes' && get('tert_status') === 'Completed',
  },
  tert_expected: {
    input: 'date',
    when: (get) => get('tertiary_studied') === 'Yes' && get('tert_status') === 'In progress',
  },

  first_tertiary_year: { input: 'yesno' },
  first_enrol_year: { input: 'year', when: (get) => get('first_tertiary_year') === 'No' },
  main_activity: { input: 'select', options: MAIN_ACTIVITIES },
  prev_up: { input: 'yesno' },
  prev_up_provider: { input: 'text', when: yes('prev_up') },
  prev_up_programme: { input: 'text', when: yes('prev_up') },
  prev_up_year: { input: 'year', when: yes('prev_up') },
  prev_up_staircase: { input: 'yesno', when: yes('prev_up') },

  gap: { input: 'yesno' },
  gap_start: { input: 'date', when: yes('gap') },
  gap_end: { input: 'date', when: yes('gap') },
  gap_reason: { input: 'text', when: yes('gap') },

  visa_refused: {
    input: 'yesno',
    note: 'A visa refusal does not stop the application. It is reviewed by admissions.',
  },
  refused_country: { input: 'text', when: yes('visa_refused') },
  refused_year: { input: 'year', when: yes('visa_refused') },
  refused_reason: { input: 'text', when: yes('visa_refused') },
  had_nz_visa: { input: 'yesno' },

  ec_relationship: { input: 'select', options: RELATIONSHIPS },
  ec_email: { input: 'email' },
  ec_home_phone: { input: 'tel' },
  ec_mobile: { input: 'tel' },
  ec_same_address: { input: 'checkbox' },
  ec_addr: { input: 'text', when: (get) => get('ec_same_address') !== 'Yes' },
  ec_city: { input: 'text', when: (get) => get('ec_same_address') !== 'Yes' },
  ec_country: { input: 'text', when: (get) => get('ec_same_address') !== 'Yes' },

  health_condition: { input: 'yesno' },
  health_condition_detail: { input: 'text', when: yes('health_condition') },
  disability_services: { input: 'yesno' },
  emergency_assist: { input: 'yesno' },
  prior_health: { input: 'yesno' },
  prior_health_detail: { input: 'text', when: yes('prior_health') },

  insurance_mode: { input: 'segmented', options: ['UP default', 'Own cover'] },

  sponsor: { input: 'select', options: SPONSORS },
  sponsor_ref: { input: 'text', when: (get) => !!get('sponsor') && get('sponsor') !== 'None' },
  other_branch: { input: 'yesno' },
  branch_name: { input: 'text', when: yes('other_branch') },
}

export function specFor(key: string): FieldSpec {
  return FIELD_SPECS[key] ?? { input: 'text' }
}

export function getter(fields: Field[]): Get {
  const map = new Map(fields.map((f) => [f.key, f.value]))
  return (key) => map.get(key) ?? ''
}

export function isApplicable(field: Field, fields: Field[]): boolean {
  const when = FIELD_SPECS[field.key]?.when
  return when ? when(getter(fields)) : true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validation error for a filled value, or null.
export function fieldError(field: Field, fields: Field[]): string | null {
  const v = field.value.trim()
  if (!v) return null
  const input = specFor(field.key).input
  if (input === 'email' && !EMAIL_RE.test(v)) return 'Enter a valid email address'
  if (input === 'year' && !/^(19|20)\d{2}$/.test(v)) return 'Enter a four-digit year'
  if (field.key === 'ec_email' && v.toLowerCase() === getter(fields)('email').trim().toLowerCase()) {
    return "Must be different from the student's email"
  }
  if (field.key === 'gap_end') {
    const start = getter(fields)('gap_start')
    if (start && v < start) return 'End date is before the start date'
  }
  return null
}

function ageOn(dobIso: string, onIso: string): number | null {
  const dob = new Date(dobIso)
  const on = new Date(onIso)
  if (Number.isNaN(dob.getTime()) || Number.isNaN(on.getTime())) return null
  let age = on.getFullYear() - dob.getFullYear()
  const m = on.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && on.getDate() < dob.getDate())) age -= 1
  return age
}

// Fills derived fields and suggested defaults. Values the agent has entered
// always win; suggestions only fill empty fields and carry a grey hint.
export function resolveFields(fields: Field[], intakeDate: string): Field[] {
  const get = getter(fields)
  const derived: Record<string, string> = {}
  const suggested: Record<string, { value: string; hint: string }> = {}

  const age = get('dob') && intakeDate ? ageOn(get('dob'), intakeDate) : null
  if (age != null) derived.under_18 = age < 18 ? 'Yes' : 'No'
  if (get('in_nz')) derived.onshore = get('in_nz') === 'Yes' ? 'Onshore' : 'Offshore'

  if (get('given_name')) suggested.preferred_name = { value: get('given_name'), hint: 'defaults to given name' }
  if (get('in_nz') === 'No') suggested.main_activity = { value: '09 Overseas', hint: 'default for offshore students' }
  if (get('study_end')) suggested.sec_last_year = { value: get('study_end'), hint: 'from transcript' }
  if (get('highest_qual')) suggested.sec_highest = { value: get('highest_qual'), hint: 'same as current qualification' }

  const lastStudy = Math.max(Number(get('study_end')) || 0, Number(get('tert_end')) || 0)
  if (lastStudy && intakeDate) {
    const endOfStudy = new Date(Date.UTC(lastStudy, 11, 31))
    const months = (new Date(intakeDate).getTime() - endOfStudy.getTime()) / (1000 * 60 * 60 * 24 * 30.4)
    suggested.gap = { value: months > 6 ? 'Yes' : 'No', hint: 'from transcript dates' }
  }

  return fields.map((f) => {
    if (f.kind === 'derived') {
      const value = derived[f.key] ?? ''
      return { ...f, value, status: value ? 'verified' : 'missing' }
    }
    const s = suggested[f.key]
    if (s && f.value.trim() === '') {
      return { ...f, value: s.value, hint: s.hint, source: 'agent', status: 'confirmed' }
    }
    return f
  })
}

type ConditionSeed = Omit<Condition, 'id' | 'createdFrom'>

// Conditions that follow from the student's answers.
export function answerConditions(fields: Field[], documents: Document[]): ConditionSeed[] {
  const get = getter(fields)
  const hasDoc = (type: Document['type']) => documents.some((d) => d.type === type && d.status === 'checked')
  const out: ConditionSeed[] = []
  if (get('under_18') === 'Yes') {
    out.push(
      { label: 'Parent or guardian consent', owner: 'agent', status: 'open' },
      {
        label: 'Approved accommodation for a student under 18 (Code of Practice)',
        owner: 'agent',
        status: 'open',
      },
    )
  }
  if (get('had_nz_visa') === 'Yes' && !hasDoc('PriorVisa')) {
    out.push({ label: 'Copy of previous New Zealand visa', owner: 'agent', status: 'open' })
  }
  if (get('visa_refused') === 'Yes' && !hasDoc('VisaRefusalLetter')) {
    out.push({ label: 'Copy of visa refusal letter(s)', owner: 'agent', status: 'open' })
  }
  if (get('insurance_mode') === 'Own cover') {
    out.push({ label: 'Own-cover insurance policy for the full stay', owner: 'student', status: 'open' })
  }
  return out
}
