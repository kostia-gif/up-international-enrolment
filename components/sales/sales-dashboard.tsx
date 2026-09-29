'use client'

import { useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Brand } from '@/lib/types'
import type { Audience } from '@/lib/entry-requirements'
import {
  buildRecords,
  byAgency,
  conditionBreakdown,
  filterRecords,
  funnel,
  kpis,
  monthlyApplications,
  scopeRecords,
  visaBreakdown,
  type SalesFilters,
} from '@/lib/sales'
import { AGENCY } from '@/lib/fixtures'
import { AudienceSwitch, AUDIENCES } from './sales-header'
import { KpiStrip } from './kpi-strip'
import { ConversionFunnel } from './conversion-funnel'
import { ApplicationsTrend } from './applications-trend'
import { ConditionsPanel } from './conditions-panel'
import { VisaPanel } from './visa-panel'
import { PipelineLocation } from './pipeline-location'
import { RequirementsLookup } from './requirements-lookup'
import { cn } from '@/lib/utils'

const BRANDS: (Brand | 'all')[] = ['all', 'UPIC', 'NZMA', 'Yoobee', 'NZTC']
const PERIODS: SalesFilters['months'][] = [3, 6, 12]

const TITLE: Record<Audience, string> = {
  internal: 'Sales pipeline — whole business',
  agent: `${AGENCY.name} — pipeline`,
  stakeholder: 'Partner pipeline report',
}

export function SalesDashboard({ audience }: { audience: Audience }) {
  const { applications } = useStore()
  const [filters, setFilters] = useState<SalesFilters>({ months: 12, brand: 'all' })

  const all = useMemo(() => scopeRecords(buildRecords(applications), audience), [applications, audience])
  const records = useMemo(() => filterRecords(all, filters), [all, filters])

  const k = kpis(records)
  const desc = AUDIENCES.find((a) => a.key === audience)!.description

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{TITLE[audience]}</h1>
          <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="size-4" /> {desc}
          </p>
        </div>
        <AudienceSwitch audience={audience} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          label="Period"
          options={PERIODS.map((m) => ({ value: m, label: `${m} months` }))}
          value={filters.months}
          onChange={(months) => setFilters((f) => ({ ...f, months }))}
        />
        <Segmented
          label="Brand"
          options={BRANDS.map((b) => ({ value: b, label: b === 'all' ? 'All brands' : b }))}
          value={filters.brand}
          onChange={(brand) => setFilters((f) => ({ ...f, brand }))}
        />
      </div>

      <KpiStrip k={k} />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ApplicationsTrend data={monthlyApplications(records, filters.months)} />
        </div>
        <div className="lg:col-span-2">
          <ConversionFunnel steps={funnel(records)} />
        </div>
      </div>

      <ConditionsPanel data={conditionBreakdown(records)} audience={audience} />

      <div className="grid gap-5 lg:grid-cols-2">
        <VisaPanel data={visaBreakdown(records)} />
        {audience === 'internal' ? <AgencyTable records={records} /> : <RequirementsLookup audience={audience} />}
      </div>

      <PipelineLocation records={records} audience={audience} />

      {audience === 'internal' && <RequirementsLookup audience={audience} />}
    </main>
  )
}

function AgencyTable({ records }: { records: Parameters<typeof byAgency>[0] }) {
  const rows = byAgency(records)
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">By agency</h2>
        <p className="text-xs text-muted-foreground">Volume, unfinished applications, open conditions and conversion per partner.</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Agency</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Apps</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Unfinished</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Conditions</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-3 py-2">
                  <span className="block font-medium">{a.name}</span>
                  <span className="text-[10px] text-muted-foreground">{a.region}</span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{a.total}</td>
                <td className="px-3 py-2 text-right tabular-nums">{a.unfinished}</td>
                <td className={cn('px-3 py-2 text-right tabular-nums', a.conditions > 5 && 'font-semibold text-warning')}>
                  {a.conditions}
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full bg-primary" style={{ width: `${a.conversion}%` }} />
                    </span>
                    <span className="w-8 tabular-nums">{a.conversion}%</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            o.value === value ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
