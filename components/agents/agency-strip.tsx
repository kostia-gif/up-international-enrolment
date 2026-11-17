import { ShieldCheck } from 'lucide-react'
import type { Agency } from '@/lib/types'
import { hasInzTick, isTrustedAgency } from '@/lib/agent-profiles'

export function AgencyStrip({ agency }: { agency: Agency }) {
  const trusted = isTrustedAgency(agency)
  const inzTick = hasInzTick(agency)

  return (
    <section
      aria-labelledby="agency-heading"
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id="agency-heading" className="text-lg font-semibold text-foreground">
          {agency.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {trusted && (
            <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              <ShieldCheck className="size-3.5" aria-hidden />
              Trusted agency
            </span>
          )}
          {inzTick && (
            <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-xs font-semibold text-info">
              <ShieldCheck className="size-3.5" aria-hidden />
              INZ tick · {agency.inz.approvalBand} approval
            </span>
          )}
        </div>
      </div>

      {trusted && (
        <p className="text-sm text-foreground text-pretty sm:text-right">
          UP trusts this agency. Agents in good standing get instant offers and upfront discounts.
        </p>
      )}
    </section>
  )
}
