// University Partnerships entry requirements — NZ Pre-Foundation.
// Source: "University Partnerships Entry Requirements New Zealand and Australia
// (Internal Only)". Foundation Connect has two versions: the internal guideline
// (which includes Year 10 exceptions) and the external version that may be
// published to agents and students. Where the external version is blank the
// country is communicated as "please contact admissions for assessment".

export type Audience = 'internal' | 'agent' | 'stakeholder'

export type ProgrammeKey = 'plp' | 'pathwayLink' | 'foundationConnect'

export interface ProgrammeDef {
  key: ProgrammeKey
  name: string
  short: string
  note?: string
}

export const PROGRAMMES: ProgrammeDef[] = [
  { key: 'plp', name: 'PLP + Foundation Connect + STD', short: 'PLP + FC + STD' },
  {
    key: 'pathwayLink',
    name: 'Pathway Link + SD',
    short: 'Pathway Link + SD',
    note: 'Age limit: 14 to 17 years old only',
  },
  { key: 'foundationConnect', name: 'Foundation Connect', short: 'Foundation Connect' },
]

export const ENGLISH_REQUIREMENT = 'IELTS 4.5 with no band less than 4.0, or Duolingo 70'

export const KEY_SUBJECTS =
  'Maths, Science, Biology, Physics, Chemistry, Geography, History, Accounting, Economics, Business Studies — or similar subjects'

export const CONTACT_ADMISSIONS = 'Please contact admissions for assessment'

export interface CountryRequirement {
  country: string
  plp: string
  pathwayLink: string
  fcInternal: string
  // Undefined means the external version defers to an admissions assessment.
  fcExternal?: string
  flagged?: boolean // marked ** in the source — assessed with extra care
}

const R = (
  country: string,
  plp: string,
  pathwayLink: string,
  fcInternal: string,
  fcExternal?: string,
  flagged = false,
): CountryRequirement => ({ country, plp, pathwayLink, fcInternal, fcExternal, flagged })

export const COUNTRY_REQUIREMENTS: CountryRequirement[] = [
  R('Australia', 'Completion of Year 9', 'Completion of Year 9', 'Completion of Year 10'),
  R('Bangladesh', 'SSC: 50%', 'SSC: 50%', 'Year 11: 60%', 'Year 11: 60%'),
  R('Bhutan', 'Bhutan Certificate of Secondary Education / ICSE (50% is a pass)', 'Bhutan Certificate of Secondary Education / ICSE (50% is a pass)', 'Completion of Upper Secondary Schools – Year 1 with good grades'),
  R('Brazil', 'Completion of Ensino Médio – Year 1', 'Completion of Ensino Médio – Year 1', 'Completion of Ensino Médio – Year 1 with good grades'),
  R('Cambodia', 'Completion of lower secondary school', 'Completion of lower secondary school', 'Upper Secondary Schools – Year 2: 80–89%', 'Upper Secondary Schools – Year 2: 80–89%'),
  R('Canada', 'Upper Secondary Schools – Year 1: 50% is a pass', 'Upper Secondary Schools – Year 1: 50% is a pass', 'Upper Secondary Schools – Year 1 with good grades'),
  R('Chile', 'Completion of Colleges & Lyceums – Year 2 (Year 10)', 'Completion of Colleges & Lyceums – Year 2 (Year 10)', 'Completion of Colleges & Lyceums – Year 1 (Year 11) with good grades', 'Completion of Colleges & Lyceums – Year 1 (Year 11) with good grades'),
  R('China', 'Completion of Middle School', 'Completion of Middle School with Year 3 at 70%, or an average of 70% across all three years', 'Senior Secondary – Year 1: 70%'),
  R('Colombia', 'Colegios, Liceos & Institutos – Year 9', 'Colegios, Liceos & Institutos – Year 9', 'Completion of Colegios, Liceos & Institutos – Year 1 (Year 10) with good grades'),
  R('Ecuador', 'Secondary Schools – Year 1: 7.0 average', 'Secondary Schools – Year 1: 7.0 average', 'Secondary Schools – Year 2: 7.5', 'Secondary Schools – Year 2: 7.6'),
  R('Fiji', 'Completion of Year 11', 'Completion of Year 11', 'Year 11: Top 3 plus English aggregate 180', 'Year 11: Top 3 plus English aggregate 180'),
  R('Hong Kong', 'Completion of Form 3', 'Completion of Form 3', 'Completion of Form 4 with good grades'),
  R('India', 'Year 9: 60%', 'Year 9: 60%', 'Year 10: 80%'),
  R('Indonesia', 'Pass SMP (Sekolah Menengah Pertama)', 'Pass SMP (Sekolah Menengah Pertama)', 'SMA1: 7.0'),
  R('Iran', 'Completion of Lower Secondary Schools', 'Completion of Lower Secondary Schools', 'Year 10: 16/20'),
  R('Japan', 'Completion of Lower Secondary School Certificate', 'Completion of Lower Secondary School Certificate', 'Kotogakko / Upper Secondary School Certificate – Year 1: Grade 2–3'),
  R('Kazakhstan', 'Completion of Year 9', 'Completion of Year 9', 'Year 10: GPA 4/5'),
  R('Kenya', 'Completion of Year 10', 'Completion of Year 10', 'Completion of Year 11 with good grades', 'Completion of Year 11 with good grades'),
  R('Kuwait', 'Secondary Education – Year 1: 70%', 'Secondary Education – Year 1: 70%', 'Secondary Education – Year 2: 80%', 'Secondary Education – Year 2: 80%'),
  R('Laos', 'Completion of Upper Secondary Schools – Year 1: 7/10', 'Completion of Upper Secondary Schools – Year 1: 7/10', 'Completion of Upper Secondary Schools – Year 2: 7/10', 'Completion of Upper Secondary Schools – Year 2: 7/10'),
  R('Macau', 'Completion of Junior Secondary School Leaving Certificate (Year 9)', 'Completion of Junior Secondary School Leaving Certificate (Year 9)', 'Senior Middle School / Upper Secondary School – Year 1: 70%'),
  R('Malaysia', 'Completion of PT3 (Pentaksiran Tingkatan 3)', 'Completion of PT3 (Pentaksiran Tingkatan 3)', 'Completion of Upper Secondary School – Year 1 with good grades'),
  R('Mexico', 'Year 10: 6.0 / 60%', 'Year 10: 6.0 / 60%', 'Year 11: 6.0 / 60%', 'Year 11: 6.0 / 60%'),
  R('Mongolia', 'Completion of Year 9', 'Completion of Year 9', 'Certificate of Complete Secondary Education: 4 x Ds', 'Certificate of Complete Secondary Education: 4 x Ds'),
  R('Myanmar', 'Completion of Lower Secondary Schools', 'Completion of Lower Secondary Schools', "Completion of Upper Secondary School – Year 1, at least 2 A's and the rest B in key subjects"),
  R('Nepal', 'School Leaving Certificate Examination', 'School Leaving Certificate Examination', 'Completion of Year 11 with good grades', 'Completion of Year 11 with good grades'),
  R('New Zealand', 'Completion of Year 10', 'Completion of Year 10 with a good school report, including satisfactory attendance (90%) and teacher comments. Assessed by the HOC.', 'NCEA: 35 credits at Level 1 with no fewer than 10 credits in each of 3 subjects including maths', undefined, true),
  R('Nigeria', 'Completion of Upper Secondary School – Year 1', 'Completion of Upper Secondary School – Year 1', 'Completion of Upper Secondary School – Year 2 with good grades', 'Completion of Upper Secondary School – Year 2 with good grades'),
  R('Pakistan', 'Completion of Secondary School Certificate (SSC)', 'Completion of Secondary School Certificate (SSC)', 'Higher Secondary Schools – Year 1: 80%'),
  R('Peru', 'Completion of Secondary School Year 3', 'Completion of Secondary School Year 3', 'Completion of Secondary School Year 4 with good grades'),
  R('Philippines', 'Completion of High School Diploma (Grade 10)', 'Completion of High School Diploma (Grade 10)', 'Senior High School – Year 11 (S1): 80%'),
  R('Russia', 'Completion of Certificate of Basic General Education', 'Completion of Certificate of Basic General Education', 'Year 10 – Grade 1 or 2 in key subjects'),
  R('Saudi Arabia', 'Secondary Education – Year 1: 70%', 'Secondary Education – Year 1: 70%', 'Secondary Education – Year 2: 80%', 'Secondary Education – Year 2: 80%'),
  R('Singapore', 'Completion of Year 9', 'Completion of Year 9', 'Completion of O Level – first year with good grades'),
  R('South Africa', 'Completion of Year 9', 'Completion of Year 9', 'Year 10: 80%'),
  R('South Korea', 'Completion of Middle School or Middle School GEE', 'Completion of Middle School or attainment of 70% in the Middle School GEE', 'High school certificate Year 1: 70%'),
  R('Sri Lanka', 'Completion of Year 9', 'Completion of Year 9', 'Completion of GCSE – 1st year with 5 or higher'),
  R('Taiwan', 'Completion of Junior High School Diploma', 'Completion of Junior High School Diploma with either 65% in Year 3 or a 65% average across all three years', 'Senior High School – Year 1: 70%'),
  R('Thailand', 'Matayom 3: 2.4', 'Matayom 3: 2.4', 'Matayom 4: 2.4'),
  R('Turkey', 'Upper Secondary – Year 2: 70/100', 'Upper Secondary – Year 2: 70/100', 'Upper Secondary – Year 3: 70/100', 'Upper Secondary – Year 3: 70/100'),
  R('Venezuela', 'Liceos Bolivarianos / Colegios – Year 3: 12 in 4 relevant subjects', 'Liceos Bolivarianos / Colegios – Year 3: 12 in 4 relevant subjects', 'Liceos Bolivarianos / Colegios – Year 4: 12 in 4 relevant subjects', 'Liceos Bolivarianos / Colegios – Year 4: 12 in 4 relevant subjects'),
  R('Vietnam', 'Completion of Year 9: 8.0', 'Completion of Year 9: 8.0', 'Year 10: 8.0'),
  R('UAE', 'General Secondary Schools – Year 1: 70%', 'General Secondary Schools – Year 1: 70%', 'General Secondary Schools – Year 2: 80%', 'General Secondary Schools – Year 2: 80%'),
  R('USA', 'Senior High School Year 10', 'Senior High School Year 10', 'Completion of Year 11 – D / 60–69% / GPA 1.0', 'Completion of Year 11 – D / 60–69% / GPA 1.0'),
  R('Uzbekistan', "Completion of Umumiy O'rta Ta'lim To'g'risida Shahodatnoma (Certificate of Secondary Education) – 3 / Qoniqarli", "Completion of Umumiy O'rta Ta'lim To'g'risida Shahodatnoma (Certificate of Secondary Education) – 3 / Qoniqarli", 'Academic Lyceums – Year 1: GPA 4/5'),
  R('Zambia', 'Completion of Junior Secondary School Leaving Certificate', 'Completion of Junior Secondary School Leaving Certificate', 'Completion of Secondary Schools (Senior Secondary Education) – Year 1'),
]

export interface InternationalQualification {
  name: string
  plp?: string
  pathwayLink?: string
  // Listed as accepted for Foundation Connect, assessed individually.
  foundationConnect: boolean
  flagged?: boolean
}

export const INTERNATIONAL_QUALIFICATIONS: InternationalQualification[] = [
  { name: 'Global Assessment Certificate (GAC)', foundationConnect: true },
  { name: 'International Baccalaureate (IB)', foundationConnect: true, flagged: true },
  {
    name: 'Cambridge O Level / IGCSE / GCSE',
    plp: 'Completion of Year 9',
    pathwayLink: 'Completion of Year 9',
    foundationConnect: false,
    flagged: true,
  },
  { name: 'Cambridge A Level', foundationConnect: true, flagged: true },
  { name: 'Scholastic Assessment Test (SAT)', foundationConnect: true },
]

export function findCountryRequirement(country: string): CountryRequirement | undefined {
  const needle = country.trim().toLowerCase()
  return COUNTRY_REQUIREMENTS.find((r) => r.country.toLowerCase() === needle)
}

// The requirement text a given audience is allowed to see. Agents and external
// stakeholders only ever see the external Foundation Connect version.
export function requirementFor(
  row: CountryRequirement,
  programme: ProgrammeKey,
  audience: Audience,
): { text: string; deferred: boolean } {
  if (programme === 'plp') return { text: row.plp, deferred: false }
  if (programme === 'pathwayLink') return { text: row.pathwayLink, deferred: false }
  if (audience === 'internal') return { text: row.fcInternal, deferred: false }
  return row.fcExternal
    ? { text: row.fcExternal, deferred: false }
    : { text: CONTACT_ADMISSIONS, deferred: true }
}
