import type { Field, FieldSection, FieldSource } from './types'

// The fields a conditional Letter of Offer needs, shared by the fixture builder
// and the live wizard.
type Tmpl = [key: string, label: string, section: FieldSection, required: boolean, s: FieldSource]

export const FIELD_TEMPLATES: Tmpl[] = [
  // Personal
  ['given_name', 'Given name', 'Personal', true, 'ai'],
  ['family_name', 'Family name', 'Personal', true, 'ai'],
  ['dob', 'Date of birth', 'Personal', true, 'ai'],
  ['nationality', 'Nationality', 'Personal', true, 'ai'],
  ['passport_number', 'Passport number', 'Personal', true, 'ai'],
  ['passport_expiry', 'Passport expiry', 'Personal', true, 'ai'],
  // Contact
  ['email', 'Email', 'Contact', true, 'agent'],
  ['mobile', 'Mobile', 'Contact', true, 'agent'],
  // Education history
  ['highest_qual', 'Highest qualification', 'Education history', true, 'ai'],
  ['institution', 'Institution', 'Education history', true, 'ai'],
  ['institution_country', 'Institution country', 'Education history', true, 'ai'],
  ['study_end', 'Study end year', 'Education history', true, 'ai'],
  ['qual_completed', 'Qualification completed', 'Education history', true, 'ai'],
  // English can be an outstanding condition on a conditional offer, so a
  // missing test must not block LoO-readiness.
  ['english_test_type', 'English test type', 'Education history', false, 'ai'],
  ['english_test_score', 'English test score', 'Education history', false, 'ai'],
  ['english_test_date', 'English test date', 'Education history', false, 'ai'],
  ['english_test_expiry', 'English test expiry', 'Education history', false, 'ai'],
  // Course
  ['brand', 'Brand', 'Course', true, 'up'],
  ['programme_name', 'Programme name (NZQA)', 'Course', true, 'up'],
  ['nzqa_level', 'NZQA level', 'Course', true, 'up'],
  ['campus', 'Campus', 'Course', true, 'up'],
  ['intake_date', 'Intake date', 'Course', true, 'up'],
  ['study_mode', 'Study mode', 'Course', false, 'up'],
  ['price_bundle', 'Price bundle', 'Course', true, 'up'],
  ['tuition_fee', 'Tuition fee', 'Course', false, 'up'],
  ['course_start', 'Course start date', 'Course', false, 'up'],
  ['course_end', 'Course end date', 'Course', false, 'up'],
  ['pathway_to', 'Pathway to', 'Course', false, 'up'],
]

export const FIELD_TOTAL = FIELD_TEMPLATES.length

export function buildBlankFields(): Field[] {
  return FIELD_TEMPLATES.map(([key, label, section, required, source]) => ({
    key,
    label,
    section,
    value: '',
    required,
    source,
    status: 'missing',
  }))
}

export const FIELD_SECTIONS: FieldSection[] = ['Personal', 'Contact', 'Education history', 'Course']
