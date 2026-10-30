import { Database, GitBranch, Globe, Server } from 'lucide-react'
import {
  DEPENDENCY_LABEL,
  STATUS_LABEL,
  type DependencyItem,
  type StepDependencies,
} from '@/lib/business-rules'

const ORDER: (keyof StepDependencies)[] = ['data', 'decisions', 'externalApis', 'internalApis']

const ICON: Record<keyof StepDependencies, typeof Database> = {
  data: Database,
  decisions: GitBranch,
  externalApis: Globe,
  internalApis: Server,
}

function DependencyColumn({
  kind,
  items,
}: {
  kind: keyof StepDependencies
  items: DependencyItem[]
}) {
  const Icon = ICON[kind]
  const { title, hint } = DEPENDENCY_LABEL[kind]
  return (
    <section
      aria-labelledby={`dep-${kind}`}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <header className="flex flex-col gap-0.5">
        <h3 id={`dep-${kind}`} className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-muted-foreground" aria-hidden />
          {title}
          <span className="ml-auto text-xs font-normal tabular-nums text-muted-foreground">{items.length}</span>
        </h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </header>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None at this step.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={item.name} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                {item.status === 'planned' && (
                  <span className="rounded-full border border-dashed border-border px-1.5 py-px text-[11px] font-medium text-muted-foreground">
                    {STATUS_LABEL.planned}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{item.detail}</p>
              {item.rules && item.rules.length > 0 && (
                <p className="font-mono text-[11px] text-muted-foreground">
                  <span className="sr-only">Used by rules </span>
                  {item.rules.join(' · ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function StepDependencyMatrix({ dependencies }: { dependencies: StepDependencies }) {
  return (
    <section aria-labelledby="dependencies-heading" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id="dependencies-heading" className="text-base font-semibold text-foreground">
          What this step depends on
        </h2>
        <p className="text-sm text-muted-foreground text-pretty">
          Data, decisions and the APIs behind them. Rule IDs show where each item is used.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {ORDER.map((kind) => (
          <DependencyColumn key={kind} kind={kind} items={dependencies[kind]} />
        ))}
      </div>
    </section>
  )
}
