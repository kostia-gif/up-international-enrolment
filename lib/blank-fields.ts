import type { Field, FieldSection, FieldSource } from './types'

// The CRM sections and their fields, shared by the fixture builder and the
// live wizard. Keep this list as the single source of the ~72-field set.
type Tmpl = [key: string, label: string, section: FieldSection, required: boolean, s: FieldSource]

export const FIELD_TEMPLATES: Tmpl[] = [
  // Personal
  ['given_name', 'Given name', 'Personal', true, 'ai'],
  ['family_name', 'Family name', 'Personal', true, 'ai'],
  ['preferred_name', 'Preferred name', 'Personal', false, 'agent'],
  ['dob', 'Date of birth', 'Personal', true, 'ai'],
  ['gender', 'Gender', 'Personal', false, 'ai'],
  ['nationality', 'Nationality', 'Personal', true, 'ai'],
  ['country_of_birth', 'Country of birth', 'Personal', false, 'ai'],
  ['passport_number', 'Passport number', 'Personal', true, 'ai'],
  ['passport_expiry', 'Passport expiry', 'Personal', true, 'ai'],
  ['first_language', 'First language', 'Personal', false, 'ai'],
  ['marital_status', 'Marital status', 'Personal', false, 'agent'],
  ['ethnicity', 'Ethnicity', 'Personal', false, 'agent'],
  ['iwi', 'Iwi (if applicable)', 'Personal', false, 'agent'],
  ['visa_status', 'Current visa status', 'Personal', false, 'agent'],
  // Contact
  ['email', 'Email', 'Contact', true, 'agent'],
  ['mobile', 'Mobile', 'Contact', true, 'agent'],
  ['alt_phone', 'Alternate phone', 'Contact', false, 'agent'],
  ['preferred_contact', 'Preferred contact method', 'Contact', false, 'agent'],
  ['cur_addr1', 'Current address line 1', 'Contact', true, 'agent'],
  ['cur_addr2', 'Current address line 2', 'Contact', false, 'agent'],
  ['cur_city', 'Current city', 'Contact', true, 'agent'],
  ['cur_country', 'Current country', 'Contact', true, 'agent'],
  ['cur_postcode', 'Current postcode', 'Contact', false, 'agent'],
  ['perm_addr1', 'Permanent address line 1', 'Contact', true, 'agent'],
  ['perm_addr2', 'Permanent address line 2', 'Contact', false, 'agent'],
  ['perm_city', 'Permanent city', 'Contact', true, 'agent'],
  ['perm_country', 'Permanent country', 'Contact', true, 'agent'],
  ['perm_postcode', 'Permanent postcode', 'Contact', false, 'agent'],
  // Emergency contact
  ['ec_name', 'Contact name', 'Emergency contact', true, 'agent'],
  ['ec_relationship', 'Relationship', 'Emergency contact', true, 'agent'],
  ['ec_phone', 'Contact phone', 'Emergency contact', true, 'agent'],
  ['ec_email', 'Contact email', 'Emergency contact', false, 'agent'],
  ['ec_address', 'Contact address', 'Emergency contact', false, 'agent'],
  // Education history
  ['highest_qual', 'Highest qualification', 'Education history', true, 'ai'],
  ['institution', 'Institution', 'Education history', true, 'ai'],
  ['institution_country', 'Institution country', 'Education history', true, 'ai'],
  ['study_start', 'Study start year', 'Education history', false, 'ai'],
  ['study_end', 'Study end year', 'Education history', true, 'ai'],
  ['field_of_study', 'Field of study', 'Education history', false, 'ai'],
  ['grade_gpa', 'Grade / GPA', 'Education history', false, 'ai'],
  ['qual_completed', 'Qualification completed', 'Education history', true, 'ai'],
  ['prev_study_nz', 'Previous study in NZ', 'Education history', false, 'agent'],
  // Optional: English can be an outstanding condition on a conditional offer,
  // so a missing test must not block LOO-readiness.
  ['english_test_type', 'English test type', 'Education history', false, 'ai'],
  ['english_test_score', 'English test score', 'Education history', false, 'ai'],
  ['english_test_date', 'English test date', 'Education history', false, 'ai'],
  ['english_test_expiry', 'English test expiry', 'Education history', false, 'ai'],
  // Health
  ['health_declaration', 'Health declaration', 'Health', true, 'agent'],
  ['disability_support', 'Disability support needed', 'Health', false, 'agent'],
  ['medical_conditions', 'Medical conditions', 'Health', false, 'agent'],
  ['medications', 'Current medications', 'Health', false, 'agent'],
  ['special_diet', 'Special dietary needs', 'Health', false, 'agent'],
  ['gp_details', 'GP / doctor details', 'Health', false, 'agent'],
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
  ['agent_ref_course', 'Agent reference', 'Course', false, 'agent'],
  // Insurance — defaults to UP-arranged, so cover mode must not block the LOO.
  ['insurance_mode', 'Cover mode', 'Insurance', false, 'agent'],
  ['insurance_reason', 'Reason', 'Insurance', false, 'agent'],
  ['insurance_provider', 'Provider', 'Insurance', false, 'agent'],
  ['insurance_policy_no', 'Policy number', 'Insurance', false, 'agent'],
  ['insurance_evidence', 'Evidence', 'Insurance', false, 'agent'],
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

export const FIELD_SECTIONS: FieldSection[] = [
  'Personal',
  'Contact',
  'Emergency contact',
  'Education history',
  'Health',
  'Course',
  'Insurance',
]
