import Link from 'next/link'
import { LayoutGrid, TrendingUp } from 'lucide-react'
import type { Audience } from '@/lib/entry-requirements'
import { AGENCY } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const AUDIENCES: { key: Audience; label: string; description: string }[] = [
  { key: 'internal', label: 'Internal sales', description: 'Whole business, every agency, internal notes' },
  { key: 'agent', label: 'Agent view', description: `${AGENCY.name} applications only` },
  { key: 'stakeholder', label: 'External stakeholder', description: 'Anonymised business-level figures' },
]

const PERSONA: Record<Audience, { name: string; role: string; initials: string }> = {
  internal: { name: 'Sam Rivera', role: 'Head of Sales', initials: 'SR' },
  agent: { name: AGENCY.name, role: 'Partner agency', initials: 'AG' },
  stakeholder: { name: 'Partner report', role: 'External stakeholder', initials: 'EX' },
}

export function SalesHeader({ audience }: { audience: Audience }) {
  const persona = PERSONA[audience]
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[oklch(0.22_0.05_220)] via-brand to-[oklch(0.3_0.07_200)] text-brand-foreground">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href={`/sales?view=${audience}`} className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-[oklch(0.55_0.2_27)] text-base font-black leading-none tracking-tight text-white shadow-sm">
            UP
          </span>
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-sm font-semibold tracking-tight">Apply Platform</span>
            <span className="h-3.5 w-px bg-white/25" aria-hidden />
            <span className="inline-flex items-center gap-1 text-xs text-brand-foreground/70">
              <TrendingUp className="size-3.5" />
              Sales pipeline
            </span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-foreground lg:inline-flex"
          >
            <LayoutGrid className="size-3.5" />
            Switch portal
          </Link>
          <span className="hidden text-right leading-tight sm:block">
            <span className="block text-sm font-medium">{persona.name}</span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-brand-foreground/70">
              {persona.role}
            </span>
          </span>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/20 text-xs font-semibold ring-2 ring-white/30">
            {persona.initials}
          </span>
        </div>
      </div>
    </header>
  )
}

export function AudienceSwitch({ audience }: { audience: Audience }) {
  return (
    <nav aria-label="Audience" className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
      {AUDIENCES.map((a) => {
        const active = a.key === audience
        return (
          <Link
            key={a.key}
            href={`/sales?view=${a.key}`}
            aria-current={active ? 'page' : undefined}
            title={a.description}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}
          >
            {a.label}
          </Link>
        )
      })}
    </nav>
  )
}
