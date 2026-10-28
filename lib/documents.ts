import type { Application, AppEvent, Condition, Document, OfferLetter, OfferLetterKind } from './types'
import { hasOffer, isUnconditional } from './dashboard'

export const OFFER_KIND_LABEL: Record<OfferLetterKind, string> = {
  'agent-conditional': 'Conditional offer (agent issued)',
  'up-conditional': 'Conditional offer with pricing',
  unconditional: 'Unconditional offer',
}

const findEventTs = (app: Application, pattern: RegExp) =>
  [...app.events].reverse().find((e) => pattern.test(e.label))?.ts

// Offer letter history, oldest first. Fixtures and future CRM data supply an
// explicit list; otherwise one is derived from the stage so every offer shows.
export function offerLetters(app: Application): OfferLetter[] {
  if (app.offerLetters?.length) return app.offerLetters
  if (!hasOffer(app)) return []

  const openConditions = app.conditions.filter((c) => c.status !== 'cleared').map((c) => c.label)
  const allConditions = app.conditions.map((c) => c.label)
  const firstTs =
    findEventTs(app, /conditional offer|submitted with conditional/i) ?? app.crmPushedAt ?? app.createdAt
  const letters: OfferLetter[] = [
    {
      id: `${app.id}-loo-1`,
      kind: app.looIssuedBy === 'agent' ? 'agent-conditional' : 'up-conditional',
      issuedAt: firstTs,
      issuedBy: app.looIssuedBy === 'agent' ? app.issuingAgent?.name ?? 'Agent' : 'UP Admissions',
      includesPricing: app.looIssuedBy !== 'agent',
      conditions: isUnconditional(app) ? allConditions : openConditions,
    },
  ]
  if (isUnconditional(app)) {
    letters.push({
      id: `${app.id}-loo-2`,
      kind: 'unconditional',
      issuedAt: findEventTs(app, /unconditional offer/i) ?? firstTs,
      issuedBy: 'UP Admissions',
      includesPricing: true,
      conditions: [],
    })
  }
  return letters
}

// Documents that prove entry requirements vs. anything else collected later.
const CORE_TYPES = new Set(['Passport', 'Transcript', 'EnglishTest', 'FinancialEvidence', 'Financial'])

export function isSupporting(d: Document): boolean {
  return !CORE_TYPES.has(d.type)
}

export const DOC_TYPE_LABEL: Record<string, string> = {
  Passport: 'Passport',
  Transcript: 'Academic transcript',
  EnglishTest: 'English test result',
  FinancialEvidence: 'Financial evidence',
  Financial: 'Financial evidence',
  Medical: 'Medical certificate',
  PoliceCertificate: 'Police certificate',
  CV: 'CV',
  Reference: 'Reference letter',
  Supporting: 'Supporting evidence',
  Other: 'Other',
}

export const docTypeLabel = (type: string) => DOC_TYPE_LABEL[type] ?? type

// Only items from UP or the system count as new; the agent's own actions don't.
export function isNewEvent(e: AppEvent, viewedAt?: string): boolean {
  return !!viewedAt && e.actor !== 'agent' && e.ts > viewedAt
}

export function isNewDocument(d: Document, viewedAt?: string): boolean {
  return !!viewedAt && !!d.addedAt && d.addedAt > viewedAt
}

export function isNewOffer(l: OfferLetter, viewedAt?: string): boolean {
  return !!viewedAt && l.kind !== 'agent-conditional' && l.issuedAt > viewedAt
}

export interface ChecklistItem {
  id: string
  document: string
  detail: string
  owner: Condition['owner']
  state: 'received' | 'with-up' | 'outstanding'
  dueBy?: string
}

const CONDITION_DOCUMENT: [RegExp, string][] = [
  [/english|ielts|pte|toefl/i, 'English test result'],
  [/transcript|completion|graduat/i, 'Final academic transcript'],
  [/medical|x-ray|health/i, 'Medical certificate'],
  [/police|character/i, 'Police certificate'],
  [/financ|funds|bank/i, 'Proof of funds'],
  [/passport/i, 'Passport'],
]

function documentFor(c: Condition): string {
  return CONDITION_DOCUMENT.find(([re]) => re.test(c.label))?.[1] ?? c.label
}

// What the agent still has to provide for an unconditional offer. UP's own
// steps (e.g. the admissions sign-off) apply to every application, so they're left out.
export function unconditionalChecklist(app: Application): ChecklistItem[] {
  return app.conditions
    .filter((c) => c.owner !== 'up')
    .map((c) => ({
      id: c.id,
      document: documentFor(c),
      detail: c.label,
      owner: c.owner,
      dueBy: c.dueBy,
      state: c.status === 'cleared' ? 'received' : c.status === 'submitted' ? 'with-up' : 'outstanding',
    }))
}

export type ActivityCategory = 'unconditional-offer' | 'conditional-offer' | 'document' | 'message' | 'update'

export const ACTIVITY_CATEGORIES: { key: ActivityCategory; label: string }[] = [
  { key: 'unconditional-offer', label: 'Unconditional offer' },
  { key: 'conditional-offer', label: 'Conditional offer' },
  { key: 'document', label: 'New document' },
  { key: 'message', label: 'Message from UP' },
  { key: 'update', label: 'Status update' },
]

export interface NewActivityItem {
  category: ActivityCategory
  label: string
  ts: string
}

// Everything UP or the system added since the agent last opened the application.
// Offers lead because they change what the agent does next; the rest is newest first.
export function newActivity(app: Application): NewActivityItem[] {
  const viewedAt = app.activityViewedAt
  const items: NewActivityItem[] = []

  for (const l of offerLetters(app)) {
    if (isNewOffer(l, viewedAt) || (l.kind === 'up-conditional' && newUpConditionalOffer(app) === l)) {
      items.push({
        category: l.kind === 'unconditional' ? 'unconditional-offer' : 'conditional-offer',
        label: l.kind === 'unconditional' ? 'Unconditional offer issued' : 'Conditional offer from UP',
        ts: l.issuedAt,
      })
    }
  }
  for (const d of app.documents) {
    if (isNewDocument(d, viewedAt)) {
      items.push({ category: 'document', label: `${docTypeLabel(d.type)} added`, ts: d.addedAt! })
    }
  }
  for (const e of app.events) {
    // Document events duplicate the file and offer entries above.
    if (!isNewEvent(e, viewedAt) || e.kind === 'document' || /offer/i.test(e.label)) continue
    items.push({ category: e.kind === 'comms' ? 'message' : 'update', label: e.label, ts: e.ts })
  }
  if (items.length === 0 && app.unseenUpdate && app.unseenUpdate !== NEW_UP_OFFER_UPDATE) {
    items.push({ category: 'update', label: app.unseenUpdate, ts: '' })
  }
  const isOffer = (i: NewActivityItem) => i.category.endsWith('-offer')
  return items.sort((a, b) => Number(isOffer(b)) - Number(isOffer(a)) || b.ts.localeCompare(a.ts))
}

export const NEW_UP_OFFER_UPDATE = 'New conditional offer from UP'

// The latest conditional offer UP issued on the agent's behalf, if the agent hasn't seen it yet.
export function newUpConditionalOffer(app: Application, viewedAt = app.activityViewedAt): OfferLetter | undefined {
  if (app.stage !== 'Conditional offer') return undefined
  const latest = [...offerLetters(app)].reverse().find((l) => l.kind === 'up-conditional')
  if (!latest) return undefined
  return isNewOffer(latest, viewedAt) || app.unseenUpdate === NEW_UP_OFFER_UPDATE ? latest : undefined
}
