// UP-side view of each agent: account status, commercial rights, and a
// 12-month application funnel compared against the network baseline. Mock data.

import { AGENCY, issuingAgentFor } from './fixtures'

export type AgentStatus = 'Active' | 'Probation' | 'Suspended' | 'Disabled'

export const AGENT_STATUSES: { value: AgentStatus; description: string }[] = [
  { value: 'Active', description: 'Can submit applications and use granted rights.' },
  { value: 'Probation', description: 'Can submit, but every application goes to admissions review.' },
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

export const FUNNEL_STAGES = [
  'Applications',
  'Conditional offer',
  'Unconditional',
  'Paid',
  'Visa approved',
] as const

export type FunnelStage = (typeof FUNNEL_STAGES)[number]

// Network-wide stage-to-stage conversion across all UP agents (last 12 months).
// Index i is the rate from stage i-1 into stage i; index 0 is unused.
export const NETWORK_BASELINE = [1, 0.72, 0.58, 0.81, 0.88]

// How far (percentage points) from baseline still counts as "on par".
export const PAR_BAND = 3

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
  canIssueConditionalLoo: boolean
  scholarships: string[] // Scholarship ids granted
  funnel: number[] // counts per FUNNEL_STAGES, last 12 months
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
    canIssueConditionalLoo: true,
    scholarships: ['regional', 'early-bird', 'pathway', 'academic'],
    funnel: [64, 49, 31, 26, 24],
  },
  'c-mei': {
    region: 'Auckland, NZ',
    markets: ['China', 'Taiwan'],
    since: '2021-08-02',
    status: 'Active',
    canIssueConditionalLoo: true,
    scholarships: ['regional', 'early-bird'],
    funnel: [41, 27, 14, 12, 10],
  },
  'c-james': {
    region: 'Lagos, Nigeria',
    markets: ['Nigeria', 'Ghana', 'Kenya'],
    since: '2024-01-15',
    status: 'Probation',
    canIssueConditionalLoo: false,
    scholarships: ['regional'],
    funnel: [28, 22, 11, 8, 7],
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

export interface OfferPermission {
  canSubmit: boolean
  canIssueLoo: boolean
  reason?: string
}

// What the agent's account lets them do at Step 4. Order matters: account
// status overrides the LoO right.
export function offerPermissionFor(profile: AgentProfile | undefined): OfferPermission {
  if (!profile) return { canSubmit: true, canIssueLoo: true }
  if (profile.status === 'Disabled' || profile.status === 'Suspended') {
    return {
      canSubmit: false,
      canIssueLoo: false,
      reason: `Your account is ${profile.status.toLowerCase()}. You can't submit new applications. Contact your regional manager.`,
    }
  }
  if (profile.status === 'Probation') {
    return {
      canSubmit: true,
      canIssueLoo: false,
      reason: 'Your account is on probation, so every application goes to UP admissions review before an offer is created.',
    }
  }
  if (!profile.canIssueConditionalLoo) {
    return {
      canSubmit: true,
      canIssueLoo: false,
      reason: "You don't have the right to create a conditional offer. UP reviews this application and creates the offer.",
    }
  }
  return { canSubmit: true, canIssueLoo: true }
}

export function grantedScholarships(profile: AgentProfile | undefined): Scholarship[] {
  if (!profile) return []
  return SCHOLARSHIPS.filter((s) => profile.scholarships.includes(s.id))
}

export function listAgentProfiles(): AgentProfile[] {
  return AGENCY.counsellors.map((c) => getAgentProfile(c.id)).filter((p): p is AgentProfile => !!p)
}

export type Comparison = 'better' | 'par' | 'worse'

export interface FunnelStep {
  stage: FunnelStage
  count: number
  // Share of the original applications that reached this stage.
  ofTotal: number
  // What the network baseline would have reached from the same starting volume.
  baselineCount: number
  // Conversion from the previous stage (undefined for the first stage).
  rate?: number
  baselineRate?: number
  deltaPts?: number
  comparison?: Comparison
}

function compare(deltaPts: number): Comparison {
  if (deltaPts > PAR_BAND) return 'better'
  if (deltaPts < -PAR_BAND) return 'worse'
  return 'par'
}

export function buildFunnel(funnel: number[]): FunnelStep[] {
  const total = funnel[0] || 1
  let baselineCum = 1
  return FUNNEL_STAGES.map((stage, i) => {
    if (i > 0) baselineCum *= NETWORK_BASELINE[i]
    const count = funnel[i] ?? 0
    const step: FunnelStep = {
      stage,
      count,
      ofTotal: count / total,
      baselineCount: Math.round(total * baselineCum),
    }
    if (i > 0) {
      const prev = funnel[i - 1] || 1
      const rate = count / prev
      const deltaPts = Math.round((rate - NETWORK_BASELINE[i]) * 1000) / 10
      Object.assign(step, { rate, baselineRate: NETWORK_BASELINE[i], deltaPts, comparison: compare(deltaPts) })
    }
    return step
  })
}

// End-to-end: applications that ended with an approved visa.
export function overallConversion(funnel: number[]) {
  const rate = (funnel[funnel.length - 1] ?? 0) / (funnel[0] || 1)
  const baseline = NETWORK_BASELINE.slice(1).reduce((a, b) => a * b, 1)
  const deltaPts = Math.round((rate - baseline) * 1000) / 10
  return { rate, baseline, deltaPts, comparison: compare(deltaPts) }
}
