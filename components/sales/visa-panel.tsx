import { VISA_LABEL, VISA_TONE, type visaBreakdown } from '@/lib/sales'
import { toneDot } from '@/lib/status'
import { cn } from '@/lib/utils'

type Visa = ReturnType<typeof visaBreakdown>

export function VisaPanel({ data }: { data: Visa }) {
  const total = Math.max(1, data.statuses.reduce((s, x) => s + x.count, 0))
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">Student visas — Immigration NZ</h2>
        <p className="text-xs text-muted-foreground">Visa outcomes for offered students, synced from INZ status updates.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Pending with INZ" value={data.pending} />
        <Stat label="Avg days with INZ" value={data.avgDaysWithInz} />
        <Stat label="Approval rate" value={`${data.approvalRate}%`} hint={`${data.decided} decided`} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label="Visa status split">
          {data.statuses.map((s) =>
            s.count ? (
              <div
                key={s.status}
                className={toneDot[VISA_TONE[s.status]]}
                style={{ width: `${(s.count / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {data.statuses.map((s) => (
            <li key={s.status} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={cn('size-2 rounded-full', toneDot[VISA_TONE[s.status]])} aria-hidden />
              {VISA_LABEL[s.status]} <span className="font-semibold tabular-nums text-foreground">{s.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Nationality</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Pending</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Approved</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">Declined</th>
              <th scope="col" className="px-3 py-2 text-right font-medium">INZ decline rate</th>
            </tr>
          </thead>
          <tbody>
            {data.byNationality.map((n) => {
              const high = n.inzRate.rate >= 20
              return (
                <tr key={n.nationality} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{n.nationality}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{n.pending}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{n.approved}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{n.declined}</td>
                  <td className={cn('px-3 py-2 text-right tabular-nums', high && 'font-semibold text-danger')}>
                    {`${n.inzRate.rate}%`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">
        A published INZ decline rate of 20% or more triggers a Regional Manager check in admissions.
      </p>
    </section>
  )
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border p-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
  )
}
