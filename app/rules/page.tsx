import type { Metadata } from 'next'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { RuleList, EntryThresholds } from '@/components/rules/rule-list'
import { STEP_RULES } from '@/lib/business-rules'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'POC business rules | UP International Enrolment',
  description: 'Every business rule applied at each step of the application flow.',
}

export default async function RulesPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>
}) {
  const { step } = await searchParams
  const active = STEP_RULES.find((s) => String(s.step) === step) ?? STEP_RULES[0]

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            POC business rules
          </p>
          <h1 className="text-2xl font-semibold text-foreground text-balance">
            Step {active.step}: {active.title}
          </h1>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">{active.summary}</p>
        </header>

        <nav aria-label="Application steps">
          <ul className="flex flex-wrap gap-2">
            {STEP_RULES.map((s) => {
              const isActive = s.step === active.step
              return (
                <li key={s.step}>
                  <Link
                    href={`/rules?step=${s.step}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:bg-muted',
                    )}
                  >
                    <span className="tabular-nums">{s.step}</span>
                    {s.title}
                    <span className={cn('text-xs', isActive ? 'opacity-80' : 'text-muted-foreground')}>
                      {s.rules.length}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <RuleList rules={active.rules} />

        {active.step === 2 && <EntryThresholds />}

        <p className="text-xs leading-relaxed text-muted-foreground">
          Thresholds and visa risk bands are illustrative POC data and need confirming against UP and INZ sources before production.
        </p>
      </main>
    </div>
  )
}
