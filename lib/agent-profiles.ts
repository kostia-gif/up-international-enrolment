// UP-side view of each agent: account status, performance over the last 12
// months, and the standing it earns them. Trust sits with the agency (see
// isTrustedAgency); performance sits with the individual agent (measuresFor).
// All figures are mocked, reviewed quarterly in the real product.

import type { Agency } from './types'
import { AGENCY, issuingAgentFor } from './fixtures'

export type AgentStatus = 'Active' | 'Suspended' | 'Disabled'

export const AGENT_STATUSES: { value: AgentStatus; description: string }[] = [
  { value: 'Active', description: 'Can submit applications and use any rights earned on standing.' },
  { value: 'Suspended', description: 'Cannot submit new applications. Existing ones continue.' },
  { value: 'Disabled', description: 'No access. Applications are reassigned to the agency owner.' },
]

export interface Scholarship {
  id: string
  name: string
  detail: string
}

export const SCHOLARSHIPS: Scholarship[] = [
  { id: 'regional', name: 'Regional scholarship', detail: 'Up to NZ$3,000 for regional campuses (Hamilton, Christchurch).' },
  { id: 'early-bird', name: 'Early-bird discount', detail: '10% off tuition when paid 8 weeks before intake.' },
  { id: 'pathway', name: 'Pathway progression award', detail: 'NZ$2,000 for students progressing from a UP pathway course.' },
  { id: 'academic', name: 'Academic merit scholarship', detail: 'Up to 25% off tuition for GPA 3.5+ (Degree and Postgraduate).' },
  { id: 'sibling', name: 'Sibling / family discount', detail: '5% off tuition when a family member is enrolled.' },
]

// Thresholds are starting values for the prototype; to be calibrated on real data.
export const UP_OFFER_TO_PAID_AVERAGE = 0.47
export const RIGHT_FIRST_TIME_STRONG = 0.9
export const RIGHT_FIRST_TIME_ON_TRACK = 0.75
export const PAR_BAND_PTS = 10
export const MIN_APPLICATIONS = 10
export const MIN_AGENCY_VISA_DECISIONS = 20

export interface AgentPerformance {
  applications: number
  rightFirstTime: number // count
  conditionalOffers: number
  paid: number
  visaDecisions: number
  visaApproved: number
  expectedVisaRate: number // 0–1, for this agent's country × course mix
}

export interface AgentProfile {
  id: string
  name: string
  role: 'owner' | 'counsellor'
  agency: string
  agentCode: string
  email: string
  phone: string
  region: string
  markets: string[]
  since: string // ISO date
  status: AgentStatus
  performance: AgentPerformance
  underReview: boolean // rule C3, set by UP
}

const PROFILE_SEED: Record<
  string,
  Omit<AgentProfile, 'id' | 'name' | 'role' | 'agency' | 'agentCode' | 'email' | 'phone'>
> = {
  'c-grace': {
    region: 'Auckland, NZ',
    markets: ['China', 'Vietnam', 'Philippines'],
    since: '2019-03-11',
    status: 'Active',
    underReview: false,
    performance: {
      applications: 64,
      rightFirstTime: 60,
      conditionalOffers: 49,
      paid: 26,
      visaDecisions: 26,
      visaApproved: 24,
      expectedVisaRate: 0.85,
    },
  },
  'c-mei': {
    region: 'Auckland, NZ',
    markets: ['China', 'Taiwan'],
    since: '2021-08-02',
    status: 'Active',
    underReview: false,
    performance: {
      applications: 41,
      rightFirstTime: 33,
      conditionalOffers: 27,
      paid: 12,
      visaDecisions: 12,
      visaApproved: 10,
      expectedVisaRate: 0.88,
    },
  },
  'c-james': {
    region: 'Lagos, Nigeria',
    markets: ['Nigeria', 'Ghana', 'Kenya'],
    since: '2024-01-15',
    status: 'Active',
    underReview: true,
    performance: {
      applications: 28,
      rightFirstTime: 19,
      conditionalOffers: 22,
      paid: 8,
      visaDecisions: 8,
      visaApproved: 7,
      expectedVisaRate: 0.55,
    },
  },
}

export function getAgentProfile(id: string): AgentProfile | undefined {
  const c = AGENCY.counsellors.find((x) => x.id === id)
  const seed = PROFILE_SEED[id]
  if (!c || !seed) return undefined
  const contact = issuingAgentFor(id)
  return {
    id: c.id,
    name: c.name,
    role: c.role,
    agency: AGENCY.name,
    agentCode: contact.agentCode,
    email: contact.email,
    phone: contact.phone,
    ...seed,
  }
}

export function listAgentProfiles(): AgentProfile[] {
  return AGENCY.counsellors.map((c) => getAgentProfile(c.id)).filter((p): p is AgentProfile => !!p)
}

// --- Agency rules (A1–A4) ------------------------------------------------

// A1. Listed in the latest INZ education agent report, approval rate at or
// above the market average.
export function hasInzTick(agency: Agency): boolean {
  if (!agency.inz.listed) return false
  if (agency.inz.approvalRate == null || agency.inz.marketAverage == null) return false
  return agency.inz.approvalRate >= agency.inz.marketAverage
}

// A3, with A4 applied: a confirmed integrity issue removes Trusted
// immediately, pending regional manager review.
export function isTrustedAgency(agency: Agency): boolean {
  if (agency.integrityIssue) return false // A4
  if (!agency.agreementActive) return false
  const visaAtOrAboveExpected =
    agency.visa.decisions >= MIN_AGENCY_VISA_DECISIONS &&
    agency.visa.approved / agency.visa.decisions >= agency.visa.expectedRate
  return hasInzTick(agency) || visaAtOrAboveExpected
}

// --- Agent performance (P1–P3) -------------------------------------------

export type MeasureStatus = 'strong' | 'onTrack' | 'needsAttention'
export type MeasureKey = 'rightFirstTime' | 'offersConvert' | 'visaApprovals'

export interface Measure {
  key: MeasureKey
  label: string
  // null only under C2: fewer than 10 applications, counts only.
  status: MeasureStatus | null
  countText: string
  compareText: string
}

const MEASURE_LABEL: Record<MeasureKey, string> = {
  rightFirstTime: 'Right first time',
  offersConvert: 'Offers that convert',
  visaApprovals: 'Visa approvals',
}

function statusFromPts(diffPts: number): MeasureStatus {
  if (diffPts >= 0) return 'strong'
  if (diffPts >= -PAR_BAND_PTS) return 'onTrack'
  return 'needsAttention'
}

// Three measures, each with a status, one count sentence and one comparison
// line. Under C2 (fewer than 10 applications) every status is null: counts
// only, no judgement yet.
export function measuresFor(profile: AgentProfile): Measure[] {
  const p = profile.performance
  const building = p.applications < MIN_APPLICATIONS

  const rftRatio = p.applications > 0 ? p.rightFirstTime / p.applications : 0
  const rftStatus: MeasureStatus =
    rftRatio >= RIGHT_FIRST_TIME_STRONG ? 'strong' : rftRatio >= RIGHT_FIRST_TIME_ON_TRACK ? 'onTrack' : 'needsAttention'

  const paidRate = p.conditionalOffers > 0 ? p.paid / p.conditionalOffers : 0
  const paidStatus = statusFromPts((paidRate - UP_OFFER_TO_PAID_AVERAGE) * 100)

  const visaRate = p.visaDecisions > 0 ? p.visaApproved / p.visaDecisions : 0
  const visaStatus = statusFromPts((visaRate - p.expectedVisaRate) * 100)

  return [
    {
      key: 'rightFirstTime',
      label: MEASURE_LABEL.rightFirstTime,
      status: building ? null : rftStatus,
      countText: `${p.rightFirstTime} of ${p.applications} applications needed no follow-up`,
      compareText: building ? '' : 'Target 90%',
    },
    {
      key: 'offersConvert',
      label: MEASURE_LABEL.offersConvert,
      status: building ? null : paidStatus,
      countText: `${p.paid} of ${p.conditionalOffers} offers reached payment`,
      compareText: building ? '' : `UP average ${Math.round(UP_OFFER_TO_PAID_AVERAGE * 100)}%`,
    },
    {
      key: 'visaApprovals',
      label: MEASURE_LABEL.visaApprovals,
      status: building ? null : visaStatus,
      countText: `${p.visaApproved} of ${p.visaDecisions} visas approved`,
      compareText: building ? '' : `Expected for your markets and courses: ${Math.round(p.expectedVisaRate * 100)}%`,
    },
  ]
}

// --- How they combine (C1–C5) --------------------------------------------

export type Standing = 'trusted' | 'standard' | 'building' | 'review'

export const STANDING_COPY: Record<Standing, { chip: string; line: string }> = {
  trusted: { chip: 'Trusted rights on', line: 'You can issue instant offers and apply discounts upfront.' },
  standard: { chip: 'Standard review', line: 'UP admissions reviews your applications and issues the offer.' },
  building: { chip: 'Building a record', line: 'Submit 10 applications to unlock your performance status.' },
  review: {
    chip: 'Under review',
    line: 'A measure has needed attention for two quarters. UP admissions reviews every application until it clears.',
  },
}

// C1: agency Trusted, 10+ applications, no measure Needs attention, not
// under review.
export function hasTrustedRights(profile: AgentProfile, agency: Agency): boolean {
  if (profile.performance.applications < MIN_APPLICATIONS) return false
  if (profile.underReview) return false
  if (!isTrustedAgency(agency)) return false
  return measuresFor(profile).every((m) => m.status !== 'needsAttention')
}

// C2 (building) and C3 (under review) short-circuit before C1 is checked.
export function standingFor(profile: AgentProfile, agency: Agency): Standing {
  if (profile.performance.applications < MIN_APPLICATIONS) return 'building'
  if (profile.underReview) return 'review'
  if (hasTrustedRights(profile, agency)) return 'trusted'
  return 'standard'
}

const NEXT_STEP_SENTENCE: Record<MeasureKey, string> = {
  rightFirstTime: 'Upload every required document before you submit. Applications that need follow-up count against you.',
  offersConvert: 'Only apply for students who are ready to accept and pay. Unconverted offers count against you.',
  visaApprovals: 'Add funds and study-intent evidence at submission. Stronger evidence up front supports the visa application.',
}

const MEASURE_RANK: Record<MeasureStatus, number> = { needsAttention: 0, onTrack: 1, strong: 2 }

// One sentence for the weakest measure (ties broken by P1, P2, P3 order), or
// null when every measure is Strong (or there aren't enough applications yet).
export function nextStepFor(profile: AgentProfile): string | null {
  const measures = measuresFor(profile)
  let weakest: Measure | null = null
  for (const m of measures) {
    if (m.status == null) continue
    if (!weakest || MEASURE_RANK[m.status] < MEASURE_RANK[weakest.status!]) weakest = m
  }
  if (!weakest || weakest.status === 'strong') return null
  return NEXT_STEP_SENTENCE[weakest.key]
}

// --- Account status and rights --------------------------------------------

export interface OfferPermission {
  canSubmit: boolean
  canIssueLoo: boolean
  reason?: string
}

// What the agent's account lets them do at Step 4. Order matters: account
// status overrides standing.
export function offerPermissionFor(profile: AgentProfile | undefined, agency: Agency = AGENCY): OfferPermission {
  if (!profile) return { canSubmit: true, canIssueLoo: true }
  if (profile.status === 'Disabled' || profile.status === 'Suspended') {
    return {
      canSubmit: false,
      canIssueLoo: false,
      reason: `Your account is ${profile.status.toLowerCase()}. You can't submit new applications. Contact your regional manager.`,
    }
  }
  const standing = standingFor(profile, agency)
  if (standing === 'trusted') return { canSubmit: true, canIssueLoo: true }
  return { canSubmit: true, canIssueLoo: false, reason: STANDING_COPY[standing].line }
}

// Every scholarship, for any agent who can submit — approval, not selection,
// is what rights govern (applied upfront vs requested for UP to approve).
export function grantedScholarships(profile: AgentProfile | undefined, agency: Agency = AGENCY): Scholarship[] {
  if (!profile) return []
  return offerPermissionFor(profile, agency).canSubmit ? SCHOLARSHIPS : []
}
