import type { Application, Brand, HoldReason } from './types'
import type { Audience } from './entry-requirements'
import type { Tone } from './status'
import { AGENCY } from './fixtures'
import { inzDeclineRate, nationalityOf } from './pre-enrolment'
import { holdReasonDef } from './holds'

// ---------------------------------------------------------------------------
// Business-level record: one per application across every agency and brand.
// The historic book is generated deterministically; live store applications
// are merged in on top so admissions actions (e.g. save & close) show here.
// ---------------------------------------------------------------------------

export type SalesStage =
  | 'unfinished'
  | 'submitted'
  | 'conditional'
  | 'unconditional'
  | 'accepted'
  | 'enrolled'
  | 'withdrawn'

export type VisaStatus = 'not-lodged' | 'lodged' | 'ppi' | 'approved' | 'declined'

export type ConditionType =
  | 'English test'
  | 'Final transcript'
  | 'Financial evidence'
  | 'Passport copy'
  | 'Medical & insurance'
  | 'Guardian & homestay'

export interface OpenCondition {
  type: ConditionType
  ageDays: number
}

export interface SalesRecord {
  id: string
  appId?: string // present for live applications that can be opened
  live: boolean
  studentName: string
  agencyId: string
  agencyName: string
  region: string
  nationality: string
  brand: Brand
  programme: string
  createdDaysAgo: number
  stage: SalesStage
  conditions: OpenCondition[]
  visa?: VisaStatus
  visaDays?: number // days since lodged with INZ
  hold?: { reason: HoldReason; note: string; step: string; savedAt: string }
}

export const AGENCIES = [
  { id: AGENCY.id, name: AGENCY.name, region: 'Pacific' },
  { id: 'gse', name: 'Global Study Edge', region: 'South Asia' },
  { id: 'ahe', name: 'AsiaHorizon Education', region: 'North Asia' },
  { id: 'mek', name: 'Mekong Pathways', region: 'South East Asia' },
  { id: 'kiw', name: 'KiwiBound Consultants', region: 'South Asia' },
  { id: 'lat', name: 'LatAm Study Group', region: 'Latin America' },
  { id: 'dir', name: 'Direct applicants', region: 'Direct' },
]

const NATIONALITIES: [string, number, string][] = [
  ['India', 18, 'South Asia'],
  ['China', 12, 'North Asia'],
  ['Vietnam', 10, 'South East Asia'],
  ['Philippines', 9, 'South East Asia'],
  ['Nepal', 7, 'South Asia'],
  ['Sri Lanka', 6, 'South Asia'],
  ['Fiji', 6, 'Pacific'],
  ['Thailand', 5, 'South East Asia'],
  ['Indonesia', 5, 'South East Asia'],
  ['Bangladesh', 4, 'South Asia'],
  ['South Korea', 4, 'North Asia'],
  ['Japan', 3, 'North Asia'],
  ['Brazil', 3, 'Latin America'],
  ['Saudi Arabia', 2, 'Middle East'],
]

const PROGRAMMES: Record<Brand, string[]> = {
  UPIC: ['PLP + Foundation Connect + STD', 'Pathway Link + SD', 'Foundation Connect'],
  NZMA: ['NZ Diploma in Business (L5)', 'NZ Certificate in Health & Wellbeing (L4)'],
  Yoobee: ['Diploma in Software Engineering (L6)', 'Bachelor of Digital Design'],
  NZTC: ['NZ Diploma in Early Childhood (L5)', 'Bachelor of Teaching (ECE)'],
}

const BRAND_WEIGHTS: [Brand, number][] = [
  ['UPIC', 35],
  ['NZMA', 28],
  ['Yoobee', 22],
  ['NZTC', 15],
]

const CONDITION_WEIGHTS: [ConditionType, number][] = [
  ['English test', 30],
  ['Final transcript', 24],
  ['Financial evidence', 18],
  ['Passport copy', 8],
  ['Medical & insurance', 12],
  ['Guardian & homestay', 8],
]

const FIRST = ['Aarav', 'Mei', 'Linh', 'Joshua', 'Priya', 'Sakura', 'Minh', 'Ravi', 'Ana', 'Hyun', 'Siosaia', 'Nimali', 'Wei', 'Tariq', 'Camila', 'Arjun', 'Yuki', 'Farah', 'Kiri', 'Diego']
const LAST = ['Sharma', 'Chen', 'Nguyen', 'Santos', 'Patel', 'Tanaka', 'Tran', 'Kumar', 'Silva', 'Park', 'Tuipulotu', 'Perera', 'Zhang', 'Rahman', 'Lopez', 'Singh', 'Sato', 'Ali', 'Wiremu', 'Costa']

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function weighted<T>(rand: () => number, items: [T, number, ...unknown[]][]): T {
  const total = items.reduce((s, i) => s + i[1], 0)
  let r = rand() * total
  for (const item of items) {
    r -= item[1]
    if (r <= 0) return item[0]
  }
  return items[items.length - 1][0]
}

function generateBook(): SalesRecord[] {
  const rand = mulberry32(20260929)
  const out: SalesRecord[] = []
  for (let i = 0; i < 640; i++) {
    // Skew towards recent months with intake peaks.
    const createdDaysAgo = Math.floor(Math.pow(rand(), 1.25) * 365)
    const nationality = weighted(rand, NATIONALITIES)
    const region = NATIONALITIES.find((n) => n[0] === nationality)![2]
    const regional = AGENCIES.filter((a) => a.region === region)
    const agency =
      rand() < 0.18
        ? AGENCIES[AGENCIES.length - 1]
        : rand() < 0.22
          ? AGENCIES[0]
          : regional[Math.floor(rand() * regional.length)] ?? AGENCIES[1]
    const brand = weighted(rand, BRAND_WEIGHTS)
    const programmes = PROGRAMMES[brand]
    const programme = programmes[Math.floor(rand() * programmes.length)]

    // Older applications have had longer to progress.
    const maturity = Math.min(1, createdDaysAgo / 120) * 0.75 + rand() * 0.35
    const decline = inzDeclineRate(nationality).rate / 100
    let stage: SalesStage
    if (rand() < 0.06 + (createdDaysAgo > 90 ? 0.06 : 0)) stage = 'withdrawn'
    else if (maturity < 0.2) stage = 'unfinished'
    else if (maturity < 0.34) stage = 'submitted'
    else if (maturity < 0.58) stage = 'conditional'
    else if (maturity < 0.7) stage = 'unconditional'
    else if (maturity < 0.86) stage = 'accepted'
    else stage = 'enrolled'

    const conditions: OpenCondition[] = []
    if (stage === 'conditional') {
      const n = 1 + Math.floor(rand() * 2.4)
      const used = new Set<ConditionType>()
      for (let c = 0; c < n; c++) {
        let type = weighted(rand, CONDITION_WEIGHTS)
        if (type === 'Guardian & homestay' && brand !== 'UPIC') type = 'Final transcript'
        if (used.has(type)) continue
        used.add(type)
        conditions.push({ type, ageDays: Math.floor(rand() * Math.min(createdDaysAgo, 75)) })
      }
    }

    let visa: VisaStatus | undefined
    let visaDays: number | undefined
    if (stage === 'unconditional') {
      visa = rand() < 0.6 ? 'not-lodged' : 'lodged'
    } else if (stage === 'accepted') {
      const r = rand()
      visa = r < 0.15 ? 'not-lodged' : r < 0.6 ? 'lodged' : r < 0.78 ? 'ppi' : r < 0.78 + (1 - decline) * 0.22 ? 'approved' : 'declined'
    } else if (stage === 'enrolled') {
      visa = 'approved'
    } else if (stage === 'withdrawn' && rand() < decline) {
      visa = 'declined'
    }
    if (visa && visa !== 'not-lodged') visaDays = 4 + Math.floor(rand() * 55)

    let hold: SalesRecord['hold']
    if (stage === 'submitted' && rand() < 0.3) {
      const reasons: HoldReason[] = ['documents', 'documents', 'regional-manager', 'campus-manager', 'other']
      const reason = reasons[Math.floor(rand() * reasons.length)]
      hold = {
        reason,
        note: '',
        step: reason === 'documents' ? 'Documents' : reason === 'regional-manager' ? 'Initial checks' : 'Academic entry',
        savedAt: new Date(Date.now() - Math.floor(rand() * 12) * 86400000).toISOString(),
      }
    }

    out.push({
      id: `h-${1000 + i}`,
      live: false,
      studentName: `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`,
      agencyId: agency.id,
      agencyName: agency.name,
      region,
      nationality,
      brand,
      programme,
      createdDaysAgo,
      stage,
      conditions,
      visa,
      visaDays,
      hold,
    })
  }
  return out
}

const BOOK = generateBook()

function stageFromApp(app: Application): SalesStage {
  switch (app.stage) {
    case 'Submitted':
      return 'submitted'
    case 'Conditional offer':
    case 'Conditions open':
      return 'conditional'
    case 'Unconditional':
      return 'unconditional'
    case 'Accepted':
      return 'accepted'
    case 'Paid':
      return 'enrolled'
    default:
      return 'unfinished'
  }
}

function fromApplication(app: Application): SalesRecord {
  const nationality = nationalityOf(app)
  const agency = AGENCIES.find((a) => a.id === app.agencyId) ?? AGENCIES[0]
  const created = new Date(app.createdAt).getTime()
  const createdDaysAgo = Number.isNaN(created) ? 0 : Math.max(0, Math.floor((Date.now() - created) / 86400000))
  const stage = stageFromApp(app)
  return {
    id: app.id,
    appId: app.id,
    live: true,
    studentName: app.studentName,
    agencyId: agency.id,
    agencyName: agency.name,
    region: agency.region,
    nationality,
    brand: app.course.brand,
    programme: app.course.programmeName,
    createdDaysAgo,
    stage,
    conditions: app.conditions
      .filter((c) => c.status !== 'cleared')
      .map((c) => ({ type: mapConditionType(c.label), ageDays: Math.min(createdDaysAgo, 14) })),
    visa: stage === 'accepted' || stage === 'unconditional' ? 'not-lodged' : stage === 'enrolled' ? 'approved' : undefined,
    hold: app.crmHold
      ? {
          reason: app.crmHold.reason,
          note: app.crmHold.note,
          step: app.crmHold.stepTitle,
          savedAt: app.crmHold.savedAt,
        }
      : undefined,
  }
}

function mapConditionType(label: string): ConditionType {
  const l = label.toLowerCase()
  if (l.includes('english') || l.includes('ielts') || l.includes('duolingo')) return 'English test'
  if (l.includes('fund') || l.includes('financ') || l.includes('bank')) return 'Financial evidence'
  if (l.includes('passport')) return 'Passport copy'
  if (l.includes('insur') || l.includes('medical')) return 'Medical & insurance'
  if (l.includes('guardian') || l.includes('homestay')) return 'Guardian & homestay'
  return 'Final transcript'
}

export function buildRecords(apps: Application[]): SalesRecord[] {
  return [...apps.map(fromApplication), ...BOOK]
}

// Agents see their own agency only. External stakeholders see the whole book,
// but never names, agency identities or internal hold notes.
export function scopeRecords(records: SalesRecord[], audience: Audience): SalesRecord[] {
  if (audience === 'agent') return records.filter((r) => r.agencyId === AGENCY.id)
  return records
}

export interface SalesFilters {
  months: 3 | 6 | 12
  brand: Brand | 'all'
}

export function filterRecords(records: SalesRecord[], f: SalesFilters): SalesRecord[] {
  const maxDays = f.months * 30.4
  return records.filter((r) => r.createdDaysAgo <= maxDays && (f.brand === 'all' || r.brand === f.brand))
}

// ---------------------------------------------------------------------------
// Where the application is sitting in the process
// ---------------------------------------------------------------------------

export type Location =
  | 'agent'
  | 'admissions'
  | 'hold'
  | 'conditions'
  | 'acceptance'
  | 'inz'
  | 'enrolled'
  | 'closed'

export const LOCATIONS: { key: Location; label: string; owner: string; tone: Tone }[] = [
  { key: 'agent', label: 'Unfinished — with agent', owner: 'Agent', tone: 'neutral' },
  { key: 'admissions', label: 'Admissions review', owner: 'Admissions', tone: 'info' },
  { key: 'hold', label: 'Admissions — saved & on hold', owner: 'Admissions', tone: 'warning' },
  { key: 'conditions', label: 'Conditional — conditions outstanding', owner: 'Agent / student', tone: 'warning' },
  { key: 'acceptance', label: 'Unconditional — awaiting acceptance', owner: 'Student', tone: 'ai' },
  { key: 'inz', label: 'Visa with INZ', owner: 'Immigration NZ', tone: 'info' },
  { key: 'enrolled', label: 'Enrolled', owner: '—', tone: 'success' },
  { key: 'closed', label: 'Withdrawn / declined', owner: '—', tone: 'danger' },
]

export function locationOf(r: SalesRecord): Location {
  if (r.stage === 'withdrawn' || r.visa === 'declined') return 'closed'
  if (r.stage === 'unfinished') return 'agent'
  if (r.stage === 'submitted') return r.hold ? 'hold' : 'admissions'
  if (r.stage === 'conditional') return 'conditions'
  if (r.stage === 'unconditional') return r.visa && r.visa !== 'not-lodged' ? 'inz' : 'acceptance'
  if (r.stage === 'accepted') return r.visa === 'approved' ? 'enrolled' : 'inz'
  return 'enrolled'
}

// ---------------------------------------------------------------------------
// Aggregations
// ---------------------------------------------------------------------------

const STAGE_ORDER: SalesStage[] = ['unfinished', 'submitted', 'conditional', 'unconditional', 'accepted', 'enrolled']

function reached(r: SalesRecord, stage: SalesStage): boolean {
  if (r.stage === 'withdrawn') {
    // Withdrawn files count as submitted — they made it that far.
    return stage === 'unfinished' || stage === 'submitted'
  }
  return STAGE_ORDER.indexOf(r.stage) >= STAGE_ORDER.indexOf(stage)
}

export interface FunnelStep {
  label: string
  count: number
  pctOfStart: number
  pctOfPrev: number
}

export function funnel(records: SalesRecord[]): FunnelStep[] {
  const steps: [string, SalesStage][] = [
    ['Applications started', 'unfinished'],
    ['Submitted to admissions', 'submitted'],
    ['Offer issued', 'conditional'],
    ['Unconditional', 'unconditional'],
    ['Accepted', 'accepted'],
    ['Enrolled', 'enrolled'],
  ]
  const start = records.length || 1
  let prev = start
  return steps.map(([label, stage]) => {
    const count = records.filter((r) => reached(r, stage)).length
    const step = {
      label,
      count,
      pctOfStart: Math.round((count / start) * 100),
      pctOfPrev: prev ? Math.round((count / prev) * 100) : 0,
    }
    prev = count
    return step
  })
}

export function kpis(records: SalesRecord[]) {
  const total = records.length
  const unfinished = records.filter((r) => r.stage === 'unfinished').length
  const submitted = records.filter((r) => reached(r, 'submitted')).length
  const enrolled = records.filter((r) => r.stage === 'enrolled').length
  const conditionalFiles = records.filter((r) => r.stage === 'conditional')
  const openConditions = conditionalFiles.reduce((s, r) => s + r.conditions.length, 0)
  const onHold = records.filter((r) => locationOf(r) === 'hold').length
  const withInz = records.filter((r) => locationOf(r) === 'inz').length
  const last30 = records.filter((r) => r.createdDaysAgo <= 30).length
  return {
    total,
    last30,
    unfinished,
    submitted,
    enrolled,
    conversion: submitted ? Math.round((enrolled / submitted) * 100) : 0,
    conditionalFiles: conditionalFiles.length,
    openConditions,
    onHold,
    withInz,
  }
}

export interface MonthBucket {
  key: string
  label: string
  submitted: number
  unfinished: number
}

export function monthlyApplications(records: SalesRecord[], months: number): MonthBucket[] {
  const now = new Date()
  const buckets: MonthBucket[] = []
  for (let m = months - 1; m >= 0; m--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - m, 1))
    buckets.push({
      key: `${d.getUTCFullYear()}-${d.getUTCMonth()}`,
      label: d.toLocaleString('en-NZ', { month: 'short', timeZone: 'UTC' }),
      submitted: 0,
      unfinished: 0,
    })
  }
  for (const r of records) {
    const d = new Date(Date.now() - r.createdDaysAgo * 86400000)
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`
    const b = buckets.find((x) => x.key === key)
    if (!b) continue
    if (r.stage === 'unfinished') b.unfinished++
    else b.submitted++
  }
  return buckets
}

export const AGE_BANDS = [
  { label: '0–14 days', max: 14, tone: 'success' as Tone },
  { label: '15–30 days', max: 30, tone: 'info' as Tone },
  { label: '31–60 days', max: 60, tone: 'warning' as Tone },
  { label: '60+ days', max: Infinity, tone: 'danger' as Tone },
]

export function conditionBreakdown(records: SalesRecord[]) {
  const files = records.filter((r) => r.stage === 'conditional' && r.conditions.length)
  const all = files.flatMap((r) => r.conditions.map((c) => ({ ...c, record: r })))
  const byType = CONDITION_WEIGHTS.map(([type]) => {
    const items = all.filter((c) => c.type === type)
    return {
      type,
      count: items.length,
      avgAge: items.length ? Math.round(items.reduce((s, c) => s + c.ageDays, 0) / items.length) : 0,
      stale: items.filter((c) => c.ageDays > 30).length,
    }
  })
    .filter((t) => t.count)
    .sort((a, b) => b.count - a.count)
  const byAge = AGE_BANDS.map((band, i) => {
    const min = i === 0 ? -1 : AGE_BANDS[i - 1].max
    return { ...band, count: all.filter((c) => c.ageDays > min && c.ageDays <= band.max).length }
  })
  // Oldest condition per file drives the chase list.
  const oldest = files
    .map((r) => ({ record: r, maxAge: Math.max(...r.conditions.map((c) => c.ageDays)) }))
    .sort((a, b) => b.maxAge - a.maxAge)
  return { files: files.length, total: all.length, byType, byAge, oldest }
}

export const VISA_LABEL: Record<VisaStatus, string> = {
  'not-lodged': 'Not yet lodged',
  lodged: 'Lodged with INZ',
  ppi: 'PPI — further info requested',
  approved: 'Approved',
  declined: 'Declined',
}

export const VISA_TONE: Record<VisaStatus, Tone> = {
  'not-lodged': 'neutral',
  lodged: 'info',
  ppi: 'warning',
  approved: 'success',
  declined: 'danger',
}

export function visaBreakdown(records: SalesRecord[]) {
  const withVisa = records.filter((r) => r.visa)
  const statuses = (Object.keys(VISA_LABEL) as VisaStatus[]).map((s) => ({
    status: s,
    count: withVisa.filter((r) => r.visa === s).length,
  }))
  const pending = withVisa.filter((r) => r.visa === 'lodged' || r.visa === 'ppi')
  const avgDaysWithInz = pending.length
    ? Math.round(pending.reduce((s, r) => s + (r.visaDays ?? 0), 0) / pending.length)
    : 0
  const decided = withVisa.filter((r) => r.visa === 'approved' || r.visa === 'declined')
  const approvalRate = decided.length
    ? Math.round((decided.filter((r) => r.visa === 'approved').length / decided.length) * 100)
    : 0

  const nats = Array.from(new Set(withVisa.map((r) => r.nationality)))
  const byNationality = nats
    .map((n) => {
      const rs = withVisa.filter((r) => r.nationality === n)
      const d = rs.filter((r) => r.visa === 'approved' || r.visa === 'declined')
      return {
        nationality: n,
        total: rs.length,
        pending: rs.filter((r) => r.visa === 'lodged' || r.visa === 'ppi').length,
        approved: rs.filter((r) => r.visa === 'approved').length,
        declined: rs.filter((r) => r.visa === 'declined').length,
        approvalRate: d.length ? Math.round((d.filter((r) => r.visa === 'approved').length / d.length) * 100) : null,
        inzRate: inzDeclineRate(n),
      }
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  return { statuses, pending: pending.length, avgDaysWithInz, approvalRate, decided: decided.length, byNationality }
}

export function locationCounts(records: SalesRecord[]) {
  return LOCATIONS.map((l) => ({ ...l, count: records.filter((r) => locationOf(r) === l.key).length }))
}

export function holdLabel(r: SalesRecord, audience: Audience): string | null {
  if (!r.hold) return null
  const def = holdReasonDef(r.hold.reason)
  return audience === 'internal' ? def.label : def.externalLabel
}

export function byAgency(records: SalesRecord[]) {
  return AGENCIES.map((a) => {
    const rs = records.filter((r) => r.agencyId === a.id)
    const submitted = rs.filter((r) => reached(r, 'submitted')).length
    const enrolled = rs.filter((r) => r.stage === 'enrolled').length
    return {
      ...a,
      total: rs.length,
      unfinished: rs.filter((r) => r.stage === 'unfinished').length,
      conditions: rs.reduce((s, r) => s + (r.stage === 'conditional' ? r.conditions.length : 0), 0),
      conversion: submitted ? Math.round((enrolled / submitted) * 100) : 0,
    }
  })
    .filter((a) => a.total)
    .sort((a, b) => b.total - a.total)
}
