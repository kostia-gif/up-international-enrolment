import { CircleHelp, ShieldCheck } from 'lucide-react'
import type { Agency } from '@/lib/types'
import { hasInzTick, isTrustedAgency } from '@/lib/agent-profiles'
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const A_RULES = [
  {
    id: 'A1',
    title: 'INZ tick',
    detail:
      'The agency is listed in the latest INZ education agent report and its approval rate is at or above the average for its market.',
  },
  {
    id: 'A2',
    title: 'Not in INZ report',
    detail: 'The agency is not listed (INZ leaves out low-volume agents). No tick, no penalty.',
  },
  {
    id: 'A3',
    title: 'Trusted agency',
    detail:
      'The agreement is active, there is no integrity issue in the last 12 months, and either the INZ tick or UP visa approvals are at or above expected on 20 or more decisions.',
  },
  {
    id: 'A4',
    title: 'Integrity issue',
    detail:
      'A confirmed integrity issue (altered or misrepresented documents) removes Trusted immediately, pending regional manager review.',
  },
]

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
          {inzTick ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex cursor-default items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-xs font-semibold text-info" />
                }
              >
                <ShieldCheck className="size-3.5" aria-hidden />
                INZ tick · {agency.inz.approvalBand} approval
              </TooltipTrigger>
              <TooltipContent>
                From INZ&apos;s {agency.inz.reportYear} education agent report. Your agency&apos;s approval rate is
                above the average for {agency.inz.market}.
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-flex cursor-default items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground" />
                }
              >
                Not yet in INZ report
              </TooltipTrigger>
              <TooltipContent>
                INZ only lists agencies above a minimum number of visa applications. We use UP&apos;s own visa
                results instead.
              </TooltipContent>
            </Tooltip>
          )}
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                />
              }
            >
              <CircleHelp className="size-3.5" aria-hidden />
              How this works
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <PopoverHeader>
                <PopoverTitle>How agency trust is decided</PopoverTitle>
              </PopoverHeader>
              <ul className="flex flex-col gap-2.5">
                {A_RULES.map((r) => (
                  <li key={r.id} className="text-xs leading-relaxed text-pretty">
                    <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>{' '}
                    <span className="font-medium text-foreground">{r.title}.</span>{' '}
                    <span className="text-muted-foreground">{r.detail}</span>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <p
        className={cn(
          'text-sm text-pretty sm:text-right',
          trusted ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {trusted
          ? 'UP trusts this agency. Agents in good standing get instant offers and upfront discounts.'
          : 'Not a trusted agency yet. UP admissions reviews every application and issues the offer.'}
      </p>
    </section>
  )
}
