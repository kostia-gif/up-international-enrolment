import type {
  Agency,
  Application,
  Condition,
  Document,
  Field,
  FieldSource,
  FieldStatus,
  InboundEmail,
  Requirement,
} from './types'
import type { DropFile } from './simulate'
import { FIELD_TEMPLATES, FIELD_TOTAL as FIELD_COUNT } from './blank-fields'

// ---------------------------------------------------------------------------
// Agency hierarchy
// ---------------------------------------------------------------------------

export const AGENCY: Agency = {
  id: 'psl',
  name: 'Pacific Study Link',
  counsellors: [
    { id: 'c-grace', name: 'Grace Tan', role: 'owner' },
    { id: 'c-mei', name: 'Mei Lin', role: 'counsellor' },
    { id: 'c-james', name: 'James Okoro', role: 'counsellor' },
  ],
}

export function counsellorName(id: string): string {
  return AGENCY.counsellors.find((c) => c.id === id)?.name ?? 'Unknown'
}

// The ~72-field CRM set lives in blank-fields.ts (shared with the wizard).
export const FIELD_TOTAL = FIELD_COUNT

interface Seed {
  v?: string
  src?: FieldSource
  status?: FieldStatus
  doc?: string
  page?: number
  conf?: number
}

function buildFields(seed: Record<string, Seed>): Field[] {
  return FIELD_TEMPLATES.map(([key, label, section, required, defaultSource]) => {
    const s = seed[key]
    if (!s) {
      return { key, label, section, value: '', required, source: defaultSource, status: 'missing' }
    }
    const source = s.src ?? defaultSource
    let status: FieldStatus
    if (s.status) status = s.status
    else if (s.v === undefined || s.v === '') status = 'missing'
    else status = source === 'ai' ? 'ai' : 'confirmed'
    return {
      key,
      label,
      section,
      value: s.v ?? '',
      required,
      source,
      status,
      sourceDoc: s.doc,
      sourcePage: s.page,
      confidence: s.conf,
    }
  })
}

// Anchored to the real runtime clock so relative ages ("2d ago", live elapsed
// timers) stay realistic whenever the demo is viewed. Evaluated once per module
// load; ElapsedTracker/RelativeTime defer their live text to after mount so this
// does not cause a hydration mismatch.
const now = new Date()
function iso(daysAgo: number, hour = 9): string {
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

// ---------------------------------------------------------------------------
// Course "up" fields helper (shared by every application)
// ---------------------------------------------------------------------------

function courseSeed(c: {
  brand: string
  programme: string
  level: string
  campus: string
  intake: string
  price: string
  fee: string
  start: string
  end: string
  agentRef?: string
}): Record<string, Seed> {
  return {
    brand: { v: c.brand, src: 'up', status: 'verified' },
    programme_name: { v: c.programme, src: 'up', status: 'verified' },
    nzqa_level: { v: c.level, src: 'up', status: 'verified' },
    campus: { v: c.campus, src: 'up', status: 'verified' },
    intake_date: { v: c.intake, src: 'up', status: 'verified' },
    study_mode: { v: 'Full-time, on campus', src: 'up', status: 'verified' },
    price_bundle: { v: c.price, src: 'up', status: 'verified' },
    tuition_fee: { v: c.fee, src: 'up', status: 'verified' },
    course_start: { v: c.start, src: 'up', status: 'verified' },
    course_end: { v: c.end, src: 'up', status: 'verified' },
    ...(c.agentRef ? { agent_ref_course: { v: c.agentRef, src: 'agent', status: 'confirmed' } } : {}),
  }
}

const agentContactSeed = (o: {
  email: string
  mobile: string
  addr: string
  city: string
  country: string
  postcode?: string
  ecName: string
  ecRel: string
  ecPhone: string
  health?: string
  insurance?: string
}): Record<string, Seed> => ({
  email: { v: o.email, src: 'agent', status: 'confirmed' },
  mobile: { v: o.mobile, src: 'agent', status: 'confirmed' },
  cur_addr1: { v: o.addr, src: 'agent', status: 'confirmed' },
  cur_city: { v: o.city, src: 'agent', status: 'confirmed' },
  cur_country: { v: o.country, src: 'agent', status: 'confirmed' },
  cur_postcode: { v: o.postcode ?? '', src: 'agent', status: o.postcode ? 'confirmed' : 'missing' },
  perm_addr1: { v: o.addr, src: 'agent', status: 'confirmed' },
  perm_city: { v: o.city, src: 'agent', status: 'confirmed' },
  perm_country: { v: o.country, src: 'agent', status: 'confirmed' },
  ec_name: { v: o.ecName, src: 'agent', status: 'confirmed' },
  ec_relationship: { v: o.ecRel, src: 'agent', status: 'confirmed' },
  ec_phone: { v: o.ecPhone, src: 'agent', status: 'confirmed' },
  health_declaration: {
    v: o.health ?? 'No conditions declared',
    src: 'agent',
    status: o.health === undefined ? 'missing' : 'confirmed',
  },
  insurance_mode: {
    v: o.insurance ?? '',
    src: 'agent',
    status: o.insurance ? 'confirmed' : 'missing',
  },
})

// ===========================================================================
// Fixture 1 — Nguyen Thi Lan (VN). Clean path, auto LOO at submit.
// ===========================================================================

const app1Docs: Document[] = [
  { id: 'a1-d1', type: 'Passport', fileName: 'Passport_UP248801.pdf', originalName: 'lan_passport_scan.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a1-d2', type: 'Transcript', fileName: 'Transcript_UP248801.pdf', originalName: 'bang_diem_thpt.pdf', language: 'Vietnamese', translatedPdf: true, status: 'checked', pages: 2 },
  { id: 'a1-d3', type: 'EnglishTest', fileName: 'EnglishTest_UP248801.pdf', originalName: 'IELTS_TRF_lan.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a1-d4', type: 'CV', fileName: 'CV_UP248801.pdf', originalName: 'CV Nguyen Lan.pdf', language: 'English', status: 'checked', pages: 2 },
  { id: 'a1-d5', type: 'Reference', fileName: 'Reference_UP248801.pdf', originalName: 'reference_teacher.pdf', language: 'Vietnamese', translatedPdf: true, status: 'checked', pages: 1 },
]

const app1Reqs: Requirement[] = [
  { id: 'a1-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a1-d1' },
  { id: 'a1-r2', label: 'Nationality matches passport', category: 'identity', status: 'met', evidence: 'a1-d1' },
  { id: 'a1-r3', label: 'Academic transcript — secondary school', category: 'academic', status: 'met', evidence: 'a1-d2', note: 'Translated to English' },
  { id: 'a1-r4', label: 'English evidence valid on start date', category: 'english', status: 'met', evidence: 'a1-d3', note: 'IELTS 6.0, valid to Nov 2028' },
  { id: 'a1-r5', label: 'Programme + intake selected', category: 'course', status: 'met' },
  { id: 'a1-r6', label: 'Genuine intent (CV + reference)', category: 'other', status: 'met', evidence: 'a1-d4' },
]

const app1Fields = buildFields({
  ...courseSeed({
    brand: 'NZMA',
    programme: 'New Zealand Certificate in Cookery (Level 4)',
    level: 'Level 4',
    campus: 'Auckland',
    intake: '2027-02-15',
    price: 'NZD 24,500',
    fee: 'NZD 22,000',
    start: '2027-02-15',
    end: '2027-11-19',
    agentRef: 'PSL-LAN-01',
  }),
  ...agentContactSeed({
    email: 'lan.nguyen@example.com',
    mobile: '+84 90 123 4567',
    addr: '24 Le Loi Street',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    postcode: '700000',
    ecName: 'Nguyen Van Minh',
    ecRel: 'Father',
    ecPhone: '+84 90 765 4321',
    health: 'No conditions declared',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Thi Lan', doc: 'a1-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Nguyen', doc: 'a1-d1', page: 1, conf: 0.99 },
  dob: { v: '2008-03-12', doc: 'a1-d1', page: 1, conf: 0.98 },
  gender: { v: 'Female', doc: 'a1-d1', page: 1, conf: 0.97 },
  nationality: { v: 'Vietnam', doc: 'a1-d1', page: 1, conf: 0.99 },
  country_of_birth: { v: 'Vietnam', doc: 'a1-d1', page: 1, conf: 0.95 },
  passport_number: { v: 'B9921034', doc: 'a1-d1', page: 1, conf: 0.99 },
  passport_expiry: { v: '2031-06-30', doc: 'a1-d1', page: 1, conf: 0.98 },
  first_language: { v: 'Vietnamese', doc: 'a1-d1', page: 1, conf: 0.9 },
  highest_qual: { v: 'High School Diploma', doc: 'a1-d2', page: 1, conf: 0.94 },
  institution: { v: 'Le Hong Phong High School', doc: 'a1-d2', page: 1, conf: 0.93 },
  institution_country: { v: 'Vietnam', doc: 'a1-d2', page: 1, conf: 0.97 },
  study_start: { v: '2023', doc: 'a1-d2', page: 1, conf: 0.9 },
  study_end: { v: '2026', doc: 'a1-d2', page: 1, conf: 0.92 },
  field_of_study: { v: 'General', doc: 'a1-d2', page: 1, conf: 0.85 },
  grade_gpa: { v: '8.1 / 10', doc: 'a1-d2', page: 2, conf: 0.88 },
  qual_completed: { v: 'Yes', doc: 'a1-d2', page: 1, conf: 0.95 },
  english_test_type: { v: 'IELTS Academic', doc: 'a1-d3', page: 1, conf: 0.98 },
  english_test_score: { v: '6.0', doc: 'a1-d3', page: 1, conf: 0.98 },
  english_test_date: { v: '2026-05-20', doc: 'a1-d3', page: 1, conf: 0.97 },
  english_test_expiry: { v: '2028-05-20', doc: 'a1-d3', page: 1, conf: 0.96 },
})

// ===========================================================================
// Fixture 2 — Rahul Sharma (IN). Special admission, review route.
// ===========================================================================

const app2Docs: Document[] = [
  { id: 'a2-d1', type: 'Passport', fileName: 'Passport_UP248802.pdf', originalName: 'rahul passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a2-d2', type: 'EnglishTest', fileName: 'EnglishTest_UP248802.pdf', originalName: 'pte score.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a2-d3', type: 'CV', fileName: 'CV_UP248802.pdf', originalName: 'Rahul_Sharma_Resume.pdf', language: 'English', status: 'checked', pages: 3 },
  { id: 'a2-d4', type: 'Reference', fileName: 'Reference_UP248802.pdf', originalName: 'manager_ref_infosys.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app2Reqs: Requirement[] = [
  { id: 'a2-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a2-d1' },
  { id: 'a2-r2', label: 'Bachelor degree or equivalent', category: 'academic', status: 'missing', note: 'No degree — routed to special admission' },
  { id: 'a2-r3', label: 'English evidence valid on start date', category: 'english', status: 'met', evidence: 'a2-d2', note: 'PTE 58, valid to Aug 2028' },
  { id: 'a2-r4', label: 'Programme + intake selected', category: 'course', status: 'met' },
  { id: 'a2-r5', label: 'Relevant work experience (special admission)', category: 'academic', status: 'problem', evidence: 'a2-d3', note: '4 years; second reference outstanding' },
]

const app2Fields = buildFields({
  ...courseSeed({
    brand: 'Yoobee',
    programme: 'New Zealand Diploma in Software Development (Level 7)',
    level: 'Level 7',
    campus: 'Wellington',
    intake: '2027-02-22',
    price: 'NZD 27,900',
    fee: 'NZD 27,900',
    start: '2027-02-22',
    end: '2028-02-20',
    agentRef: 'PSL-RAHUL-07',
  }),
  ...agentContactSeed({
    email: 'rahul.sharma@example.com',
    mobile: '+91 98200 11223',
    addr: '14 MG Road',
    city: 'Bengaluru',
    country: 'India',
    ecName: 'Anita Sharma',
    ecRel: 'Spouse',
    ecPhone: '+91 98200 44556',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Rahul', doc: 'a2-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Sharma', doc: 'a2-d1', page: 1, conf: 0.99 },
  dob: { v: '1996-11-02', doc: 'a2-d1', page: 1, conf: 0.98 },
  nationality: { v: 'India', doc: 'a2-d1', page: 1, conf: 0.99 },
  passport_number: { v: 'M7742318', doc: 'a2-d1', page: 1, conf: 0.98 },
  passport_expiry: { v: '2029-09-14', doc: 'a2-d1', page: 1, conf: 0.97 },
  first_language: { v: 'Hindi', doc: 'a2-d1', page: 1, conf: 0.9 },
  highest_qual: { v: 'Higher Secondary (12th)', doc: 'a2-d3', page: 1, conf: 0.7, status: 'conflict' },
  field_of_study: { v: 'Computer Applications (self-taught)', doc: 'a2-d3', page: 2, conf: 0.6 },
  english_test_type: { v: 'PTE Academic', doc: 'a2-d2', page: 1, conf: 0.97 },
  english_test_score: { v: '58', doc: 'a2-d2', page: 1, conf: 0.96 },
  english_test_date: { v: '2026-08-10', doc: 'a2-d2', page: 1, conf: 0.95 },
  english_test_expiry: { v: '2028-08-10', doc: 'a2-d2', page: 1, conf: 0.95 },
})

// ===========================================================================
// Fixture 3 — Wang Yuxuan (CN). Bundle, Conditions open, email capture today.
// ===========================================================================

const app3Docs: Document[] = [
  { id: 'a3-d1', type: 'Passport', fileName: 'Passport_UP248803.pdf', originalName: '王宇轩护照.pdf', language: 'Chinese', translatedPdf: true, status: 'checked', pages: 1 },
  { id: 'a3-d2', type: 'Transcript', fileName: 'Transcript_UP248803.pdf', originalName: '成绩单.pdf', language: 'Chinese', translatedPdf: true, status: 'checked', pages: 3 },
  { id: 'a3-d3', type: 'FinancialEvidence', fileName: 'FinancialEvidence_UP248803.pdf', originalName: 'bank_statement_boc.pdf', language: 'Chinese', translatedPdf: true, status: 'checked', pages: 4 },
  { id: 'a3-d4', type: 'InsuranceEvidence', fileName: 'InsuranceEvidence_UP248803.pdf', originalName: 'family_travel_policy.pdf', language: 'English', status: 'checked', pages: 2 },
  { id: 'a3-d5', type: 'EnglishTest', fileName: 'EnglishTest_UP248803.pdf', originalName: 'IELTS_result_wang.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app3Reqs: Requirement[] = [
  { id: 'a3-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a3-d1' },
  { id: 'a3-r2', label: 'Academic transcript — senior high', category: 'academic', status: 'met', evidence: 'a3-d2' },
  { id: 'a3-r3', label: 'English evidence for Foundation entry', category: 'english', status: 'met', evidence: 'a3-d5', note: 'IELTS 5.5 — added from email today' },
  { id: 'a3-r4', label: 'Bundle: English + Foundation selected', category: 'course', status: 'met' },
  { id: 'a3-r5', label: 'Financial evidence', category: 'other', status: 'met', evidence: 'a3-d3' },
]

const app3Fields = buildFields({
  ...courseSeed({
    brand: 'UPIC',
    programme: 'UP International College Foundation (Bundle: English + Foundation)',
    level: 'Foundation',
    campus: 'Auckland',
    intake: '2027-03-01',
    price: 'NZD 31,200',
    fee: 'NZD 31,200',
    start: '2027-03-01',
    end: '2028-02-25',
    agentRef: 'PSL-WANG-FB',
  }),
  ...agentContactSeed({
    email: 'yuxuan.wang@example.com',
    mobile: '+86 138 0011 2233',
    addr: '88 Nanjing Road',
    city: 'Shanghai',
    country: 'China',
    postcode: '200000',
    ecName: 'Wang Lei',
    ecRel: 'Father (travelling with student)',
    ecPhone: '+86 138 0044 5566',
    health: 'No conditions declared',
    insurance: 'Own cover',
  }),
  insurance_reason: { v: 'Travelling with parent on family policy', src: 'agent', status: 'confirmed' },
  insurance_provider: { v: 'Ping An Travel', src: 'agent', status: 'confirmed' },
  insurance_evidence: { v: 'family_travel_policy.pdf', src: 'agent', status: 'confirmed', doc: 'a3-d4' },
  given_name: { v: 'Yuxuan', doc: 'a3-d1', page: 1, conf: 0.97 },
  family_name: { v: 'Wang', doc: 'a3-d1', page: 1, conf: 0.97 },
  dob: { v: '2009-01-22', doc: 'a3-d1', page: 1, conf: 0.96 },
  nationality: { v: 'China', doc: 'a3-d1', page: 1, conf: 0.98 },
  passport_number: { v: 'E88231045', doc: 'a3-d1', page: 1, conf: 0.97 },
  passport_expiry: { v: '2032-04-18', doc: 'a3-d1', page: 1, conf: 0.96 },
  first_language: { v: 'Mandarin', doc: 'a3-d1', page: 1, conf: 0.93 },
  highest_qual: { v: 'Senior High School (in progress)', doc: 'a3-d2', page: 1, conf: 0.9 },
  institution: { v: 'Shanghai No. 3 Girls High School', doc: 'a3-d2', page: 1, conf: 0.9 },
  institution_country: { v: 'China', doc: 'a3-d2', page: 1, conf: 0.96 },
  study_end: { v: '2027', doc: 'a3-d2', page: 1, conf: 0.88 },
  qual_completed: { v: 'In progress', doc: 'a3-d2', page: 1, conf: 0.85 },
  english_test_type: { v: 'IELTS Academic', doc: 'a3-d5', page: 1, conf: 0.97, status: 'verified' },
  english_test_score: { v: '5.5', doc: 'a3-d5', page: 1, conf: 0.97, status: 'verified' },
  english_test_date: { v: '2026-09-01', doc: 'a3-d5', page: 1, conf: 0.96, status: 'verified' },
  english_test_expiry: { v: '2028-09-01', doc: 'a3-d5', page: 1, conf: 0.96, status: 'verified' },
})

const app3Conditions: Condition[] = [
  { id: 'a3-c1', label: 'English test result (IELTS) for Foundation entry', owner: 'student', status: 'cleared', evidence: 'a3-d5', createdFrom: 'email' },
  { id: 'a3-c2', label: 'Own-cover insurance policy valid for full stay', owner: 'agent', status: 'submitted', dueBy: '2027-02-01', evidence: 'a3-d4', createdFrom: 'system' },
  { id: 'a3-c3', label: 'Final senior high transcript on completion', owner: 'student', status: 'open', dueBy: '2027-02-15', createdFrom: 'system' },
]

// ===========================================================================
// Fixture 4 — Maria Santos (PH). Duplicate hold.
// ===========================================================================

const app4Docs: Document[] = [
  { id: 'a4-d1', type: 'Passport', fileName: 'Passport_UP248804.pdf', originalName: 'santos_passport.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app4Reqs: Requirement[] = [
  { id: 'a4-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a4-d1' },
  { id: 'a4-r2', label: 'Bachelor-level academic evidence', category: 'academic', status: 'missing' },
  { id: 'a4-r3', label: 'English evidence valid on start date', category: 'english', status: 'missing' },
  { id: 'a4-r4', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app4Fields = buildFields({
  ...courseSeed({
    brand: 'NZTC',
    programme: 'Bachelor of Education (Early Childhood Education)',
    level: 'Level 7',
    campus: 'Auckland',
    intake: '2027-02-22',
    price: 'NZD 23,800',
    fee: 'NZD 23,800',
    start: '2027-02-22',
    end: '2030-02-20',
  }),
  given_name: { v: 'Maria', doc: 'a4-d1', page: 1, conf: 0.98 },
  family_name: { v: 'Santos', doc: 'a4-d1', page: 1, conf: 0.98 },
  dob: { v: '2000-07-19', doc: 'a4-d1', page: 1, conf: 0.97 },
  nationality: { v: 'Philippines', doc: 'a4-d1', page: 1, conf: 0.98 },
  passport_number: { v: 'PH8842019', doc: 'a4-d1', page: 1, conf: 0.98 },
  passport_expiry: { v: '2030-03-11', doc: 'a4-d1', page: 1, conf: 0.97 },
})

// ===========================================================================
// Fixture 5 — Ahmed Al-Rashid (SA). Expiring evidence + discount request.
// ===========================================================================

const app5Docs: Document[] = [
  { id: 'a5-d1', type: 'Passport', fileName: 'Passport_UP248805.pdf', originalName: 'ahmed_passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a5-d2', type: 'Transcript', fileName: 'Transcript_UP248805.pdf', originalName: 'diploma_transcript.pdf', language: 'Arabic', translatedPdf: true, status: 'checked', pages: 2 },
  { id: 'a5-d3', type: 'EnglishTest', fileName: 'EnglishTest_UP248805.pdf', originalName: 'ielts_ahmed.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app5Reqs: Requirement[] = [
  { id: 'a5-r1', label: 'Passport valid 6 months beyond travel', category: 'identity', status: 'expiring', evidence: 'a5-d1', note: 'Passport expires 4 months after intake start' },
  { id: 'a5-r2', label: 'Academic transcript', category: 'academic', status: 'met', evidence: 'a5-d2' },
  { id: 'a5-r3', label: 'English evidence valid on start date', category: 'english', status: 'expiring', evidence: 'a5-d3', note: 'IELTS expires 12 Jan 2027 — intake starts 15 Feb 2027' },
  { id: 'a5-r4', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app5Fields = buildFields({
  ...courseSeed({
    brand: 'NZMA',
    programme: 'New Zealand Diploma in Hospitality Management (Level 5)',
    level: 'Level 5',
    campus: 'Auckland',
    intake: '2027-02-15',
    price: 'NZD 25,600',
    fee: 'NZD 25,600',
    start: '2027-02-15',
    end: '2028-02-11',
    agentRef: 'PSL-AHMED-05',
  }),
  ...agentContactSeed({
    email: 'ahmed.alrashid@example.com',
    mobile: '+966 50 112 3344',
    addr: 'King Fahd Road 220',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    ecName: 'Fahd Al-Rashid',
    ecRel: 'Brother',
    ecPhone: '+966 50 556 7788',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Ahmed', doc: 'a5-d1', page: 1, conf: 0.98 },
  family_name: { v: 'Al-Rashid', doc: 'a5-d1', page: 1, conf: 0.98 },
  dob: { v: '2002-05-30', doc: 'a5-d1', page: 1, conf: 0.97 },
  nationality: { v: 'Saudi Arabia', doc: 'a5-d1', page: 1, conf: 0.98 },
  passport_number: { v: 'S3390142', doc: 'a5-d1', page: 1, conf: 0.97 },
  passport_expiry: { v: '2027-06-14', doc: 'a5-d1', page: 1, conf: 0.97, status: 'conflict' },
  highest_qual: { v: 'Diploma in Tourism', doc: 'a5-d2', page: 1, conf: 0.9 },
  institution: { v: 'Riyadh College of Tourism', doc: 'a5-d2', page: 1, conf: 0.89 },
  institution_country: { v: 'Saudi Arabia', doc: 'a5-d2', page: 1, conf: 0.95 },
  study_end: { v: '2024', doc: 'a5-d2', page: 1, conf: 0.9 },
  qual_completed: { v: 'Yes', doc: 'a5-d2', page: 1, conf: 0.92 },
  english_test_type: { v: 'IELTS Academic', doc: 'a5-d3', page: 1, conf: 0.96 },
  english_test_score: { v: '5.5', doc: 'a5-d3', page: 1, conf: 0.96 },
  english_test_date: { v: '2025-01-12', doc: 'a5-d3', page: 1, conf: 0.95 },
  english_test_expiry: { v: '2027-01-12', doc: 'a5-d3', page: 1, conf: 0.95, status: 'conflict' },
})

// ===========================================================================
// Fixture 6 — Priya Menon (IN). Conditional offer issued; English test is the
// one outstanding item. Used to demo the Pearson authenticity validation flow.
// ===========================================================================

const app6Docs: Document[] = [
  { id: 'a6-d1', type: 'Passport', fileName: 'Passport_UP248806.pdf', originalName: 'priya_passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a6-d2', type: 'Transcript', fileName: 'Transcript_UP248806.pdf', originalName: 'bachelor_transcript.pdf', language: 'English', status: 'checked', pages: 2 },
]

const app6Reqs: Requirement[] = [
  { id: 'a6-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a6-d1' },
  { id: 'a6-r2', label: 'Academic transcript — bachelor degree', category: 'academic', status: 'met', evidence: 'a6-d2' },
  { id: 'a6-r3', label: 'English evidence valid on start date', category: 'english', status: 'missing', note: 'Outstanding — student to submit PTE or IELTS' },
  { id: 'a6-r4', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app6Fields = buildFields({
  ...courseSeed({
    brand: 'Yoobee',
    programme: 'New Zealand Diploma in Web Development and Design (Level 6)',
    level: 'Level 6',
    campus: 'Auckland',
    intake: '2027-02-22',
    price: 'NZD 22,900',
    fee: 'NZD 22,900',
    start: '2027-02-22',
    end: '2028-02-18',
    agentRef: 'PSL-PRIYA-06',
  }),
  ...agentContactSeed({
    email: 'priya.menon@example.com',
    mobile: '+91 98450 33221',
    addr: '7 Brigade Road',
    city: 'Bengaluru',
    country: 'India',
    postcode: '560001',
    ecName: 'Latha Menon',
    ecRel: 'Mother',
    ecPhone: '+91 98450 77889',
    health: 'No conditions declared',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Priya', doc: 'a6-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Menon', doc: 'a6-d1', page: 1, conf: 0.99 },
  dob: { v: '2001-04-08', doc: 'a6-d1', page: 1, conf: 0.98 },
  gender: { v: 'Female', doc: 'a6-d1', page: 1, conf: 0.96 },
  nationality: { v: 'India', doc: 'a6-d1', page: 1, conf: 0.99 },
  country_of_birth: { v: 'India', doc: 'a6-d1', page: 1, conf: 0.95 },
  passport_number: { v: 'Z4471903', doc: 'a6-d1', page: 1, conf: 0.98 },
  passport_expiry: { v: '2030-12-02', doc: 'a6-d1', page: 1, conf: 0.97 },
  first_language: { v: 'Malayalam', doc: 'a6-d1', page: 1, conf: 0.9 },
  highest_qual: { v: 'Bachelor of Commerce', doc: 'a6-d2', page: 1, conf: 0.93 },
  institution: { v: 'Bangalore University', doc: 'a6-d2', page: 1, conf: 0.92 },
  institution_country: { v: 'India', doc: 'a6-d2', page: 1, conf: 0.96 },
  study_start: { v: '2019', doc: 'a6-d2', page: 1, conf: 0.9 },
  study_end: { v: '2022', doc: 'a6-d2', page: 1, conf: 0.92 },
  field_of_study: { v: 'Commerce', doc: 'a6-d2', page: 1, conf: 0.88 },
  grade_gpa: { v: '7.4 / 10', doc: 'a6-d2', page: 2, conf: 0.86 },
  qual_completed: { v: 'Yes', doc: 'a6-d2', page: 1, conf: 0.94 },
  // english_test_* intentionally left missing — this is the outstanding item.
})

const app6Conditions: Condition[] = [
  { id: 'a6-c1', label: 'English test result (PTE / IELTS) valid on start date', owner: 'student', status: 'open', dueBy: '2027-01-15', createdFrom: 'system' },
]

// ===========================================================================
// Fixture 7 — Chen Jiahao (CN). Submitted for unconditional; conditional LoO
// generated by the agent at submit; awaiting English score.
// ===========================================================================

const app7Docs: Document[] = [
  { id: 'a7-d1', type: 'Passport', fileName: 'Passport_UP248807.pdf', originalName: 'chen_passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a7-d2', type: 'Transcript', fileName: 'Transcript_UP248807.pdf', originalName: 'chen_degree.pdf', language: 'Chinese', translatedPdf: true, status: 'checked', pages: 2 },
]

const app7Reqs: Requirement[] = [
  { id: 'a7-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a7-d1' },
  { id: 'a7-r2', label: 'Academic transcript — bachelor degree', category: 'academic', status: 'met', evidence: 'a7-d2' },
  { id: 'a7-r3', label: 'English evidence valid on start date', category: 'english', status: 'missing', note: 'Student sits IELTS next week' },
  { id: 'a7-r4', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app7Conditions: Condition[] = [
  { id: 'a7-c1', label: 'Application to be reviewed by UP admissions team', owner: 'up', status: 'open', createdFrom: 'system' },
  { id: 'a7-c2', label: 'English test result (IELTS) valid on start date', owner: 'student', status: 'open', dueBy: '2027-01-20', createdFrom: 'system' },
]

const app7Fields = buildFields({
  ...courseSeed({
    brand: 'Yoobee',
    programme: 'New Zealand Diploma in Software Development (Level 6)',
    level: 'Level 6',
    campus: 'Auckland',
    intake: '2027-02-22',
    price: 'NZD 23,400',
    fee: 'NZD 21,000',
    start: '2027-02-22',
    end: '2028-02-18',
    agentRef: 'PSL-CHEN-11',
  }),
  ...agentContactSeed({
    email: 'chen.jh@example.com',
    mobile: '+86 138 0011 2233',
    addr: '88 Nanjing Road',
    city: 'Shanghai',
    country: 'China',
    postcode: '200000',
    ecName: 'Chen Wei',
    ecRel: 'Father',
    ecPhone: '+86 138 9988 7766',
    health: 'No conditions declared',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Jiahao', doc: 'a7-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Chen', doc: 'a7-d1', page: 1, conf: 0.99 },
  dob: { v: '2004-07-19', doc: 'a7-d1', page: 1, conf: 0.98 },
  gender: { v: 'Male', doc: 'a7-d1', page: 1, conf: 0.97 },
  nationality: { v: 'China', doc: 'a7-d1', page: 1, conf: 0.99 },
  passport_number: { v: 'E12345678', doc: 'a7-d1', page: 1, conf: 0.99 },
  passport_expiry: { v: '2030-09-01', doc: 'a7-d1', page: 1, conf: 0.98 },
  highest_qual: { v: 'Bachelor of Science', doc: 'a7-d2', page: 1, conf: 0.94 },
  institution: { v: 'Fudan University', doc: 'a7-d2', page: 1, conf: 0.93 },
})

// ===========================================================================
// Fixture 8 — Aisha Rahman (BD). Submitted for unconditional; conditional LoO
// generated by the agent at submit; awaiting financial evidence.
// ===========================================================================

const app8Docs: Document[] = [
  { id: 'a8-d1', type: 'Passport', fileName: 'Passport_UP248808.pdf', originalName: 'aisha_passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a8-d2', type: 'Transcript', fileName: 'Transcript_UP248808.pdf', originalName: 'aisha_transcript.pdf', language: 'English', status: 'checked', pages: 2 },
  { id: 'a8-d3', type: 'EnglishTest', fileName: 'EnglishTest_UP248808.pdf', originalName: 'aisha_ielts.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app8Reqs: Requirement[] = [
  { id: 'a8-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a8-d1' },
  { id: 'a8-r2', label: 'Academic transcript', category: 'academic', status: 'met', evidence: 'a8-d2' },
  { id: 'a8-r3', label: 'English evidence valid on start date', category: 'english', status: 'met', evidence: 'a8-d3', note: 'IELTS 6.5' },
  { id: 'a8-r4', label: 'Financial evidence (bank statement)', category: 'other', status: 'missing', note: 'Awaiting updated bank statement' },
  { id: 'a8-r5', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app8Conditions: Condition[] = [
  { id: 'a8-c1', label: 'Application to be reviewed by UP admissions team', owner: 'up', status: 'open', createdFrom: 'system' },
]

const app8Fields = buildFields({
  ...courseSeed({
    brand: 'NZMA',
    programme: 'New Zealand Diploma in Business (Level 5)',
    level: 'Level 5',
    campus: 'Auckland',
    intake: '2027-02-15',
    price: 'NZD 20,500',
    fee: 'NZD 18,900',
    start: '2027-02-15',
    end: '2028-02-11',
    agentRef: 'PSL-AISHA-14',
  }),
  ...agentContactSeed({
    email: 'aisha.rahman@example.com',
    mobile: '+880 1711 223344',
    addr: '12 Gulshan Avenue',
    city: 'Dhaka',
    country: 'Bangladesh',
    postcode: '1212',
    ecName: 'Rahman Karim',
    ecRel: 'Father',
    ecPhone: '+880 1711 998877',
    health: 'No conditions declared',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Aisha', doc: 'a8-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Rahman', doc: 'a8-d1', page: 1, conf: 0.99 },
  dob: { v: '2005-11-02', doc: 'a8-d1', page: 1, conf: 0.98 },
  gender: { v: 'Female', doc: 'a8-d1', page: 1, conf: 0.97 },
  nationality: { v: 'Bangladesh', doc: 'a8-d1', page: 1, conf: 0.99 },
  passport_number: { v: 'A0456789', doc: 'a8-d1', page: 1, conf: 0.99 },
  passport_expiry: { v: '2031-03-15', doc: 'a8-d1', page: 1, conf: 0.98 },
  highest_qual: { v: 'Higher Secondary Certificate', doc: 'a8-d2', page: 1, conf: 0.94 },
  institution: { v: 'Dhaka College', doc: 'a8-d2', page: 1, conf: 0.93 },
  english_test_type: { v: 'IELTS Academic', doc: 'a8-d3', page: 1, conf: 0.98 },
  english_test_score: { v: '6.5', doc: 'a8-d3', page: 1, conf: 0.98 },
  english_test_date: { v: '2026-06-10', doc: 'a8-d3', page: 1, conf: 0.97 },
  english_test_expiry: { v: '2028-06-10', doc: 'a8-d3', page: 1, conf: 0.96 },
})

// ===========================================================================
// Fixture 9 — Sofia Rossi (IT). Unconditional offer issued and accepted; all
// conditions cleared. Populates the Unconditional offer column.
// ===========================================================================

const app9Docs: Document[] = [
  { id: 'a9-d1', type: 'Passport', fileName: 'Passport_UP248809.pdf', originalName: 'sofia_passport.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a9-d2', type: 'Transcript', fileName: 'Transcript_UP248809.pdf', originalName: 'sofia_transcript.pdf', language: 'Italian', translatedPdf: true, status: 'checked', pages: 2 },
  { id: 'a9-d3', type: 'EnglishTest', fileName: 'EnglishTest_UP248809.pdf', originalName: 'sofia_ielts.pdf', language: 'English', status: 'checked', pages: 1 },
  { id: 'a9-d4', type: 'Other', fileName: 'Financial_UP248809.pdf', originalName: 'sofia_funds.pdf', language: 'English', status: 'checked', pages: 1 },
]

const app9Reqs: Requirement[] = [
  { id: 'a9-r1', label: 'Passport (identity + expiry)', category: 'identity', status: 'met', evidence: 'a9-d1' },
  { id: 'a9-r2', label: 'Academic transcript', category: 'academic', status: 'met', evidence: 'a9-d2' },
  { id: 'a9-r3', label: 'English evidence valid on start date', category: 'english', status: 'met', evidence: 'a9-d3', note: 'IELTS 7.0' },
  { id: 'a9-r4', label: 'Financial evidence (bank statement)', category: 'other', status: 'met', evidence: 'a9-d4' },
  { id: 'a9-r5', label: 'Programme + intake selected', category: 'course', status: 'met' },
]

const app9Conditions: Condition[] = [
  { id: 'a9-c1', label: 'English test result (IELTS) valid on start date', owner: 'student', status: 'cleared', evidence: 'a9-d3', createdFrom: 'system' },
  { id: 'a9-c2', label: 'Financial evidence for full first-year fees', owner: 'student', status: 'cleared', evidence: 'a9-d4', createdFrom: 'system' },
]

const app9Fields = buildFields({
  ...courseSeed({
    brand: 'Yoobee',
    programme: 'Bachelor of Creative Technologies (Level 7)',
    level: 'Level 7',
    campus: 'Auckland',
    intake: '2027-02-22',
    price: 'NZD 28,900',
    fee: 'NZD 26,500',
    start: '2027-02-22',
    end: '2030-02-18',
    agentRef: 'PSL-SOFIA-16',
  }),
  ...agentContactSeed({
    email: 'sofia.rossi@example.com',
    mobile: '+39 320 112 3344',
    addr: '24 Via Roma',
    city: 'Milan',
    country: 'Italy',
    postcode: '20121',
    ecName: 'Rossi Marco',
    ecRel: 'Father',
    ecPhone: '+39 320 998 7766',
    health: 'No conditions declared',
    insurance: 'UP-arranged',
  }),
  given_name: { v: 'Sofia', doc: 'a9-d1', page: 1, conf: 0.99 },
  family_name: { v: 'Rossi', doc: 'a9-d1', page: 1, conf: 0.99 },
  dob: { v: '2004-04-12', doc: 'a9-d1', page: 1, conf: 0.98 },
  gender: { v: 'Female', doc: 'a9-d1', page: 1, conf: 0.97 },
  nationality: { v: 'Italy', doc: 'a9-d1', page: 1, conf: 0.99 },
  passport_number: { v: 'YB1234567', doc: 'a9-d1', page: 1, conf: 0.99 },
  passport_expiry: { v: '2032-05-20', doc: 'a9-d1', page: 1, conf: 0.98 },
  highest_qual: { v: 'Diploma di Maturità', doc: 'a9-d2', page: 1, conf: 0.94 },
  institution: { v: 'Liceo Scientifico Milano', doc: 'a9-d2', page: 1, conf: 0.93 },
  english_test_type: { v: 'IELTS Academic', doc: 'a9-d3', page: 1, conf: 0.98 },
  english_test_score: { v: '7.0', doc: 'a9-d3', page: 1, conf: 0.98 },
  english_test_date: { v: '2026-05-18', doc: 'a9-d3', page: 1, conf: 0.97 },
  english_test_expiry: { v: '2028-05-18', doc: 'a9-d3', page: 1, conf: 0.96 },
})

// ===========================================================================
// Applications
// ===========================================================================

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    preId: 'UP248801',
    studentName: 'Nguyen Thi Lan',
    agentRef: 'PSL-LAN-01',
    agentId: 'c-mei',
    agencyId: 'psl',
    stage: 'Submitted',
    route: 'auto',
    daysInStage: 1,
    createdAt: iso(0, 2),
    course: {
      brand: 'NZMA',
      programmeName: 'New Zealand Certificate in Cookery (Level 4)',
      level: 'Level 4',
      levelGroup: 'Vocational',
      campus: 'Auckland',
      intakeDate: '2027-02-15',
      priceBundle: 'NZD 24,500',
      durationMonths: 9,
    },
    documents: app1Docs,
    fields: app1Fields,
    requirements: app1Reqs,
    conditions: [],
    requests: [],
    events: [
      { ts: iso(2, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Nguyen Thi Lan — NZMA Cookery L4', channel: 'agent-tool' },
      { ts: iso(2, 9), actor: 'ai', label: 'Duplicate check passed' },
      {
        ts: iso(2, 10),
        actor: 'email',
        label: 'Student emailed her documents',
        detail: 'Nguyen sent her passport, transcript and supporting evidence by email — all attachments captured to her file automatically.',
        channel: 'email',
        attachments: [
          { name: 'lan_passport.pdf', addedTo: 'Applicant file' },
          { name: 'lan_transcript.pdf', addedTo: 'Applicant file' },
          { name: 'lan_ielts.pdf', addedTo: 'IELTS — English evidence' },
          { name: 'lan_financial.pdf', addedTo: 'Applicant file' },
          { name: 'lan_personal_statement.pdf', addedTo: 'Applicant file' },
        ],
      },
      { ts: iso(2, 10), actor: 'ai', label: 'Documents reviewed', detail: '5 of 5 checked, 45 fields extracted' },
      { ts: iso(1, 11), actor: 'ai', label: 'Minimum evidence met' },
      { ts: iso(1, 12), actor: 'email', label: 'Confirmed contact details by email', detail: 'Nguyen replied confirming her contact and emergency details.', channel: 'email' },
      { ts: iso(0, 10), actor: 'agent', label: 'Application submitted', channel: 'agent-tool' },
      { ts: iso(0, 10), actor: 'ai', label: 'File complete — no conditions outstanding', detail: 'All evidence met and required data confirmed' },
    ],
  },
  {
    id: 'app-2',
    preId: 'UP248802',
    studentName: 'Rahul Sharma',
    agentRef: 'PSL-RAHUL-07',
    agentId: 'c-james',
    agencyId: 'psl',
    stage: 'Requests',
    route: 'review',
    daysInStage: 3,
    createdAt: iso(6),
    notesToAdmissions:
      'Strong candidate applying without a bachelor degree — please review the special-admission case before deciding. One manager reference is attached; a second is outstanding and the agent expects it this week.',
    course: {
      brand: 'Yoobee',
      programmeName: 'New Zealand Diploma in Software Development (Level 7)',
      level: 'Level 7',
      levelGroup: 'Degree',
      campus: 'Wellington',
      intakeDate: '2027-02-22',
      priceBundle: 'NZD 27,900',
      durationMonths: 12,
    },
    documents: app2Docs,
    fields: app2Fields,
    requirements: app2Reqs,
    conditions: [],
    requests: [
      {
        type: 'special-admission',
        detail: 'No bachelor degree. Applying on 4 years professional software experience.',
        status: 'pending',
        caseFile: {
          experienceYears: 4,
          roleLevel: 'Software Engineer (mid-level), Infosys',
          references: ['Manager reference — Infosys (attached)'],
          summary:
            '4 years commercial software development. One manager reference attached; a second reference is outstanding. Programme accepts 3+ years relevant experience plus two references in place of a degree.',
        },
      },
    ],
    events: [
      { ts: iso(6, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Rahul Sharma — Yoobee Software Development L7', channel: 'agent-tool' },
      {
        ts: iso(6, 10),
        actor: 'email',
        label: 'Student emailed his documents',
        detail: 'Rahul sent his passport, CV and a manager reference by email — captured to his file automatically.',
        channel: 'email',
        attachments: [
          { name: 'rahul_passport.pdf', addedTo: 'Applicant file' },
          { name: 'rahul_cv.pdf', addedTo: 'Applicant file' },
          { name: 'infosys_manager_reference.pdf', addedTo: 'Special admission case' },
        ],
      },
      { ts: iso(6, 10), actor: 'ai', label: 'Documents reviewed', detail: 'No degree found — academic requirement missing' },
      { ts: iso(4, 14), actor: 'agent', label: 'Special admission case started', channel: 'agent-tool' },
      { ts: iso(4, 15), actor: 'email', label: 'Asked Rahul for a second reference', detail: 'Emailed the student requesting one more professional reference to complete the case.', channel: 'email' },
      { ts: iso(3, 9), actor: 'ai', label: 'Precedent surfaced', detail: 'Similar profiles typically admitted with 4 years and a manager reference' },
    ],
  },
  {
    id: 'app-3',
    preId: 'UP248803',
    studentName: 'Wang Yuxuan',
    agentRef: 'PSL-WANG-FB',
    agentId: 'c-mei',
    agencyId: 'psl',
    stage: 'Conditions open',
    route: 'auto',
    daysInStage: 5,
    createdAt: iso(12),
    course: {
      brand: 'UPIC',
      programmeName: 'UP International College Foundation',
      level: 'Foundation',
      levelGroup: 'Pathway',
      campus: 'Auckland',
      intakeDate: '2027-03-01',
      priceBundle: 'NZD 31,200',
      durationMonths: 12,
    },
    bundle: [
      {
        brand: 'UPIC',
        programmeName: 'General English (pre-Foundation)',
        level: 'English',
        levelGroup: 'Pathway',
        campus: 'Auckland',
        intakeDate: '2027-03-01',
        priceBundle: 'included',
        durationMonths: 3,
      },
      {
        brand: 'UPIC',
        programmeName: 'UP International College Foundation',
        level: 'Foundation',
        levelGroup: 'Pathway',
        campus: 'Auckland',
        intakeDate: '2027-06-01',
        priceBundle: 'included',
        durationMonths: 9,
      },
    ],
    documents: app3Docs,
    fields: app3Fields,
    requirements: app3Reqs,
    conditions: app3Conditions,
    requests: [
      { type: 'insurance', detail: 'Own cover — travelling with parent on family policy', status: 'approved' },
    ],
    events: [
      { ts: iso(12, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Bundle: English + Foundation', channel: 'agent-tool' },
      {
        ts: iso(12, 10),
        actor: 'email',
        label: 'Student emailed her documents',
        detail: 'Wang sent her passport and academic records by email — captured to her file automatically.',
        channel: 'email',
        attachments: [
          { name: 'wang_passport.pdf', addedTo: 'Applicant file' },
          { name: 'wang_transcript.pdf', addedTo: 'Applicant file' },
        ],
      },
      { ts: iso(12, 10), actor: 'ai', label: 'Documents reviewed', detail: '4 of 4 checked' },
      { ts: iso(9, 11), actor: 'up', label: 'Conditional offer issued', detail: 'Mel confirmed the offer — English test outstanding as a condition' },
      { ts: iso(8, 9), actor: 'email', label: 'Asked the student to send their IELTS result', detail: 'Emailed the student requesting proof of English before the intake start.', channel: 'email' },
      { ts: iso(5, 16), actor: 'agent', label: 'Quick WhatsApp nudge', detail: 'Messaged the family on WhatsApp to check the IELTS result was on the way.', channel: 'whatsapp' },
      { ts: iso(4, 15), actor: 'up', label: 'Reminder sent to student', detail: 'Mel followed up on the outstanding English evidence' },
      {
        ts: iso(0, 8),
        actor: 'email',
        label: "Student's family emailed the IELTS result",
        detail: 'Result attached by email — English test condition cleared automatically once verified.',
        channel: 'email',
        attachments: [{ name: 'wang_ielts_result.pdf', addedTo: 'IELTS — English evidence' }],
      },
    ],
  },
  {
    id: 'app-4',
    preId: 'UP248804',
    studentName: 'Maria Santos',
    agentRef: undefined,
    agentId: 'c-james',
    agencyId: 'psl',
    stage: 'Draft',
    route: 'auto',
    daysInStage: 0,
    createdAt: iso(0),
    duplicateHold: true,
    course: {
      brand: 'NZTC',
      programmeName: 'Bachelor of Education (Early Childhood Education)',
      level: 'Level 7',
      levelGroup: 'Degree',
      campus: 'Auckland',
      intakeDate: '2027-02-22',
      priceBundle: 'NZD 23,800',
      durationMonths: 36,
    },
    documents: app4Docs,
    fields: app4Fields,
    requirements: app4Reqs,
    conditions: [],
    requests: [],
    events: [
      { ts: iso(0, 9), actor: 'agent', label: 'Application started on the platform', detail: 'Maria Santos — NZTC Early Childhood Education L7', channel: 'agent-tool' },
      { ts: iso(0, 9), actor: 'ai', label: 'Duplicate check — hold', detail: 'Possible existing application with UP. Placed on hold; sales team notified.' },
    ],
  },
  {
    id: 'app-5',
    preId: 'UP248805',
    studentName: 'Ahmed Al-Rashid',
    agentRef: 'PSL-AHMED-05',
    agentId: 'c-mei',
    agencyId: 'psl',
    stage: 'Gaps',
    route: 'review',
    daysInStage: 2,
    createdAt: iso(4),
    notesToAdmissions:
      'Partner early-bird 10% discount requested — needs sales sign-off. Passport and IELTS both expire before the intake start; the agent has flagged this to the student.',
    course: {
      brand: 'NZMA',
      programmeName: 'New Zealand Diploma in Hospitality Management (Level 5)',
      level: 'Level 5',
      levelGroup: 'Vocational',
      campus: 'Auckland',
      intakeDate: '2027-02-15',
      priceBundle: 'NZD 25,600',
      durationMonths: 12,
    },
    documents: app5Docs,
    fields: app5Fields,
    requirements: app5Reqs,
    conditions: [],
    requests: [
      { type: 'discount', detail: 'Early-bird partner rate — 10%', status: 'pending' },
    ],
    events: [
      { ts: iso(4, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Ahmed Al-Rashid — NZMA Hospitality L5', channel: 'agent-tool' },
      {
        ts: iso(4, 10),
        actor: 'email',
        label: 'Student emailed his documents',
        detail: 'Ahmed sent his passport and English test by email — captured to his file automatically.',
        channel: 'email',
        attachments: [
          { name: 'ahmed_passport.pdf', addedTo: 'Applicant file' },
          { name: 'ahmed_english_test.pdf', addedTo: 'IELTS — English evidence' },
        ],
      },
      { ts: iso(4, 10), actor: 'ai', label: 'Documents reviewed', detail: 'English test and passport flagged as expiring' },
      { ts: iso(2, 15), actor: 'agent', label: 'Discount requested', detail: 'Early-bird partner rate 10%', channel: 'agent-tool' },
      {
        ts: iso(1, 13),
        actor: 'email',
        label: 'Partner emailed an updated bank statement',
        detail: 'Updated financial evidence attached by email — captured to his file automatically.',
        channel: 'email',
        attachments: [{ name: 'bank_statement_updated.pdf', addedTo: 'Applicant file' }],
      },
    ],
  },
  {
    id: 'app-6',
    preId: 'UP248806',
    studentName: 'Priya Menon',
    agentRef: 'PSL-PRIYA-06',
    agentId: 'c-james',
    agencyId: 'psl',
    stage: 'Conditions open',
    route: 'auto',
    daysInStage: 4,
    createdAt: iso(8),
    course: {
      brand: 'Yoobee',
      programmeName: 'New Zealand Diploma in Web Development and Design (Level 6)',
      level: 'Level 6',
      levelGroup: 'Vocational',
      campus: 'Auckland',
      intakeDate: '2027-02-22',
      priceBundle: 'NZD 22,900',
      durationMonths: 12,
    },
    documents: app6Docs,
    fields: app6Fields,
    requirements: app6Reqs,
    conditions: app6Conditions,
    requests: [],
    events: [
      { ts: iso(8, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Priya Menon — Yoobee Web Development L6', channel: 'agent-tool' },
      {
        ts: iso(8, 10),
        actor: 'email',
        label: 'Student emailed her documents',
        detail: 'Priya sent her passport and degree transcript by email — captured to her file automatically.',
        channel: 'email',
        attachments: [
          { name: 'priya_passport.pdf', addedTo: 'Applicant file' },
          { name: 'priya_degree_transcript.pdf', addedTo: 'Applicant file' },
        ],
      },
      { ts: iso(8, 10), actor: 'ai', label: 'Documents reviewed', detail: 'Passport + degree transcript checked; English evidence outstanding' },
      { ts: iso(7, 11), actor: 'up', label: 'Conditional offer issued', detail: 'Condition: English test result outstanding' },
      { ts: iso(6, 9), actor: 'email', label: 'Asked Priya to book her PTE test', detail: 'Emailed the student to book PTE and clear the English condition on the offer.', channel: 'email' },
      { ts: iso(5, 16), actor: 'agent', label: 'Quick WhatsApp nudge', detail: 'Messaged Priya on WhatsApp to confirm she had booked her test.', channel: 'whatsapp' },
      {
        ts: iso(5, 10),
        actor: 'email',
        label: 'Priya emailed her booking confirmation',
        detail: 'Confirmed she sits PTE Academic on 10 Jan and will send the result — booking attached.',
        channel: 'email',
        attachments: [{ name: 'pte_booking_confirmation.pdf', addedTo: 'Applicant file' }],
      },
    ],
  },
  {
    id: 'app-7',
    preId: 'UP248807',
    studentName: 'Chen Jiahao',
    agentRef: 'PSL-CHEN-11',
    agentId: 'c-mei',
    agencyId: 'psl',
    stage: 'Submitted',
    route: 'auto',
    daysInStage: 0,
    createdAt: iso(0, 5),
    fastTrack: true,
    notesToAdmissions:
      'Fast-track requested — the student needs the conditional offer this week for a visa appointment. IELTS is booked for next week and will clear the one open condition.',
    course: {
      brand: 'Yoobee',
      programmeName: 'New Zealand Diploma in Software Development (Level 6)',
      level: 'Level 6',
      levelGroup: 'Vocational',
      campus: 'Auckland',
      intakeDate: '2027-02-22',
      priceBundle: 'NZD 23,400',
      durationMonths: 12,
    },
    documents: app7Docs,
    fields: app7Fields,
    requirements: app7Reqs,
    conditions: app7Conditions,
    requests: [],
    events: [
      { ts: iso(0, 5), actor: 'agent', label: 'Application created on the platform', detail: 'Chen Jiahao — Yoobee Software Development L6', channel: 'agent-tool' },
      {
        ts: iso(0, 6),
        actor: 'email',
        label: 'Student emailed his documents',
        detail: 'Chen sent his passport and degree by email — captured to his file automatically.',
        channel: 'email',
        attachments: [
          { name: 'chen_passport.pdf', addedTo: 'Applicant file' },
          { name: 'chen_degree.pdf', addedTo: 'Applicant file' },
        ],
      },
      { ts: iso(0, 6), actor: 'ai', label: 'Documents reviewed', detail: '2 of 2 checked; English evidence outstanding' },
      { ts: iso(0, 7), actor: 'agent', label: 'Application submitted with conditional offer', detail: 'Conditional Letter of Offer generated — awaiting IELTS result', channel: 'agent-tool' },
    ],
  },
  {
    id: 'app-8',
    preId: 'UP248808',
    studentName: 'Aisha Rahman',
    agentRef: 'PSL-AISHA-14',
    agentId: 'c-grace',
    agencyId: 'psl',
    stage: 'Submitted',
    route: 'auto',
    daysInStage: 0,
    createdAt: iso(0, 6),
    notesToAdmissions:
      'Bank statement is being updated by the family and should arrive shortly; everything else is complete. Please issue the conditional offer so the student can proceed.',
    course: {
      brand: 'NZMA',
      programmeName: 'New Zealand Diploma in Business (Level 5)',
      level: 'Level 5',
      levelGroup: 'Vocational',
      campus: 'Auckland',
      intakeDate: '2027-02-15',
      priceBundle: 'NZD 20,500',
      durationMonths: 12,
    },
    documents: app8Docs,
    fields: app8Fields,
    requirements: app8Reqs,
    conditions: app8Conditions,
    requests: [],
    events: [
      { ts: iso(0, 6), actor: 'agent', label: 'Application created on the platform', detail: 'Aisha Rahman — NZMA Business L5', channel: 'agent-tool' },
      {
        ts: iso(0, 7),
        actor: 'email',
        label: 'Student emailed her documents',
        detail: 'Aisha sent her passport, transcript and IELTS by email — captured to her file automatically.',
        channel: 'email',
        attachments: [
          { name: 'aisha_passport.pdf', addedTo: 'Applicant file' },
          { name: 'aisha_transcript.pdf', addedTo: 'Applicant file' },
          { name: 'aisha_ielts.pdf', addedTo: 'IELTS — English evidence' },
        ],
      },
      { ts: iso(0, 7), actor: 'ai', label: 'Documents reviewed', detail: '3 of 3 checked; financial evidence outstanding' },
      { ts: iso(0, 8), actor: 'agent', label: 'Application submitted with conditional offer', detail: 'Conditional Letter of Offer generated — awaiting bank statement', channel: 'agent-tool' },
    ],
  },
  {
    id: 'app-9',
    preId: 'UP248809',
    studentName: 'Sofia Rossi',
    agentRef: 'PSL-SOFIA-16',
    agentId: 'c-james',
    agencyId: 'psl',
    stage: 'Accepted',
    route: 'auto',
    daysInStage: 1,
    createdAt: iso(6, 9),
    course: {
      brand: 'Yoobee',
      programmeName: 'Bachelor of Creative Technologies (Level 7)',
      level: 'Level 7',
      levelGroup: 'Degree',
      campus: 'Auckland',
      intakeDate: '2027-02-22',
      priceBundle: 'NZD 28,900',
      durationMonths: 36,
    },
    documents: app9Docs,
    fields: app9Fields,
    requirements: app9Reqs,
    conditions: app9Conditions,
    requests: [],
    events: [
      { ts: iso(6, 9), actor: 'agent', label: 'Application created on the platform', detail: 'Sofia Rossi — Yoobee Creative Technologies L7', channel: 'agent-tool' },
      {
        ts: iso(6, 10),
        actor: 'email',
        label: 'Student emailed her documents',
        detail: 'Sofia sent her passport, transcript, IELTS and financial evidence by email — captured to her file automatically.',
        channel: 'email',
        attachments: [
          { name: 'sofia_passport.pdf', addedTo: 'Applicant file' },
          { name: 'sofia_transcript.pdf', addedTo: 'Applicant file' },
          { name: 'sofia_ielts.pdf', addedTo: 'IELTS — English evidence' },
          { name: 'sofia_funds.pdf', addedTo: 'Applicant file' },
        ],
      },
      { ts: iso(6, 10), actor: 'ai', label: 'Documents reviewed', detail: '4 of 4 checked; all evidence met' },
      { ts: iso(5, 11), actor: 'up', label: 'Unconditional offer issued', detail: 'Mel confirmed all conditions cleared — unconditional Letter of Offer sent' },
      {
        ts: iso(1, 14),
        actor: 'email',
        label: 'Sofia emailed her signed acceptance',
        detail: 'Signed acceptance returned by email — captured to her file; ready for tuition payment.',
        channel: 'email',
        attachments: [{ name: 'signed_acceptance_sofia.pdf', addedTo: 'Applicant file' }],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Inbound emails for the dashboard Email capture tab
// ---------------------------------------------------------------------------

export const SEED_EMAILS: InboundEmail[] = [
  {
    id: 'em-1',
    ts: iso(0, 8),
    sender: 'yuxuan.wang@example.com',
    subject: 'IELTS result attached — Wang Yuxuan',
    matchedApplicationId: 'app-3',
    extractedSummary: '1 document added (IELTS), English test condition cleared',
    documents: ['IELTS_result_wang.pdf'],
  },
  {
    id: 'em-2',
    ts: iso(1, 13),
    sender: 'admissions.partner@studylink.example',
    subject: 'Updated bank statement for Ahmed',
    matchedApplicationId: 'app-5',
    extractedSummary: '1 document added (financial evidence)',
    documents: ['bank_statement_updated.pdf'],
  },
  {
    id: 'em-3',
    ts: iso(1, 16),
    sender: 'unknown.sender@gmail.example',
    subject: 'Documents for my son — please add',
    matchedApplicationId: undefined,
    documents: ['passport.pdf', 'transcript.pdf'],
  },
]

// ---------------------------------------------------------------------------
// Demo drop files for the Step 2 drop zone (brand-new application demo)
// ---------------------------------------------------------------------------

export const DEMO_DROP_FILES: DropFile[] = [
  {
    originalName: 'passport_scan.pdf',
    type: 'Passport',
    language: 'English',
    pages: 1,
    satisfiesRequirement: 'identity',
    fields: [
      { key: 'given_name', value: 'Linh', confidence: 0.99 },
      { key: 'family_name', value: 'Tran', confidence: 0.99 },
      { key: 'dob', value: '2005-03-11', confidence: 0.98 },
      { key: 'gender', value: 'Female', confidence: 0.97 },
      { key: 'nationality', value: 'Vietnam', confidence: 0.99 },
      { key: 'country_of_birth', value: 'Vietnam', confidence: 0.96 },
      { key: 'first_language', value: 'Vietnamese', confidence: 0.95 },
      { key: 'passport_number', value: 'C7729104', confidence: 0.98 },
      { key: 'passport_expiry', value: '2030-05-09', confidence: 0.97 },
    ],
  },
  {
    // Vietnamese source — the AI translates it to English and cross-reads it.
    originalName: 'hoc_ba_thpt.pdf',
    type: 'Transcript',
    language: 'Vietnamese',
    translated: true,
    pages: 2,
    satisfiesRequirement: 'academic',
    fields: [
      { key: 'highest_qual', value: 'High School Diploma (THPT)', confidence: 0.93 },
      { key: 'institution', value: 'Le Hong Phong High School', confidence: 0.9 },
      { key: 'institution_country', value: 'Vietnam', confidence: 0.96 },
      { key: 'study_end', value: '2025', confidence: 0.9 },
      { key: 'qual_completed', value: 'Yes', confidence: 0.92 },
      { key: 'grade_gpa', value: '8.6 / 10', confidence: 0.85 },
      { key: 'field_of_study', value: 'Natural Sciences', confidence: 0.82 },
    ],
  },
  {
    originalName: 'so_yeu_ly_lich_cv.pdf',
    type: 'CV',
    language: 'Vietnamese',
    translated: true,
    pages: 2,
    satisfiesRequirement: 'other',
    fields: [],
  },
]
