import type { SalesRecord } from '@/lib/sales'
import type { Audience } from '@/lib/entry-requirements'

// External stakeholders never see student names — only an initialled reference.
export function displayName(r: SalesRecord, audience: Audience): string {
  if (audience !== 'stakeholder') return r.studentName
  const initials = r.studentName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
  return `${initials} · ${r.id.slice(-4).toUpperCase()}`
}

export function appliedIso(r: SalesRecord): string {
  return new Date(Date.now() - r.createdDaysAgo * 86400000).toISOString()
}
