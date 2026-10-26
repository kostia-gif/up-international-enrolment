import type { Field, FieldKind, FieldSection, FieldSource } from './types'

// Every field a complete UP CRM application needs, shared by the fixture
// builder and the live wizard. Labels follow the Enroller international form.
// Conditional fields are only required when their parent answer applies (see
// FIELD_SPECS in field-specs.ts).
type Tmpl = [
  key: string,
  label: string,
  section: FieldSection,
  required: boolean,
  source: FieldSource,
  kind: FieldKind,
]

export const FIELD_TEMPLATES: Tmpl[] = [
  // Personal — passport
  ['given_name', 'Given name', 'Personal', true, 'ai', 'document'],
  ['family_name', 'Family name', 'Personal', true, 'ai', 'document'],
  ['dob', 'Date of birth', 'Personal', true, 'ai', 'document'],
  ['gender', 'Gender', 'Personal', true, 'ai', 'document'],
  ['country_of_birth', 'Country of birth', 'Personal', true, 'ai', 'document'],
  ['nationality', 'Country of citizenship', 'Personal', true, 'ai', 'document'],
  ['passport_number', 'Passport number', 'Personal', true, 'ai', 'document'],
  ['passport_expiry', 'Passport expiry', 'Personal', true, 'ai', 'document'],
  // Personal — ask the student
  ['preferred_name', 'Preferred name / known as', 'Personal', true, 'agent', 'manual'],
  ['ethnicity', 'Ethnicity', 'Personal', true, 'agent', 'manual'],
  ['in_nz', 'Currently in New Zealand?', 'Personal', true, 'agent', 'manual'],
  ['nz_visa_type', 'Current NZ visa type', 'Personal', true, 'agent', 'manual'],
  ['under_18', 'Under 18 at course start', 'Personal', false, 'agent', 'derived'],
  ['onshore', 'Onshore / offshore', 'Personal', false, 'agent', 'derived'],
  // Contact
  ['email', 'Email', 'Contact', true, 'agent', 'manual'],
  ['mobile', 'Mobile', 'Contact', true, 'agent', 'manual'],
  // Home address
  ['addr_line1', 'Address line 1', 'Home address', true, 'agent', 'manual'],
  ['addr_line2', 'Address line 2', 'Home address', false, 'agent', 'manual'],
  ['addr_city', 'City / town', 'Home address', true, 'agent', 'manual'],
  ['addr_region', 'State / province / region', 'Home address', true, 'agent', 'manual'],
  ['addr_postcode', 'Postcode / ZIP', 'Home address', true, 'agent', 'manual'],
  ['addr_country', 'Country', 'Home address', true, 'agent', 'manual'],
  // Secondary education — AI pre-fills from the transcript, the agent confirms
  ['highest_qual', 'Current / last secondary school qualification', 'Secondary education', true, 'ai', 'manual'],
  ['institution', 'Secondary school', 'Secondary education', true, 'ai', 'manual'],
  ['institution_country', 'School country', 'Secondary education', true, 'ai', 'manual'],
  ['qual_completed', 'Qualification completed?', 'Secondary education', true, 'ai', 'manual'],
  ['study_start', 'Year qualification started', 'Secondary education', true, 'ai', 'manual'],
  ['study_end', 'Year qualification completed', 'Secondary education', true, 'ai', 'manual'],
  ['sec_last_year', 'Last year of secondary school', 'Secondary education', true, 'ai', 'manual'],
  ['sec_highest', 'Highest secondary school qualification', 'Secondary education', true, 'ai', 'manual'],
  // Tertiary education
  ['tertiary_studied', 'Studied at tertiary level?', 'Tertiary education', true, 'agent', 'manual'],
  ['tert_qual', 'Highest tertiary qualification', 'Tertiary education', true, 'ai', 'manual'],
  ['tert_institution', 'Institution', 'Tertiary education', true, 'ai', 'manual'],
  ['tert_start', 'Start year', 'Tertiary education', true, 'ai', 'manual'],
  ['tert_status', 'Status', 'Tertiary education', true, 'ai', 'manual'],
  ['tert_end', 'End year', 'Tertiary education', true, 'ai', 'manual'],
  ['tert_expected', 'Expected completion date', 'Tertiary education', true, 'agent', 'manual'],
  // English can be an outstanding condition on a conditional offer, so a
  // missing test must not block LoO-readiness.
  ['english_test_type', 'English test type', 'English', false, 'ai', 'document'],
  ['english_test_score', 'English test score', 'English', false, 'ai', 'document'],
  ['english_test_date', 'English test date', 'English', false, 'ai', 'document'],
  ['english_test_expiry', 'English test expiry', 'English', false, 'ai', 'document'],
  // Study record (MoE)
  ['first_tertiary_year', 'Is this your first year of tertiary education?', 'Study record', true, 'agent', 'manual'],
  ['first_enrol_year', 'Year of first tertiary enrolment', 'Study record', true, 'agent', 'manual'],
  ['main_activity', 'Main activity at 1 October before study', 'Study record', true, 'agent', 'manual'],
  ['prev_up', 'Previous UP Education student?', 'Study record', true, 'agent', 'manual'],
  ['prev_up_provider', 'Provider', 'Study record', true, 'agent', 'manual'],
  ['prev_up_programme', 'Programme', 'Study record', true, 'agent', 'manual'],
  ['prev_up_year', 'Year finished', 'Study record', true, 'agent', 'manual'],
  ['prev_up_staircase', 'Staircase application?', 'Study record', true, 'agent', 'manual'],
  // Study gap
  ['gap', 'Have you had a study/work gap of more than 6 months?', 'Study gap', true, 'agent', 'manual'],
  ['gap_start', 'Gap start date', 'Study gap', true, 'agent', 'manual'],
  ['gap_end', 'Gap end date', 'Study gap', true, 'agent', 'manual'],
  ['gap_reason', 'Reason for the gap', 'Study gap', true, 'agent', 'manual'],
  // Immigration
  ['visa_refused', 'Have you ever been refused a visa (NZ or overseas)?', 'Immigration', true, 'agent', 'manual'],
  ['refused_country', 'Country', 'Immigration', true, 'agent', 'manual'],
  ['refused_year', 'Year', 'Immigration', true, 'agent', 'manual'],
  ['refused_reason', 'Reason', 'Immigration', true, 'agent', 'manual'],
  ['had_nz_visa', 'Had or currently hold a New Zealand visa?', 'Immigration', true, 'agent', 'manual'],
  // Emergency contact in home country
  ['ec_relationship', 'Relationship', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_first', 'First name', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_last', 'Last name', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_email', 'Email address', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_home_phone', 'Home phone', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_mobile', 'Mobile', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_same_address', "Address is the same as the student's", 'Emergency contact', false, 'agent', 'manual'],
  ['ec_addr', 'Address line', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_city', 'City / town', 'Emergency contact', true, 'agent', 'manual'],
  ['ec_country', 'Country', 'Emergency contact', true, 'agent', 'manual'],
  // Health
  ['health_condition', 'Condition affecting study?', 'Health', true, 'agent', 'manual'],
  ['health_condition_detail', 'Details', 'Health', true, 'agent', 'manual'],
  ['disability_services', 'Disability services accessed?', 'Health', true, 'agent', 'manual'],
  ['emergency_assist', 'Assistance needed in an emergency?', 'Health', true, 'agent', 'manual'],
  ['prior_health', 'Prior health condition to declare?', 'Health', true, 'agent', 'manual'],
  ['prior_health_detail', 'Details', 'Health', true, 'agent', 'manual'],
  // Insurance
  ['insurance_mode', 'Cover mode', 'Insurance', true, 'agent', 'manual'],
  // Optional
  ['sponsor', 'Sponsorship programme', 'Funding', false, 'agent', 'manual'],
  ['sponsor_ref', 'Sponsor reference', 'Funding', false, 'agent', 'manual'],
  ['other_branch', 'Submitted on behalf of another branch?', 'Agent', false, 'agent', 'manual'],
  ['branch_name', 'Branch name', 'Agent', true, 'agent', 'manual'],
  // Course
  ['brand', 'Brand', 'Course', true, 'up', 'document'],
  ['programme_name', 'Programme name (NZQA)', 'Course', true, 'up', 'document'],
  ['nzqa_level', 'NZQA level', 'Course', true, 'up', 'document'],
  ['campus', 'Campus', 'Course', true, 'up', 'document'],
  ['intake_date', 'Intake date', 'Course', true, 'up', 'document'],
  ['study_mode', 'Study mode', 'Course', false, 'up', 'document'],
  ['price_bundle', 'Price bundle', 'Course', true, 'up', 'document'],
  ['tuition_fee', 'Tuition fee', 'Course', false, 'up', 'document'],
  ['course_start', 'Course start date', 'Course', false, 'up', 'document'],
  ['course_end', 'Course end date', 'Course', false, 'up', 'document'],
  ['pathway_to', 'Pathway to', 'Course', false, 'up', 'document'],
]

// Fields a document can fill (shown as "x of N fields read" in step 2).
export const FIELD_TOTAL = FIELD_TEMPLATES.filter((t) => t[4] === 'ai').length

// Pre-answered defaults for a new application.
export const FIELD_DEFAULTS: Record<string, string> = {
  health_condition: 'No',
  disability_services: 'No',
  emergency_assist: 'No',
  prior_health: 'No',
  ec_same_address: 'Yes',
  insurance_mode: 'UP default',
}

export function buildBlankFields(): Field[] {
  return FIELD_TEMPLATES.map(([key, label, section, required, source, kind]) => {
    const preset = FIELD_DEFAULTS[key]
    return {
      key,
      label,
      section,
      kind,
      value: preset ?? '',
      required,
      source: preset ? 'agent' : source,
      status: preset ? 'confirmed' : 'missing',
    }
  })
}

export const DOCUMENT_SECTIONS: FieldSection[] = ['Personal', 'English', 'Course']

export const MANUAL_SECTIONS: FieldSection[] = [
  'Personal',
  'Contact',
  'Home address',
  'Secondary education',
  'Tertiary education',
  'Study record',
  'Study gap',
  'Immigration',
  'Emergency contact',
  'Health',
  'Insurance',
]

// Collapsed "Optional" group at the end of "Ask the student".
export const OPTIONAL_SECTIONS: FieldSection[] = ['Funding', 'Agent']

export const FIELD_SECTIONS: FieldSection[] = [
  ...MANUAL_SECTIONS.filter((s) => !DOCUMENT_SECTIONS.includes(s)),
  ...DOCUMENT_SECTIONS,
  ...OPTIONAL_SECTIONS,
]
