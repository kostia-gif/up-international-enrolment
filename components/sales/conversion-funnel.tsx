import type { FunnelStep } from '@/lib/sales'

export function ConversionFunnel({ steps }: { steps: FunnelStep[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">Conversion funnel</h2>
        <p className="text-xs text-muted-foreground">From application started to enrolled, with step-to-step conversion.</p>
      </div>
      <ol className="flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2 text-xs">
              <span className="font-medium text-foreground">{s.label}</span>
              <span className="flex items-baseline gap-2 tabular-nums">
                <span className="text-sm font-semibold">{s.count}</span>
                {i > 0 && <span className="text-muted-foreground">{s.pctOfPrev}% of previous</span>}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.max(s.pctOfStart, 2)}%`, opacity: 1 - i * 0.1 }}
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
