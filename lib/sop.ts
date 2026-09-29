import type { Application } from './types'
import type { ReviewStepKind } from './admissions'
import { inzDeclineRate, nationalityOf } from './pre-enrolment'

// The Pre-enrolment Process SOP (current state), encoded task-by-task so the
// admissions review captures every step an Admissions Officer performs.
// Where the rule can be evaluated from the application data it checks itself;
// everything else is a manual confirmation the officer ticks off.

export type SopPlacement = ReviewStepKind | 'post-offer'

export type AutoState = 'pass' | 'fail' | 'na' | 'info'

export interface AutoResult {
  state: AutoState
  text: string
}

export interface SopTask {
  id: string
  stage: number
  label: string
  detail?: string
  step: SopPlacement
  // Required tasks must be satisfied (auto-pass, not applicable, or ticked)
  // before the step can be approved.
  required: boolean
  auto?: (app: Application) => AutoResult
}

export interface SopStage {
  stage: number
  title: string
  step: SopPlacement | 'intake'
}

export const SOP_STAGES: SopStage[] = [
  { stage: 1, title: 'Application received and allocated', step: 'intake' },
  { stage: 2, title: 'Initial eligibility and risk checks', step: 'checks' },
  { stage: 3, title: 'Prepare application documents', step: 'files' },
  { stage: 4, title: 'Check programme entry requirements', step: 'academic' },
  { stage: 5, title: 'Verify supporting documentation', step: 'identity' },
  { stage: 6, title: 'Validate and update the Contact record', step: 'personal' },
  { stage: 7, title: 'Complete the Opportunity record', step: 'opportunity' },
  { stage: 8, title: 'International and application-specific fields', step: 'opportunity' },
  { stage: 9, title: 'Build programme pricing', step: 'course' },
  { stage: 10, title: 'Generate and issue conditional offer', step: 'decision' },
  { stage: 11, title: 'Student satisfies conditions', step: 'post-offer' },
  { stage: 12, title: 'Create invoice and process payment', step: 'post-offer' },
  { stage: 13, title: 'Handle payment exceptions', step: 'post-offer' },
  { stage: 14, title: 'Issue receipt', step: 'post-offer' },
  { stage: 15, title: 'Complete final workflow check', step: 'post-offer' },
  { stage: 16, title: 'Push enrolment to provider / SELMA', step: 'post-offer' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function val(app: Application, key: string): string {
  return app.fields.find((f) => f.key === key)?.value.trim() ?? ''
}

const pass = (text: string): AutoResult => ({ state: 'pass', text })
const fail = (text: string): AutoResult => ({ state: 'fail', text })
const na = (text: string): AutoResult => ({ state: 'na', text })
const info = (text: string): AutoResult => ({ state: 'info', text })

const digits = (s: string) => s.replace(/\D/g, '')

export function courseEnd(app: Application): Date {
  const explicit = val(app, 'course_end')
  if (explicit && !Number.isNaN(Date.parse(explicit))) return new Date(explicit)
  const d = new Date(app.course.intakeDate)
  d.setMonth(d.getMonth() + (app.course.durationMonths || 12))
  return d
}

function monthYear(d: Date): string {
  return d.toLocaleDateString('en-NZ', { month: 'short', year: 'numeric' })
}

// Insurance duration rule: programme ends Jan–Oct → +1 month; Nov–Dec → +3.
export function insuranceCover(app: Application): { end: Date; extraMonths: number } {
  const end = courseEnd(app)
  const extraMonths = end.getMonth() >= 10 ? 3 : 1
  const cover = new Date(end)
  cover.setMonth(cover.getMonth() + extraMonths)
  return { end: cover, extraMonths }
}

export function ageAtIntake(app: Application): number | null {
  const dob = val(app, 'dob')
  if (!dob || Number.isNaN(Date.parse(dob))) return null
  const b = new Date(dob)
  const i = new Date(app.course.intakeDate)
  let age = i.getFullYear() - b.getFullYear()
  if (i.getMonth() < b.getMonth() || (i.getMonth() === b.getMonth() && i.getDate() < b.getDate())) age--
  return age
}

function isResident(visa: string): boolean {
  return /resident|permanent/i.test(visa)
}

function hasMedical(app: Application): boolean {
  const m = val(app, 'medical_conditions')
  return m !== '' && !/^(none|no|n\/a|nil)$/i.test(m)
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const SOP_TASKS: SopTask[] = [
  // 1 — Received and allocated
  {
    id: 'allocated',
    stage: 1,
    step: 'checks',
    required: false,
    label: 'Allocated from Unassigned to My Unprocessed Application Opportunity',
    auto: () => pass('Allocated to you from the admissions queue'),
  },
  {
    id: 'two-records',
    stage: 1,
    step: 'checks',
    required: false,
    label: 'Process across the Opportunity and Contact records',
    detail: 'Opportunity holds conditions, offers and receipts. Contact holds personal, passport and core information.',
    auto: () => info('Opportunity + Contact'),
  },
  {
    id: 'direct-decline',
    stage: 2,
    step: 'checks',
    required: false,
    label: 'Latest INZ visa-decline rate for the nationality',
    auto: (app) => {
      const r = inzDeclineRate(nationalityOf(app))
      return r.rate >= 20
        ? fail(`${nationalityOf(app)}: ${r.rate}% — refer direct applicants to the Regional Manager`)
        : pass(`${nationalityOf(app)}: ${r.rate}% — below the 20% threshold`)
    },
  },

  // 3 — Prepare documents
  {
    id: 'rename-docs',
    stage: 3,
    step: 'files',
    required: true,
    label: 'Rename documents as Document Name + Student ID',
    auto: (app) => {
      if (app.documents.length === 0) return na('No documents on file yet')
      const bad = app.documents.filter((d) => !d.fileName.includes(app.preId)).length
      return bad === 0
        ? pass(`All ${app.documents.length} files follow the naming convention`)
        : fail(`${bad} of ${app.documents.length} files need renaming`)
    },
  },
  {
    id: 'crm-form',
    stage: 3,
    step: 'files',
    required: true,
    label: 'Leave the CRM-generated enrolment application form as generated',
  },

  // 4 — Entry requirements
  {
    id: 'locate-reqs',
    stage: 4,
    step: 'academic',
    required: true,
    label: 'Locate approved entry requirements (provider SharePoint / NZQA approval)',
  },
  {
    id: 'compare-evidence',
    stage: 4,
    step: 'academic',
    required: true,
    label: 'Compare academic, English and programme-specific evidence to each requirement',
  },
  {
    id: 'outstanding-conditions',
    stage: 4,
    step: 'academic',
    required: false,
    label: 'Add any outstanding requirement as an offer condition in CRM',
    auto: (app) => {
      const open = app.conditions.filter((c) => c.status !== 'cleared').length
      return open > 0 ? info(`${open} condition${open === 1 ? '' : 's'} recorded`) : pass('No outstanding requirements')
    },
  },

  // 5 — Verification
  {
    id: 'certified',
    stage: 5,
    step: 'identity',
    required: true,
    label: 'Passport and academic documents verified or certified',
    detail: 'Authorised: JP, lawyer, Member of Parliament, notary public or education agent.',
  },
  {
    id: 'name-matches',
    stage: 5,
    step: 'identity',
    required: true,
    label: 'Student name matches the passport',
  },
  {
    id: 'passport-expiry',
    stage: 5,
    step: 'identity',
    required: true,
    label: 'Passport expiry updated and valid for the programme',
    auto: (app) => {
      const exp = val(app, 'passport_expiry')
      if (!exp || Number.isNaN(Date.parse(exp))) return fail('Passport expiry not recorded')
      return new Date(exp) >= courseEnd(app)
        ? pass(`Expires ${monthYear(new Date(exp))}, after programme end`)
        : fail(`Expires ${monthYear(new Date(exp))}, before programme end ${monthYear(courseEnd(app))}`)
    },
  },

  // 6 — Contact record
  {
    id: 'phone-code',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Phone country code updated',
    auto: (app) => {
      const m = val(app, 'mobile')
      if (!m) return fail('No mobile number')
      return m.startsWith('+') ? pass(m) : fail(`${m}: add the international code`)
    },
  },
  {
    id: 'mandatory-blanks',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Mandatory fields populated so the record pushes to SELMA',
    auto: (app) => {
      const blanks = app.fields.filter(
        (f) => f.required && f.value.trim() === '' && ['Personal', 'Contact', 'Emergency contact'].includes(f.section),
      ).length
      return blanks === 0 ? pass('All mandatory Contact fields populated') : fail(`${blanks} mandatory field${blanks === 1 ? '' : 's'} blank`)
    },
  },
  {
    id: 'onshore',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Onshore / offshore status confirmed',
    auto: (app) => {
      const country = val(app, 'cur_country')
      if (!country) return fail('Current country not recorded')
      return info(/new zealand|^nz$/i.test(country) ? 'Onshore (in New Zealand)' : `Offshore (${country})`)
    },
  },
  {
    id: 'ec-phone',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Emergency contact linked, phone differs from the student’s',
    auto: (app) => {
      const ec = val(app, 'ec_phone')
      if (!val(app, 'ec_name') || !ec) return fail('Emergency contact not linked')
      return digits(ec) === digits(val(app, 'mobile')) ? fail('Same number as the student') : pass(`${val(app, 'ec_name')} · ${ec}`)
    },
  },
  {
    id: 'ec-relationship',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Relationship to emergency contact recorded',
    auto: (app) => (val(app, 'ec_relationship') ? pass(val(app, 'ec_relationship')) : fail('Relationship missing')),
  },
  {
    id: 'citizenship',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'Country of birth, citizenship and country of citizenship checked',
    auto: (app) => {
      const b = val(app, 'country_of_birth')
      const n = val(app, 'nationality')
      return b && n ? pass(`Born ${b} · citizen of ${n}`) : fail('Country of birth or citizenship missing')
    },
  },
  {
    id: 'nz-resident',
    stage: 6,
    step: 'personal',
    required: true,
    label: 'NZ resident status set correctly',
    detail: 'Yes only for NZ resident or permanent resident visa holders; otherwise No.',
    auto: (app) => info(isResident(val(app, 'visa_status')) ? 'Set to Yes (resident visa)' : 'Set to No'),
  },

  // 7 — Opportunity record
  {
    id: 'secondary-school',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Secondary school education fields completed',
    auto: (app) => {
      const c = val(app, 'institution_country')
      if (!c) return fail('Institution country missing')
      return info(/new zealand/i.test(c) ? `Select the NZ school: ${val(app, 'institution') || '—'}` : 'Overseas Secondary School')
    },
  },
  {
    id: 'enrol-years',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Year of first enrolment and expected year of completion',
    auto: (app) => info(`${new Date(app.course.intakeDate).getFullYear()} → ${courseEnd(app).getFullYear()}`),
  },
  {
    id: 'studied-before',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Studied with the provider previously',
    auto: (app) => (val(app, 'prev_study_nz') ? info(val(app, 'prev_study_nz')) : fail('Not recorded')),
  },
  {
    id: 'activity-funding',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Main activity/status, health/disability and funding source completed',
    auto: (app) => (val(app, 'health_declaration') ? pass('Health declaration on file') : fail('Health declaration missing')),
  },
  {
    id: 'agent-region',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Agent region updated',
    detail: 'Required to avoid issues when the enrolment is pushed into SELMA.',
  },
  {
    id: 'medical',
    stage: 7,
    step: 'opportunity',
    required: true,
    label: 'Medical certificate requested and sent to the Campus Manager',
    auto: (app) => (hasMedical(app) ? fail(`Declared: ${val(app, 'medical_conditions')}`) : na('No medical condition declared')),
  },

  // 8 — International fields
  {
    id: 'insurance-default',
    stage: 8,
    step: 'opportunity',
    required: true,
    label: 'Insurance defaults to provider insurance unless own cover arranged',
    auto: (app) => {
      const mode = val(app, 'insurance_mode')
      return /own|student/i.test(mode) ? fail('Own cover — evidence to be verified') : pass('Provider insurance')
    },
  },
  {
    id: 'english-results',
    stage: 8,
    step: 'opportunity',
    required: false,
    label: 'English proficiency test results recorded',
    auto: (app) =>
      val(app, 'english_test_score')
        ? pass(`${val(app, 'english_test_type') || 'Test'} ${val(app, 'english_test_score')}`)
        : na('Not supplied — tracked as an offer condition'),
  },
  {
    id: 'under-18',
    stage: 8,
    step: 'opportunity',
    required: true,
    label: 'Under 18: homestay/caregiver and airport transfer completed',
    auto: (app) => {
      const age = ageAtIntake(app)
      if (age === null) return fail('Date of birth missing')
      return age < 18 ? fail(`Aged ${age} at intake — complete homestay & transfer`) : na(`Aged ${age} at intake`)
    },
  },
  {
    id: 'workflow-reqs',
    stage: 8,
    step: 'opportunity',
    required: true,
    label: 'Workflow requirements updated (academic, English, interview, portfolio, other)',
  },

  // 9 — Pricing
  {
    id: 'price-list',
    stage: 9,
    step: 'course',
    required: true,
    label: 'Correct provider price list and year’s price bundle selected',
    auto: (app) => info(`${app.course.brand} · ${app.course.priceBundle}`),
  },
  {
    id: 'scholarship',
    stage: 9,
    step: 'course',
    required: false,
    label: 'Relevant scholarship applied',
    auto: (app) => (app.requests.some((r) => r.type === 'discount') ? info('Discount request on file') : na('No scholarship requested')),
  },
  {
    id: 'insurance-period',
    stage: 9,
    step: 'course',
    required: true,
    label: 'Insurance added using the duration rule',
    detail: 'Ends Jan–Oct: +1 month after programme end. Ends Nov–Dec: +3 months.',
    auto: (app) => {
      const { end, extraMonths } = insuranceCover(app)
      return info(`Programme ends ${monthYear(courseEnd(app))} → cover to ${monthYear(end)} (+${extraMonths})`)
    },
  },

  // 10 — Conditional offer
  {
    id: 'offer-template',
    stage: 10,
    step: 'decision',
    required: true,
    label: 'Create Documents with the correct conditional-offer template',
  },
  {
    id: 'offer-qa',
    stage: 10,
    step: 'decision',
    required: true,
    label: 'QA the generated offer: student, programme, fees and conditions',
  },
  {
    id: 'offer-sent',
    stage: 10,
    step: 'decision',
    required: false,
    label: 'Send through Enroller and confirm status updates to Sent',
    auto: () => info('Set automatically when the offer is issued'),
  },

  // 11–16 — Post-offer
  {
    id: 'conditions-met',
    stage: 11,
    step: 'post-offer',
    required: true,
    label: 'All conditions satisfied; Unconditional Offer and Enrolment Agreement issued',
  },
  {
    id: 'agreement-signed',
    stage: 11,
    step: 'post-offer',
    required: true,
    label: 'Enrolment agreement signed; required pages initialled',
  },
  {
    id: 'signature-passport',
    stage: 11,
    step: 'post-offer',
    required: true,
    label: 'Signature matches the passport',
  },
  {
    id: 'invoice',
    stage: 12,
    step: 'post-offer',
    required: true,
    label: 'Invoice created with programme start/end dates and invoice type',
  },
  {
    id: 'payment-added',
    stage: 12,
    step: 'post-offer',
    required: true,
    label: 'Payment added: date, amount and reference/student ID (e.g. Flywire)',
  },
  {
    id: 'receipt-emailed',
    stage: 14,
    step: 'post-offer',
    required: true,
    label: 'Receipt generated, filed, QA’d and emailed to the student or agent',
    detail: 'Receipts are emailed rather than sent through Enroller because of delivery issues.',
  },
  {
    id: 'final-insurance',
    stage: 15,
    step: 'post-offer',
    required: true,
    label: 'Final check: insurance evidence, full payment, sponsor evidence, receipt issued',
  },
]

export function tasksFor(step: SopPlacement): SopTask[] {
  return SOP_TASKS.filter((t) => t.step === step)
}

export function taskDone(task: SopTask, app: Application, ticks: Record<string, boolean>): boolean {
  if (ticks[task.id]) return true
  const r = task.auto?.(app)
  return r?.state === 'pass' || r?.state === 'na'
}

export function outstandingRequired(step: SopPlacement, app: Application, ticks: Record<string, boolean>): SopTask[] {
  return tasksFor(step).filter((t) => t.required && !taskDone(t, app, ticks))
}
