'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import {
  ArrowUp,
  CircleAlert,
  CircleCheck,
  FlaskConical,
  ListChecks,
  Loader2,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Square,
  TriangleAlert,
  X,
} from 'lucide-react'
import type { Application } from '@/lib/types'
import { shortProgramme } from '@/lib/format'
import { buildAssistantContext } from '@/lib/assistant'
import {
  checkEligibility,
  checkEligibilityAll,
  COURSE_TYPE_LABEL,
  INZ_DATA_LABEL,
  RISK_META,
  RISK_TIPS,
  summariseTopTasks,
  worstSeverity,
  type CheckSeverity,
  type EligibilityCheck,
  type EligibilityResult,
  type OfferOutcome,
  type ProspectResult,
  type RiskLevel,
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

const OUTCOME_STYLE: Record<OfferOutcome, string> = {
  unconditional: 'border-success/25 bg-success/10 text-success',
  conditional: 'border-warning/25 bg-warning/10 text-warning',
  withheld: 'border-destructive/25 bg-destructive/10 text-destructive',
}

const THINKING_MS = 650

const TEST_STARTERS = [
  'Indian student, Diploma in Hospitality, no study gap',
  'Pakistan, Bachelor of Business, previous visa refusal',
  'Vietnam, pathway programme, funds ready',
]

export function AssistantPanel({
  applications,
  focusApp,
}: {
  applications: Application[]
  focusApp?: Application
}) {
  const [pending, setPending] = useState<Task | null>(null)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [testMode, setTestMode] = useState(false)
  const [input, setInput] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const threadRef = useRef<HTMLDivElement>(null)

  const context = useMemo(
    () => buildAssistantContext(applications, focusApp?.id),
    [applications, focusApp?.id],
  )
  const contextRef = useRef(context)
  contextRef.current = context

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/assistant',
        body: () => ({ context: contextRef.current }),
      }),
    [],
  )
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({ transport })
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const run = (task: Task) => {
    if (timer.current) clearTimeout(timer.current)
    setTestMode(false)
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

  const ask = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  const startTest = () => {
    setAnswer(null)
    setTestMode(true)
    if (messages.length === 0) {
      ask('I want to test eligibility for a prospective student. What do you need from me?')
    }
  }

  const reset = () => {
    stop()
    setMessages([])
    setTestMode(false)
  }

  const hasThread = messages.length > 0

  return (
    <section
      aria-label="Enrolment assistant"
      className="rounded-xl border border-ai/25 bg-card px-3 py-2 shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex size-6 items-center justify-center rounded-md bg-ai/12 text-ai">
          <Sparkles className="size-3.5" aria-hidden />
          <span className="sr-only">Assistant</span>
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
          label={focusApp ? `Check eligibility · ${focusApp.studentName}` : 'Check existing applications'}
          active={pending === 'eligibility' || answer?.task === 'eligibility'}
          disabled={pending !== null}
          onClick={() => run('eligibility')}
        />
        <QuickTask
          icon={<FlaskConical className="size-3.5" />}
          label="Test eligibility"
          active={testMode}
          disabled={busy}
          onClick={startTest}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1 focus-within:border-ai/50"
        >
          <label htmlFor="assistant-input" className="sr-only">
            Ask the assistant
          </label>
          <textarea
            id="assistant-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey) return
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              ask(input)
            }}
            placeholder={
              testMode
                ? 'Describe the student: country, course, funds, gaps, refusals…'
                : 'Ask about your applications…'
            }
            className="max-h-24 min-h-5 flex-1 resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-muted-foreground"
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors hover:bg-muted/70"
              aria-label="Stop response"
            >
              <Square className="size-3" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-ai text-ai-foreground transition-opacity disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="size-3.5" aria-hidden />
            </button>
          )}
        </form>
        {answer && (
          <button
            type="button"
            onClick={() => setAnswer(null)}
            className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        {answer?.task === 'tasks' && (
          <TasksAnswer
            items={answer.items}
            onDeepDive={(t) => ask(`Deep dive on ${t.studentName}: "${t.label}". What exactly do I need to do?`)}
          />
        )}
        {answer?.task === 'eligibility' && (
          <EligibilityAnswer
            scope={answer.scope}
            results={answer.results}
            onDeepDive={(r) =>
              ask(`Deep dive on ${r.studentName}'s visa eligibility. What are the risks and what should I add to the application?`)
            }
          />
        )}
      </div>

      {hasThread && (
        <div className="mt-3 flex flex-col rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <MessageSquareText className="size-3.5" aria-hidden />
              {testMode ? 'Test eligibility' : 'Conversation'}
            </span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden /> New conversation
            </button>
          </div>
          <div
            ref={threadRef}
            className="flex max-h-[420px] flex-col gap-3 overflow-y-auto p-3"
            aria-live="polite"
          >
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {status === 'submitted' && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" aria-hidden /> Thinking…
              </p>
            )}
            {error && (
              <p className="text-xs text-destructive">
                The assistant could not respond. Try again in a moment.
              </p>
            )}
          </div>
          {testMode && messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2">
              {TEST_STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => ask(s)}
                  className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-ai/40 hover:text-ai disabled:opacity-60"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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

function DeepDiveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-ai transition-colors hover:bg-ai/10"
    >
      <Sparkles className="size-3" aria-hidden /> Deep dive
    </button>
  )
}

function RiskBadge({ level, rate }: { level: RiskLevel; rate: number }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium tabular-nums',
        level === 'high' && 'border-destructive/25 bg-destructive/12 text-destructive',
        level === 'elevated' && 'border-warning/25 bg-warning/12 text-warning',
        level === 'low' && 'border-success/25 bg-success/12 text-success',
      )}
    >
      {RISK_META[level].short} · {rate}%
    </span>
  )
}

function CheckList({ checks }: { checks: EligibilityCheck[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {checks.map((c) => {
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
  )
}

function TasksAnswer({ items, onDeepDive }: { items: TopTask[]; onDeepDive: (t: TopTask) => void }) {
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
        <li key={`${t.appId}-${i}`} className="flex items-center gap-2 pr-2">
          <Link
            href={`/applications/${t.appId}`}
            className="flex min-w-0 flex-1 items-start gap-3 px-3 py-2 transition-colors hover:bg-muted/60"
          >
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold tabular-nums">
              {i + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">{t.studentName}</span>
              <span className="text-xs leading-relaxed text-muted-foreground text-pretty">{t.label}</span>
            </span>
          </Link>
          <DeepDiveButton onClick={() => onDeepDive(t)} />
        </li>
      ))}
    </ol>
  )
}

function EligibilityAnswer({
  scope,
  results,
  onDeepDive,
}: {
  scope: string
  results: EligibilityResult[]
  onDeepDive: (r: EligibilityResult) => void
}) {
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
          <li key={r.appId} className="flex flex-col rounded-lg border border-border bg-background p-3">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/applications/${r.appId}`} className="min-w-0 hover:underline">
                <p className="truncate text-sm font-medium">{r.studentName}</p>
                <p className="truncate text-xs text-muted-foreground">{shortProgramme(r.programme)}</p>
              </Link>
              {r.risk && <RiskBadge level={r.risk.level} rate={r.risk.approvalRate} />}
            </div>
            <CheckList checks={r.checks} />
            {worstSeverity(r) !== 'ok' && (
              <div className="mt-2 flex justify-end">
                <DeepDiveButton onClick={() => onDeepDive(r)} />
              </div>
            )}
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
          <summary className="cursor-pointer text-sm font-medium">Tips for higher-risk applications</summary>
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

const TOOL_LABEL: Record<string, string> = {
  'tool-getTopTasks': 'Reviewing your top tasks',
  'tool-checkApplications': 'Checking existing applications',
  'tool-testEligibility': 'Testing against INZ outcomes',
}

function ChatMessage({ message }: { message: UIMessage }) {
  if (message.role === 'user') {
    const text = message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-xl rounded-br-sm bg-ai/12 px-3 py-2 text-sm leading-relaxed text-foreground">
          {text}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`
        if (part.type === 'text') {
          if (!part.text.trim()) return null
          return (
            <p key={key} className="whitespace-pre-wrap text-sm leading-relaxed text-pretty">
              {part.text}
            </p>
          )
        }
        if (!(part.type in TOOL_LABEL) || !('state' in part)) return null
        if (part.state === 'output-error') {
          return (
            <p key={key} className="text-xs text-destructive">
              {TOOL_LABEL[part.type]} failed.
            </p>
          )
        }
        if (part.state !== 'output-available') {
          return (
            <p key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> {TOOL_LABEL[part.type]}…
            </p>
          )
        }
        if (part.type === 'tool-testEligibility') {
          return <ProspectCard key={key} result={part.output as ProspectResult & { outcomeLabel: string }} />
        }
        return (
          <p key={key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <CircleCheck className="size-3 text-success" aria-hidden /> {TOOL_LABEL[part.type]}
          </p>
        )
      })}
    </div>
  )
}

function ProspectCard({ result }: { result: ProspectResult & { outcomeLabel: string } }) {
  const { profile, risk, checks, outcome, outcomeLabel } = result
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prospective student</p>
          <p className="text-sm font-medium">
            {profile.nationality} · {profile.programme || COURSE_TYPE_LABEL[profile.courseType]}
          </p>
        </div>
        <RiskBadge level={risk.level} rate={risk.approvalRate} />
      </div>
      <CheckList checks={checks} />
      <p className={cn('mt-3 rounded-md border px-2 py-1.5 text-xs font-medium', OUTCOME_STYLE[outcome])}>
        {outcomeLabel}
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">{INZ_DATA_LABEL}</p>
    </div>
  )
}
