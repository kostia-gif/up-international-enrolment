'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import {
  COUNTRY_REQUIREMENTS,
  ENGLISH_REQUIREMENT,
  INTERNATIONAL_QUALIFICATIONS,
  KEY_SUBJECTS,
  PROGRAMMES,
  requirementFor,
  type Audience,
} from '@/lib/entry-requirements'
import { cn } from '@/lib/utils'

export function RequirementsLookup({ audience }: { audience: Audience }) {
  const [country, setCountry] = useState('India')
  const row = COUNTRY_REQUIREMENTS.find((r) => r.country === country) ?? COUNTRY_REQUIREMENTS[0]

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Entry requirements — NZ Pre-Foundation</h2>
          <p className="text-xs text-muted-foreground">
            {audience === 'internal'
              ? 'Internal guideline shown. Agents and stakeholders see the external Foundation Connect version.'
              : 'Published entry requirements by country of study.'}
          </p>
        </div>
        <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
          Country
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
          >
            {COUNTRY_REQUIREMENTS.map((r) => (
              <option key={r.country} value={r.country}>
                {r.country}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {PROGRAMMES.map((p) => {
          const req = requirementFor(row, p.key, audience)
          const externalDiffers =
            audience === 'internal' && p.key === 'foundationConnect' && row.fcExternal !== row.fcInternal
          return (
            <div key={p.key} className="flex flex-col gap-2 rounded-lg border border-border p-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold">{p.name}</span>
                {p.note && <span className="text-[10px] text-muted-foreground">{p.note}</span>}
              </div>
              <p className={cn('text-xs leading-relaxed', req.deferred && 'italic text-muted-foreground')}>{req.text}</p>
              {externalDiffers && (
                <p className="mt-auto flex items-start gap-1.5 border-t border-border pt-2 text-[10px] leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 size-3 shrink-0" />
                  External version: {row.fcExternal ?? 'Please contact admissions for assessment'}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <dl className="grid gap-2 text-xs md:grid-cols-2">
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="font-medium">English (all programmes)</dt>
          <dd className="text-muted-foreground">{ENGLISH_REQUIREMENT}</dd>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <dt className="font-medium">Key subjects</dt>
          <dd className="text-muted-foreground">{KEY_SUBJECTS}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-1.5">
        {INTERNATIONAL_QUALIFICATIONS.map((q) => (
          <span key={q.name} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
            {q.name}
            {q.foundationConnect ? ' · accepted for FC' : ''}
          </span>
        ))}
      </div>
    </section>
  )
}
