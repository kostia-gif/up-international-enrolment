import type { Application } from './types'

export function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short' })
}

export function formatDateTime(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function relativeTime(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

// Short programme label for cards: strips the parenthetical and truncates.
export function shortProgramme(name: string): string {
  const base = name.replace(/\s*\(.*?\)\s*/g, ' ').trim()
  return base
}

export interface CardBadge {
  label: string
  tone: 'ai' | 'info' | 'warning' | 'danger' | 'neutral'
}

export function pipelineBadges(app: Application): CardBadge[] {
  const badges: CardBadge[] = []
  if (app.duplicateHold) badges.push({ label: 'On hold', tone: 'danger' })
  if (app.route === 'auto' && !app.duplicateHold)
    badges.push({ label: 'Auto LOO', tone: 'ai' })
  if (app.route === 'review') badges.push({ label: 'In review', tone: 'info' })
  if (app.requests.some((r) => r.type === 'special-admission'))
    badges.push({ label: 'Special admission', tone: 'warning' })
  if (app.events.some((e) => e.actor === 'email'))
    badges.push({ label: 'Email captured', tone: 'neutral' })
  if (app.requirements.some((r) => r.status === 'expiring'))
    badges.push({ label: 'Expiring', tone: 'warning' })
  return badges
}
