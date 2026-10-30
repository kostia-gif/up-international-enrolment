// Scripted POC journeys. Each one pre-selects a course, names the student and
// swaps in a set of demo documents so the wizard plays out a known path through
// the assessment rules. Chosen from /journeys and loaded via /new?journey=<id>.
import type { DropFile } from './simulate'
import { CATALOG, type CatalogProgramme } from './catalog'

export type JourneyOutcome = 'green' | 'amber' | 'red'

export interface Journey {
  id: string
  title: string
  sector: 'VET' | 'HE'
  summary: string
  expected: JourneyOutcome
  programmeId: string
  intake: string
  student: { given: string; family: string; nationality: string }
  agentRef?: string
  files: DropFile[]
  // What the POC user should look for at each step.
  watchFor: string[]
}

interface Person {
  given: string
  family: string
  nationality: string
  dob: string
  gender: 'Female' | 'Male'
  firstLanguage: string
  passportNo: string
  passportExpiry: string
  language: string
  passportFile?: string
}

function passport(p: Person): DropFile {
  const translated = p.language !== 'English'
  return {
    originalName: p.passportFile ?? 'passport_scan.pdf',
    type: 'Passport',
    language: p.language,
    translated,
    pages: 2,
    satisfiesRequirement: 'identity',
    fields: [
      { key: 'given_name', value: p.given, confidence: 0.99 },
      { key: 'family_name', value: p.family, confidence: 0.99 },
      { key: 'dob', value: p.dob, confidence: 0.98 },
      { key: 'gender', value: p.gender, confidence: 0.97 },
      { key: 'nationality', value: p.nationality, confidence: 0.99 },
      { key: 'country_of_birth', value: p.nationality, confidence: 0.96 },
      { key: 'first_language', value: p.firstLanguage, confidence: 0.95 },
      { key: 'passport_number', value: p.passportNo, confidence: 0.98 },
      { key: 'passport_expiry', value: p.passportExpiry, confidence: 0.97 },
    ],
  }
}

interface TranscriptSpec {
  originalName: string
  language: string
  qual: string
  institution: string
  country: string
  end: string
  grade: string
  field: string
  completed?: 'Yes' | 'No'
}

function transcript(t: TranscriptSpec): DropFile {
  return {
    originalName: t.originalName,
    type: 'Transcript',
    language: t.language,
    translated: t.language !== 'English',
    pages: 2,
    satisfiesRequirement: 'academic',
    fields: [
      { key: 'highest_qual', value: t.qual, confidence: 0.93 },
      { key: 'institution', value: t.institution, confidence: 0.9 },
      { key: 'institution_country', value: t.country, confidence: 0.96 },
      { key: 'study_end', value: t.end, confidence: 0.9 },
      { key: 'qual_completed', value: t.completed ?? 'Yes', confidence: 0.92 },
      { key: 'grade_gpa', value: t.grade, confidence: 0.85 },
      { key: 'field_of_study', value: t.field, confidence: 0.82 },
    ],
  }
}

function englishTest(originalName = 'PTE_score_report.pdf'): DropFile {
  return {
    originalName,
    type: 'EnglishTest',
    language: 'English',
    pages: 1,
    satisfiesRequirement: 'english',
    fields: [],
  }
}

function cv(originalName: string, language = 'English'): DropFile {
  return {
    originalName,
    type: 'CV',
    language,
    translated: language !== 'English',
    pages: 2,
    fields: [],
  }
}

// Problem files: the AI can't accept them and says how to fix it.
const PASSPORT_ONE_PAGE: DropFile = {
  originalName: 'passport_photo_page.jpg',
  type: 'Passport',
  language: 'English',
  pages: 1,
  problem: 'Only the photo page was scanned.',
  fix: 'Scan both the photo page and the signature / observations page into one PDF, then upload again.',
  fields: [],
}

const TRANSCRIPT_UNSTAMPED: DropFile = {
  originalName: 'transcript_photo.jpg',
  type: 'Transcript',
  language: 'English',
  pages: 1,
  problem: 'No institution stamp or registrar signature is visible.',
  fix: 'Ask the school for a certified copy with the official stamp and signature, or a sealed transcript scanned in colour.',
  fields: [],
}

const POLICE_CHECK: DropFile = {
  originalName: 'nbi_clearance.pdf',
  type: 'PoliceCheck',
  language: 'English',
  pages: 1,
  satisfiesRequirement: 'other',
  satisfiesLabel: 'police',
  fields: [],
}

const REFEREES: DropFile = {
  originalName: 'referee_reports.pdf',
  type: 'Reference',
  language: 'English',
  pages: 2,
  satisfiesRequirement: 'other',
  satisfiesLabel: 'referee',
  fields: [],
}

export const JOURNEYS: Journey[] = [
  {
    id: 'vet-simple',
    title: 'VET — straight through',
    sector: 'VET',
    summary: 'Cookery Level 4. Passport, transcript and English all present and meet requirements. Low immigration risk.',
    expected: 'green',
    programmeId: 'nzma-cookery-4',
    intake: '2027-02-15',
    student: { given: 'Yuxuan', family: 'Wang', nationality: 'China' },
    agentRef: 'CRM-10442',
    files: [
      passport({
        given: 'Yuxuan',
        family: 'Wang',
        nationality: 'China',
        dob: '2006-07-19',
        gender: 'Male',
        firstLanguage: 'Mandarin',
        passportNo: 'E88213045',
        passportExpiry: '2032-01-30',
        language: 'Chinese',
        passportFile: '王宇轩_护照.pdf',
      }),
      transcript({
        originalName: '高中成绩单.pdf',
        language: 'Chinese',
        qual: 'Senior High School Graduation Certificate',
        institution: 'Hangzhou No. 2 High School',
        country: 'China',
        end: '2025',
        grade: '82%',
        field: 'General',
      }),
      englishTest(),
      cv('王宇轩_简历.pdf', 'Chinese'),
    ],
    watchFor: [
      'Step 2: Chinese documents are translated before reading.',
      'Step 3: every rule is green — "Ready to apply" with high acceptance for China → vocational.',
    ],
  },
  {
    id: 'vet-missing-english',
    title: 'VET — missing English results',
    sector: 'VET',
    summary: 'Hospitality Level 5. First passport scan is only one page; English test not yet sat. Conditional offer path.',
    expected: 'green',
    programmeId: 'nzma-hospo-5',
    intake: '2027-02-15',
    student: { given: 'Haruto', family: 'Sato', nationality: 'Japan' },
    files: [
      PASSPORT_ONE_PAGE,
      passport({
        given: 'Haruto',
        family: 'Sato',
        nationality: 'Japan',
        dob: '2005-11-02',
        gender: 'Male',
        firstLanguage: 'Japanese',
        passportNo: 'TR5520981',
        passportExpiry: '2031-06-14',
        language: 'Japanese',
        passportFile: '佐藤陽翔_パスポート.pdf',
      }),
      transcript({
        originalName: '成績証明書.pdf',
        language: 'Japanese',
        qual: 'Upper Secondary School Certificate',
        institution: 'Yokohama Suiran High School',
        country: 'Japan',
        end: '2024',
        grade: '3.4 / 5',
        field: 'Commerce',
      }),
      cv('Sato_Haruto_CV.pdf'),
    ],
    watchFor: [
      'Step 2: the one-page passport is rejected with a fix; the full scan is then accepted.',
      'Step 3: documents complete apart from English — upload when sat; a conditional offer is still possible.',
    ],
  },
  {
    id: 'vet-teaching',
    title: 'VET — Teaching (more information)',
    sector: 'VET',
    summary: 'Early Childhood Education. Teaching Council rules add police vetting, referees and an interview; English bar is IELTS 7.0.',
    expected: 'amber',
    programmeId: 'nztc-ece-7',
    intake: '2027-02-22',
    student: { given: 'Maria Clara', family: 'Reyes', nationality: 'Philippines' },
    agentRef: 'CRM-20917',
    files: [
      passport({
        given: 'Maria Clara',
        family: 'Reyes',
        nationality: 'Philippines',
        dob: '2001-04-27',
        gender: 'Female',
        firstLanguage: 'Filipino',
        passportNo: 'P9034117B',
        passportExpiry: '2030-09-03',
        language: 'English',
        passportFile: 'reyes_passport.pdf',
      }),
      TRANSCRIPT_UNSTAMPED,
      transcript({
        originalName: 'TOR_certified.pdf',
        language: 'English',
        qual: 'Senior High School Diploma (K-12)',
        institution: 'St. Scholastica’s College Manila',
        country: 'Philippines',
        end: '2020',
        grade: '91%',
        field: 'Humanities and Social Sciences',
      }),
      englishTest(),
      POLICE_CHECK,
    ],
    watchFor: [
      'Step 2: unstamped transcript is rejected with a fix; certified copy accepted. Police clearance recognised.',
      'Step 3: amber — referee reports still needed and an interview will be scheduled before any offer.',
    ],
  },
  {
    id: 'vet-india-risk',
    title: 'VET — India, high INZ risk',
    sector: 'VET',
    summary: 'Hospitality Level 5. All documents fine, but India → vocational has a high INZ refusal rate, so visa evidence is mandatory.',
    expected: 'amber',
    programmeId: 'nzma-hospo-5',
    intake: '2027-02-15',
    student: { given: 'Arjun', family: 'Mehta', nationality: 'India' },
    agentRef: 'CRM-31108',
    files: [
      passport({
        given: 'Arjun',
        family: 'Mehta',
        nationality: 'India',
        dob: '2003-09-12',
        gender: 'Male',
        firstLanguage: 'Hindi',
        passportNo: 'Z6120934',
        passportExpiry: '2031-02-20',
        language: 'English',
        passportFile: 'arjun_passport.pdf',
      }),
      transcript({
        originalName: 'CBSE_class12_marksheet.pdf',
        language: 'English',
        qual: 'Higher Secondary Certificate (CBSE Class XII)',
        institution: 'Delhi Public School, Pune',
        country: 'India',
        end: '2022',
        grade: '71%',
        field: 'Commerce',
      }),
      englishTest(),
      cv('Arjun_Mehta_CV.pdf'),
    ],
    watchFor: [
      'Step 3: documents and entry are green but immigration is flagged — purpose of study and financial evidence will be requested.',
    ],
  },
  {
    id: 'he-bachelor-simple',
    title: 'HE — Bachelor, straight through',
    sector: 'HE',
    summary: 'Software Development Level 7. Everything present, strong grades, very low INZ refusal rate for China → degree.',
    expected: 'green',
    programmeId: 'yoobee-software-7',
    intake: '2027-02-22',
    student: { given: 'Zihan', family: 'Li', nationality: 'China' },
    files: [
      passport({
        given: 'Zihan',
        family: 'Li',
        nationality: 'China',
        dob: '2006-02-08',
        gender: 'Female',
        firstLanguage: 'Mandarin',
        passportNo: 'EJ4471208',
        passportExpiry: '2033-04-11',
        language: 'Chinese',
        passportFile: '李子涵_护照.pdf',
      }),
      transcript({
        originalName: '高中成绩单_李子涵.pdf',
        language: 'Chinese',
        qual: 'Senior High School Graduation Certificate',
        institution: 'Shenzhen Middle School',
        country: 'China',
        end: '2025',
        grade: '88%',
        field: 'Science',
      }),
      englishTest(),
    ],
    watchFor: ['Step 3: all green, including a ~5% INZ refusal rate for applications like this.'],
  },
  {
    id: 'he-masters-gap',
    title: 'HE — Masters, qualification gap',
    sector: 'HE',
    summary: 'Master of Applied AI. Transcript shows a high-school qualification, not a bachelor degree. Suggests an alternative course.',
    expected: 'amber',
    programmeId: 'yoobee-applied-ai-9',
    intake: '2027-02-15',
    student: { given: 'Minh', family: 'Pham', nationality: 'Vietnam' },
    agentRef: 'CRM-27731',
    files: [
      passport({
        given: 'Minh',
        family: 'Pham',
        nationality: 'Vietnam',
        dob: '2002-12-01',
        gender: 'Male',
        firstLanguage: 'Vietnamese',
        passportNo: 'C8810342',
        passportExpiry: '2031-08-25',
        language: 'Vietnamese',
        passportFile: 'ho_chieu_pham_minh.pdf',
      }),
      transcript({
        originalName: 'hoc_ba_thpt_pham_minh.pdf',
        language: 'Vietnamese',
        qual: 'High School Diploma (THPT)',
        institution: 'Le Quy Don High School',
        country: 'Vietnam',
        end: '2021',
        grade: '8.1 / 10',
        field: 'Mathematics',
      }),
      englishTest(),
      cv('CV_Pham_Minh.pdf'),
    ],
    watchFor: [
      'Step 3: amber — a bachelor degree is required. Add RPL / special admission evidence, or switch to the suggested Level 7 programme.',
    ],
  },
  {
    id: 'he-medium-risk',
    title: 'HE — Bachelor, medium INZ risk',
    sector: 'HE',
    summary: 'Software Development Level 7 from Sri Lanka. Entry is met; INZ refusal rate sits in the potential-risk band, so evidence is optional.',
    expected: 'amber',
    programmeId: 'yoobee-software-7',
    intake: '2027-02-22',
    student: { given: 'Tharindu', family: 'Perera', nationality: 'Sri Lanka' },
    files: [
      passport({
        given: 'Tharindu',
        family: 'Perera',
        nationality: 'Sri Lanka',
        dob: '2004-05-23',
        gender: 'Male',
        firstLanguage: 'Sinhala',
        passportNo: 'N7729016',
        passportExpiry: '2030-12-02',
        language: 'English',
        passportFile: 'perera_passport.pdf',
      }),
      transcript({
        originalName: 'GCE_AL_results.pdf',
        language: 'English',
        qual: 'GCE Advanced Level',
        institution: 'Royal College Colombo',
        country: 'Sri Lanka',
        end: '2023',
        grade: '74%',
        field: 'Physical Science',
      }),
      englishTest(),
      cv('Perera_CV.pdf'),
    ],
    watchFor: [
      'Step 3: amber — entry met, potential INZ refusal risk. Purpose statement and funds are offered as optional evidence in Review.',
    ],
  },
]

export function findJourney(id: string | null | undefined): Journey | null {
  if (!id) return null
  return JOURNEYS.find((j) => j.id === id) ?? null
}

export function journeyProgramme(j: Journey): CatalogProgramme | undefined {
  return CATALOG.find((p) => p.id === j.programmeId)
}
