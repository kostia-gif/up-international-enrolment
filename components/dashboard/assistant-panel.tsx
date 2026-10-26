'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  CircleAlert,
  CircleCheck,
  ListChecks,
  Loader2,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  X,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import {
  checkEligibility,
  checkEligibilityAll,
  INZ_DATA_LABEL,
  RISK_META,
  RISK_TIPS,
  summariseTopTasks,
  worstSeverity,
  type CheckSeverity,
  type EligibilityResult,
  type TopTask,
} from '@/lib/eligibility'
import { cn } from '@/lib/utils'

type Task = 'tasks' | 'eligibility'

type Answer =
  | { task: 'tasks'; items: TopTask[] }
  | { task: 'eligibility'; scope: string; results: EligibilityResult[] }

const SEVERITY_STYLE: Record<CheckSeverity, { icon: typeof CircleAlert; className: string }> = {
  danger: { icon: CircleAlert, className: 'text-destructive' },
  warning: { icon: TriangleAlert, className: 'text-warning' },
  ok: { icon: CircleCheck, className: 'text-success' },
}

const THINKING_MS = 650

export function AssistantPanel({
  applications,
  focusApp,
}: {
  applications: Application[]
  focusApp?: Application
}) {
  const [pending, setPending] = useState<Task | null>(null)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const run = (task: Task) => {
    if (timer.current) clearTimeout(timer.current)
    setPending(task)
    setAnswer(null)
    timer.current = setTimeout(() => {
      if (task === 'tasks') {
        setAnswer({ task, items: summariseTopTasks(applications) })
      } else {
        const results = focusApp ? [checkEligibility(focusApp)] : checkEligibilityAll(applications)
        setAnswer({
          task,
          scope: focusApp ? focusApp.studentName : 'all active applications',
          results,
        })
      }
      setPending(null)
    }, THINKING_MS)
  }

  return (
    <section
      aria-label="Enrolment assistant"
      className="rounded-2xl border border-ai/25 bg-card p-3 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 pr-1 text-sm font-semibold">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-ai/12 text-ai">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          Assistant
        </span>
        <QuickTask
          icon={<ListChecks className="size-3.5" />}
          label="Summarise my top tasks"
          active={pending === 'tasks' || answer?.task === 'tasks'}
          disabled={pending !== null}
          onClick={() => run('tasks')}
        />
        <QuickTask
          icon={<ShieldCheck className="size-3.5" />}
          label={focusApp ? `Check eligibility · ${focusApp.studentName}` : 'Check eligibility'}
          active={pending === 'eligibility' || answer?.task === 'eligibility'}
          disabled={pending !== null}
          onClick={() => run('eligibility')}
        />
        {answer && (
          <button
            type="button"
            onClick={() => setAnswer(null)}
            className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close assistant answer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div aria-live="polite">
        {pending && (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            {pending === 'tasks' ? 'Reviewing your pipeline…' : 'Checking against INZ outcomes…'}
          </p>
        )}
        {answer?.task === 'tasks' && <TasksAnswer items={answer.items} />}
        {answer?.task === 'eligibility' && (
          <EligibilityAnswer scope={answer.scope} results={answer.results} />
        )}
      </div>
    </section>
  )
}

function QuickTask({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        active
          ? 'border-ai/40 bg-ai/12 text-ai'
          : 'border-border bg-background text-foreground hover:border-ai/40 hover:text-ai',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function TasksAnswer({ items }: { items: TopTask[] }) {
  if (items.length === 0) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-sm text-success">
        <CircleCheck className="size-4" aria-hidden /> Nothing needs you right now.
      </p>
    )
  }
  return (
    <ol className="mt-3 flex flex-col divide-y divide-border rounded-lg border border-border">
      {items.map((t, i) => (
        <li key={`${t.appId}-${i}`}>
          <Link
            href={`/applications/${t.appId}`}
            className="flex items-start gap-3 px-3 py-2 transition-colors hover:bg-muted/60"
          >
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{t.studentName}</span>
              <span className="text-xs leading-relaxed text-muted-foreground text-pretty">
                {t.label}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}

function EligibilityAnswer({ scope, results }: { scope: string; results: EligibilityResult[] }) {
  const [showAll, setShowAll] = useState(false)
  const flagged = results.filter((r) => worstSeverity(r) !== 'ok')
  const shown = showAll ? results : results.slice(0, 4)
  const needsTips = results.some((r) => r.risk && r.risk.level !== 'low')

  return (
    <div className="mt-3 flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Checked {scope}:{' '}
        <span className="font-medium text-foreground">
          {flagged.length === 0
            ? 'no warnings'
            : `${flagged.length} ${flagged.length === 1 ? 'application needs' : 'applications need'} attention`}
        </span>
      </p>

      <ul className="grid gap-2 md:grid-cols-2">
        {shown.map((r) => (
          <li key={r.appId} className="rounded-lg border border-border bg-background p-3">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/applications/${r.appId}`} className="min-w-0 hover:underline">
                <p className="truncate text-sm font-medium">{r.studentName}</p>
                <p className="truncate text-xs text-muted-foreground">{shortProgramme(r.programme)}</p>
              </Link>
              {r.risk && (
                <span
                  className={cn(
                    'shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium tabular-nums',
                    r.risk.level === 'high' && 'border-destructive/25 bg-destructive/12 text-destructive',
                    r.risk.level === 'elevated' && 'border-warning/25 bg-warning/12 text-warning',
                    r.risk.level === 'low' && 'border-success/25 bg-success/12 text-success',
                  )}
                >
                  {RISK_META[r.risk.level].short} · {r.risk.approvalRate}%
                </span>
              )}
            </div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {r.checks.map((c) => {
                const { icon: Icon, className } = SEVERITY_STYLE[c.severity]
                return (
                  <li key={c.label} className="flex items-start gap-1.5 text-xs">
                    <Icon className={cn('mt-0.5 size-3.5 shrink-0', className)} aria-hidden />
                    <span className="leading-relaxed text-pretty">
                      <span className="font-medium">{c.label}</span>
                      {c.detail && <span className="text-muted-foreground"> — {c.detail}</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>

      {results.length > 4 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="self-start text-xs font-medium text-primary hover:underline"
        >
          {showAll ? 'Show fewer' : `Show all ${results.length}`}
        </button>
      )}

      {needsTips && (
        <details className="rounded-lg border border-border bg-muted/40 p-3">
          <summary className="cursor-pointer text-sm font-medium">
            Tips for higher-risk applications
          </summary>
          <ul className="mt-2 flex flex-col gap-2">
            {RISK_TIPS.map((tip) => (
              <li key={tip.title} className="text-xs leading-relaxed">
                <span className="font-medium">{tip.title}.</span>{' '}
                <span className="text-muted-foreground">{tip.detail}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
    </div>
  )
}
