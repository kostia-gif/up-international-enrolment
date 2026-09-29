'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import {
  LOCATIONS,
  holdLabel,
  locationCounts,
  locationOf,
  type Location,
  type SalesRecord,
} from '@/lib/sales'
import type { Audience } from '@/lib/entry-requirements'
import { toneBadge, toneDot } from '@/lib/status'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { appliedIso, displayName } from './display'

export function PipelineLocation({ records, audience }: { records: SalesRecord[]; audience: Audience }) {
  const counts = locationCounts(records)
  const [selected, setSelected] = useState<Location | 'all'>('hold')
  const total = Math.max(1, records.length)

  const rows = records
    .filter((r) => selected === 'all' || locationOf(r) === selected)
    .sort((a, b) => Number(Boolean(b.hold)) - Number(Boolean(a.hold)) || a.createdDaysAgo - b.createdDaysAgo)
    .slice(0, 12)

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">Where applications are sitting</h2>
        <p className="text-xs text-muted-foreground">
          Live position in the process. Reviews that admissions saved & closed appear as on hold with the reason they stopped.
        </p>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Applications by location">
        {counts.map((c) =>
          c.count ? (
            <div key={c.key} className={toneDot[c.tone]} style={{ width: `${(c.count / total) * 100}%` }} />
          ) : null,
        )}
      </div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by location">
        <FilterChip active={selected === 'all'} onClick={() => setSelected('all')} label="All" count={records.length} />
        {counts.map((c) => (
          <FilterChip
            key={c.key}
            active={selected === c.key}
            onClick={() => setSelected(c.key)}
            label={c.label}
            count={c.count}
            dot={toneDot[c.tone]}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Student</th>
              {audience === 'internal' && <th scope="col" className="px-3 py-2 font-medium">Agency</th>}
              <th scope="col" className="px-3 py-2 font-medium">Programme</th>
              <th scope="col" className="px-3 py-2 font-medium">Applied</th>
              <th scope="col" className="px-3 py-2 font-medium">Sitting with</th>
              <th scope="col" className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  No applications here right now.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const loc = LOCATIONS.find((l) => l.key === locationOf(r))!
              const hold = holdLabel(r, audience)
              const canOpen = audience === 'internal' && r.appId
              return (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">
                    {canOpen ? (
                      <Link
                        href={`/admissions/${r.appId}/review`}
                        className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
                      >
                        {displayName(r, audience)}
                        <ArrowUpRight className="size-3" />
                      </Link>
                    ) : (
                      displayName(r, audience)
                    )}
                    {r.live && (
                      <span className="ml-1.5 rounded bg-primary/10 px-1 py-0.5 text-[9px] font-semibold uppercase text-primary">
                        Live
                      </span>
                    )}
                  </td>
                  {audience === 'internal' && <td className="px-3 py-2 text-muted-foreground">{r.agencyName}</td>}
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.brand} · {r.programme}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">{formatShortDate(appliedIso(r))}</td>
                  <td className="px-3 py-2 text-muted-foreground">{loc.owner}</td>
                  <td className="px-3 py-2">
                    <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium', toneBadge[loc.tone])}>
                      {hold ?? loc.label}
                    </span>
                    {audience === 'internal' && r.hold && (
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        Stopped at {r.hold.step}
                        {r.hold.note ? ` — ${r.hold.note}` : ''}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  dot,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  dot?: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        active ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-secondary',
      )}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dot)} aria-hidden />}
      {label}
      <span className="tabular-nums text-muted-foreground">{count}</span>
    </button>
  )
}
