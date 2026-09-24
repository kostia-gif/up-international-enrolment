'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, User } from 'lucide-react'
import {
  AUDIT_RECORDS,
  QUEUE_TABS,
  sortedQueue,
  type QueueTab,
  type AuditRecord,
} from '@/lib/internal-control'
import { formatDate } from '@/lib/format'
import { IcStatusBadge } from './ic-status-badge'
import { cn } from '@/lib/utils'

function EvidenceDot({ label, state }: { label: string; state: AuditRecord['visaStatus'] }) {
  const tone =
    state === 'available'
      ? 'bg-success'
      : state === 'different'
        ? 'bg-warning'
        : 'bg-destructive'
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <span className={cn('size-1.5 rounded-full', tone)} aria-hidden />
      {label}
    </span>
  )
}

function QueueRow({ record }: { record: AuditRecord }) {
  return (
    <Link
      href={`/internal-control/${record.id}`}
      className="group grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.6fr)_auto]"
    >
      {/* Student + programme */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{record.studentName}</p>
          {record.missing.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-warning/25 bg-warning/12 px-1.5 py-0.5 text-[10px] font-medium text-warning">
              <AlertTriangle className="size-3" aria-hidden />
              {record.missing.join(' · ')}
            </span>
          )}
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground/80">{record.school}</span>
          <span aria-hidden>·</span>
          <span className="text-pretty">{record.programme}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {record.applicationId}
          {record.studentId ? ` · ${record.studentId}` : ''} · Start{' '}
          {formatDate(record.programmeStart)}
        </p>
      </div>

      {/* Evidence + auditor */}
      <div className="flex flex-col justify-center gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <EvidenceDot label="Visa" state={record.visaStatus} />
          <EvidenceDot label="Insurance" state={record.insuranceStatus} />
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" aria-hidden />
            Offer {record.offerStatus}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <User className="size-3" aria-hidden />
          {record.auditor}
        </span>
      </div>

      {/* Status + days */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2.5 md:flex-col md:items-end md:justify-center md:border-l md:border-t-0 md:pl-4 md:pt-0">
        <IcStatusBadge status={record.status} />
        <div className="flex items-center gap-2 text-right">
          <span
            className={cn(
              'text-[11px] font-medium tabular-nums',
              record.daysOutstanding > 7
                ? 'text-destructive'
                : record.daysOutstanding > 0
                  ? 'text-warning'
                  : 'text-muted-foreground',
            )}
          >
            {record.daysOutstanding === 0
              ? 'Closed'
              : `${record.daysOutstanding}d outstanding`}
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  )
}

export function IcQueue() {
  const [tab, setTab] = useState<QueueTab>('all')
  const activeTab = QUEUE_TABS.find((t) => t.id === tab)!
  const rows = sortedQueue(AUDIT_RECORDS.filter((r) => activeTab.match(r.status)))

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Audit queue</h2>
          <p className="text-[11px] text-muted-foreground">
            Prioritised by what needs action today — queries and ready-for-audit first
          </p>
        </div>
      </div>

      <div
        className="mt-3 flex flex-wrap gap-1.5 border-b border-border pb-2.5"
        role="tablist"
        aria-label="Audit queue filters"
      >
        {QUEUE_TABS.map((t) => {
          const count = AUDIT_RECORDS.filter((r) => t.match(r.status)).length
          const active = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {t.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] tabular-nums',
                  active ? 'bg-primary-foreground/20' : 'bg-muted-foreground/15',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {rows.map((r) => (
          <QueueRow key={r.id} record={r} />
        ))}
        {rows.length === 0 && (
          <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-xs text-muted-foreground">
            No records in this view.
          </p>
        )}
      </div>
    </section>
  )
}
