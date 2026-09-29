import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Flag } from 'lucide-react'
import { getAuditRecord, AUDIT_RECORDS } from '@/lib/internal-control'
import { formatDate } from '@/lib/format'
import { IcHeader } from '@/components/internal-control/ic-header'
import { IcStatusBadge } from '@/components/internal-control/ic-status-badge'
import { EvidenceStatus, EvidenceGroups } from '@/components/internal-control/evidence-columns'
import { AuditChecklist } from '@/components/internal-control/audit-checklist'
import { ComparisonTable } from '@/components/internal-control/comparison-table'
import { SmsRecord } from '@/components/internal-control/sms-record'
import { ExceptionsPanel } from '@/components/internal-control/exceptions-panel'
import { AuditTimeline } from '@/components/internal-control/audit-timeline'
import { SchoolRequestPanel } from '@/components/internal-control/school-request'
import { DecisionPanel } from '@/components/internal-control/decision-panel'
import { ProcessControls } from '@/components/internal-control/process-controls'

export function generateStaticParams() {
  return AUDIT_RECORDS.map((r) => ({ id: r.id }))
}

export default async function AuditRecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const record = getAuditRecord(id)
  if (!record) notFound()

  const meta = [
    { label: 'Application', value: record.applicationId },
    { label: 'Student ID', value: record.studentId ?? '—' },
    { label: 'DOB', value: formatDate(record.dob) },
    { label: 'Nationality', value: record.nationality },
    { label: 'Passport', value: record.passport },
    { label: 'Intake', value: record.intake },
    { label: 'Programme start', value: formatDate(record.programmeStart) },
    { label: 'Auditor', value: record.auditor },
  ]

  return (
    <div className="min-h-screen">
      <IcHeader />

      {/* Record header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
          <Link
            href="/internal-control"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to audit queue
          </Link>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg font-semibold tracking-tight">{record.studentName}</h1>
                <IcStatusBadge status={record.status} />
                <span className="inline-flex items-center gap-1 rounded-full border border-ai/25 bg-ai/12 px-2 py-0.5 text-[11px] font-medium text-ai">
                  <Flag className="size-3" />
                  20% audit sample
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                <span className="font-medium text-foreground/80">{record.school}</span> ·{' '}
                {record.programme} · {record.campus}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Offer status
              </p>
              <p className="text-sm font-semibold text-success">{record.offerStatus}</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 lg:grid-cols-8">
            {meta.map((m) => (
              <div key={m.label} className="min-w-0">
                <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </dt>
                <dd className="truncate text-xs font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <EvidenceStatus record={record} />

        <div className="mt-4">
          <ProcessControls recordId={record.id} />
        </div>

        {/* Three-column audit workspace */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)_minmax(0,1.1fr)]">
          {/* Left — checklist */}
          <div className="flex flex-col gap-4">
            <AuditChecklist record={record} />
          </div>

          {/* Centre — comparison & discrepancies */}
          <div className="flex flex-col gap-4">
            <ComparisonTable record={record} />
            <ExceptionsPanel record={record} />
          </div>

          {/* Right — original & final evidence */}
          <EvidenceGroups record={record} />
        </div>

        {/* Full-width sections */}
        <div className="mt-4">
          <SmsRecord record={record} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <DecisionPanel record={record} />
            <SchoolRequestPanel record={record} />
          </div>
          <AuditTimeline record={record} />
        </div>
      </main>
    </div>
  )
}
