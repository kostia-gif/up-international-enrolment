import {
  ClipboardList,
  Plane,
  Building2,
  ClipboardCheck,
  Search,
  CircleCheck,
  Users,
  Clock,
  FileWarning,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import {
  IC_SUMMARY,
  IC_METRICS,
  SCHOOL_FOLLOW_UPS,
} from '@/lib/internal-control'
import { cn } from '@/lib/utils'

const CARDS: { label: string; value: number; icon: LucideIcon; tone: string }[] = [
  { label: 'Selected for audit', value: IC_SUMMARY.selected, icon: ClipboardList, tone: 'text-ai' },
  { label: 'Awaiting student arrival', value: IC_SUMMARY.awaitingArrival, icon: Plane, tone: 'text-info' },
  { label: 'Waiting on school', value: IC_SUMMARY.waitingSchool, icon: Building2, tone: 'text-warning' },
  { label: 'Ready for audit', value: IC_SUMMARY.ready, icon: ClipboardCheck, tone: 'text-info' },
  { label: 'Under review', value: IC_SUMMARY.underReview, icon: Search, tone: 'text-ai' },
  { label: 'Completed', value: IC_SUMMARY.completed, icon: CircleCheck, tone: 'text-success' },
]

export function IcSummaryCards() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {CARDS.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
          <c.icon className={cn('size-4', c.tone)} />
          <p className="mt-2 text-2xl font-semibold tabular-nums leading-none">{c.value}</p>
          <p className="mt-1.5 text-[11px] font-medium leading-tight text-muted-foreground">
            {c.label}
          </p>
        </div>
      ))}
    </div>
  )
}

const METRICS: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
  {
    label: 'Audit population',
    value: `${IC_SUMMARY.population} unconditional`,
    icon: Users,
    tone: 'text-foreground',
  },
  {
    label: 'Avg days waiting for school',
    value: `${IC_METRICS.avgDaysWaitingSchool} days`,
    icon: Clock,
    tone: 'text-warning',
  },
  {
    label: 'Missing visa records',
    value: String(IC_METRICS.missingVisaRecords),
    icon: FileWarning,
    tone: 'text-warning',
  },
  {
    label: 'Missing insurance records',
    value: String(IC_METRICS.missingInsuranceRecords),
    icon: FileWarning,
    tone: 'text-warning',
  },
  {
    label: 'SMS updates outstanding',
    value: String(IC_METRICS.smsUpdatesOutstanding),
    icon: ShieldAlert,
    tone: 'text-destructive',
  },
]

export function IcMetrics() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <h2 className="text-sm font-semibold">Audit metrics</h2>
      <p className="text-[11px] text-muted-foreground">
        {IC_SUMMARY.selected} of {IC_SUMMARY.population} unconditional applications selected · 20%
        sample
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-secondary/40 p-3">
            <m.icon className={cn('size-4', m.tone)} />
            <p className="mt-2 text-base font-semibold leading-tight text-pretty">{m.value}</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function IcSchoolFollowUps() {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-warning/12 text-warning">
          <Building2 className="size-3.5" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-tight">School follow-ups</h2>
          <p className="text-[11px] text-muted-foreground">
            Where the process is breaking down operationally
          </p>
        </div>
      </div>
      <ul className="mt-3 flex flex-col divide-y divide-border">
        {SCHOOL_FOLLOW_UPS.map((s) => (
          <li key={s.school} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.school}</p>
              <p className="text-[11px] text-muted-foreground">
                {s.studentsImpacted} student{s.studentsImpacted === 1 ? '' : 's'} impacted
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-warning">{s.outstanding}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">outstanding</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">{s.oldestDays}d</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">oldest</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
