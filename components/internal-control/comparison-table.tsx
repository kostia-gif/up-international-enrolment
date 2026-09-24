import { ArrowRight } from 'lucide-react'
import type { AuditRecord, DateRange } from '@/lib/internal-control'
import { compareMeta, assessCoverage } from '@/lib/internal-control'
import { toneBadge, toneDot } from '@/lib/status'
import { formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'

export function ComparisonTable({ record }: { record: AuditRecord }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">Comparison &amp; discrepancies</h2>
      <p className="text-[11px] text-muted-foreground">
        Admissions record vs final verified evidence, field by field
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_auto] bg-secondary/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Field</span>
          <span>Admissions</span>
          <span>Final evidence</span>
          <span className="text-right">Result</span>
        </div>
        <ul className="divide-y divide-border">
          {record.comparison.map((row) => {
            const meta = compareMeta[row.result]
            return (
              <li
                key={row.field}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_auto] items-center gap-2 px-3 py-2"
              >
                <span className="text-[11px] font-medium text-muted-foreground">{row.field}</span>
                <span className="truncate text-xs">{row.admissions}</span>
                <span
                  className={cn(
                    'truncate text-xs',
                    row.result === 'mismatch' || row.result === 'review'
                      ? 'font-medium text-foreground'
                      : '',
                  )}
                >
                  {row.final}
                </span>
                <span
                  className={cn(
                    'ml-auto inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
                    toneBadge[meta.tone],
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', toneDot[meta.tone])} aria-hidden />
                  {meta.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <DateCoverage record={record} />
    </section>
  )
}

function TimelineBar({
  label,
  range,
  min,
  span,
  tone,
}: {
  label: string
  range: DateRange | undefined
  min: number
  span: number
  tone: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="relative h-4 flex-1 rounded bg-secondary/60">
        {range ? (
          (() => {
            const left = ((new Date(range.start).getTime() - min) / span) * 100
            const width =
              ((new Date(range.end).getTime() - new Date(range.start).getTime()) / span) * 100
            return (
              <div
                className={cn('absolute inset-y-0 rounded', tone)}
                style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
                title={`${formatShortDate(range.start)} – ${formatShortDate(range.end)}`}
              />
            )
          })()
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[10px] text-muted-foreground">
            Not supplied
          </span>
        )}
      </div>
    </div>
  )
}

function DateCoverage({ record }: { record: AuditRecord }) {
  // Overall window spans the earliest start to the latest end across all ranges.
  const ranges = [record.study, record.visa, record.insurance].filter(Boolean) as DateRange[]
  const starts = ranges.map((r) => new Date(r.start).getTime())
  const ends = ranges.map((r) => new Date(r.end).getTime())
  const min = Math.min(...starts)
  const max = Math.max(...ends)
  const span = max - min || 1
  const coverage = assessCoverage(record)

  // Position of the study start line, to make coverage gaps visible.
  const studyStartPct = ((new Date(record.study.start).getTime() - min) / span) * 100

  return (
    <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold">Date coverage</h3>
        <span
          className={cn(
            'rounded-full border px-2 py-0.5 text-[10px] font-medium',
            coverage.ok
              ? 'border-success/25 bg-success/12 text-success'
              : 'border-warning/25 bg-warning/12 text-warning',
          )}
        >
          {coverage.ok ? 'Study period fully covered' : 'Coverage needs review'}
        </span>
      </div>

      <div className="relative mt-3 flex flex-col gap-1.5">
        {/* Study start marker */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-foreground/30"
          style={{ left: `calc(4rem + 0.5rem + ${studyStartPct}% * 0.72)` }}
          aria-hidden
        />
        <TimelineBar label="Study" range={record.study} min={min} span={span} tone="bg-primary/70" />
        <TimelineBar label="Visa" range={record.visa} min={min} span={span} tone="bg-info/70" />
        <TimelineBar
          label="Insurance"
          range={record.insurance}
          min={min}
          span={span}
          tone="bg-ai/70"
        />
      </div>

      {coverage.issues.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {coverage.issues.map((issue) => (
            <li key={issue} className="flex items-start gap-1.5 text-[11px] text-warning">
              <ArrowRight className="mt-0.5 size-3 shrink-0" aria-hidden />
              {issue}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
