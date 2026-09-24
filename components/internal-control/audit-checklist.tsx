import {
  UserCheck,
  BookUser,
  Stamp,
  ShieldCheck,
  CalendarClock,
  Database,
  CircleCheck,
  CircleAlert,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react'
import type { AuditRecord } from '@/lib/internal-control'
import { cn } from '@/lib/utils'

type CheckTone = 'ok' | 'review' | 'missing'

interface CheckItem {
  label: string
  icon: LucideIcon
  detail: string
  tone: CheckTone
}

function toneIcon(tone: CheckTone) {
  if (tone === 'ok') return CircleCheck
  if (tone === 'review') return CircleAlert
  return CircleDashed
}

function toneColor(tone: CheckTone) {
  if (tone === 'ok') return 'text-success'
  if (tone === 'review') return 'text-warning'
  return 'text-destructive'
}

// Derive the six audit checks from the record's comparison, exceptions and
// evidence so the checklist reflects the actual state of the audit.
function buildChecks(record: AuditRecord): CheckItem[] {
  const ex = record.exceptions
  const has = (t: string) => ex.some((e) => e.type === t)
  const row = (field: string) => record.comparison.find((c) => c.field === field)

  const identity: CheckTone = has('data-mismatch') ? 'review' : 'ok'
  const passport: CheckTone =
    row('Passport')?.result === 'mismatch'
      ? 'review'
      : row('Passport')?.result === 'confirmed'
        ? 'ok'
        : 'missing'
  const visa: CheckTone =
    record.visaStatus === 'available'
      ? has('visa-condition')
        ? 'review'
        : 'ok'
      : 'missing'
  const insurance: CheckTone =
    record.insuranceStatus !== 'available' ? 'missing' : has('coverage-issue') ? 'review' : 'ok'
  const startDate: CheckTone = has('date-discrepancy')
    ? 'review'
    : row('Start date')?.result === 'confirmed'
      ? 'ok'
      : 'missing'
  const sms: CheckTone = has('sms-missing')
    ? 'review'
    : record.smsRecord.some((s) => s.state === 'missing')
      ? 'missing'
      : 'ok'

  return [
    {
      label: 'Identity',
      icon: UserCheck,
      detail: 'Name, DOB, nationality across application, passport, visa & SMS',
      tone: identity,
    },
    {
      label: 'Passport',
      icon: BookUser,
      detail: 'Belongs to student, matches application & visa, remains valid',
      tone: passport,
    },
    {
      label: 'Visa',
      icon: Stamp,
      detail: 'Holder, provider, programme & dates vs Offer of Place',
      tone: visa,
    },
    {
      label: 'Insurance',
      icon: ShieldCheck,
      detail: 'Insurer, policy & dates cover the full study period',
      tone: insurance,
    },
    {
      label: 'Start date',
      icon: CalendarClock,
      detail: 'Application, Offer, visa & SMS actual start align',
      tone: startDate,
    },
    {
      label: 'SMS record',
      icon: Database,
      detail: 'School has correctly recorded the final information',
      tone: sms,
    },
  ]
}

export function AuditChecklist({ record }: { record: AuditRecord }) {
  const checks = buildChecks(record)
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">Audit checklist</h2>
      <p className="text-[11px] text-muted-foreground">Six checks Internal Control must confirm</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {checks.map((c) => {
          const StatusIcon = toneIcon(c.tone)
          return (
            <li
              key={c.label}
              className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-secondary/30 p-2.5"
            >
              <c.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium">{c.label}</p>
                  <StatusIcon className={cn('size-4 shrink-0', toneColor(c.tone))} aria-hidden />
                </div>
                <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground text-pretty">
                  {c.detail}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
