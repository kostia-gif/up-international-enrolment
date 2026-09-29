import type { Tone } from '@/lib/status'

// Internal Control re-performs each admissions control from the pre-enrolment
// process and records whether the CRM trail evidences it.

export type ControlResult = 'pass' | 'exception' | 'not-evidenced'

export const controlResultMeta: Record<ControlResult, { label: string; tone: Tone }> = {
  pass: { label: 'Evidenced', tone: 'success' },
  exception: { label: 'Exception', tone: 'danger' },
  'not-evidenced': { label: 'Not evidenced', tone: 'warning' },
}

export type ControlPhase = 'Initial checks' | 'Assessment' | 'Offer' | 'Payment' | 'Enrolment'

export interface ControlDef {
  key: string
  phase: ControlPhase
  title: string
  test: string
}

export const PROCESS_CONTROLS: ControlDef[] = [
  {
    key: 'duplicate',
    phase: 'Initial checks',
    title: 'Duplicate application check',
    test: 'Existing Contact searched in CRM; any duplicate merged or withdrawn before assessment.',
  },
  {
    key: 'channel',
    phase: 'Initial checks',
    title: 'Agent or direct verified',
    test: 'Submitting agent is active and contracted, or the application is recorded as direct.',
  },
  {
    key: 'visa',
    phase: 'Initial checks',
    title: 'Visa refusal & INZ decline rate',
    test: 'Prior refusals declared; nationalities with a high INZ decline rate carry Regional Manager approval.',
  },
  {
    key: 'crm',
    phase: 'Assessment',
    title: 'CRM assessment complete',
    test: 'Files, NZQA entry requirements, Verification, Contact, Opportunity, Workflow and Price Bundle recorded.',
  },
  {
    key: 'conditional',
    phase: 'Offer',
    title: 'Conditional Offer via Enroller',
    test: 'Conditional Offer generated from CRM and sent through Enroller, with conditions listed.',
  },
  {
    key: 'unconditional',
    phase: 'Offer',
    title: 'Conditions met before Unconditional Offer',
    test: 'Every condition evidenced before the Unconditional Offer and Enrolment Pack were issued.',
  },
  {
    key: 'payment',
    phase: 'Payment',
    title: 'Outstanding-balance rule applied',
    test: 'Letter issued matches the balance: paid in full, insurance only, under $100 or $100 and over.',
  },
  {
    key: 'push',
    phase: 'Enrolment',
    title: 'Enrolment requirements before push',
    test: 'Enrolment requirements confirmed in CRM before the record was pushed to Yoobee SMS.',
  },
]

export interface ControlOutcome {
  result: ControlResult
  note: string
}

type Trail = Record<string, ControlOutcome>

const pass = (note: string): ControlOutcome => ({ result: 'pass', note })
const exception = (note: string): ControlOutcome => ({ result: 'exception', note })
const missing = (note: string): ControlOutcome => ({ result: 'not-evidenced', note })

const TRAILS: Record<string, Trail> = {
  'ic-108429': {
    duplicate: pass('No existing Contact · checked 12 May 2026'),
    channel: pass('Agent: Bright Future Education · contract active'),
    visa: pass('No prior refusal · China decline rate 9%'),
    crm: pass('All seven CRM areas complete'),
    conditional: pass('Sent via Enroller · 20 May 2026'),
    unconditional: pass('IELTS 6.0 and fees evidenced · 31 May 2026'),
    payment: pass('Paid in full → Unconditional Offer + Enrolment Pack'),
    push: pass('Requirements confirmed · pushed to Yoobee 2 Jun 2026'),
  },
  'ic-108530': {
    duplicate: pass('No existing Contact'),
    channel: pass('Agent: Global Pathways · contract active'),
    visa: exception('India decline rate 38% · Regional Manager approval not on file'),
    crm: pass('All seven CRM areas complete'),
    conditional: pass('Sent via Enroller · 3 Jun 2026'),
    unconditional: pass('Conditions evidenced · 18 Jun 2026'),
    payment: exception('Balance $450 outstanding but full Unconditional Offer issued'),
    push: pass('Pushed to Yoobee 21 Jun 2026'),
  },
  'ic-108671': {
    duplicate: pass('Duplicate from 2025 intake merged'),
    channel: pass('Direct application'),
    visa: pass('No prior refusal · Philippines decline rate 14%'),
    crm: missing('Price Bundle not recorded against the Opportunity'),
    conditional: pass('Sent via Enroller · 8 Jun 2026'),
    unconditional: pass('Conditions evidenced · 25 Jun 2026'),
    payment: pass('Insurance only outstanding → offer issued with insurance note'),
    push: pass('Pushed to Yoobee 28 Jun 2026'),
  },
  'ic-108744': {
    duplicate: pass('No existing Contact'),
    channel: pass('Agent: Eastern Star · contract active'),
    visa: pass('No prior refusal · China decline rate 9%'),
    crm: pass('All seven CRM areas complete'),
    conditional: pass('Sent via Enroller · 11 Jun 2026'),
    unconditional: missing('English condition evidence not attached in Files'),
    payment: pass('Paid in full'),
    push: missing('Enrolment requirements checklist not completed before push'),
  },
  'ic-108802': {
    duplicate: exception('Second open Opportunity for same passport not withdrawn'),
    channel: pass('Agent: Saigon Study Link · contract active'),
    visa: pass('Prior refusal declared · reviewed and approved'),
    crm: pass('All seven CRM areas complete'),
    conditional: pass('Sent via Enroller · 14 Jun 2026'),
    unconditional: pass('Conditions evidenced · 30 Jun 2026'),
    payment: pass('Under $100 outstanding → Unconditional Offer, balance on arrival'),
    push: pass('Pushed to Yoobee 2 Jul 2026'),
  },
}

export interface ControlRow extends ControlDef, ControlOutcome {}

export function processControlsFor(recordId: string): ControlRow[] {
  const trail = TRAILS[recordId] ?? {}
  return PROCESS_CONTROLS.map((def) => ({
    ...def,
    ...(trail[def.key] ?? missing('No CRM evidence found')),
  }))
}

export function controlSummary(rows: ControlRow[]) {
  return {
    pass: rows.filter((r) => r.result === 'pass').length,
    exception: rows.filter((r) => r.result === 'exception').length,
    missing: rows.filter((r) => r.result === 'not-evidenced').length,
    total: rows.length,
  }
}
