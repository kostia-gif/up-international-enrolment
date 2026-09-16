import type {
  Application,
  EventActor,
  EventAttachment,
  EventChannel,
  Requirement,
  Stage,
} from './types'
import type { Tone } from './status'
import { computeReadiness } from './readiness'

// ---------------------------------------------------------------------------
// Board: four funnel columns mapped from the internal stages.
//   Draft       — still being worked on before submission
//   Submitted   — submitted for an unconditional decision, whether or not
//                 admissions has picked it up for review yet
//   Conditional offer   — conditional offer issued, conditions being tracked
//   Unconditional offer — final offer issued / accepted / enrolled
// ---------------------------------------------------------------------------

export type BoardColumnKey = 'draft' | 'submitted' | 'conditional' | 'unconditional'

export interface BoardColumnDef {
  key: BoardColumnKey
  label: string
  description: string
  tone: Tone
}

export const BOARD_COLUMNS: BoardColumnDef[] = [
  { key: 'draft', label: 'In draft', description: 'Being worked on', tone: 'neutral' },
  { key: 'submitted', label: 'Submitted', description: 'For unconditional offer', tone: 'info' },
  { key: 'conditional', label: 'Conditional offer', description: 'Conditions tracking', tone: 'ai' },
  { key: 'unconditional', label: 'Unconditional offer', description: 'Confirmed & enrolled', tone: 'success' },
]

const PRE_SUBMIT_STAGES: Stage[] = ['Draft', 'Reviewing', 'Gaps', 'Data', 'Requests']
const CONDITIONAL_STAGES: Stage[] = ['Conditional offer', 'Conditions open']
const UNCONDITIONAL_STAGES: Stage[] = ['Unconditional', 'Accepted', 'Paid']

export function hasPendingSpecial(app: Application): boolean {
  return app.requests.some(
    (r) => (r.type === 'discount' || r.type === 'special-admission') && r.status === 'pending',
  )
}

export function columnFor(app: Application): BoardColumnKey {
  if (UNCONDITIONAL_STAGES.includes(app.stage)) return 'unconditional'
  if (CONDITIONAL_STAGES.includes(app.stage)) return 'conditional'
  // Submitted OR sent to admissions review both live in the Submitted column;
  // the card itself shows whether it has been picked up for review yet.
  if (app.stage === 'Submitted' || app.route === 'review') return 'submitted'
  if (PRE_SUBMIT_STAGES.includes(app.stage)) return 'draft'
  return 'draft'
}

export interface CardPill {
  label: string
  tone: Tone
}

// Submitted sub-status: whether admissions has picked the file up for review.
export function pickupPill(app: Application): CardPill {
  return app.route === 'review'
    ? { label: 'In review', tone: 'info' }
    : { label: 'Awaiting review', tone: 'neutral' }
}

// Unconditional sub-status: offer issued, accepted, or fully paid / enrolled.
export function unconditionalPill(app: Application): CardPill {
  if (app.stage === 'Paid') return { label: 'Paid · enrolled', tone: 'success' }
  if (app.stage === 'Accepted') return { label: 'Offer accepted', tone: 'success' }
  return { label: 'Unconditional offer', tone: 'success' }
}

// In-review special request status shown on the card.
export function specialRequestPill(app: Application): CardPill | null {
  if (app.requests.some((r) => r.type === 'special-admission' && r.status === 'pending')) {
    return { label: 'Special application requested', tone: 'warning' }
  }
  if (app.requests.some((r) => r.type === 'discount' && r.status === 'pending')) {
    return { label: 'Discount requested', tone: 'warning' }
  }
  return null
}

// A conditional Letter of Offer is generated at submission. When the agent
// auto-submitted, they generated it at submit time ("by Agent"); files picked
// up for review or already on a conditional offer carry one too. Unconditional
// files show the final unconditional offer.
export function looBadge(app: Application): string | null {
  const col = columnFor(app)
  if (col === 'submitted') {
    return app.route === 'review' ? 'Conditional LoO' : 'Conditional LoO by Agent'
  }
  if (col === 'conditional') return 'Conditional LoO'
  if (col === 'unconditional') return 'Unconditional LoO'
  return null
}

// The single most relevant outstanding document / data item, phrased for the
// card (e.g. "English score"). English and academic evidence are chased first.
const AWAITING_PHRASE: Record<Requirement['category'], string> = {
  english: 'English score',
  academic: 'academic evidence',
  other: 'financial evidence',
  identity: 'valid passport',
  course: 'programme selection',
}
const AWAITING_PRIORITY: Requirement['category'][] = ['english', 'academic', 'other', 'identity']

export function awaitingItem(app: Application): string | null {
  const candidates = app.requirements.filter(
    (r) =>
      r.category !== 'course' &&
      (r.status === 'missing' || r.status === 'problem' || r.status === 'expiring'),
  )
  if (candidates.length === 0) return null
  candidates.sort(
    (a, b) => AWAITING_PRIORITY.indexOf(a.category) - AWAITING_PRIORITY.indexOf(b.category),
  )
  return AWAITING_PHRASE[candidates[0].category] ?? 'evidence'
}

// The outstanding document items on an application — the evidence gaps an agent
// can resolve by dropping a file. Drives the inline "add documents" panel on
// the board and is ordered so English/academic evidence surfaces first.
export interface OutstandingDoc {
  requirementId: string
  label: string
  category: Requirement['category']
  english: boolean
}

export function outstandingDocs(app: Application): OutstandingDoc[] {
  return app.requirements
    .filter(
      (r) =>
        r.category !== 'course' &&
        (r.status === 'missing' || r.status === 'problem' || r.status === 'expiring'),
    )
    .sort(
      (a, b) => AWAITING_PRIORITY.indexOf(a.category) - AWAITING_PRIORITY.indexOf(b.category),
    )
    .map((r) => ({
      requirementId: r.id,
      label: r.label,
      category: r.category,
      english: r.category === 'english',
    }))
}

// Conditional sub-status: how many conditions remain, or in review if all sent.
export function conditionalPill(app: Application): CardPill {
  const open = app.conditions.filter((c) => c.status === 'open').length
  const submitted = app.conditions.filter((c) => c.status === 'submitted').length
  if (open === 0 && submitted > 0) return { label: 'Conditions in review', tone: 'info' }
  return { label: `${open} condition${open === 1 ? '' : 's'} open`, tone: 'warning' }
}

// In-review sub-status: what admissions is waiting on — docs / info / a decision.
export function reviewNeeds(app: Application): string {
  const docs = app.requirements.filter(
    (r) =>
      r.category !== 'course' &&
      (r.status === 'missing' || r.status === 'problem' || r.status === 'expiring'),
  ).length
  const r = computeReadiness(app)
  const fields = Math.max(0, r.fieldsTotal - r.fieldsDone)
  const parts: string[] = []
  if (docs > 0) parts.push(`${docs} doc${docs === 1 ? '' : 's'}`)
  if (fields > 0) parts.push(`${fields} field${fields === 1 ? '' : 's'}`)
  if (parts.length > 0) return `${parts.join(' + ')} required`
  if (hasPendingSpecial(app)) return 'Admissions decision required'
  return 'Awaiting admissions'
}

// Urgent (danger) vs amber (warning) to-do counts across a set of applications,
// for the To-dos toggle badge.
export function todoCounts(apps: Application[]): { urgent: number; amber: number } {
  let urgent = 0
  let amber = 0
  for (const app of apps) {
    for (const t of appTodos(app)) {
      if (t.tone === 'danger') urgent++
      else if (t.tone === 'warning') amber++
    }
  }
  return { urgent, amber }
}

// ---------------------------------------------------------------------------
// To-dos: what each application is waiting on, in plain language.
// ---------------------------------------------------------------------------

export interface Todo {
  label: string
  waitingOn: string
  tone: Tone
}

const OWNER_LABEL: Record<string, string> = {
  student: 'Student',
  agent: 'You',
  up: 'UP admissions',
}

export type NextOwner = 'Student' | 'You' | 'UP admissions'

// Who owns the next action on this application, for the card's "Next" chip.
export function nextOwner(app: Application): NextOwner {
  if (app.duplicateHold) return 'UP admissions'
  const col = columnFor(app)
  if (col === 'submitted') return 'UP admissions'
  const open = app.conditions.find((c) => c.status === 'open')
  if (open) return (OWNER_LABEL[open.owner] as NextOwner) ?? 'Student'
  if (app.conditions.some((c) => c.status === 'submitted')) return 'UP admissions'
  if (app.requirements.some((r) => r.category !== 'course' && r.status === 'missing')) {
    return 'Student'
  }
  return 'You'
}

export function appTodos(app: Application): Todo[] {
  const todos: Todo[] = []

  if (app.duplicateHold) {
    todos.push({ label: 'Duplicate hold — sales team to clear', waitingOn: 'UP admissions', tone: 'danger' })
  }

  // Pending discount / special-admission requests sit with admissions.
  for (const r of app.requests) {
    if ((r.type === 'discount' || r.type === 'special-admission') && r.status === 'pending') {
      todos.push({
        label: r.type === 'discount' ? `Discount request — ${r.detail}` : `Special admission — ${r.detail}`,
        waitingOn: 'UP admissions',
        tone: 'warning',
      })
    }
  }

  // Open / submitted conditions.
  for (const c of app.conditions) {
    if (c.status === 'open' || c.status === 'submitted') {
      todos.push({
        label: c.label,
        waitingOn: OWNER_LABEL[c.owner] ?? 'Student',
        tone: c.status === 'submitted' ? 'info' : 'warning',
      })
    }
  }

  // Evidence gaps (excluding the programme-selection item).
  for (const r of app.requirements) {
    if (r.category === 'course') continue
    if (r.status === 'problem') {
      todos.push({ label: `${r.label} — problem`, waitingOn: 'You', tone: 'danger' })
    } else if (r.status === 'expiring') {
      todos.push({ label: `${r.label} — expiring`, waitingOn: 'You', tone: 'warning' })
    } else if (r.status === 'missing') {
      todos.push({ label: `${r.label} — awaiting evidence`, waitingOn: 'Student', tone: 'warning' })
    }
  }

  // Data completeness before submission.
  const preSubmit = ['Draft', 'Reviewing', 'Gaps', 'Data', 'Requests'] as Stage[]
  if (preSubmit.includes(app.stage)) {
    const r = computeReadiness(app)
    if (r.fieldsTotal > 0 && r.fieldsDone < r.fieldsTotal) {
      todos.push({
        label: `Complete required data (${r.fieldsDone} of ${r.fieldsTotal} fields)`,
        waitingOn: 'You',
        tone: 'neutral',
      })
    }
  }

  return todos
}

// ---------------------------------------------------------------------------
// Activity feed: every application event flattened and sorted, for the
// chat-style timeline. Each actor renders as a "sender" in the conversation.
// ---------------------------------------------------------------------------

export interface FeedEntry {
  id: string
  appId: string
  studentName: string
  ts: string
  actor: EventActor
  label: string
  detail?: string
  channel: EventChannel
  attachments?: EventAttachment[]
}

// When an event has no explicit channel, infer a sensible default from who
// acted: inbound student/family messages arrive by email, the agent works
// through the platform tool, and AI/admissions actions are internal.
function defaultChannel(actor: EventActor): EventChannel {
  if (actor === 'email') return 'email'
  if (actor === 'agent') return 'agent-tool'
  return 'system'
}

export function buildActivityFeed(apps: Application[]): FeedEntry[] {
  const entries: FeedEntry[] = []
  for (const app of apps) {
    app.events.forEach((e, i) => {
      entries.push({
        id: `${app.id}-${i}`,
        appId: app.id,
        studentName: app.studentName,
        ts: e.ts,
        actor: e.actor,
        label: e.label,
        detail: e.detail,
        channel: e.channel ?? defaultChannel(e.actor),
        attachments: e.attachments,
      })
    })
  }
  return entries.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
}

// Applications grouped for the "by applicant" view, ordered by most recent
// activity first. Each thread carries a preview of its latest engagement.
export interface ThreadSummary {
  appId: string
  studentName: string
  preId: string
  lastTs: string
  lastLabel: string
  lastChannel: EventChannel
  count: number
}

export function buildThreads(apps: Application[]): ThreadSummary[] {
  return apps
    .filter((a) => a.events.length > 0)
    .map((a) => {
      const last = a.events.reduce((m, e) =>
        new Date(e.ts).getTime() > new Date(m.ts).getTime() ? e : m,
      )
      return {
        appId: a.id,
        studentName: a.studentName,
        preId: a.preId,
        lastTs: last.ts,
        lastLabel: last.label,
        lastChannel: last.channel ?? defaultChannel(last.actor),
        count: a.events.length,
      }
    })
    .sort((a, b) => new Date(b.lastTs).getTime() - new Date(a.lastTs).getTime())
}

// How each channel is labelled and coloured in the timeline.
export interface ChannelMeta {
  label: string
  chip: string
}

export const channelMeta: Record<EventChannel, ChannelMeta> = {
  'agent-tool': { label: 'Agent tool', chip: 'bg-muted text-muted-foreground' },
  email: { label: 'Email', chip: 'bg-info/12 text-info' },
  whatsapp: { label: 'WhatsApp', chip: 'bg-success/12 text-success' },
  system: { label: 'Platform', chip: 'bg-ai/12 text-ai' },
}

// How each actor appears in the conversation. "You" (the agent) is the
// right-aligned author; everyone else replies from the left.
export interface SenderMeta {
  name: string
  side: 'left' | 'right'
}

export const senderMeta: Record<EventActor, SenderMeta> = {
  agent: { name: 'You', side: 'right' },
  ai: { name: 'Apply AI', side: 'left' },
  up: { name: 'Mel · UP admissions', side: 'left' },
  email: { name: 'Student / family', side: 'left' },
}
